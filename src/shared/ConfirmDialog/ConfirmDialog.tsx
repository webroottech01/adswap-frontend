import React from 'react';
import { Modal } from '@/ui/Modal';
import { Button } from '@/ui/Button';

export interface ConfirmDialogProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onHide} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={variant} onClick={handleConfirm} disabled={loading}>
        {loading ? 'Processing...' : confirmText}
      </Button>
    </>
  );

  return (
    <Modal show={show} onHide={onHide} title={title} footer={footer} centered>
      <p className="mb-0">{message}</p>
    </Modal>
  );
};

