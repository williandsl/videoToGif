import React from 'react';

const ProgressBar = ({ progress, showGeneratingText, blinking }) => {
  return (
    <span>
      {showGeneratingText ? (
        <span className={`blinking-text ${blinking ? 'highlight' : ''}`}>
          Gerando arquivo, aguarde ...
        </span>
      ) : (
        `Convertendo... ${progress.toFixed(1)}%`
      )}
      <progress value={progress} max="100" />
    </span>
  );
};

export default ProgressBar;
