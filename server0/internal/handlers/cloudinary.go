package handlers
import (
	"context"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/joho/godotenv"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	// "github.com/gofiber/fiber/v2"
	"log"
	"fmt"
	"mime/multipart" // Import the multipart package for file handling

	"os"
)
// Credentials initializes Cloudinary with secure settings


func credentials() (*cloudinary.Cloudinary, context.Context, error) {
	err := godotenv.Load()
if err != nil {
    log.Fatalf("Error loading .env file: %v", err)
}

    cloudinaryURL := os.Getenv("CLOUDINARY_URL")
    log.Println("CLOUDINARY_URL:", cloudinaryURL) // Add this line for debugging
    if cloudinaryURL == "" {
        return nil, nil, fmt.Errorf("CLOUDINARY_URL environment variable not set")
    }

    cld, err := cloudinary.NewFromURL(cloudinaryURL)
    if err != nil {
        return nil, nil, fmt.Errorf("failed to create Cloudinary client: %v", err)
    }
    
    cld.Config.URL.Secure = true
    ctx := context.Background()
    return cld, ctx, nil
}



// UploadImageHandler handles the image upload
func UploadImageHandler(file *multipart.FileHeader) (string, error) { // Update to return URL and error
    cld, ctx, err := credentials()
    if err != nil {
        return "", fmt.Errorf("Error initializing Cloudinary: %s", err.Error())
    }

    // Open the file
    src, err := file.Open()
    if err != nil {
        return "", fmt.Errorf("Unable to open file: %s", err)
    }
    defer src.Close()

    // Upload the image to Cloudinary
    resp, err := cld.Upload.Upload(ctx, src, uploader.UploadParams{
        PublicID:       file.Filename,
        UniqueFilename: api.Bool(true),
        Overwrite:      api.Bool(true),
    })
    if err != nil {
        log.Println("Upload error:", err)
        return "", fmt.Errorf("Failed to upload image: %s", err)
    }
    // Return the secure URL
    return resp.SecureURL, nil // Returning the URL and no error
}
