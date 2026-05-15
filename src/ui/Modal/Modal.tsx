import React from 'react';

export interface ModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  size,
  centered = false,
  children,
  footer,
}) => {
  if (!show) return null;

  const sizeClass = size ? `modal-${size}` : '';
  const centeredClass = centered ? 'modal-dialog-centered' : '';

  return (
    <>
      <div
        className="modal fade show"
        tabIndex={-1}
        onClick={onHide}
      >
        <div
          className={`modal-dialog ${sizeClass} ${centeredClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {title && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onHide}
                  aria-label="Close"
                />
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onHide} />
    </>
  );
};

