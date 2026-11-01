import type { CSSProperties, ReactNode } from "react";

/* Shared poster vocabulary: the dotted truck-art frame and slap-in headline lines. */

const CORNERS: { pos: string; flip: string }[] = [
  { pos: "left-0 top-0", flip: "" },
  { pos: "right-0 top-0", flip: "scaleX(-1)" },
  { pos: "left-0 bottom-0", flip: "scaleY(-1)" },
  { pos: "right-0 bottom-0", flip: "scale(-1,-1)" },
];

// top corners would sit under the fixed header, so the frame blooms from the bottom
export function PosterFrame({ corners = true }: { corners?: boolean }) {
  const list = corners ? CORNERS.slice(2) : [];
  return (
    <div className="beat pointer-events-none absolute inset-0" data-beat data-in="-1" data-out="2" aria-hidden="true">
      <div className="poster-frame" />
      {list.map((c) => (
        <div key={c.pos} className={`absolute ${c.pos} m-1 md:m-2`} style={{ transform: c.flip || undefined }}>
          <div className="corner bloom relative" style={{ transformOrigin: "top left" }} />
        </div>
      ))}
    </div>
  );
}

/** Headline whose lines slap in one after another, each at its own tilt. */
export function Slap({
  lines,
  className = "",
  as: Tag = "h2",
}: {
  lines: { text: ReactNode; tone?: "pop" | "pop-white" | "orange"; r?: number }[];
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag className={`display ${className}`}>
      {lines.map((l, i) => (
        <span
          key={i}
          className={`slap ${l.tone === "orange" ? "text-brand-orange" : l.tone ?? "pop"}`}
          style={{ "--i": i, "--r": `${l.r ?? (i % 2 ? 2 : -3)}deg`, transformOrigin: "left center" } as CSSProperties}
        >
          {l.text}
        </span>
      ))}
    </Tag>
  );
}

export const step = (i: number) => ({ "--i": i }) as CSSProperties;
