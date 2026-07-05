/**
 * Resolve activity image URL from Lanyard data.
 * Handles external, spotify, rich presence, and game icons.
 */
export async function resolveActivityImage(
  image: string | undefined | null,
  applicationId?: string | null
): Promise<string | null> {
  if (!image) {
    if (!applicationId) return null;
    try {
      const res = await fetch(`https://discord.com/api/v10/applications/${applicationId}/rpc`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.icon
        ? `https://cdn.discordapp.com/app-icons/${applicationId}/${data.icon}.png?size=512`
        : null;
    } catch {
      return null;
    }
  }

  if (image.startsWith('mp:external/')) {
    return image.replace('mp:external/', 'https://media.discordapp.net/external/');
  }

  if (image.startsWith('spotify:')) {
    return `https://i.scdn.co/image/${image.replace('spotify:', '')}`;
  }

  if (!applicationId) return null;

  return /^\d+$/.test(image)
    ? `https://cdn.discordapp.com/app-assets/${applicationId}/${image}.png?size=512`
    : `https://cdn.discordapp.com/app-icons/${applicationId}/${image}.png?size=512&keep_aspect_ratio=false`;
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
