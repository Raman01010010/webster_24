import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRComponent = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleOCR = () => {
    Tesseract.recognize(
      image,
      'eng', // specify the language you want (e.g., 'eng' for English)
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(parseInt(m.progress * 100));
          }
        },
      }
    )
      .then(({ data: { text } }) => {
        setText(text);
        setProgress(0);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {image && <img src={image} alt="Selected" style={{ maxWidth: '100%' }} />}
      <button onClick={handleOCR}>Recognize Text</button>
      <div>Progress: {progress}%</div>
      <p>Recognized Text: {text}</p>
    </div>
  );
};

export default OCRComponent;
