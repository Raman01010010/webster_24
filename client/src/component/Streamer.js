// src/component/VideoChat.js
import React, { useState, useEffect, useRef } from 'react';
import SimpleSFUClient from './SimpleSFUClient';

const VideoChat = () => {
    const [username, setUsername] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const remoteContainerRef = useRef(null);
    const simpleSFUClientRef = useRef(null);

    useEffect(() => {
        const simple = new SimpleSFUClient();
        simpleSFUClientRef.current = simple;

        simple.on('onConnected', () => {
            setIsConnected(true);
        });

        return () => {
            if (simpleSFUClientRef.current) {
                simpleSFUClientRef.current.handleClose();
            }
        };
    }, []);

    const handleConnect = () => {
        if (simpleSFUClientRef.current) {
            simpleSFUClientRef.current.username = username;
            simpleSFUClientRef.current.connect();
        }
    };

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
            />
            <button onClick={handleConnect} disabled={!isConnected}>
                Connect
            </button>
            <br />
            <div id="remote_videos" ref={remoteContainerRef}>
                <div className="videos-inner"></div>
            </div>
        </div>
    );
};

export default VideoChat;