const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normaliza un color hex ("fff", "#FFFFFF") o devuelve null si no es válido. */
export function normalizeHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.trim().match(HEX);
  if (!match?.[1]) return null;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) hex = hex.replace(/./g, (c) => c + c);
  return `#${hex}`;
}

/** Devuelve un color de texto legible (tinta o papel) sobre el fondo indicado. */
export function readableOn(background: string | null | undefined): string {
  const hex = normalizeHex(background);
  if (!hex) return "#0a0a0a";
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.4 ? "#0a0a0a" : "#f2f0eb";
}

export const DEFAULT_ACCENT = "#c6ff3d";

export function accentOf(color: string | null | undefined): string {
  return normalizeHex(color) ?? DEFAULT_ACCENT;
}
