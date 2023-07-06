import React, { useRef } from 'react';

const FileUploader = ({ onFileUpload, converting }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];
    if (file && !converting) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input">
        <button onClick={() => fileInputRef.current.click()} disabled={converting}>
          Escolher arquivo
        </button>
      </label>
    </div>
  );
};

export default FileUploader;
