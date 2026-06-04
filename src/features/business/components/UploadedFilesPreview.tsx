'use client';

import { FileText } from 'lucide-react';
import { BusinessAsset, BusinessDocument } from '../api';
import { resolveBusinessFileUrl, resolveLogoUrl } from '../utils/businessAssetUrl';
import type { Business } from '../api';
import { ASSET_TYPE_LABELS } from '../utils/profileLabels';

interface UploadedFilesPreviewProps {
  business: Business | null;
  mode: 'brand' | 'verification';
}

function FileTile({
  url,
  fileName,
  mimeType,
  subtitle,
}: {
  url: string;
  fileName: string;
  mimeType?: string;
  subtitle?: string;
}) {
  const isImage = mimeType?.startsWith('image/');

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card border h-100">
        <div className="card-body p-2">
          {isImage ? (
            <img
              src={url}
              alt={fileName}
              className="img-fluid rounded mb-2 w-100"
              style={{ height: 100, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded mb-2 text-muted"
              style={{ height: 100 }}
            >
              <FileText size={28} />
            </div>
          )}
          {subtitle && <p className="small text-muted mb-1">{subtitle}</p>}
          <p className="mb-0 small fw-semibold text-truncate" title={fileName}>
            {fileName}
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="small">
            View
          </a>
        </div>
      </div>
    </div>
  );
}

export function UploadedFilesPreview({ business, mode }: UploadedFilesPreviewProps) {
  if (!business) return null;

  if (mode === 'brand') {
    const logoUrl = resolveLogoUrl(business);
    const mediaAssets =
      business.assets?.filter((a) => a.asset_type !== 'logo') ?? [];

    if (!logoUrl && mediaAssets.length === 0) {
      return null;
    }

    return (
      <div className="mb-4">
        <h6 className="text-muted text-uppercase small mb-3">Already uploaded</h6>
        {logoUrl && (
          <div className="mb-3">
            <p className="small fw-semibold mb-2">Business logo</p>
            <div className="row g-2">
              <FileTile url={logoUrl} fileName="Logo" mimeType="image/jpeg" />
            </div>
          </div>
        )}
        {mediaAssets.length > 0 && (
          <div>
            <p className="small fw-semibold mb-2">Brand assets</p>
            <div className="row g-2">
              {mediaAssets.map((asset: BusinessAsset) => (
                <FileTile
                  key={asset.id}
                  url={resolveBusinessFileUrl(asset)}
                  fileName={asset.file_name}
                  mimeType={asset.mime_type}
                  subtitle={ASSET_TYPE_LABELS[asset.asset_type] ?? asset.asset_type}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const documents = business.documents ?? [];
  if (documents.length === 0) return null;

  return (
    <div className="mb-4">
      <h6 className="text-muted text-uppercase small mb-3">Already uploaded</h6>
      <div className="row g-2">
        {documents.map((doc: BusinessDocument) => (
          <FileTile
            key={doc.id}
            url={resolveBusinessFileUrl(doc)}
            fileName={doc.file_name}
            mimeType={doc.mime_type}
            subtitle={`${doc.document_type.toUpperCase()} · ${doc.status}`}
          />
        ))}
      </div>
    </div>
  );
}
