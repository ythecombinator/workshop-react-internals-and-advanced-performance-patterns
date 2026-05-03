export const VIDEO_ID = 'Fr5byuGZtnY';
export const YOUTUBE_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
export const THUMBNAIL_URL = `https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`;
export const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`;

type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

export interface NetworkInformation extends EventTarget {
  readonly downlink: number;
  readonly effectiveType: EffectiveConnectionType;
  readonly rtt: number;
  readonly saveData: boolean;
}

declare global {
  interface Navigator {
    readonly connection?: NetworkInformation;
  }
}

export function getConnectionInfo() {
  return navigator.connection;
}

export function isFastConnection() {
  const connection = navigator.connection;

  if (!connection) {
    return true;
  }

  if (connection.saveData) {
    return false;
  }

  return connection.effectiveType === '4g';
}
