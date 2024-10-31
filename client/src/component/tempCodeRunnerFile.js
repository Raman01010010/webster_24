 const sendDataToGemini = async () => {
    const apiKey = "AIzaSyApSfdsy2-vWOUwWAGjkp9xwoKMuudOL18";
  
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`; // Use the API key directly in the URL
    const requestPayload = {
      prompt: "Extract the fields: subject_name, start time, end time, and room.",
      data: incomingData,
    };
  
    console.log(incomingData); // Log incoming data
  
    try {
      // Send the incoming data and prompt to Gemini for field extraction
      const response = await axios.post(geminiUrl, requestPayload, {
        headers: {
          "Content-Type": "application/json", // Keep only Content-Type
        },
      });
  
      // Check if extraction was successful and format data
      if (response.status === 200 && response.data) {
        // Assuming the response contains the required fields in a structured format
        const extracted = response.data.map((item) => ({
          subject_name: item.subject_name || "Unknown",
          start: item.start || "Unknown",
          end: item.end || "Unknown",
          room: item.room || "Unknown",
        }));
        setExtractedData(extracted);
        setMessage("Data extraction successful.");
      } else {
        setMessage("Extraction failed or fields missing.");
      }
    } catch (error) {
      console.error("Error during extraction:", error); // Log the full error object
      if (error.response) {
        console.error("Response data:", error.response.data); // Log response data if available
        console.error("Response status:", error.response.status); // Log response status
        console.error("Response headers:", error.response.headers); // Log response headers
      } else if (error.request) {
        console.error("Request data:", error.request); // Log request data if no response was received
      } else {
        console.error("Error message:", error.message); // Log any other error messages
      }
      setMessage("Extraction failed. Check console for details.");
    }
  };