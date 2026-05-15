'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { X, FileText } from 'lucide-react';

interface Step7BusinessDocumentsProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 7: Business Documents
 * Only one of GST/Shop Act/PAN can be selected
 */
export function Step7BusinessDocuments({ form }: Step7BusinessDocumentsProps) {
  const { setValue, watch, register, formState: { errors } } = form;
  const businessDocuments = watch('businessDocuments') || [];
  const documentType = watch('documentType');

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

  const handleDocumentTypeChange = (type: 'gst' | 'shop_act' | 'pan' | 'other') => {
    setValue('documentType', type);
    // Clear documents if switching between exclusive types
    if (['gst', 'shop_act', 'pan'].includes(type) && documentType && ['gst', 'shop_act', 'pan'].includes(documentType) && type !== documentType) {
      setValue('businessDocuments', []);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Documents</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label className="form-label">
            Document Type <span className="text-danger">*</span>
          </label>
          <div className="d-flex flex-column gap-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="documentType-gst"
                value="gst"
                checked={documentType === 'gst'}
                onChange={() => handleDocumentTypeChange('gst')}
              />
              <label className="form-check-label" htmlFor="documentType-gst">
                GST
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="documentType-shop_act"
                value="shop_act"
                checked={documentType === 'shop_act'}
                onChange={() => handleDocumentTypeChange('shop_act')}
              />
              <label className="form-check-label" htmlFor="documentType-shop_act">
                Shop Act
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="documentType-pan"
                value="pan"
                checked={documentType === 'pan'}
                onChange={() => handleDocumentTypeChange('pan')}
              />
              <label className="form-check-label" htmlFor="documentType-pan">
                PAN
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="documentType-other"
                value="other"
                checked={documentType === 'other'}
                onChange={() => handleDocumentTypeChange('other')}
              />
              <label className="form-check-label" htmlFor="documentType-other">
                Other
              </label>
            </div>
          </div>
          {errors.documentType && (
            <div className="text-danger small mt-1">{errors.documentType.message}</div>
          )}
          <small className="form-text text-muted">
            Note: Only one of GST, Shop Act, or PAN can be uploaded per business.
          </small>
        </div>

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
            disabled={!documentType}
          />
          <small className="form-text text-muted">
            {documentType ? 'Upload business documents. Supported formats: PDF, Word documents, Images' : 'Please select a document type first'}
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




