
package handlers

import (
	"context"
	"fmt"
	"os"
	"encoding/json"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)
type ContentResponse struct {
    Parts []string `json:"parts"` // Assuming extracted parts are strings
}

func GenerateContentFromData(prompt string, incomingData map[string]interface{}) (string, error) {
	// Assuming you already have a function that creates the context and client
	ctx := context.Background()
	apiKey := os.Getenv("API_KEY")
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return "", fmt.Errorf("failed to create AI client: %v", err)
	}
	defer client.Close()

	// Create the model
	model := client.GenerativeModel("gemini-1.5-flash")

	// Generate content using the prompt and incoming data
	resp, err := model.GenerateContent(ctx, genai.Text(fmt.Sprintf("%s\nIncoming Data: %v", prompt, incomingData)))
	if err != nil {
		return "", fmt.Errorf("failed to generate content: %v", err)
	}
	

	
	// extracted := resp.Candidates[0].Content.Parts
	jsonResponse, err := json.Marshal(resp)
    if err != nil {
        return "", fmt.Errorf("failed to marshal extracted parts to JSON: %v", err)
    }
    
    // Return the JSON string
    return string(jsonResponse), nil
}