import type { MessageAttachment } from '../types';

/**
 * Resolve message attachment URL for display (aligns API host in local dev).
 */
export function resolveMessageAttachmentUrl(attachment: MessageAttachment): string {
  const url = attachment.file_url;
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!apiBase || !url.includes('/storage/')) {
    return url;
  }
  const storageIndex = url.indexOf('/storage/');
  if (storageIndex === -1) {
    return url;
  }
  const path = url.slice(storageIndex + '/storage/'.length);
  return `${apiBase}/storage/${path}`;
}

export function isImageAttachment(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}
