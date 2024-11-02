package db
import (
    "context"
    "sync"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    // "log"
)
var (
    clientInstance      *mongo.Client
    mongoOnce           sync.Once
    clientInstanceError error
	ProductsCollection  = "products" // Define the ProductsCollection constant
)
const (
    url      = "mongodb://localhost:27017"
    Database = "products-api"
)
// InitializeMongoClient initializes the MongoDB client and returns the client and any error encountered.
func InitializeMongoClient() (*mongo.Client, error) {
    mongoOnce.Do(func() {
        clientOptions := options.Client().ApplyURI(url)
        client, err := mongo.Connect(context.TODO(), clientOptions)
        if err != nil {
            clientInstanceError = err
            return
        }
        // Test the connection to verify it is established
        if err := client.Ping(context.TODO(), nil); err != nil {
            clientInstanceError = err
            return
        }

        clientInstance = client
    })
    
    return clientInstance, clientInstanceError
}
// GetMongoClient returns the initialized MongoDB client and an error if it hasn't been initialized.
func GetMongoClient() (*mongo.Client, error) {
    if clientInstanceError != nil {
        return nil, clientInstanceError // Return nil and the error if the client is not initialized
    }
    return clientInstance, nil
}

// DisconnectMongoClient gracefully disconnects the MongoDB client.
func DisconnectMongoClient() error {
    if clientInstance != nil {
        return clientInstance.Disconnect(context.TODO())
    }
    return nil
}
