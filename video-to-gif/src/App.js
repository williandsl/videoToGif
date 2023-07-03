import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import gifshot from 'gifshot';

function App() {
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [gifUrl, setGifUrl] = useState('');
  const [converting, setConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [converted, setConverted] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      resetState(); // Redefine os estados antes de selecionar um novo arquivo
      setVideoFile(file);
      setVideoUploaded(true);
    }
  };
  

  

  const convertToGif = () => {
    setConverting(true);
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.onerror = () => {
      console.error('Erro ao carregar o vídeo');
    };

    video.onloadeddata = () => {
      video.onseeked = () => {
        const videoDuration = video.duration;
        const frames = Math.ceil(videoDuration * 10); // 10 frames por segundo
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        setTotalFrames(frames);
        setCurrentFrame(0);

        gifshot.createGIF(
          {
            video: [videoFile],
            numFrames: frames,
            frameDuration: videoDuration / frames,
            gifWidth: videoWidth,
            gifHeight: videoHeight,
            sampleInterval: 10,
            progressCallback: (currentFrame) => {
              setCurrentFrame(currentFrame * 120);
            },
          },
          (obj) => {
            if (!obj.error) {
              const gifUrl = obj.image;
              setGifUrl(gifUrl);
              setConverted(true);
            } else {
              console.error('Erro ao converter o vídeo em GIF:', obj.error);
            }
            setConverting(false);
          }
        );
      };

      video.currentTime = video.duration;
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

  const resetState = () => {
    setVideoUploaded(false);
    setVideoFile(null);
    setGifUrl('');
    setConversionProgress(0);
    setConverted(false);
  };

  useEffect(() => {
    if (converting) {
      const progress = (currentFrame / totalFrames) * 100;
      setConversionProgress(progress);

      if (progress === 90) {
        setConversionProgress(91);
        const interval = setInterval(() => {
          setConversionProgress((prevProgress) => {
            if (prevProgress < 100) {
              return prevProgress + 1;
            } else {
              clearInterval(interval);
              return prevProgress;
            }
          });
        }, 3000);
      }
    }
  }, [converting, currentFrame, totalFrames]);

  useEffect(() => {
    if (converted) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [converted]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Converter vídeo em .GIF</p>
        <input type="file" accept="video/*" onChange={handleFileUpload} />
        {videoUploaded && (
          <div className="video-container">
            {converting && (
              <div className="progress-bar">
                {conversionProgress < 100
                  ? `Convertendo... ${conversionProgress.toFixed(1)}%`
                  : 'Arquivo convertido, Gerando arquivo abaixo'}
              </div>
            )}
  
            {!converting && !converted && (
              <p>
                <button onClick={convertToGif} disabled={converting}>
                  Converter em GIF
                </button>
              </p>
            )}
            <video controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            </video>
  
        
  
            {converted && (
              <div className="gif-container">
                <p>Arquivo convertido</p>
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
