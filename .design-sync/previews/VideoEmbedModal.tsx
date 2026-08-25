import { VideoEmbedModal } from "@tmi-packages/ui";

export function YouTube() {
  return (
    <VideoEmbedModal
      open
      onClose={() => undefined}
      title="YouTube sample"
      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    />
  );
}

export function Vimeo() {
  return (
    <VideoEmbedModal
      open
      onClose={() => undefined}
      title="Vimeo sample"
      url="https://vimeo.com/76979871"
    />
  );
}
