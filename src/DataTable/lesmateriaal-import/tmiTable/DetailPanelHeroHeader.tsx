import AccountTree from "@mui/icons-material/AccountTree";
import Close from "@mui/icons-material/Close";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import EditOff from "@mui/icons-material/EditOff";
import Lock from "@mui/icons-material/Lock";
import Save from "@mui/icons-material/Save";
import {
  Box,
  CircularProgress,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { COVER_IMAGE_ACCEPT } from "../shared-utils/coverImageValidation.js";
import {
  DETAIL_HERO_SUBTITLE_LINE_CLAMP,
  DETAIL_HERO_TITLE_LINE_CLAMP,
  detailHeroClampSx,
  detailHeroOverlayIconButtonSx,
} from "./detailHeroTypography.js";
import { COVER_IMAGE_OBJECT_POSITION } from "../shared-theme/defaultTheme.js";
import { heroReadabilityGradientCss } from "../shared-theme/detailPanelHeroTheme.js";
import type {
  DetailHeroCoverMeta,
  DetailPanelHeroCoverEdit,
} from "../shared-types/detailPanelHero.types.js";
import { DetailPanelHeroLeftCluster } from "./DetailPanelHeroLeftCluster.js";
import { useWorkspaceDetailFullscreen } from "./context/WorkspaceDetailFullscreenContext.js";

export type {
  DetailHeroCoverMeta,
  DetailPanelHeroCoverEdit,
} from "../shared-types/detailPanelHero.types.js";

function PanelHeaderChrome({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        flexShrink: 0,
        px: 1.5,
        pt: 1.5,
        pb: 1.5,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {children}
    </Box>
  );
}

function CloseOnlyHeader({
  onClose,
  onBack,
}: {
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <PanelHeaderChrome>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ width: "100%", alignItems: "flex-start" }}
      >
        <Box sx={{ mr: "auto" }}>
          <DetailPanelHeroLeftCluster onBack={onBack} />
        </Box>
        <IconButton
          aria-label="Paneel sluiten"
          onClick={onClose}
          size="small"
          sx={(t) => detailHeroOverlayIconButtonSx(t)}
        >
          <Close />
        </IconButton>
      </Stack>
    </PanelHeaderChrome>
  );
}

type HeroCoverLayerProps = {
  heroMeta: DetailHeroCoverMeta;
};

function DetailPanelHeroCoverLayer({ heroMeta }: HeroCoverLayerProps) {
  const theme = useTheme();
  const h = theme.detailPanelHero.hero;
  const [imgSrc, setImgSrc] = useState(heroMeta.src);

  useEffect(() => {
    setImgSrc(heroMeta.src);
  }, [heroMeta.src, heroMeta.fallbackSrc]);

  return (
    <Box
      component="img"
      src={imgSrc}
      alt=""
      aria-hidden
      onError={() => {
        if (heroMeta.fallbackSrc && imgSrc !== heroMeta.fallbackSrc) {
          setImgSrc(heroMeta.fallbackSrc);
        }
      }}
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: COVER_IMAGE_OBJECT_POSITION,
        filter: `blur(${h.thumbnailBlurPx}px)`,
        transform: `scale(${h.thumbnailUpscale})`,
        transformOrigin: "center center",
      }}
    />
  );
}

function DetailPanelHeroCoverEditSurface({
  heroImageMeta,
  heroCoverEdit,
  fallbackBg,
}: {
  heroImageMeta: DetailHeroCoverMeta | null | undefined;
  heroCoverEdit: DetailPanelHeroCoverEdit | null | undefined;
  fallbackBg: string;
}) {
  const theme = useTheme();
  const showEdit = Boolean(heroCoverEdit);
  const editable = heroCoverEdit?.editable ?? false;
  const locked = showEdit && !editable;

  return (
    <Box
      role={editable ? "button" : undefined}
      tabIndex={editable ? 0 : undefined}
      aria-label={editable ? "Coverafbeelding wijzigen" : undefined}
      onClick={editable ? heroCoverEdit?.onCoverClick : undefined}
      onKeyDown={
        editable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                heroCoverEdit?.onCoverClick();
              }
            }
          : undefined
      }
      onDrop={showEdit ? heroCoverEdit?.onDrop : undefined}
      onDragOver={showEdit ? heroCoverEdit?.onDragOver : undefined}
      onDragLeave={showEdit ? heroCoverEdit?.onDragLeave : undefined}
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: showEdit ? "auto" : "none",
        cursor: editable ? "pointer" : "default",
        ...(editable && heroCoverEdit?.dragActive && heroCoverEdit.dropSurfaceSx
          ? heroCoverEdit.dropSurfaceSx(theme)
          : {}),
      }}
    >
      {heroImageMeta ? (
        <DetailPanelHeroCoverLayer heroMeta={heroImageMeta} />
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: fallbackBg,
          }}
        />
      )}
      {editable ? (
        <input
          ref={heroCoverEdit?.fileInputRef}
          type="file"
          accept={COVER_IMAGE_ACCEPT}
          hidden
          onChange={heroCoverEdit?.onFileInputChange}
        />
      ) : null}
      {heroCoverEdit?.uploading ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: (t) => alpha(t.palette.common.black, 0.35),
          }}
        >
          <CircularProgress size={28} sx={{ color: "common.white" }} />
        </Box>
      ) : null}
      {locked && heroCoverEdit?.lockedReason ? (
        <Tooltip title={heroCoverEdit.lockedReason}>
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: (t) => alpha(t.palette.common.black, 0.45),
              color: "common.white",
              pointerEvents: "auto",
            }}
          >
            <Lock sx={{ fontSize: 16 }} aria-hidden />
            <Typography variant="caption" component="span">
              {heroCoverEdit.lockedReason}
            </Typography>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}

export type HeroBranchInsteadOfEdit = {
  onClick: () => void;
  disabled?: boolean;
  pending?: boolean;
  title?: string;
};

type HeroActionButtonsProps = {
  isAdmin: boolean;
  editMode: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onClose: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
  saveDisabledTitle?: string;
  savePending?: boolean;
  hideEditToggle?: boolean;
  branchInsteadOfEdit?: HeroBranchInsteadOfEdit | null;
  canDelete?: boolean;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deletePending?: boolean;
  /** Extra icon actions immediately before Sluiten (e.g. Start bookmark). */
  railExtraActions?: ReactNode;
};

/* eslint-disable-next-line complexity */
function HeroActionButtons({
  isAdmin,
  editMode,
  onEdit,
  onCancelEdit,
  onClose,
  onSave,
  saveDisabled,
  saveDisabledTitle,
  savePending,
  hideEditToggle = false,
  branchInsteadOfEdit = null,
  canDelete = false,
  onDelete,
  deleteDisabled,
  deletePending,
  railExtraActions = null,
}: HeroActionButtonsProps) {
  const showDelete = Boolean(canDelete && onDelete);
  const branchTitle = branchInsteadOfEdit?.title ?? "maak een eigen versie";
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ flexShrink: 0, alignItems: "flex-start" }}
    >
      {editMode && isAdmin && onSave && (
        <Tooltip
          title={
            saveDisabled && saveDisabledTitle ? saveDisabledTitle : "Opslaan"
          }
        >
          <span>
            <IconButton
              aria-label="Opslaan"
              onClick={onSave}
              disabled={saveDisabled || savePending}
              size="small"
              sx={(t) => detailHeroOverlayIconButtonSx(t)}
            >
              {savePending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Save />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}
      {!hideEditToggle && editMode && isAdmin ? (
        <IconButton
          aria-label="Bewerken stoppen"
          title="Bewerken stoppen (Esc)"
          onClick={onCancelEdit}
          size="small"
          sx={(t) => detailHeroOverlayIconButtonSx(t)}
        >
          <EditOff />
        </IconButton>
      ) : null}
      {!hideEditToggle && !editMode && branchInsteadOfEdit ? (
        <Tooltip title={branchTitle}>
          <span>
            <IconButton
              aria-label="Maak een eigen versie"
              onClick={branchInsteadOfEdit.onClick}
              disabled={
                branchInsteadOfEdit.disabled || branchInsteadOfEdit.pending
              }
              size="small"
              sx={(t) => detailHeroOverlayIconButtonSx(t)}
            >
              {branchInsteadOfEdit.pending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <AccountTree />
              )}
            </IconButton>
          </span>
        </Tooltip>
      ) : null}
      {!hideEditToggle && !editMode && !branchInsteadOfEdit && isAdmin ? (
        <IconButton
          aria-label="Bewerken"
          title="Bewerken"
          onClick={onEdit}
          size="small"
          sx={(t) => detailHeroOverlayIconButtonSx(t)}
        >
          <Edit />
        </IconButton>
      ) : null}
      {showDelete ? (
        <IconButton
          aria-label="Verwijderen"
          title="Verwijderen"
          onClick={onDelete}
          disabled={deleteDisabled || deletePending}
          size="small"
          sx={(t) => detailHeroOverlayIconButtonSx(t)}
        >
          {deletePending ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <DeleteOutline />
          )}
        </IconButton>
      ) : null}
      {railExtraActions}
      <IconButton
        aria-label="Paneel sluiten"
        onClick={onClose}
        size="small"
        sx={(t) => detailHeroOverlayIconButtonSx(t)}
      >
        <Close />
      </IconButton>
    </Stack>
  );
}

export type DetailPanelHeroHeaderProps = {
  loading: boolean;
  recordPresent: boolean;
  title: string;
  /** Optional icon or affordance immediately left of the title (e.g. evaluatiemoment badge). */
  titleLeadingSlot?: ReactNode;
  subtitle?: string | null;
  heroImageMeta?: DetailHeroCoverMeta | null;
  /** Optional edit affordance for the hero cover (click / drag image). */
  heroCoverEdit?: DetailPanelHeroCoverEdit | null;
  /** Optional middle hero control (e.g. placement drag handle), absolutely centered below the top rails. */
  centerToolbarSlot?: ReactNode;
  /**
   * Meta row on the hero (status, “Bijgewerkt”, version picker, etc.) — sits above the straddling stats strip.
   * Full icon actions stay in the top-right rail; do not hide those behind an overflow menu here.
   */
  heroBottomSlot?: ReactNode;
  /** Card that overlaps the hero/body boundary (e.g. Tijdsduur / Leerjaar / Niveau). */
  statsStrip?: ReactNode;
  hideEditToggle?: boolean;
  branchInsteadOfEdit?: HeroBranchInsteadOfEdit | null;
  isAdmin: boolean;
  editMode?: boolean;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  onClose: () => void;
  onBack?: () => void;
  onSave?: () => void;
  saveDisabled?: boolean;
  saveDisabledTitle?: string;
  savePending?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deletePending?: boolean;
  /** Extra top-right rail controls before Sluiten (e.g. bookmark). */
  heroRailExtraActions?: ReactNode;
  /**
   * Fired when the painted bottom edge of the hero stack changes (hero + optional straddling stats strip).
   * Pass to the scroll body’s top padding so content starts flush under the stats card.
   */
  onHeroBottomPxChange?: (bottomPx: number) => void;
};

/**
 * Gradient hero for detail panes (`TMITableWorkspace`, drawers, record stack).
 * Frosted icon rails + straddling stats strip; tokens from `theme.detailPanelHero`.
 */
/* eslint-disable max-lines-per-function, complexity -- absolute rails, gradient stack, straddling stats card */
export function DetailPanelHeroHeader({
  loading,
  recordPresent,
  title,
  titleLeadingSlot,
  subtitle,
  heroImageMeta,
  heroCoverEdit,
  centerToolbarSlot,
  heroBottomSlot,
  statsStrip,
  hideEditToggle = false,
  branchInsteadOfEdit = null,
  isAdmin,
  editMode = false,
  onEdit = () => {},
  onCancelEdit = () => {},
  onClose,
  onBack,
  onSave,
  saveDisabled,
  saveDisabledTitle,
  savePending,
  canDelete,
  onDelete,
  deleteDisabled,
  deletePending,
  heroRailExtraActions,
  onHeroBottomPxChange,
}: DetailPanelHeroHeaderProps) {
  const theme = useTheme();
  const workspaceFullscreen = useWorkspaceDetailFullscreen();
  const showLeftCluster = Boolean(workspaceFullscreen?.available || onBack);
  const h = theme.detailPanelHero;
  const rootRef = useRef<HTMLDivElement>(null);
  const statsStripMeasureRef = useRef<HTMLDivElement | null>(null);
  const overlayRootSx = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    pointerEvents: "none",
  } as const;

  useLayoutEffect(() => {
    if (!onHeroBottomPxChange) return;
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const stripEl = statsStripMeasureRef.current;
      const rootTop = root.getBoundingClientRect().top;
      const bottomPx = stripEl
        ? Math.ceil(stripEl.getBoundingClientRect().bottom - rootTop)
        : Math.ceil(root.getBoundingClientRect().height);
      onHeroBottomPxChange(bottomPx);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [onHeroBottomPxChange, loading, recordPresent]);

  if (loading) {
    return (
      <Box ref={rootRef} sx={overlayRootSx}>
        <Skeleton
          variant="rectangular"
          sx={{
            height: h.hero.minHeightPx,
            borderTopLeftRadius: (th) => Number(th.shape.borderRadius) * 2,
            borderTopRightRadius: (th) => Number(th.shape.borderRadius) * 2,
          }}
        />
      </Box>
    );
  }

  if (!recordPresent) {
    return (
      <Box ref={rootRef} sx={{ ...overlayRootSx, pointerEvents: "auto" }}>
        <CloseOnlyHeader onClose={onClose} onBack={onBack} />
      </Box>
    );
  }

  const insetPx = h.overlay.railInsetPx;
  const heroContentPaddingBottomPx =
    h.hero.contentPaddingBottomPx +
    (statsStrip ? h.statsStrip.overlapSafeZonePx : 0);

  return (
    <Box
      ref={rootRef}
      sx={{
        ...overlayRootSx,
      }}
    >
      <Box
        sx={{
          position: "relative",
          minHeight: h.hero.minHeightPx,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            maskImage: h.contentScrim.fadeMask,
            WebkitMaskImage: h.contentScrim.fadeMask,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            maskImage: h.hero.imageFadeMask,
            WebkitMaskImage: h.hero.imageFadeMask,
          }}
        >
          {heroCoverEdit ? (
            <DetailPanelHeroCoverEditSurface
              heroImageMeta={heroImageMeta}
              heroCoverEdit={heroCoverEdit}
              fallbackBg={h.hero.fallbackBg}
            />
          ) : heroImageMeta ? (
            <DetailPanelHeroCoverLayer heroMeta={heroImageMeta} />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: h.hero.fallbackBg,
              }}
            />
          )}

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: heroReadabilityGradientCss(
                theme.palette.common.black,
                h.hero,
              ),
            }}
          />
        </Box>

        {showLeftCluster ? (
          <Box
            sx={{
              position: "absolute",
              top: insetPx,
              left: insetPx,
              zIndex: 5,
              pointerEvents: "auto",
            }}
          >
            <DetailPanelHeroLeftCluster onBack={onBack} />
          </Box>
        ) : null}

        {centerToolbarSlot ? (
          <Box
            sx={{
              position: "absolute",
              top: insetPx,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {centerToolbarSlot}
          </Box>
        ) : null}

        <Box
          sx={{
            position: "absolute",
            top: insetPx,
            right: insetPx,
            zIndex: 5,
            pointerEvents: "auto",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <HeroActionButtons
            isAdmin={isAdmin}
            editMode={editMode}
            onEdit={onEdit}
            onCancelEdit={onCancelEdit}
            onClose={onClose}
            onSave={onSave}
            saveDisabled={saveDisabled}
            saveDisabledTitle={saveDisabledTitle}
            savePending={savePending}
            hideEditToggle={hideEditToggle}
            branchInsteadOfEdit={branchInsteadOfEdit}
            canDelete={canDelete}
            onDelete={onDelete}
            deleteDisabled={deleteDisabled}
            deletePending={deletePending}
            railExtraActions={heroRailExtraActions}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 4,
            minHeight: h.hero.minHeightPx,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pt: `${h.hero.contentPaddingTopPx}px`,
            px: {
              xs: `${h.hero.titleBlockPaddingX.xs}px`,
              sm: `${h.hero.titleBlockPaddingX.sm}px`,
            },
            pb: `${heroContentPaddingBottomPx}px`,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          <Box sx={{ pointerEvents: "auto", width: "100%", minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              useFlexGap
            >
              {titleLeadingSlot}
              <Typography
                variant="h6"
                component="h2"
                title={title}
                sx={{
                  color: "common.white",
                  m: 0,
                  flex: 1,
                  minWidth: 0,
                  fontFamily: theme.typography.fontFamily,
                  ...detailHeroClampSx(DETAIL_HERO_TITLE_LINE_CLAMP),
                }}
              >
                {title}
              </Typography>
            </Stack>
            {subtitle ? (
              <Typography
                variant="body2"
                title={subtitle}
                sx={{
                  color: (th) => alpha(th.palette.common.white, 0.88),
                  m: 0,
                  mt: 1,
                  fontFamily: theme.typography.fontFamily,
                  ...detailHeroClampSx(DETAIL_HERO_SUBTITLE_LINE_CLAMP),
                }}
              >
                {subtitle}
              </Typography>
            ) : null}
            {heroBottomSlot ? (
              <Box
                sx={{
                  mt: `${h.hero.bottomSlotPaddingTopPx}px`,
                  mb: `${h.hero.bottomSlotMarginBottomPx}px`,
                  width: "100%",
                }}
              >
                {heroBottomSlot}
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>

      {statsStrip ? (
        <Box
          ref={statsStripMeasureRef}
          sx={{
            px: `${h.scrollBody.paddingXPx}px`,
            mt: 0,
            position: "relative",
            zIndex: 4,
            boxSizing: "border-box",
            pointerEvents: "none",
            transform: "translateY(-50%)",
          }}
        >
          {statsStrip}
        </Box>
      ) : null}
    </Box>
  );
}
