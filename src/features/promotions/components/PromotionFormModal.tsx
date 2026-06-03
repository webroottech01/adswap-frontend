'use client';

import { useEffect, useState } from 'react';
import { FileDropzone, PendingFile } from './FileDropzone';
import type { Promotion } from '../types';
import { resolvePromotionMediaUrl } from '../utils/mediaUrl';

interface PromotionFormModalProps {
  show: boolean;
  promotion?: Promotion | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    files: File[];
  }) => void | Promise<void>;
  onDeleteMedia?: (mediaId: number) => void | Promise<void>;
  deletingMediaId?: number | null;
}

export function PromotionFormModal({
  show,
  promotion,
  loading = false,
  onClose,
  onSubmit,
  onDeleteMedia,
  deletingMediaId = null,
}: PromotionFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const isEdit = Boolean(promotion);

  useEffect(() => {
    if (show) {
      setTitle(promotion?.title ?? '');
      setDescription(promotion?.description ?? '');
      setPendingFiles([]);
    }
  }, [show, promotion]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      files: pendingFiles.map((p) => p.file),
    });
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? 'Edit promotion' : 'Create promotion'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="promotionTitle" className="form-label">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    id="promotionTitle"
                    type="text"
                    className="form-control"
                    placeholder='e.g. "Place your coupons at my salon reception"'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={255}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="promotionDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="promotionDescription"
                    className="form-control"
                    rows={3}
                    placeholder="Describe the promotion opportunity for partner businesses..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={5000}
                    disabled={loading}
                  />
                </div>

                {isEdit && promotion && promotion.media.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-2">Uploaded content</h6>
                    <div className="row g-2">
                      {promotion.media.map((media) => {
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
                    onChange={setPendingFiles}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
                  {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
