'use client';

import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { Business } from '../../api';
import { FileDropzone, PendingFile } from '@/shared/forms/FileDropzone';
import { UploadedFilesPreview } from '../UploadedFilesPreview';

interface Step6BrandAssetsProps {
  form: UseFormReturn<BusinessFormData>;
  existingBusiness?: Business | null;
  uploadRevision?: number;
}

export function Step6BrandAssets({ form, existingBusiness, uploadRevision = 0 }: Step6BrandAssetsProps) {
  const { watch, setValue } = form;
  const [logoPending, setLogoPending] = useState<PendingFile[]>([]);
  const [assetsPending, setAssetsPending] = useState<PendingFile[]>([]);

  useEffect(() => {
    setLogoPending([]);
    setAssetsPending([]);
  }, [uploadRevision]);

  const syncLogo = (files: PendingFile[]) => {
    setLogoPending(files);
    setValue('logoFile', files[0]?.file);
  };

  const syncAssets = (files: PendingFile[]) => {
    setAssetsPending(files);
    setValue('brandAssets', files.map((f) => f.file));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Brand Assets</h5>
      </div>
      <div className="card-body">
        <p className="text-muted small">Supported formats: JPG, PNG, PDF. Logo is required before submit.</p>

        <UploadedFilesPreview business={existingBusiness ?? null} mode="brand" />

        <div className="mb-4">
          <label className="form-label">Business Logo <span className="text-danger">*</span></label>
          <FileDropzone
            files={logoPending}
            onChange={syncLogo}
            label="Drag logo here (JPG/PNG)"
          />
        </div>

        <div>
          <label className="form-label">Outlet Images, Brochures, Menu, etc. (optional)</label>
          <FileDropzone
            files={assetsPending}
            onChange={syncAssets}
            label="Drag files here (JPG, PNG, PDF)"
          />
        </div>
      </div>
    </div>
  );
}
