import React, { useState, useEffect, useRef } from 'react';
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
  const [blinking, setBlinking] = useState(false);
  const [showGeneratingText, setShowGeneratingText] = useState(false);
  const videoRef = useRef(null); // Referência para o elemento <video>

  const handleFileUpload = (event) => {
    resetState();

    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoUploaded(true);
    }
  };

  const convertToGif = () => {
    setConverting(true);
    setShowGeneratingText(true);
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.onerror = () => {
      console.error('Erro ao carregar o vídeo');
    };

    video.onloadeddata = () => {
      video.onseeked = () => {
        const videoDuration = video.duration;
        const frames = Math.ceil(videoDuration * 10);
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
    setTotalFrames(0);
    setCurrentFrame(0);
    setBlinking(false);
    setShowGeneratingText(false);
  };

  useEffect(() => {
    if (converting) {
      const progress = (currentFrame / totalFrames) * 100;
      setConversionProgress(progress);

      if (progress >= 70) {
        setShowGeneratingText(true);
      }

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

  useEffect(() => {
    if (conversionProgress === 90) {
      const blinkInterval = setInterval(() => {
        setBlinking((prevState) => !prevState);
      }, 500);
      return () => clearInterval(blinkInterval);
    }
  }, [conversionProgress]);

  useEffect(() => {
    if (showGeneratingText) {
      const blinkInterval = setInterval(() => {
        setBlinking((prevState) => !prevState);
      }, 500);
      return () => clearInterval(blinkInterval);
    }
  }, [showGeneratingText]);

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
                {conversionProgress < 100 ? (
                  <span>
                    {showGeneratingText ? (
                      <span className={`blinking-text ${blinking ? 'highlight' : ''}`}>
                        Gerando arquivo, aguarde alguns segundos...
                      </span>
                    ) : (
                      `Convertendo... ${conversionProgress.toFixed(1)}%`
                    )}
                    <progress value={conversionProgress} max="100" />
                  </span>
                ) : (
                  'Arquivo convertido, gerando arquivo abaixo'
                )}
              </div>
            )}

            {!converting && !converted && (
              <p>
                <button onClick={convertToGif} disabled={converting}>
                  Converter em GIF
                </button>
              </p>
            )}
            <video ref={videoRef} key={videoFile ? videoFile.name : ''} controls>
              <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
            </video>

            {converted && (
              <div className="gif-container">
                <p>Arquivo convertido, clique em Baixar GIF para</p>
                <img src={gifUrl} alt="GIF convertido" width="200" height="200" />
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
