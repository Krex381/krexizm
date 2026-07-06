const SAFE_APP_ID = /^\d{17,20}$/;
const SAFE_ASSET_KEY = /^[a-zA-Z0-9_\-]+$/;

function sanitizeAppId(id: string): string | null {
  return SAFE_APP_ID.test(id) ? id : null;
}

function sanitizeAssetKey(key: string): string | null {
  return SAFE_ASSET_KEY.test(key) ? key : null;
}

export async function resolveActivityImage(
  image: string | undefined | null,
  applicationId?: string | null
): Promise<string | null> {
  if (!image) {
    if (!applicationId) return null;
    const safeAppId = sanitizeAppId(applicationId);
    if (!safeAppId) return null;
    try {
      const res = await fetch(`https://discord.com/api/v10/applications/${safeAppId}/rpc`);
      if (!res.ok) return null;
      const data = await res.json();
      const icon = typeof data.icon === 'string' ? sanitizeAssetKey(data.icon) : null;
      return icon
        ? `https://cdn.discordapp.com/app-icons/${safeAppId}/${icon}.png?size=512`
        : null;
    } catch {
      return null;
    }
  }

  if (image.startsWith('mp:external/')) {
    return image.replace('mp:external/', 'https://media.discordapp.net/external/');
  }

  if (image.startsWith('spotify:')) {
    const assetId = image.replace('spotify:', '');
    return SAFE_ASSET_KEY.test(assetId) ? `https://i.scdn.co/image/${assetId}` : null;
  }

  if (!applicationId) return null;
  const safeAppId = sanitizeAppId(applicationId);
  if (!safeAppId) return null;
  const safeImage = sanitizeAssetKey(image);
  if (!safeImage) return null;

  return /^\d+$/.test(safeImage)
    ? `https://cdn.discordapp.com/app-assets/${safeAppId}/${safeImage}.png?size=512`
    : `https://cdn.discordapp.com/app-icons/${safeAppId}/${safeImage}.png?size=512&keep_aspect_ratio=false`;
}

/**
 * Format timestamp for activity display.
 */
export function formatTimestamp(start: number, end?: number): string {
  const now = Date.now();
  const diff = end ? end - now : now - start;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}
