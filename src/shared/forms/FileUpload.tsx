import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  error?: string;
  helperText?: string;
  className?: string;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload Files',
  accept,
  multiple = false,
  onChange,
  error,
  helperText,
  className = '',
  maxFiles,
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file count
    if (maxFiles && files.length > maxFiles) {
      alert(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    // Validate file size
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed ${maxSizeMB}MB limit`);
      return;
    }

    const newFiles = multiple ? [...selectedFiles, ...files] : files;
    setSelectedFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onChange?.(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="form-label">{label}</label>
      )}
      
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="d-none"
        />
        
        <button
          type="button"
          className="btn btn-outline-primary d-flex align-items-center"
          onClick={handleClick}
        >
          <Upload size={18} className="me-2" />
          Choose Files
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <p className="small text-muted mb-2">Selected files:</p>
          <ul className="list-group">
            {selectedFiles.map((file, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center justify-content-between"
              >
                <span className="small">{file.name}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger"
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="invalid-feedback d-block mt-1">{error}</div>
      )}
      
      {helperText && !error && (
        <div className="form-text mt-1">{helperText}</div>
      )}
    </div>
  );
};

