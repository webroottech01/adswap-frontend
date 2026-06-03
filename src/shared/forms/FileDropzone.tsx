'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export interface PendingFile {
  file: File;
  preview?: string;
}

interface FileDropzoneProps {
  files: PendingFile[];
  onChange: (files: PendingFile[]) => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

const ACCEPT = 'image/*,.pdf';

export function FileDropzone({
  files,
  onChange,
  disabled = false,
  label = 'Drag and drop files here, or click to browse',
  compact = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: File[]) => {
      const next: PendingFile[] = [...files];
      incoming.forEach((file) => {
        const entry: PendingFile = { file };
        if (file.type.startsWith('image/')) {
          entry.preview = URL.createObjectURL(file);
        }
        next.push(entry);
      });
      onChange(next);
    },
    [files, onChange],
  );

  const removeFile = (index: number) => {
    const removed = files[index];
    if (removed.preview) {
      URL.revokeObjectURL(removed.preview);
    }
    onChange(files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={`border border-2 rounded text-center ${
          compact ? 'p-2' : 'p-4'
        } ${isDragging ? 'border-primary bg-light' : 'border-dashed'} ${
          disabled ? 'opacity-50' : 'cursor-pointer'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <Upload className="text-muted mb-2" size={compact ? 20 : 32} />
        <p className={`mb-1 ${compact ? 'small mb-0' : 'small'}`}>{label}</p>
        {!compact && (
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
            Images or PDF, up to 5MB each
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          className="d-none"
          multiple
          accept={ACCEPT}
          disabled={disabled}
          onChange={(e) => {
            addFiles(Array.from(e.target.files || []));
            e.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <div className={`row g-2 ${compact ? 'mt-2' : 'mt-3'}`}>
          {files.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className={compact ? 'col-auto' : 'col-6 col-md-4'}>
              <div className="card h-100">
                <div className="card-body p-2 position-relative">
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="img-fluid rounded"
                      style={{
                        height: compact ? 64 : 100,
                        width: compact ? 64 : '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center bg-light rounded"
                      style={{ height: compact ? 64 : 100, width: compact ? 64 : '100%' }}
                    >
                      <FileText size={compact ? 20 : 28} className="text-muted" />
                      {!compact && (
                        <small className="text-muted text-truncate w-100 text-center px-1">
                          {item.file.name}
                        </small>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    style={{ borderRadius: '50%', width: 28, height: 28, padding: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={disabled}
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
