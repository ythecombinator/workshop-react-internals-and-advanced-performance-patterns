import Typography from '@components/ui/typography';

import { THUMBNAIL_URL, YOUTUBE_URL } from './utils';

//  ---------------------------------------------------------------------------
//  YouTube Thumbnail (lightweight: just an <img> + play link)
//  ---------------------------------------------------------------------------

export default function YouTubeThumbnail() {
  return (
    <div className="space-y-3">
      <Typography.small className="text-muted-foreground">
        Thumbnail loaded (slow connection detected)
      </Typography.small>
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full aspect-video rounded-lg overflow-hidden border"
      >
        <img
          src={THUMBNAIL_URL}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>
      <Typography.subtle>
        Tap to open on YouTube (saves ~1.3 MB of iframe + player JS)
      </Typography.subtle>
    </div>
  );
}
