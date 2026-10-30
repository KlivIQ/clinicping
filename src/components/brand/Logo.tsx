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

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="ClinicPing">
      <LogoMark size={size} />
      <span className="font-display text-[1.35rem] font-semibold tracking-tight text-primary" style={{ fontFamily: '"Fraunces", serif' }}>
        ClinicPing
      </span>
    </span>
  );
}
