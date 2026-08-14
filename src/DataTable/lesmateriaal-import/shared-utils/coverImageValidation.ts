const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|svg|bmp|ico)(\?|$)/i;

/** `accept` for hidden file inputs on detail hero cover pickers. */
export const COVER_IMAGE_ACCEPT = "image/*";

export const COVER_IMAGE_REJECT_MESSAGE_NL =
  "Alleen afbeeldingen zijn toegestaan als coverafbeelding.";

export function isImageFileAcceptedAsCover(file: File): boolean {
  const type = file.type.trim().toLowerCase();
  if (type.startsWith("image/")) return true;
  return IMAGE_EXTENSION.test(file.name.trim());
}
