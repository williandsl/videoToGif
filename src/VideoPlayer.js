import React from 'react';

const VideoPlayer = React.forwardRef(({ videoFile }, ref) => {
  return (
    <video ref={ref} key={videoFile ? videoFile.name : ''} controls>
      <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
    </video>
  );
});

export default VideoPlayer;
