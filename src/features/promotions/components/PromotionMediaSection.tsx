'use client';

import { FileDropzone, PendingFile } from './FileDropzone';
import type { Promotion } from '../types';
import { resolvePromotionMediaUrl } from '../utils/mediaUrl';

interface PromotionMediaSectionProps {
  promotion?: Promotion | null;
  pendingFiles: PendingFile[];
  onPendingFilesChange: (files: PendingFile[]) => void;
  loading?: boolean;
  onDeleteMedia?: (mediaId: number) => void | Promise<void>;
  deletingMediaId?: number | null;
}

export function PromotionMediaSection({
  promotion,
  pendingFiles,
  onPendingFilesChange,
  loading = false,
  onDeleteMedia,
  deletingMediaId = null,
}: PromotionMediaSectionProps) {
  const isEdit = Boolean(promotion);
  const existingMedia = promotion?.media ?? [];

  return (
    <>
      {isEdit && existingMedia.length > 0 && (
        <div className="mb-4">
          <h6 className="mb-2">Uploaded content</h6>
          <div className="row g-2">
            {existingMedia.map((media) => {
              const isImage = media.mime_type?.startsWith('image/');
              return (
                <div key={media.id} className="col-6 col-md-4">
                  <div className="card">
                    <div className="card-body p-2 position-relative">
                      {isImage ? (
                        <img
                          src={resolvePromotionMediaUrl(media)}
                          alt={media.file_name}
                          className="img-fluid rounded"
                          style={{ height: 100, width: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-light rounded small text-muted"
                          style={{ height: 100 }}
                        >
                          {media.file_name}
                        </div>
                      )}
                      {onDeleteMedia && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-1"
                          onClick={() => onDeleteMedia(media.id)}
                          disabled={loading || deletingMediaId === media.id}
                        >
                          {deletingMediaId === media.id ? '…' : 'Remove'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h6 className="mb-2">
          {isEdit ? 'Add more content' : 'Upload content for this promotion'}
        </h6>
        <FileDropzone
          files={pendingFiles}
          onChange={onPendingFilesChange}
          disabled={loading}
        />
      </div>
    </>
  );
}
