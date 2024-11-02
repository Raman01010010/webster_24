import React, { useState,useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
const StoryGenerator = ({data}) => {
  const [extractedData, setExtractedData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("Extract the fields: subject_name, start time, end time, day, and room. Try to get room number more precisely because room number may be a combination of letters and numbers. give in output only required data that is extracted  dont give unnesedccary thing because i want standard output to further process it");
  const sendData = async () => {
    // setLoading(true);
    try {
      // Send request to the Gemini API
      const response = await axios.post('http://localhost:3000/api/imagedata', {
        data: editableData
      });
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      // setLoading(false);
    }
  };
  const extractData = async () => {
    setLoading(true); // Set loading state
    try {
      // Send request to the Gemini API
      const response = await axios.post('http://localhost:3000/api/gemini', {
        prompt: `${prompt}\nIncoming Data: ${JSON.stringify(data)}`,
      });
      const fullData = response.data;
      // Check if 'extracted' and 'Candidates' exist
      if (fullData.extracted && fullData.extracted.Candidates && fullData.extracted.Candidates.length > 0) {
        const parts = fullData.extracted.Candidates[0].Content.Parts; // Extract only the Parts field
       let modifiedExtracted = parts.map(part => part.slice(7, -3)); // Slice each part

      // Filter out any undefined or empty strings (if necessary)
      modifiedExtracted = modifiedExtracted.filter(part => part.trim() !== "");

      // Create a JSON object from the modified parts
      const jsonResult = { extractedParts: modifiedExtracted }; // You can adjust the key as needed

      // Set the result as JSON string in state
      setExtractedData(JSON.parse(JSON.stringify(jsonResult.extractedParts))[0]); // Store in JSON format
        
        setMessage('Data extraction successful.');
      } else {
        setMessage('No candidates found in the response.');
      }
    } catch (error) {
      console.error("Error during extraction:", error.message);
      setMessage('Failed to extract data. Please check the console for details.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  const makeDataEditable = () => {
    setEditableData(JSON.parse(extractedData));
  };
  const handleEditChange = (event, index, key) => {
    const newData = [...editableData];
    newData[index][key] = event.target.value;
    setEditableData(newData);
  };
  useEffect(() => {
    if (data) {
      extractData();
    }
  }, [data]);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Random JSON Data Extractor</h2>
     
      <h1 className="text-2xl font-bold mb-4">Data Extractor</h1>

      <button className={`bg-${loading ? "gray-500" : "green-500"} text-white px-4 py-2 rounded`} onClick={extractData} disabled={loading}>
        {loading ? 'Extracting...' : 'Extract Data'}
      </button>

      {message && <p className="text-blue-700 mt-4">{message}</p>}

      {extractedData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Extracted Data:</h2>
          <pre className="bg-gray-100 p-4 rounded mb-4">{extractedData}</pre>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded" onClick={makeDataEditable}>
            Edit Extracted Data
          </button>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded" onClick={sendData}>
            Save Data
          </button>
        </div>
      )}
      {editableData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Editable Extracted Data</h2>
          <div className="bg-white shadow-md rounded p-4 space-y-4">
            {editableData.map((entry, index) => (
              <div key={index} className="p-2 border-b last:border-0">
                {Object.keys(entry).map((key) => (
                  <div key={key} className="flex items-center mb-2">
                    <label className="w-1/4 font-semibold">{key}:</label>
                    <input
                      className="border w-full p-2 rounded"
                      type="text"
                      value={entry[key]}
                      onChange={(e) => handleEditChange(e, index, key)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;
