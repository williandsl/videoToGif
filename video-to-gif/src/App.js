import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import gifshot from 'gifshot';

function App() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [gifUrl, setGifUrl] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoUploaded(true);
  };

  const convertToGif = () => {
    gifshot.createGIF(
      {
        video: [videoFile],
        numFrames: 10,
        frameDuration: 1
      },
      (obj) => {
        if (!obj.error) {
          const gifUrl = obj.image;
          setGifUrl(gifUrl);
        } else {
          console.error('Erro ao converter o vídeo em GIF:', obj.error);
        }
      }
    );
  };

  const handleDownload = () => {
    if (gifUrl) {
      const link = document.createElement('a');
      link.href = gifUrl;
      link.download = 'video.gif';
      link.click();
    }
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
            <video controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            </video>
            <button onClick={convertToGif}>Converter em GIF</button>
            {gifUrl && (
              <div>
                <a href={gifUrl} download="video.gif" onClick={handleDownload}>
                  Baixar GIF
                </a>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
