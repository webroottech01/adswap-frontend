'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData, DocumentType } from '../../types';
import { Business } from '../../api';
import { DOCUMENT_TYPE_OPTIONS } from '../../constants';
import { FileDropzone, PendingFile } from '@/shared/forms/FileDropzone';
import { UploadedFilesPreview } from '../UploadedFilesPreview';

interface Step7BusinessVerificationProps {
  form: UseFormReturn<BusinessFormData>;
  verificationStatus?: string;
  existingBusiness?: Business | null;
  uploadRevision?: number;
}

export function Step7BusinessVerification({
  form,
  verificationStatus = 'not_submitted',
  existingBusiness,
  uploadRevision = 0,
}: Step7BusinessVerificationProps) {
  const { watch, setValue } = form;
  const [docPending, setDocPending] = useState<PendingFile[]>([]);
  const documentType = watch('documentType');

  useEffect(() => {
    setDocPending([]);
  }, [uploadRevision]);

  const statusLabel: Record<string, string> = {
    not_submitted: 'Not Submitted',
    under_review: 'Under Review',
    verified: 'Verified',
    rejected: 'Rejected',
  };

  const syncDocs = (files: PendingFile[]) => {
    setDocPending(files);
    setValue('businessDocuments', files.map((f) => f.file));
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Business Verification</h5>
        <span className="badge bg-secondary">{statusLabel[verificationStatus] ?? verificationStatus}</span>
      </div>
      <div className="card-body">
        <div className="alert alert-info small">
          Upload any one business document to receive a verified badge. You can skip this step — your profile will remain unverified.
        </div>

        <UploadedFilesPreview business={existingBusiness ?? null} mode="verification" />

        <div className="mb-3">
          <label className="form-label">Document Type</label>
          <div className="d-flex flex-wrap gap-2">
            {DOCUMENT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`btn btn-sm ${documentType === opt.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setValue('documentType', opt.value as DocumentType)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <FileDropzone files={docPending} onChange={syncDocs} label="Drag document here (JPG, PNG, PDF)" />
      </div>
    </div>
  );
}
