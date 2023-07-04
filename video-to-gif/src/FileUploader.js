import React from 'react';

const FileUploader = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <input type="file" accept="video/*" onChange={handleFileChange} />
  );
};

export default FileUploader;
