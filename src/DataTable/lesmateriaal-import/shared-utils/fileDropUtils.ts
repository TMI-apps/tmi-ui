/**
 * Collects File[] from a DataTransfer (drag-and-drop), including files inside
 * dropped directories when supported (webkitGetAsEntry). Used by lesmateriaal
 * create drawer, edit form, and table row drop.
 */
export async function collectFilesFromDrop(
  dataTransfer: DataTransfer,
): Promise<File[]> {
  const files: File[] = [];
  const items = dataTransfer.items;
  if (!items) {
    for (let i = 0; i < dataTransfer.files.length; i++) {
      const f = dataTransfer.files[i];
      if (f) files.push(f);
    }
    return files;
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind !== "file") continue;
    const entry = (
      item as DataTransferItem & {
        webkitGetAsEntry?: () => FileSystemEntry | null;
      }
    ).webkitGetAsEntry?.();
    if (entry?.isDirectory) {
      const dirFiles = await readFilesFromDirectory(
        entry as FileSystemDirectoryEntry,
      );
      files.push(...dirFiles);
    } else {
      const f = item.getAsFile();
      if (f) files.push(f);
    }
  }
  return files;
}

const URL_IN_TEXT = /https?:\/\/[^\s]+/gi;

/** Parses http(s) URLs from plain text (lines or embedded URLs). */
export function parseHttpUrlsFromText(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      out.push(trimmed);
      continue;
    }
    const matches = trimmed.match(URL_IN_TEXT);
    if (matches) out.push(...matches);
  }
  return [...new Set(out)];
}

/**
 * Reads http(s) URLs from a drop's DataTransfer (call from `drop` only — `getData` is often empty until drop).
 */
export function extractHttpUrlsFromDataTransfer(dt: DataTransfer): string[] {
  const out: string[] = [];
  const uriList = dt.getData("text/uri-list");
  if (uriList) {
    for (const line of uriList.split(/\r?\n/)) {
      const u = line.trim();
      if (!u || u.startsWith("#")) continue;
      if (u.startsWith("http://") || u.startsWith("https://")) out.push(u);
    }
  }
  const plain = dt.getData("text/plain");
  if (plain) {
    out.push(...parseHttpUrlsFromText(plain));
  }
  return [...new Set(out)];
}

async function readFilesFromDirectory(
  dir: FileSystemDirectoryEntry,
): Promise<File[]> {
  const files: File[] = [];
  const reader = dir.createReader();
  let entries: FileSystemEntry[];
  do {
    entries = await new Promise((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    for (const entry of entries) {
      if (entry.isDirectory) {
        const sub = await readFilesFromDirectory(
          entry as FileSystemDirectoryEntry,
        );
        files.push(...sub);
      } else {
        const f = await new Promise<File | null>((res) =>
          (entry as FileSystemFileEntry).file(res, () => res(null)),
        );
        if (f) files.push(f);
      }
    }
  } while (entries.length > 0);
  return files;
}
