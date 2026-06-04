// Tiny YouTube helpers — extracted from ExerciseEditor so the warm-up
// editor (and any future editor) can reuse them without code dup.

// Pull the 11-char video ID out of a raw URL or just-the-ID string.
// Returns null if nothing matches a known YouTube URL shape.
export function parseYouTubeId(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

// Soft-verify a video ID by calling YouTube oembed. Returns the parsed
// JSON (with title + author_name + thumbnail_url etc.) or null on
// failure. oembed supports CORS so this works from the browser.
export async function fetchYouTubeOembed(videoId) {
  if (!videoId) return null;
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
