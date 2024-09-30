// components/WebcamCapture.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    
    // Chuyển base64 thành Blob để gửi lên server
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    onCapture(blob); // Truyền blob cho component cha
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={200}
        height={150}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={capture}>Chụp ảnh</button>
      </div>
    </div>
  );
};

export default WebcamCapture;
