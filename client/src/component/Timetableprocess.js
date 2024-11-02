import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const ImageUploadAndEdit = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [editableData, setEditableData] = useState([]);
    const [extractedData, setExtractedData] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const csvToJson = (csv) => {
        const rows = csv.trim().split("\n").map(row => row.split(","));
        const headers = rows[0].map(header => header.trim());

        const jsonData = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] ? row[index].trim() : null;
            });
            return obj;
        });

        return jsonData.filter(item => item.subject_name); // Filter out entries without a subject_name
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post('http://localhost:3000/api/imagedata', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
      
          console.log("response", response); // Log the complete response
      
          const fullData = response.data;
          console.log("fulldata",fullData);
          if (typeof fullData.extracted === 'string') {
            try {
                fullData.extracted = JSON.parse(fullData.extracted); // Parse the string into an object
                console.log("Parsed fullData.extracted:", fullData.extracted);
            } catch (parseError) {
                console.error('Error parsing extracted data:', parseError);
                setMessage('Failed to parse extracted data.');
                return; // Exit the function if parsing fails
            }
        }
          // Step-by-step checks with logging
          if (fullData.extracted) {
              console.log("fullData.extracted exists.");
                
              if (fullData.extracted.Candidates) {
                  console.log("fullData.extracted.Candidates exists.");
                  if (fullData.extracted.Candidates.length > 0) {
                      console.log("Candidates found:", fullData.extracted.Candidates);
                      
                      const parts = fullData.extracted.Candidates[0].Content.Parts.map(part => part.slice(3, -3));
                      
                      // Log extracted parts for debugging
                      console.log("Extracted parts:", parts);
                      
                      if (parts.length > 0 && parts[0]) {
                          const bigData = csvToJson(parts[0]);
                          console.log("Parsed CSV data:", bigData); // Log parsed data for verification
                          
                          if (bigData.length > 0) {
                              setExtractedData(bigData);
                              setEditableData(bigData);
                              setMessage('Image uploaded successfully. Extracted data is available for editing.');
                          } else {
                              setMessage('No valid CSV data found after parsing.');
                          }
                      } else {
                          setMessage('No valid CSV data found in parts.');
                      }
                  } else {
                      setMessage('No candidates found in the extracted data.');
                  }
              } else {
                  setMessage('No candidates key found in extracted data.');
              }
          } else {
              setMessage('No extracted data found in response.');
          }
      } catch (error) {
          console.error('Error uploading image:', error);
          setMessage('Failed to upload image. Please try again.');
      }
      
    };
    const handleEditChange = (event, index, key) => {
        const newData = [...editableData];
        newData[index][key] = event.target.value;
        setEditableData(newData);
    };

    const sendData = async () => {
        try {
            await axios.post('http://localhost:3000/api/save', { data: editableData });
            setMessage('Data saved successfully.');
        } catch (error) {
            console.error('Error saving data:', error);
            setMessage('Failed to save data.');
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">Image Upload and Data Extractor</h1>
            <form onSubmit={handleUpload} className="flex flex-col items-center mb-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-2 border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Upload Image
                </button>
            </form>
            {message && <p className="text-red-500 mb-4">{message}</p>}

            {extractedData.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Extracted Data:</h2>
                    <pre className="bg-gray-100 p-4 rounded mb-4">{JSON.stringify(extractedData, null, 2)}</pre>
                    {editableData.length > 0 && (
                        <div className="mt-4">
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
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={sendData}
                                >
                                    Save Edited Data
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUploadAndEdit;
