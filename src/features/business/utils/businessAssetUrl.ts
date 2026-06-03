/**
 * Build a public storage URL for business logos, assets, and documents.
 */
export function resolveBusinessFileUrl(file: {
  file_url?: string | null;
  file_path: string;
}): string {
  if (file.file_url) {
    return file.file_url;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (apiBase) {
    const path = file.file_path.replace(/^\/+/, '');
    return `${apiBase}/storage/${path}`;
  }
  return file.file_path;
}

export function resolveLogoUrl(business: {
  logo_url?: string | null;
  logo_path?: string | null;
  assets?: Array<{ asset_type: string; file_path: string; file_url?: string | null }>;
}): string | null {
  if (business.logo_url) {
    return business.logo_url;
  }
  if (business.logo_path) {
    return resolveBusinessFileUrl({ file_path: business.logo_path });
  }
  const logoAsset = business.assets?.find((a) => a.asset_type === 'logo');
  if (logoAsset) {
    return resolveBusinessFileUrl(logoAsset);
  }
  return null;
}
