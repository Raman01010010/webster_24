import React, { useState } from 'react';
import axios from 'axios';

const CloudinaryToDocsumoUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [docData, setDocData] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const existingUrl = uploadedUrls.find(url => url.fileName === file.name);
    if (existingUrl) {
      setMessage('File already uploaded.');
      console.log('Existing Cloudinary URL:', existingUrl.url);
      await uploadToDocsumo(existingUrl.url);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'WEBSTER_2024');

    try {
      const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/deafbhwzg/upload', formData);
      if (cloudinaryResponse.status === 200) {
        const cloudinaryUrl = cloudinaryResponse.data.secure_url;
        console.log('Cloudinary URL:', cloudinaryUrl);
        setUploadedUrls(prev => [...prev, { fileName: file.name, url: cloudinaryUrl }]);
        await uploadToDocsumo(cloudinaryUrl);
      }
    } catch (error) {
      console.error('Error during upload:', error);
      setMessage('Upload failed.');
    }
  };

  const uploadToDocsumo = async (cloudinaryUrl) => {
    const docsumoForm = new FormData();
    docsumoForm.append('file_type', 'url');
    docsumoForm.append('file', cloudinaryUrl);
    docsumoForm.append('type', 'Table Extractor');

    const docsumoOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        apikey: 'haRMNPOZXJk77KTUmu7sJ6ULE2u3nM9ohsj46Xy0rr3lddXDvj87wrTjDKTX',
      },
      body: docsumoForm,
    };

    const docsumoResponse = await fetch('https://app.docsumo.com/api/v1/eevee/apikey/upload/custom/', docsumoOptions);
    const docsumoResult = await docsumoResponse.json();

    if (docsumoResponse.ok) {
      const docId = docsumoResult.data.document[0].doc_id;
      setMessage('Upload successful!');
      console.log('Docsumo response:', docsumoResult);
      await pollForDocumentData(docId);
    } else {
      console.error('Docsumo error response:', docsumoResult);
      setMessage(`Upload to Docsumo failed: ${docsumoResult.message || 'Unknown error'}`);
    }
  };

  const pollForDocumentData = async (docId) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        apikey: 'haRMNPOZXJk77KTUmu7sJ6ULE2u3nM9ohsj46Xy0rr3lddXDvj87wrTjDKTX',
      },
    };

    const checkInterval = 5000;
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const docDataResponse = await fetch(`https://app.docsumo.com/api/v1/eevee/apikey/data/simplified/${docId}/`, options);

      if (docDataResponse.ok) {
        const docDataResult = await docDataResponse.json();
        if (docDataResult.status_code === 200) {
          setDocData(docDataResult);
          console.log('Document Data:', docDataResult);
          setMessage('Document data fetched successfully.');
          await sendDataToGemini(docDataResult); // Send data to Gemini once fetched
          return;
        } else if (docDataResult.message === 'document still processing') {
          console.log('Document still processing, checking again...');
        } else {
          console.error('Error fetching document data:', docDataResult);
          setMessage('Failed to fetch document data.');
          return;
        }
      } else {
        const errorText = await docDataResponse.text();
        console.error('Error fetching document data:', errorText);
        setMessage('Failed to fetch document data.');
        return;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    setMessage('Document processing is taking longer than expected.');
  };

  const sendDataToGemini = async (incomingData) => {
    const geminiUrl = 'https://api.gemini.com/v1/extract'; // Replace with the actual Gemini API endpoint
    const apiKey = "AIzaSyApSfdsy2-vWOUwWAGjkp9xwoKMuudOL18";
    const requestPayload = {
      data: incomingData,
      prompt: "Extract the fields: subject_name, start time, end time, and room."
    };

    try {
      const response = await axios.post(geminiUrl, requestPayload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data) {
        const extracted = response.data.map((item) => ({
          subject_name: item.subject_name || 'Unknown',
          start: item.start || 'Unknown',
          end: item.end || 'Unknown',
          room: item.room || 'Unknown',
        }));
        setExtractedData(extracted);
        setMessage('Data extraction successful.');
      } else {
        setMessage('Extraction failed or fields missing.');
      }
    } catch (error) {
      console.error('Error during extraction:', error);
      setMessage('Extraction failed. Check console for details.');
    }
  };

  return (
    <div>
      <h1>Upload File to Cloudinary and Docsumo</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}

      {/* Display document data and extracted data */}
      {docData && (
        <div className="p-2 rounded-md bg-green-100 mt-4">
          <h2 className="font-bold">Document Data:</h2>
          <pre>{JSON.stringify(docData, null, 2)}</pre>
        </div>
      )}
      {extractedData && (
        <div className="p-2 rounded-md bg-blue-100 mt-4">
          <h2 className="font-bold">Extracted Data:</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CloudinaryToDocsumoUpload;
