'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { X } from 'lucide-react';

interface Step4PromotionalMediaProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 4: Promotional Media Upload
 */
export function Step4PromotionalMedia({ form }: Step4PromotionalMediaProps) {
  const { setValue, watch } = form;
  const brandProofs = watch('brandProofs') || [];
  const [previews, setPreviews] = useState<Record<number, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const updatedFiles = [...brandProofs, ...files];
      setValue('brandProofs', updatedFiles);

      // Create previews for image files
      files.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews((prev) => ({
              ...prev,
              [brandProofs.length + index]: reader.result as string,
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = brandProofs.filter((_, i) => i !== index);
    setValue('brandProofs', updatedFiles);
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Promotional Media Upload</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label htmlFor="promotionalMedia" className="form-label">
            Upload Images or Documents
          </label>
          <input
            id="promotionalMedia"
            type="file"
            className="form-control"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <small className="form-text text-muted">
            You can upload multiple files. Supported formats: Images, PDF, Word documents
          </small>
        </div>

        {brandProofs.length > 0 && (
          <div>
            <h6 className="mb-3">Uploaded Files ({brandProofs.length})</h6>
            <div className="row g-3">
              {brandProofs.map((file, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body p-2">
                      {previews[index] ? (
                        <div className="position-relative">
                          <img
                            src={previews[index]}
                            alt={file.name}
                            className="img-fluid rounded"
                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => removeFile(index)}
                            style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0 }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="flex-grow-1">
                            <small className="d-block text-truncate" style={{ maxWidth: '150px' }}>
                              {file.name}
                            </small>
                            <small className="text-muted">
                              {(file.size / 1024).toFixed(2)} KB
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFile(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}









