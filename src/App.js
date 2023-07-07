import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import gifshot from 'gifshot';
import FileUploader from './FileUploader';
import VideoPlayer from './VideoPlayer';
import ProgressBar from './ProgressBar';
import ConvertedGif from './ConvertedGif';
import logo from './conv.png';
import assintauraLogo from './assinatura.png';


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
  const [videoDurationError, setVideoDurationError] = useState(false);
  const [disableConversion, setDisableConversion] = useState(false);


  const handleFileUpload = (file) => {
    resetState();
    setVideoFile(file);
    setVideoUploaded(true);
  
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
  
    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration > 15) {
        setVideoDurationError(true);
        setDisableConversion(true); // Bloquear o botão de conversão
      } else {
        setVideoDurationError(false);
        setDisableConversion(false); // Desbloquear o botão de conversão
      }
    };
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
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth() + 1; // Os meses são indexados a partir de 0
      const currentYear = currentDate.getFullYear();
      const currentMinute = currentDate.getMinutes();
      const currentSecond = currentDate.getSeconds();
      const filename = `GifGenerated_${currentDay}-${currentMonth}-${currentYear}_${currentMinute}${currentSecond}.gif`;
      link.href = gifUrl;
      link.download = filename;
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
        <img src={assintauraLogo} className="App-assintaura-logo" alt="assintaura logo" />
        <h1>Converter vídeo em .GIF</h1>
        {videoUploaded && videoDurationError && (
  <div className="video-duration-error">
   <p> O vídeo deve ter no máximo 15 segundos de duração. </p>
  </div>
)}

        <FileUploader onFileUpload={handleFileUpload} converting={converting} />
        {videoUploaded && (
          <div className="video-container">
            {converting && (
              <div className="progress-bar">
                {conversionProgress < 100 ? (
                  <ProgressBar
                    progress={conversionProgress}
                    showGeneratingText={showGeneratingText}
                    blinking={blinking}
                  />
                ) : (
                <span className={`blinking-text ${blinking ? 'highlight' : ''}`}>
                  Gerando arquivo convertido, aguarde ...
                </span>                )}
              </div>
            )}

            {!converting && !converted && (
              <p>
 <button onClick={convertToGif} disabled={converting || disableConversion}>
  Converter em GIF
</button>

              </p>
            )}
            <VideoPlayer ref={videoRef} videoFile={videoFile} />

            {converted && (
              <ConvertedGif gifUrl={gifUrl} onDownload={handleDownload} />
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
