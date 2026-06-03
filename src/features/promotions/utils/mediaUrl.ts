import type { PromotionMedia } from '../types';

/**
 * Build a media URL that matches the Laravel API host (NEXT_PUBLIC_API_URL).
 * API file_url values follow APP_URL and may point at the wrong host in local dev.
 */
export function resolvePromotionMediaUrl(media: Pick<PromotionMedia, 'file_url' | 'file_path'>): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (apiBase) {
    const path = media.file_path.replace(/^\/+/, '');
    return `${apiBase}/storage/${path}`;
  }
  return media.file_url;
}
