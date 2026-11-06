/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * "Paired Rhythm": two slot pills — left booked (solid), right receiving a peach ping node.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="5" width="11" height="30" rx="5.5" fill="var(--inkberry)" />
      <rect x="23" y="5" width="11" height="30" rx="5.5" fill="none" stroke="var(--inkberry)" strokeWidth="2.25" />
      <circle cx="28.5" cy="24" r="4.25" fill="var(--peach)" />
    </svg>
  );
}

/** Minimum legible size for the "BY KLIVIQ" endorsement; below this it is hidden, never enlarged. */
export const ENDORSEMENT_MIN_PX = 11;
/** Endorsement height as a share of the wordmark height. */
export const ENDORSEMENT_RATIO = 0.24;

/** "BY KLIVIQ" endorsement line, sized from the wordmark's font size in px. */
export function Endorsement({ wordmarkPx }: { wordmarkPx: number }) {
  const px = wordmarkPx * ENDORSEMENT_RATIO;
  if (px < ENDORSEMENT_MIN_PX) return null;
  return (
    <span
      className="block font-medium uppercase leading-none"
      style={{ fontFamily: '"Figtree", sans-serif', fontSize: px, letterSpacing: "0.12em", marginTop: px * 0.3, color: "color-mix(in oklab, var(--inkberry) 65%, transparent)" }}
    >
      BY KLIVIQ
    </span>
  );
}

export function Logo({ size = 32, wordmarkPx = 21.6 }: { size?: number; wordmarkPx?: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="ClinicPing by KlivIQ">
      <LogoMark size={size} />
      <span className="inline-flex flex-col items-start">
        <span className="font-display font-semibold leading-none tracking-tight text-primary" style={{ fontFamily: '"Fraunces", serif', fontSize: wordmarkPx }}>
          ClinicPing
        </span>
        <Endorsement wordmarkPx={wordmarkPx} />
      </span>
    </span>
  );
}
