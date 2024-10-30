import React, { useState } from 'react';
import axios from 'axios';

const DocsumoUpload = () => {
    const [file, setFile] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [documentId, setDocumentId] = useState('');

    const API_KEY = "haRMNPOZXJk77KTUmu7sJ6ULE2u3nM9ohsj46Xy0rr3lddXDvj87wrTjDKTX";
    const UPLOAD_URL = "https://api.docsumo.com/v1/api/upload"; // Replace with correct upload endpoint
    const DATA_URL = "https://app.docsumo.com/api/v1/eevee/apikey/data/simplified"; // Use this endpoint for simplified data

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadDocument = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadResponse = await axios.post(UPLOAD_URL, formData, {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const docId = uploadResponse.data.id; // Update based on actual response format
            setDocumentId(docId);
            console.log("Document uploaded successfully:", uploadResponse.data);
            alert("Document uploaded successfully. Document ID: " + docId);

        } catch (error) {
            console.error("Error uploading document:", error);
            alert("An error occurred during upload. Check the console for details.");
        }
    };

    const getSimplifiedData = async () => {
        if (!documentId) {
            alert("Please upload a document first to get its ID.");
            return;
        }

        try {
            const dataResponse = await axios.get(`${DATA_URL}/${documentId}/`, {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Accept": "application/json"
                }
            });

            setResponseData(dataResponse.data);
            console.log("Retrieved document data:", dataResponse.data);
        } catch (error) {
            console.error("Error retrieving document data:", error);
            alert("An error occurred while retrieving data. Check the console for details.");
        }
    };

    return (
        <div>
            <h1>Upload Document to Docsumo and Retrieve Simplified Data</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadDocument}>Upload Document</button>

            {documentId && (
                <button onClick={getSimplifiedData}>Get Simplified Data</button>
            )}

            {responseData && (
                <div>
                    <h2>Response Data:</h2>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default DocsumoUpload;
