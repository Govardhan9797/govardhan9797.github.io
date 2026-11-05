import { useMemo, type ReactElement } from 'react';

/*
  Generative "signal ribbon": seven bands of marks sweeping up and over the hero.
  - 'twist': dashes spin in a travelling wave, so the band appears to twist
  - 'dots':  dots pop in a wave along the band
  Built once with useMemo; the motion is pure CSS (each mark gets a phase offset).
*/

export type RibbonStyle = 'twist' | 'dots';

const COLORS = ['#ff3d6e', '#ff8a3d', '#ffd23f', '#2ee59d', '#3aa0ff', '#7c6cff', '#d77bff'];
const ROW_GAP = 30;
const STEP = 32; // distance between marks along the band
const DASH = 15; // half dash length
const CYCLE = 5; // seconds per full twist
const TWISTS = 1.6; // twists visible along the band

type Pt = [number, number];
// centre line of the band: a cubic Bézier rising behind the avatar and sweeping right
const P: Pt[] = [[140, 560], [190, 130], [560, 10], [1010, 150]];

const bez = (t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]];
};

/** Sample the curve at equal arc-length steps, returning point, unit tangent and progress. */
function samples(step: number) {
  const fine: Pt[] = [];
  for (let i = 0; i <= 600; i++) fine.push(bez(i / 600));
  const out: { x: number; y: number; tx: number; ty: number; s: number }[] = [];
  let acc = 0;
  let next = step / 2;
  let total = 0;
  for (let i = 1; i < fine.length; i++) total += Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]);
  for (let i = 1; i < fine.length; i++) {
    const [x0, y0] = fine[i - 1];
    const [x1, y1] = fine[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    while (acc + seg >= next) {
      const k = (next - acc) / seg;
      out.push({ x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, tx: (x1 - x0) / seg, ty: (y1 - y0) / seg, s: next / total });
      next += step;
    }
    acc += seg;
  }
  return out;
}

export default function Ribbon({ variant }: { variant: RibbonStyle }) {
  const rows = useMemo(() => {
    const pts = samples(STEP);
    return COLORS.map((color, r) => {
      const off = (r - (COLORS.length - 1) / 2) * ROW_GAP; // outer rows first
      const marks: ReactElement[] = [];
      pts.forEach((p, j) => {
        const x = p.x - p.ty * off; // shift along the normal
        const y = p.y + p.tx * off;
        const delay = `${(-p.s * CYCLE * TWISTS).toFixed(2)}s`;
        if (variant === 'dots') {
          marks.push(<circle key={j} className="rb-mark" cx={x.toFixed(1)} cy={y.toFixed(1)} r="8" style={{ animationDelay: delay }} />);
        } else {
          marks.push(
            <line key={j} className="rb-mark" style={{ animationDelay: delay }}
              x1={(x - p.tx * DASH).toFixed(1)} y1={(y - p.ty * DASH).toFixed(1)}
              x2={(x + p.tx * DASH).toFixed(1)} y2={(y + p.ty * DASH).toFixed(1)} />,
          );
        }
      });
      return <g key={r} fill={color} stroke={color}>{marks}</g>;
    });
  }, [variant]);

  return (
    <svg key={variant} className={`ribbon rb-${variant}`} viewBox="0 0 1000 600" aria-hidden="true">
      {rows}
    </svg>
  );
}
