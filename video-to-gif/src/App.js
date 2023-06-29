import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const videoUrl = URL.createObjectURL(file);
    setVideoSrc(videoUrl);
    setVideoUploaded(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Converter vídeo em .GIF
        </p>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
        />
        {videoUploaded && (
          <div className="video-container">
            <video id="uploaded-video" controls>
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
