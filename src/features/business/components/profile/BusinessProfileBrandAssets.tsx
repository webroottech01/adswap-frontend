'use client';

import { ImageIcon, FileText } from 'lucide-react';
import type { Business, BusinessAsset } from '../../api';
import { BusinessProfileSection } from './BusinessProfileSection';
import { ASSET_TYPE_LABELS } from '../../utils/profileLabels';
import { resolveBusinessFileUrl } from '../../utils/businessAssetUrl';

interface BusinessProfileBrandAssetsProps {
  business: Business;
}

function AssetTile({ asset }: { asset: BusinessAsset }) {
  const url = resolveBusinessFileUrl(asset);
  const isImage = asset.mime_type?.startsWith('image/');

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card border h-100">
        <div className="card-body p-2">
          {isImage ? (
            <img
              src={url}
              alt={asset.file_name}
              className="img-fluid rounded mb-2 w-100"
              style={{ height: 120, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded mb-2 text-muted"
              style={{ height: 120 }}
            >
              <FileText size={32} />
            </div>
          )}
          <p className="mb-0 small fw-semibold text-truncate" title={asset.file_name}>
            {asset.file_name}
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="small">
            View file
          </a>
        </div>
      </div>
    </div>
  );
}

export function BusinessProfileBrandAssets({ business }: BusinessProfileBrandAssetsProps) {
  const mediaAssets =
    business.assets?.filter((a) => a.asset_type !== 'logo') ?? [];

  if (mediaAssets.length === 0) {
    return null;
  }

  const grouped = mediaAssets.reduce<Record<string, BusinessAsset[]>>((acc, asset) => {
    const key = asset.asset_type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(asset);
    return acc;
  }, {});

  return (
    <BusinessProfileSection title="Brand assets & media" icon={ImageIcon}>
      {Object.entries(grouped).map(([type, assets]) => (
        <div key={type} className="mb-4">
          <h6 className="small text-muted text-uppercase mb-2">
            {ASSET_TYPE_LABELS[type] ?? type.replace(/_/g, ' ')}
          </h6>
          <div className="row g-3">
            {assets.map((asset) => (
              <AssetTile key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      ))}
    </BusinessProfileSection>
  );
}
