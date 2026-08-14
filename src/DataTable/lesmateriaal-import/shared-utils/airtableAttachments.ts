/**
 * Shape of a single attachment inside an Airtable `multipleAttachments` JSON
 * payload as mirrored by the sync webhook (`toAttachmentsJson` in
 * `supabase/functions/_shared/airtableSync.ts`).
 *
 * Only `url` is required in practice; the other fields are optional metadata
 * that Airtable supplies for convenience.
 */
export interface AirtableAttachment {
  url: string;
  /** Stable Airtable attachment id; stored after rehost to detect replaced images on sync. */
  id?: string | null;
  filename?: string | null;
  type?: string | null;
  thumbnails?: {
    small?: { url: string; width?: number; height?: number };
    large?: { url: string; width?: number; height?: number };
    full?: { url: string; width?: number; height?: number };
  };
}

/**
 * Parses a JSONB attachment column (Tools `thumbnail`, Media `afbeelding`) into
 * a safely-typed array. Accepts either an array or a single attachment object
 * to match the loose shape stored by the sync script.
 */
export function parseAirtableAttachments(value: unknown): AirtableAttachment[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.filter(
    (a): a is AirtableAttachment =>
      a !== null &&
      typeof a === "object" &&
      "url" in (a as Record<string, unknown>) &&
      typeof (a as Record<string, unknown>).url === "string",
  );
}

/**
 * Returns the best chip-sized thumbnail URL from an Airtable attachments JSONB,
 * preferring the small rendered thumbnail (≈36–60px) over the full-resolution
 * original. Used for narrow row cells where the full image would be wasteful.
 */
export function getAirtableAttachmentChipThumbnailUrl(
  value: unknown,
): string | null {
  const [first] = parseAirtableAttachments(value);
  if (!first) return null;
  return (
    first.thumbnails?.small?.url ??
    first.thumbnails?.large?.url ??
    first.url ??
    null
  );
}

/**
 * URLs for a cover-style detail hero (large preview + fallback to original `url`).
 */
export function getAirtableAttachmentHeroImageMeta(
  value: unknown,
): { src: string; fallbackSrc: string | null } | null {
  const [first] = parseAirtableAttachments(value);
  if (!first?.url) return null;
  const src =
    first.thumbnails?.large?.url ??
    first.thumbnails?.full?.url ??
    first.thumbnails?.small?.url ??
    first.url;
  const fallbackSrc = src !== first.url ? first.url : null;
  return { src, fallbackSrc };
}
