import Typography from '@components/ui/typography';

import { EMBED_URL } from './utils';

//  ---------------------------------------------------------------------------
//  YouTube Embed (heavy: loads iframe + YT player JS)
//  ---------------------------------------------------------------------------

export default function YouTubeEmbed() {
  return (
    <div className="space-y-3">
      <Typography.small className="text-muted-foreground">
        Full embed loaded (fast connection detected)
      </Typography.small>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={EMBED_URL}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
