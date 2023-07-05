import React from 'react';

const ConvertedGif = ({ gifUrl, onDownload }) => {
  return (
    <div className="gif-container">
      <p>Arquivo convertido, clique em Baixar GIF para</p>
      <img src={gifUrl} alt="GIF convertido" width="200" height="200" />
      <p>
        <button onClick={onDownload}>Baixar GIF</button>
      </p>
    </div>
  );
};

export default ConvertedGif;
