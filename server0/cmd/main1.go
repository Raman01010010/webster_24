package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
	"github.com/google/uuid"
)

type ServerOptions struct {
	ListenPort    int
	UseHttps      bool
	HttpsCertFile string
	HttpsKeyFile  string
}

type Peer struct {
	Socket   *websocket.Conn
	Username string
	Peer     *webrtc.PeerConnection
	Stream   *webrtc.TrackRemote // Change to TrackRemote
}

type Consumer struct {
	// Define consumer structure if needed
}

var (
	peers     sync.Map
	consumers sync.Map
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func handleTrackEvent(track *webrtc.TrackRemote, peerID string, ws *websocket.Conn) {
	if track != nil {
		peerInterface, _ := peers.Load(peerID)
		peer := peerInterface.(*Peer)
		peer.Stream = track // No type mismatch now

		payload := map[string]interface{}{
			"type":     "newProducer",
			"id":       peerID,
			"username": peer.Username,
		}
		broadcastMessage(payload)
	}
}

func createPeer() (*webrtc.PeerConnection, error) {
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{URLs: []string{"stun:stun.stunprotocol.org:3478"}},
			{URLs: []string{"stun:stun.l.google.com:19302"}},
		},
	}
	return webrtc.NewPeerConnection(config)
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	peerID := uuid.New().String()
	conn.WriteJSON(map[string]interface{}{"type": "welcome", "id": peerID})

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}

		var body map[string]interface{}
		if err := json.Unmarshal(message, &body); err != nil {
			log.Println("unmarshal:", err)
			continue
		}

		switch body["type"] {
		case "connect":
			uqid := body["uqid"].(string)
			peer, err := createPeer()
			if err != nil {
				log.Println("create peer:", err)
				continue
			}

			peers.Store(uqid, &Peer{
				Socket:   conn,
				Username: body["username"].(string),
				Peer:     peer,
			})

			peer.OnTrack(func(track *webrtc.TrackRemote, receiver *webrtc.RTPReceiver) {
				handleTrackEvent(track, uqid, conn)
			})

			offer := webrtc.SessionDescription{}
			if err := json.Unmarshal([]byte(body["sdp"].(string)), &offer); err != nil {
				log.Println("unmarshal SDP:", err)
				continue
			}

			if err := peer.SetRemoteDescription(offer); err != nil {
				log.Println("set remote description:", err)
				continue
			}

			answer, err := peer.CreateAnswer(nil)
			if err != nil {
				log.Println("create answer:", err)
				continue
			}

			if err := peer.SetLocalDescription(answer); err != nil {
				log.Println("set local description:", err)
				continue
			}

			payload := map[string]interface{}{
				"type": "answer",
				"sdp":  peer.LocalDescription(),
			}
			conn.WriteJSON(payload)

		case "getPeers":
			uuid := body["uqid"].(string)
			list := []map[string]interface{}{}

			peers.Range(func(key, value interface{}) bool {
				if key.(string) != uuid {
					peer := value.(*Peer)
					peerInfo := map[string]interface{}{
						"id":       key,
						"username": peer.Username,
					}
					list = append(list, peerInfo)
				}
				return true
			})

			peersPayload := map[string]interface{}{
				"type":  "peers",
				"peers": list,
			}
			conn.WriteJSON(peersPayload)

		case "ice":
			uqid := body["uqid"].(string)
			peerInterface, ok := peers.Load(uqid)
			if !ok {
				log.Println("peer not found:", uqid)
				continue
			}
			peer := peerInterface.(*Peer)

			candidate := webrtc.ICECandidateInit{}
			if err := json.Unmarshal([]byte(body["ice"].(string)), &candidate); err != nil {
				log.Println("unmarshal ICE candidate:", err)
				continue
			}

			if err := peer.Peer.AddICECandidate(candidate); err != nil {
				log.Println("add ICE candidate:", err)
			}
		}
	}
}

func broadcastMessage(message interface{}) {
	peers.Range(func(_, value interface{}) bool {
		peer := value.(*Peer)
		peer.Socket.WriteJSON(message)
		return true
	})
}

func main() {
	serverOptions := ServerOptions{
		ListenPort:    5000,
		UseHttps:      false,
		HttpsCertFile: "/path/to/cert/",
		HttpsKeyFile:  "/path/to/key/",
	}

	http.Handle("/", http.FileServer(http.Dir("public")))
	http.HandleFunc("/ws", handleWebSocket)

	var err error
	if serverOptions.UseHttps {
		cert, err := ioutil.ReadFile(serverOptions.HttpsCertFile)
		if err != nil {
			log.Fatal(err)
		}
		key, err := ioutil.ReadFile(serverOptions.HttpsKeyFile)
		if err != nil {
			log.Fatal(err)
		}
		config := &tls.Config{
			Certificates: []tls.Certificate{
				{
					Certificate: [][]byte{cert},
					PrivateKey:  key,
				},
			},
		}
		server := &http.Server{
			Addr:      fmt.Sprintf(":%d", serverOptions.ListenPort),
			TLSConfig: config,
		}
		err = server.ListenAndServeTLS("", "")
	} else {
		err = http.ListenAndServe(fmt.Sprintf(":%d", serverOptions.ListenPort), nil)
	}

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
