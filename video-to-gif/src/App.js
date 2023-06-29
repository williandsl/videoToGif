import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const videoUrl = URL.createObjectURL(file);
    setVideoSrc(videoUrl);
    setVideoUploaded(true);
  };

  const convertToGif = () => {
    // Lógica para converter o vídeo em GIF
    // Aqui você pode implementar a lógica para converter o vídeo em GIF
    // por exemplo, usando uma biblioteca de conversão de vídeo para GIF
    setShowAlert(true);
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
            <button onClick={convertToGif}>Converter em GIF</button>
            {showAlert && <p>Ok, botão clicado</p>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
