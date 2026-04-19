import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type VideoEmbedProvider = "youtube" | "vimeo";

export interface VideoEmbedModalProps {
  open: boolean;
  onClose: () => void;
  /** Media URL (YouTube or Vimeo). Video ID is extracted automatically. */
  url: string;
  /** Title shown in the modal header. */
  title: string;
  /**
   * Accessible label for the close button.
   * Localize in consumer apps; defaults to English.
   */
  closeAriaLabel?: string;
}

function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  return null;
}

function getVimeoVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const playerMatch = trimmed.match(/(?:player\.vimeo\.com\/video\/)(\d+)/);
  if (playerMatch) return playerMatch[1];

  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];

  return null;
}

function getEmbedSrc(url: string): { src: string; provider: VideoEmbedProvider } | null {
  if (!url || typeof url !== "string") return null;

  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
      provider: "youtube",
    };
  }

  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) {
    return {
      src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      provider: "vimeo",
    };
  }

  return null;
}

/**
 * Modal that embeds YouTube or Vimeo videos in a responsive 16:9 iframe.
 * Uses privacy-enhanced `youtube-nocookie.com` for YouTube.
 * Video autoplays when the modal opens. Returns `null` if `url` cannot be
 * resolved to a supported provider.
 */
export const VideoEmbedModal = ({
  open,
  onClose,
  url,
  title,
  closeAriaLabel = "Close",
}: VideoEmbedModalProps) => {
  const theme = useTheme();
  const fullWidthOnMobile = useMediaQuery(theme.breakpoints.down("md"));

  const embed = getEmbedSrc(url);
  if (!embed) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          mx: fullWidthOnMobile ? 1 : 4,
          maxWidth: fullWidthOnMobile ? "none" : 900,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 0.5,
        }}
      >
        <Box
          component="span"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            pr: 1,
          }}
        >
          {title}
        </Box>
        <IconButton
          onClick={onClose}
          aria-label={closeAriaLabel}
          size="small"
          sx={{ flexShrink: 0 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            borderRadius: 1,
          }}
        >
          <Box
            component="iframe"
            src={embed.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
