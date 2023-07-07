import React from 'react';

const ConvertedGif = ({ gifUrl, onDownload }) => {
  return (
    <div className="gif-container">
      <p >Arquivo convertido ... </p>
      <p>
        <button onClick={onDownload}>Clique aqui para Baixar</button>
      </p>
      <img src={gifUrl} alt="GIF convertido" width="200" height="200" />

    </div>
  );
};

export default ConvertedGif;
