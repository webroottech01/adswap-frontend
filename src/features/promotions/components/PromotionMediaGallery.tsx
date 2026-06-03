'use client';

import { useState } from 'react';
import { FileText, ImageIcon } from 'lucide-react';
import { resolvePromotionMediaUrl } from '../utils/mediaUrl';
import type { PromotionMedia } from '../types';

function isImageMedia(media: PromotionMedia): boolean {
  return Boolean(media.mime_type?.startsWith('image/'));
}

interface PromotionMediaGalleryProps {
  media: PromotionMedia[];
  compact?: boolean;
}

export function PromotionMediaGallery({ media, compact = false }: PromotionMediaGalleryProps) {
  const [activeId, setActiveId] = useState<number | undefined>(media[0]?.id);
  const active = media.find((m) => m.id === activeId) ?? media[0];
  const height = compact ? 140 : 200;

  if (media.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center bg-light text-muted border-bottom rounded-top"
        style={{ height }}
      >
        <ImageIcon size={compact ? 24 : 32} className="mb-2 opacity-50" />
        <span className="small">No media uploaded</span>
      </div>
    );
  }

  return (
    <div className="border-bottom rounded-top overflow-hidden">
      <div className="position-relative bg-light" style={{ height }}>
        {active && isImageMedia(active) ? (
          <a
            href={resolvePromotionMediaUrl(active)}
            target="_blank"
            rel="noopener noreferrer"
            className="d-block h-100"
          >
            <img
              src={resolvePromotionMediaUrl(active)}
              alt={active.file_name}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </a>
        ) : active ? (
          <a
            href={resolvePromotionMediaUrl(active)}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex flex-column align-items-center justify-content-center h-100 text-decoration-none text-muted"
          >
            <FileText size={compact ? 28 : 40} className="mb-2" />
            <span className="small px-3 text-center">{active.file_name}</span>
          </a>
        ) : null}
        <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75">
          {media.length} {media.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      {media.length > 1 && (
        <div className="d-flex gap-2 p-2 bg-white border-top overflow-auto" style={{ scrollbarWidth: 'thin' }}>
          {media.map((item) => {
            const selected = item.id === active?.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`btn p-0 border rounded overflow-hidden flex-shrink-0 ${
                  selected ? 'border-primary border-2' : 'border-secondary-subtle'
                }`}
                style={{ width: 48, height: 48 }}
                onClick={() => setActiveId(item.id)}
                aria-label={`View ${item.file_name}`}
                aria-pressed={selected}
              >
                {isImageMedia(item) ? (
                  <img
                    src={resolvePromotionMediaUrl(item)}
                    alt=""
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="d-flex align-items-center justify-content-center w-100 h-100 bg-light">
                    <FileText size={16} className="text-muted" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
