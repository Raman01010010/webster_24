package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	// "handlers"
	"net/http"
	"os"
	"time"
	"github.com/gofiber/fiber/v2"

)
// const docsumoApiKey = "haRMNPOZXJk77KTUmu7sJ6ULE2u3nM9ohsj46Xy0rr3lddXDvj87wrTjDKTX"

// Struct for Docsumo's response after uploading
type DocsumoUploadResponse struct {
	Data struct {
		Document []struct {
			DocID string `json:"doc_id"`
		} `json:"document"`
	} `json:"data"`
}

// Struct for Docsumo's response while polling for document data
type DocsumoDataResponse struct {
	StatusCode int                    `json:"status_code"`
	Message    string                 `json:"message"`
	Data       map[string]interface{} `json:"data"`
}
// Function to upload image URL to Docsumo and poll for extracted data
func ImageToData(c *fiber.Ctx) error {
	
    // Step 1: Upload URL to Docsumo
    file, err := c.FormFile("file")
    if err != nil {
        return c.Status(fiber.StatusBadRequest).SendString("Error retrieving file")
    }

    // Step 2: Open the file for reading
    openedFile, err := file.Open()
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Error opening file")
    }
    defer openedFile.Close()

    // Step 3: Upload the image to Cloudinary
    // Pass the opened file to the UploadImageHandler function
    cloudinaryURL, err := UploadImageHandler(file) // Pass the opened file
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).SendString("Error uploading to Cloudinary")
    }
	// Step 4: Upload to Docsumo
	docID, err := uploadToDocsumo(cloudinaryURL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("failed to upload to Docsumo: %v", err))
	}

	// Step 5: Poll for document data
	docData, err := pollForDocumentData(docID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("failed to fetch document data: %v", err))
	}

	prompt:="Extract the fields: subject_name, start time, end time, day, and room. Try to get room number more precisely because room number may be a combination of letters and numbers. give in output only required data that is extracted  dont give unnesedccary thing because i want standard output to further process it "

	// Step 6: Send data to Gemini API
	extractedText, err := GenerateContentFromData(prompt, docData)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(fmt.Sprintf("failed to send data to Gemini API: %v", err))
	}

	fmt.Println("Document data processed and sent successfully.")
	return c.JSON(fiber.Map{"message": "Processing completed successfully.", "extracted": extractedText}) // Respond with extracted data
}
// ad the URL to Docsumo API
func uploadToDocsumo(cloudinaryURL string) (string, error) {
	docsumoApiKey := os.Getenv("docsumoApiKey")

	url := "https://app.docsumo.com/api/v1/eevee/apikey/upload/custom/"
	form := map[string]string{
		"file_type": "url",
		"file":      cloudinaryURL,
		"type":      "Table Extractor",
	}

	// Prepare request
	jsonData, _ := json.Marshal(form)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("apikey", docsumoApiKey)
	req.Header.Add("Content-Type", "application/json")

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Parse response
	var uploadResp DocsumoUploadResponse
	if err := json.NewDecoder(resp.Body).Decode(&uploadResp); err != nil {
		return "", err
	}

	if len(uploadResp.Data.Document) == 0 {
		return "", errors.New("no document ID returned from Docsumo")
	}
	return uploadResp.Data.Document[0].DocID, nil
}



// Poll Docsumo API to get extracted document data
func pollForDocumentData(docID string) (map[string]interface{}, error) {
	docsumoApiKey := os.Getenv("docsumoApiKey")

	url := fmt.Sprintf("https://app.docsumo.com/api/v1/eevee/apikey/data/simplified/%s/", docID)
	client := &http.Client{}
	checkInterval := 5 * time.Second
	maxAttempts := 10

	for attempts := 0; attempts < maxAttempts; attempts++ {
		req, _ := http.NewRequest("GET", url, nil)
		req.Header.Add("accept", "application/json")
		req.Header.Add("apikey", docsumoApiKey)

		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		var dataResp DocsumoDataResponse
		if err := json.NewDecoder(resp.Body).Decode(&dataResp); err != nil {
			return nil, err
		}
		if dataResp.StatusCode == 200 {
			return dataResp.Data, nil
		} else if dataResp.Message == "document still processing" {
			fmt.Println("Document still processing, waiting before retry...")
		} else {
			return nil, fmt.Errorf("unexpected response: %s", dataResp.Message)
		}
		// Wait before trying again
		time.Sleep(checkInterval)
	}
	return nil, errors.New("document processing is taking longer than expected")
}

