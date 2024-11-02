package handlers

import (
    "context"
    // "encoding/json"
    "time"
    "fmt"

    "example.com/tomdoestech/internal/db"
    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/bson"
)
// ClassData represents the structure of the data sent from the frontend
type ClassData struct {
    ClassModuleName string `json:"classModuleName"`
    Room            string `json:"room"`
    Day             string `json:"day"`
    StartTime       string `json:"startTime"`
    EndTime         string `json:"endTime"`
}
type ClassData2 struct {
    SubjectName string `json:"subject_name"`
    StartTime   string `json:"start time"` // JSON tag handles the space in the key
    EndTime     string `json:"end time"`   // JSON tag handles the space in the key
    Day         string `json:"day"`
    Room        string `json:"room"`
}

type ImagedataRequest struct {
    Data []ClassData2 `json:"data"`
}


func HandleClassSubmission(c *fiber.Ctx) error {
    fmt.Println("HandleClassSubmission function called")

    if c.Method() != fiber.MethodPost {
        fmt.Println("Received method:", c.Method())
        return c.Status(fiber.StatusMethodNotAllowed).SendString("Method not allowed")
    }

    var classData ClassData
    if err := c.BodyParser(&classData); err != nil {
        fmt.Printf("Error parsing body: %v\n", err)
        return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
    }
    fmt.Printf("Received class data: %+v\n", classData)

    if classData.ClassModuleName == "" || classData.StartTime == "" || classData.EndTime == "" {
        fmt.Println("Validation error: Missing required fields")
        return c.Status(fiber.StatusBadRequest).SendString("Missing required fields")
    }

    client, err := db.GetMongoClient()
    if err != nil {
        fmt.Printf("Mongo client error: %v\n", err)
        return c.Status(fiber.StatusInternalServerError).SendString("Could not connect to database")
    }

    collection := client.Database(db.Database).Collection("classes")
    classDocument := bson.M{
        "classModuleName": classData.ClassModuleName,
        "room":            classData.Room,
        "day":             classData.Day,
        "startTime":       classData.StartTime,
        "endTime":         classData.EndTime,
        "createdAt":       time.Now(),
    }

    _, err = collection.InsertOne(context.TODO(), classDocument)
    if err != nil {
        fmt.Printf("Database insert error: %v\n", err)
        return c.Status(fiber.StatusInternalServerError).SendString("Failed to save to database")
    }

    response := map[string]string{"message": "Class added successfully!"}
    return c.Status(fiber.StatusOK).JSON(response)
}
// ImagedataRequest represents the incoming JSON structure
// ImagedataUploader handles uploading image data
func Imagedatauploader(c *fiber.Ctx) error {
    fmt.Println("ImagedataUploader function called")
    
    // Print the raw incoming body for debugging
    fmt.Println("Raw incoming data:", string(c.Body()))

    // Parse the JSON body into ImagedataRequest struct
    var request ImagedataRequest
    if err := c.BodyParser(&request); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "status":  "error",
            "message": "Couldn't parse request body",
            "error":   err.Error(),
        })
    }

    // Get MongoDB client and collection
    client, err := db.GetMongoClient()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "status":  "error",
            "message": "Couldn't connect to database",
            "error":   err.Error(),
        })
    }
    collection := client.Database(db.Database).Collection("classes")

    // Iterate through each class entry in request.Data and insert it into MongoDB
    for _, classData := range request.Data {
        classDocument := bson.M{
            "classModuleName": classData.SubjectName,
            "room":            classData.Room,
            "day":             classData.Day,
            "startTime":       classData.StartTime,
            "endTime":         classData.EndTime,
            "createdAt":       time.Now(),
        }

        // Insert each document into MongoDB
        if _, err := collection.InsertOne(context.Background(), classDocument); err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "status":  "error",
                "message": "Couldn't store data in database",
                "error":   err.Error(),
            })
        }
    }

    return c.JSON(fiber.Map{
        "status":  "success",
        "message": "Data stored successfully",
    })
}
