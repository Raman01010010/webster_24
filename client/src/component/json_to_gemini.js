import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const StoryGenerator = () => {
  const [incomingData, setIncomingData] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [message, setMessage] = useState("");
  
  const [prompt, setPrompt] = useState("Extract the fields: subject_name, start time, end time, and room. and try to get room number more precisely becuase room number may be combination of letter and number both");
  const [loading, setLoading] = useState(false);
  const apiKey = "AIzaSyApSfdsy2-vWOUwWAGjkp9xwoKMuudOL18"; // Use environment variable

  const extractData = async () => {
    console.log("Incoming Data:", incomingData);
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Change to the correct model name

      const response = await model.generateContent(`${prompt}\nIncoming Data: ${JSON.stringify(incomingData)}`);
      
      console.log("Response from API:", response); // Log the response
      
      const extracted = response.response.text(); // Ensure this matches the response structure
      console.log("Extracted Data:", extracted); // Log extracted data
      // Check if extracted data is in JSON format
      try {
        let modifiedExtracted = extracted.slice(7); 
        // Find the position of the closing bracket and slice the string before it
        const closingBracketIndex = modifiedExtracted.indexOf(']');
        if (closingBracketIndex !== -1) {
            modifiedExtracted = modifiedExtracted.slice(0, closingBracketIndex + 1); // Keep up to and including the closing bracket
        }
        setExtractedData(JSON.parse(modifiedExtracted));
        setMessage('Data extraction successful.');
      } catch (parseError) {
        console.error("Parsing error:", parseError);
        setMessage('Failed to parse extracted data.');
      }
    } catch (error) {
      console.error("Error during extraction:", error.message, error.stack);
      setMessage('Failed to extract data. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const simulateIncomingData = () => {
    const sampleData = [
      {
        prompt:
          "Generate JSON format timetable containing subjects, start and end times, and room numbers",
        meta_data: {
          title: "Screenshot 2024-10-31 023719.png",
          doc_id: "df475754e31e4dd3a0d1fb3a0d32f709",
          type: "table_vision",
          uploaded_from: "api",
          user_doc_id: null,
          doc_meta_data: "",
          folder_name: "",
          folder_id: "",
          created_at_iso: "2024-10-30T21:24:11+00:00",
          modified_at_iso: "2024-10-30T21:24:33+00:00",
          status: "reviewing",
          review_url:
            "https://app.docsumo.com/review-document/df475754e31e4dd3a0d1fb3a0d32f709",
        },
        data: {
          Tables: [
            {
              "Column 01": {
                value: "",
                position: [1, 54, 80, 117],
                confidence: 0,
                review_required: true,
              },
              "Column 02": {
                value: "08 : 00-09 : 00 Hrs.",
                position: [87, 63, 147, 87],
                confidence: 0,
                review_required: true,
              },
              "Column 03": {
                value: "09 : 00-10 : 00 Hrs.",
                position: [179, 63, 239, 87],
                confidence: 0,
                review_required: true,
              },
              "Column 04": {
                value: "10 : 00-11 : 00 Hrs.",
                position: [274, 62, 354, 73],
                confidence: 0,
                review_required: true,
              },
              "Column 05": {
                value: "13 : 00-14 : 00 Hrs.",
                position: [365, 62, 433, 87],
                confidence: 0,
                review_required: true,
              },
              "Column 06": {
                value: "14 : 00-15 : 00 Hrs.",
                position: [452, 63, 520, 87],
                confidence: 0,
                review_required: true,
              },
              "Column 07": {
                value: "15 : 00-16 : 00 Hrs.",
                position: [549, 63, 609, 88],
                confidence: 0,
                review_required: true,
              },
              "Column 08": {
                value: "16 : 00-17 : 00 Hrs.",
                position: [640, 63, 702, 87],
                confidence: 0,
                review_required: true,
              },
              "Column 09": {
                value: "17 : 00-18 : 00 Hrs.",
                position: [734, 62, 795, 87],
                confidence: 0,
                review_required: true,
              },
            },
            {
              "Column 01": {
                value: "Monday",
                position: [8, 123, 50, 134],
                confidence: 0,
                review_required: true,
              },
              "Column 02": {
                value: "CNS(L) CSD GS5 VIS",
                position: [86, 123, 134, 162],
                confidence: 0,
                review_required: true,
              },
              "Column 03": {
                value: "CNS(L) CSD GS5. VIS",
                position: [179, 123, 251, 149],
                confidence: 0,
                review_required: true,
              },
              "Column 04": {
                value: "",
                position: [266, 117, 359, 194],
                confidence: 0,
                review_required: true,
              },
              "Column 05": {
                value: "",
                position: [359, 117, 446, 194],
                confidence: 0,
                review_required: true,
              },
              "Column 06": {
                value: "DBMS(P) CSD L3 Lab SJT",
                position: [453, 123, 516, 162],
                confidence: 0,
                review_required: true,
              },
              "Column 07": {
                value: "DBMS(P) CSD L3 Lub SJT",
                position: [550, 123, 612, 163],
                confidence: 0,
                review_required: true,
              },
              "Column 08": {
                value: "ES(L) CSD GS5 SOR",
                position: [640, 123, 688, 162],
                confidence: 0,
                review_required: true,
              },
              "Column 09": {
                value: "",
                position: [726, 117, 799, 194],
                confidence: 0,
                review_required: true,
              },
            },
            {
              "Column 01": {
                value: "Tuesday",
                position: [8, 201, 49, 211],
                confidence: 0,
                review_required: true,
              },
              "Column 02": {
                value: "SEPM(L) CSD CSNB2 MW",
                position: [87, 201, 151, 241],
                confidence: 0,
                review_required: true,
              },
              "Column 03": {
                value: "CN(P) CSD L3 Lab GF1",
                position: [179, 199, 242, 240],
                confidence: 0,
                review_required: true,
              },
              "Column 04": {
                value: "CN(P) CSD L3 Lab GF1",
                position: [272, 199, 336, 240],
                confidence: 0,
                review_required: true,
              },
              "Column 05": {
                value: "DBMS(L) CSD CSNB1 SJT",
                position: [365, 198, 429, 240],
                confidence: 0,
                review_required: true,
              },
              "Column 06": {
                value: "ES(P) CSD2 Micro process Lab SOR",
                position: [452, 197, 514, 253],
                confidence: 0,
                review_required: true,
              },
              "Column 07": {
                value: "ESOP) CSD2 Micro process Lab SOR",
                position: [550, 198, 621, 249],
                confidence: 0,
                review_required: true,
              },
              "Column 08": {
                value: "",
                position: [634, 194, 726, 267],
                confidence: 0,
                review_required: true,
              },
              "Column 09": {
                value: "",
                position: [726, 194, 799, 267],
                confidence: 0,
                review_required: true,
              },
            },
            {
              "Column 01": {
                value: "Wednesday",
                position: [8, 274, 66, 285],
                confidence: 0,
                review_required: true,
              },
              "Column 02": {
                value: "DBMS(L) CSD GS8 SJT",
                position: [87, 273, 137, 313],
                confidence: 0,
                review_required: true,
              },
              "Column 03": {
                value: "ES(L) CSD GS8 SOR",
                position: [179, 275, 228, 313],
                confidence: 0,
                review_required: true,
              },
              "Column 04": {
                value: "ES(L) CSD GS8 SOR",
                position: [272, 275, 321, 314],
                confidence: 0,
                review_required: true,
              },
              "Column 05": {
                value: "SEPM(L) CSD CSNB1 MW",
                position: [365, 273, 430, 313],
                confidence: 0,
                review_required: true,
              },
              "Column 06": {
                value: "SEPM(L) CSD CSNB! MW",
                position: [452, 275, 516, 314],
                confidence: 0,
                review_required: true,
              },
              "Column 07": {
                value: "CNS(L) CSD GS6 VIS",
                position: [550, 274, 598, 315],
                confidence: 0,
                review_required: true,
              },
              "Column 08": {
                value: "CN(L) CSD CSNB1 MP",
                position: [640, 274, 706, 313],
                confidence: 0,
                review_required: true,
              },
              "Column 09": {
                value: "CN(L) CSD CSNB1 MP",
                position: [733, 274, 798, 313],
                confidence: 0,
                review_required: true,
              },
            },
            {
              "Column 01": {
                value: "Thursday",
                position: [8, 323, 57, 334],
                confidence: 0,
                review_required: true,
              },
              "Column 02": {
                value: "",
                position: [80, 317, 173, 364],
                confidence: 0,
                review_required: true,
              },
              "Column 03": {
                value: "",
                position: [173, 317, 266, 364],
                confidence: 0,
                review_required: true,
              },
              "Column 04": {
                value: "",
                position: [266, 317, 359, 364],
                confidence: 0,
                review_required: true,
              },
              "Column 05": {
                value: "CNS(L) CSD CSNB2 VIS",
                position: [365, 323, 430, 361],
                confidence: 0,
                review_required: true,
              },
              "Column 06": {
                value: "SEPM(L) CSD CSNB2 MW",
                position: [453, 323, 518, 362],
                confidence: 0,
                review_required: true,
              },
              "Column 07": {
                value: "",
                position: [544, 317, 634, 364],
                confidence: 0,
                review_required: true,
              },
              "Column 08": {
                value: "CN(L) CSD CSNBI MP",
                position: [640, 323, 704, 362],
                confidence: 0,
                review_required: true,
              },
              "Column 09": {
                value: "CN(L) CSD CSNB1 MP",
                position: [733, 321, 791, 358],
                confidence: 0,
                review_required: true,
              },
            },
            {
              "Column 01": {
                value: "Friday",
                position: [8, 371, 41, 382],
                confidence: 0,
                review_required: true,
              },
              "Column 02": {
                value: "ES(L) CSD CSNBI SOR",
                position: [87, 370, 151, 410],
                confidence: 0,
                review_required: true,
              },
              "Column 03": {
                value: "DBMS(L) CSD CSNB1 SJT",
                position: [179, 370, 244, 409],
                confidence: 0,
                review_required: true,
              },
              "Column 04": {
                value: "DBMS(L) CSD CSNBI SJT",
                position: [272, 370, 336, 409],
                confidence: 0,
                review_required: true,
              },
              "Column 05": {
                value: "",
                position: [359, 364, 446, 453],
                confidence: 0,
                review_required: true,
              },
              "Column 06": {
                value: "ES(P) CSD1 Micro process Lab SOR",
                position: [452, 369, 513, 423],
                confidence: 0,
                review_required: true,
              },
              "Column 07": {
                value:
                  "ES(P) CSD1 \u041c\u0456\u0441\u0442\u043e process Lab SOR",
                position: [549, 369, 610, 422],
                confidence: 0,
                review_required: true,
              },
              "Column 08": {
                value: "",
                position: [634, 364, 726, 453],
                confidence: 0,
                review_required: true,
              },
              "Column 09": {
                value: "",
                position: [726, 364, 799, 453],
                confidence: 0,
                review_required: true,
              },
            },
          ],
        },
      },
    ];
    setIncomingData(sampleData); // Set incoming data to the state variable
  };

  return (
    <div>
     <h2>Random JSON taking data</h2>
     <button onClick={simulateIncomingData}>Simulate Incoming Data</button>
      <h1>Data Extractor</h1>
      
      {/* Input for incoming data (for demonstration, you can change this according to your needs) */}
      <textarea
        onChange={(e) => setIncomingData(e.target.value)} // Assuming JSON format input
        rows="4"
        cols="50"
        placeholder="Enter incoming data as JSON..."
      />
      
      <br />
      <button onClick={extractData} disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Data'}
      </button>
      
      {message && <p>{message}</p>}
      
      {extractedData && (
        <div>
          <h2>Extracted Data:</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;

     
     
/*

import React, { useState } from "react";
import axios from "axios";

const JsonToGemini = () => {
  



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

  

  // Function to simulate setting incoming data (you can replace this with actual data fetching logic)
 

  return (
    <div>
      
      <button onClick={sendDataToGemini}>Extract Data</button>
      {message && <p>{message}</p>}
      {extractedData && <pre>{JSON.stringify(extractedData, null, 2)}</pre>}
    </div>
  );
};

export default JsonToGemini;
*/