import { useMemo, type ReactElement } from 'react';

/*
  Telecom-inspired "signal" arcs that pulse outward from behind the avatar,
  like a cell tower broadcasting. Three mark styles; tapping the avatar cycles them.
*/

export type SignalStyle = 'dots' | 'dashes' | 'bars';

// inner → outer: brand pink through violet to sky blue
const COLORS = ['#ff5c93', '#f472b6', '#e879f9', '#c084fc', '#a78bfa', '#8b9dff', '#60a5fa', '#38bdf8'];
const CX = 300;
const CY = 320;
const HALF = 6; // half-length of a dash / bar

export default function SignalWaves({ variant }: { variant: SignalStyle }) {
  const rows = useMemo(
    () =>
      COLORS.map((color, i) => {
        const r = 104 + i * 27;
        const n = Math.round((Math.PI * r) / 21);
        const marks: ReactElement[] = [];
        for (let j = 0; j < n; j++) {
          const t = Math.PI + (Math.PI * (j + 0.5)) / n; // upper half-circle
          const cos = Math.cos(t);
          const sin = Math.sin(t);
          const x = CX + r * cos;
          const y = CY + r * sin;
          if (variant === 'dots') {
            marks.push(<circle key={j} cx={x.toFixed(1)} cy={y.toFixed(1)} r="4.2" />);
          } else {
            // dashes follow the arc (tangent); bars point outward (radial)
            const [dx, dy] = variant === 'dashes' ? [-sin * HALF, cos * HALF] : [cos * HALF, sin * HALF];
            marks.push(
              <line key={j} x1={(x - dx).toFixed(1)} y1={(y - dy).toFixed(1)} x2={(x + dx).toFixed(1)} y2={(y + dy).toFixed(1)} />,
            );
          }
        }
        return (
          <g key={i} className="sw-row" fill={color} stroke={color} style={{ animationDelay: `${i * 0.16}s` }}>
            {marks}
          </g>
        );
      }),
    [variant],
  );

  return (
    <svg key={variant} className={`signal sw-${variant}`} viewBox="0 0 600 330" aria-hidden="true">
      {rows}
    </svg>
  );
}
