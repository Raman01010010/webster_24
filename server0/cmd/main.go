package main

import (
	"context"
	"fmt"
	"log"

	"example.com/tomdoestech/internal/db"
	"example.com/tomdoestech/internal/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func healthcheck(c *fiber.Ctx) error {
	return c.SendString("OK")
}
func main() {
	// Initialize the MongoDB client and store it
	client, err := db.InitializeMongoClient() // Modify your db package to return *mongo.Client
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Ensure the MongoDB client is disconnected when the application exits
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Printf("Failed to disconnect MongoDB: %v", err)
		}
	}()

	app := fiber.New()

	// CORS middleware setup
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",                // Allow all origins, or specify your domain here
		AllowMethods: "GET,POST,OPTIONS", // Allow specific HTTP methods
		AllowHeaders: "Content-Type",     // Allow specific headers
	}))
	// Middleware to log requests
	// Middleware to log requests
	app.Use("/api", func(c *fiber.Ctx) error {
		fmt.Printf("Received %s request for %s\n", c.Method(), c.Path()) // Log method and path

		// Call the next handler
		err := c.Next()
		if err != nil {
			fmt.Println("Error in middleware:", err) // Log any error
			return err
		}
		fmt.Println("Request processed successfully")
		return nil
	})
	// Define routes
	app.Get("/healthcheck", healthcheck)
	app.Post("/api/products", handlers.CreateProduct)
	app.Get("/api/products", handlers.GetAllProducts)
	app.Post("/api/class", handlers.HandleClassSubmission)
    app.Post("/api/imagedata", handlers.ImageToData)
    app.Post("/api/save", handlers.Imagedatauploader)
	fmt.Println("Server is running on http://localhost:3000")
	log.Fatal(app.Listen(":3000"))
}
