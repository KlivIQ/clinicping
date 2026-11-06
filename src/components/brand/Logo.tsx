/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * "Paired Rhythm": two slot pills — left booked (solid), right receiving a peach ping node.
 */
import { useLayoutEffect, useRef, useState } from "react";

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="5" width="11" height="30" rx="5.5" fill="var(--inkberry)" />
      <rect x="23" y="5" width="11" height="30" rx="5.5" fill="none" stroke="var(--inkberry)" strokeWidth="2.25" />
      <circle cx="28.5" cy="24" r="4.25" fill="var(--peach)" />
    </svg>
  );
}

/** Endorsement height as a share of the wordmark height. */
export const ENDORSEMENT_RATIO = 0.24;
/** Below this rendered size the endorsement switches to its small-size styling. */
export const ENDORSEMENT_SMALL_PX = 10;
/** Never render the endorsement smaller than this. */
export const ENDORSEMENT_MIN_PX = 5;

/** Styling for the "BY KLIVIQ" line at a given rendered size. */
export function endorsementStyle(px: number) {
  const small = px < ENDORSEMENT_SMALL_PX;
  return { weight: small ? 600 : 500, tracking: small ? 0.16 : 0.12, opacity: small ? 85 : 65 };
}

/**
 * Full lockup wordmark: "ClinicPing" with "BY KLIVIQ" right-aligned under it, ending just
 * before the left-most point of the "g" descender. Measured from the rendered text so it
 * holds at every size. Font size is inherited unless wordmarkPx is given.
 */
export function Wordmark({ wordmarkPx, className = "" }: { wordmarkPx?: number; className?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const gRef = useRef<HTMLSpanElement>(null);
  const [m, setM] = useState<{ widthPct: number; px: number } | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current, g = gRef.current;
    if (!root || !g) return;
    const measure = () => {
      const total = root.getBoundingClientRect().width;
      const gLeft = g.getBoundingClientRect().left - root.getBoundingClientRect().left;
      const fontPx = parseFloat(getComputedStyle(root).fontSize);
      if (!total) return;
      const px = Math.max(ENDORSEMENT_MIN_PX, fontPx * ENDORSEMENT_RATIO);
      // Leave one letter-spacing unit of clear space before the "g" tail.
      const gap = px * endorsementStyle(px).tracking;
      setM({ widthPct: ((gLeft - gap) / total) * 100, px });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const px = m?.px ?? (wordmarkPx ? Math.max(ENDORSEMENT_MIN_PX, wordmarkPx * ENDORSEMENT_RATIO) : 0);
  const st = endorsementStyle(px || 12);
  return (
    <span ref={rootRef} className={`inline-flex flex-col items-start leading-none ${className}`} style={wordmarkPx ? { fontSize: wordmarkPx } : undefined}>
      <span className="font-display font-semibold leading-none tracking-tight text-primary" style={{ fontFamily: '"Fraunces", serif' }}>
        ClinicPin<span ref={gRef}>g</span>
      </span>
      <span
        className="block uppercase leading-none"
        style={{
          fontFamily: '"Figtree", sans-serif',
          fontSize: px ? px : `${ENDORSEMENT_RATIO}em`,
          fontWeight: st.weight,
          letterSpacing: `${st.tracking}em`,
          // Trailing letter-spacing would push the visible edge left; cancel it.
          marginRight: `-${st.tracking}em`,
          marginTop: (px || 0) * 0.3,
          width: m ? `${m.widthPct}%` : "88%",
          textAlign: "right",
          whiteSpace: "nowrap",
          color: `color-mix(in oklab, var(--inkberry) ${st.opacity}%, transparent)`,
        }}
      >
        BY KLIVIQ
      </span>
    </span>
  );
}

export function Logo({ size = 32, wordmarkPx = 21.6 }: { size?: number; wordmarkPx?: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="ClinicPing by KlivIQ">
      <LogoMark size={size} />
      <Wordmark wordmarkPx={wordmarkPx} />
    </span>
  );
}
