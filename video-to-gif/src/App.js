import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import gifshot from 'gifshot';

function App() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [gifUrl, setGifUrl] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setVideoFile(file);
    setVideoUploaded(true);
  };

  const convertToGif = () => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);

    video.onloadedmetadata = () => {
      const videoDuration = video.duration;

      gifshot.createGIF(
        {
          video: [videoFile],
          numFrames: 10,
          frameDuration: videoDuration / 10,
          gifWidth: 400,
          gifHeight: 400, // video.videoHeight,
          sampleInterval: 1,
          progressCallback: (currentFrame, totalFrames) => {
            const progress = Math.round((currentFrame / totalFrames) * 100);
            setProgress(progress);
          },
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
  };

  const handleDownload = () => {
    if (gifUrl) {
      const link = document.createElement('a');
      link.href = gifUrl;
      link.download = 'video.gif';
      link.click();
    }
  };

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setProgress(0);
      }, 1000);
    }
  }, [progress]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Converter vídeo em .GIF</p>
        <input type="file" accept="video/*" onChange={handleFileUpload} />
        {videoUploaded && (
          <div className="video-container">
            <video controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            </video>
            <button onClick={convertToGif}>Converter em GIF</button>
            {progress > 0 && progress < 100 && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
                <span>{`${progress}%`}</span>
              </div>
            )}
            {gifUrl && (
              <div className="gif-container">
                <img src={gifUrl} alt="GIF convertido" width="400" height="400" />
                <p>
                  <button onClick={handleDownload}>Baixar GIF</button>
                </p>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}


export default App;
