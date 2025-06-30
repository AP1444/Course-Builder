import { useState, useEffect } from 'react';

const UploadModal = ({
  isOpen,
  onClose,
  onSave,
  moduleId,
  initialTitle = '',
  initialFileName = '',
}) => {
  const [fileTitle, setFileTitle] = useState(initialTitle);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFileTitle(initialTitle);
    setSelectedFile(null);
  }, [initialTitle, initialFileName]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSave({
      id: Date.now().toString(),
      moduleId,
      type: 'file',
      title: fileTitle.trim(),
      fileName: selectedFile ? selectedFile.name : initialFileName,
      fileSize: selectedFile ? selectedFile.size : 0,
      fileType: selectedFile ? selectedFile.type : '',
    });
    setFileTitle('');
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload file</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File title</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={e => setFileTitle(e.target.value)}
                placeholder="File title"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="file-upload">Select file</label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="file-input"
              />
              {selectedFile && (
                <div className="selected-file">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              )}
              {!selectedFile && initialFileName && (
                <div className="selected-file">
                  <span className="file-name">{initialFileName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={
                !fileTitle.trim() || (!selectedFile && !initialFileName)
              }
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
