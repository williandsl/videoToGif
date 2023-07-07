import React from 'react';


const VideoPlayer = React.forwardRef(({ videoFile }, ref) => {
  return (
    <p>
    <video ref={ref} key={videoFile ? videoFile.name : ''} controls>
      <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
    </video>
    </p>
  );
});

export default VideoPlayer;
