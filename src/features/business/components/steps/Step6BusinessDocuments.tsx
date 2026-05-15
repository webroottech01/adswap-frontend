'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { X, FileText } from 'lucide-react';

interface Step6BusinessDocumentsProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 6: Business Documents
 */
export function Step6BusinessDocuments({ form }: Step6BusinessDocumentsProps) {
  const { setValue, watch } = form;
  const businessDocuments = watch('businessDocuments') || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const updatedFiles = [...businessDocuments, ...files];
      setValue('businessDocuments', updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = businessDocuments.filter((_, i) => i !== index);
    setValue('businessDocuments', updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Documents</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label htmlFor="businessDocuments" className="form-label">
            Upload Business Documents
          </label>
          <input
            id="businessDocuments"
            type="file"
            className="form-control"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <small className="form-text text-muted">
            Upload business registration documents, licenses, or other relevant files
          </small>
        </div>

        {businessDocuments.length > 0 && (
          <div>
            <h6 className="mb-3">Uploaded Documents ({businessDocuments.length})</h6>
            <div className="list-group">
              {businessDocuments.map((file, index) => (
                <div
                  key={index}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center">
                    <FileText size={20} className="text-muted me-2" />
                    <div>
                      <div className="fw-medium">{file.name}</div>
                      <small className="text-muted">{formatFileSize(file.size)}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFile(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}









