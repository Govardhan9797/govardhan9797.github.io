import { useEffect, useMemo, useRef, type ReactElement } from 'react';

/*
  Generative "signal ribbon": seven bands of marks sweeping up and over the hero.
  - 'twist': dashes spin in a travelling wave, so the band appears to twist
  - 'dots':  dots pop in a wave along the band
  Cursor reactive: marks near the pointer stop their idle motion, grow, and
  (for dashes) turn to point at the pointer, like iron filings around a magnet.
  The idle motion is pure CSS; the pointer only sets two custom properties per mark.
*/

export type RibbonStyle = 'twist' | 'dots';

const COLORS = ['#ff3d6e', '#ff8a3d', '#ffd23f', '#2ee59d', '#3aa0ff', '#7c6cff', '#d77bff'];
const ROW_GAP = 30;
const STEP = 32; // distance between marks along the band
const DASH = 15; // half dash length
const CYCLE = 5; // seconds per full twist
const TWISTS = 1.6; // twists visible along the band
const REACH = 190; // pointer influence radius, in screen pixels

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
  let total = 0;
  for (let i = 1; i < fine.length; i++) total += Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]);
  const out: { x: number; y: number; tx: number; ty: number; s: number }[] = [];
  let acc = 0;
  let next = step / 2;
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

interface Mark { x: number; y: number; deg: number }

export default function Ribbon({ variant }: { variant: RibbonStyle }) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { rows, marks } = useMemo(() => {
    const pts = samples(STEP);
    const data: Mark[] = [];
    const groups = COLORS.map((color, r) => {
      const off = (r - (COLORS.length - 1) / 2) * ROW_GAP;
      const els: ReactElement[] = [];
      pts.forEach((p, j) => {
        const x = p.x - p.ty * off; // shift along the normal
        const y = p.y + p.tx * off;
        const delay = `${(-p.s * CYCLE * TWISTS).toFixed(2)}s`;
        data.push({ x, y, deg: (Math.atan2(p.ty, p.tx) * 180) / Math.PI });
        els.push(
          variant === 'dots' ? (
            <circle key={j} className="rb-mark" cx={x.toFixed(1)} cy={y.toFixed(1)} r="8" style={{ animationDelay: delay }} />
          ) : (
            <line key={j} className="rb-mark" style={{ animationDelay: delay }}
              x1={(x - p.tx * DASH).toFixed(1)} y1={(y - p.ty * DASH).toFixed(1)}
              x2={(x + p.tx * DASH).toFixed(1)} y2={(y + p.ty * DASH).toFixed(1)} />
          ),
        );
      });
      return <g key={r} fill={color} stroke={color}>{els}</g>;
    });
    return { rows: groups, marks: data };
  }, [variant]);

  // React to the pointer: write --w (closeness 0..1) and --aim (turn toward pointer) per mark
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const els = Array.from(svg.querySelectorAll<SVGElement>('.rb-mark'));
    const weight = new Float32Array(els.length);
    let raf = 0;
    let px = -1e4;
    let py = -1e4;

    const update = () => {
      raf = 0;
      const m = svg.getScreenCTM();
      if (!m) return;
      for (let i = 0; i < els.length; i++) {
        const { x, y, deg } = marks[i];
        const sx = m.a * x + m.c * y + m.e;
        const sy = m.b * x + m.d * y + m.f;
        const dx = px - sx;
        const dy = py - sy;
        const d = Math.hypot(dx, dy);
        let w = d < REACH ? 1 - d / REACH : 0;
        w = w * w * (3 - 2 * w); // smoothstep
        if (w < 0.01 && weight[i] === 0) continue; // untouched and still far: skip the write
        if (w < 0.01) w = 0;
        weight[i] = w;
        const s = els[i].style;
        s.setProperty('--w', w.toFixed(3));
        if (variant === 'twist' && w > 0) {
          let aim = (Math.atan2(dy, dx) * 180) / Math.PI - deg; // a dash is symmetric: keep within ±90°
          aim = ((((aim + 90) % 180) + 180) % 180) - 90;
          s.setProperty('--aim', `${aim.toFixed(1)}deg`);
        }
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY; schedule(); };
    const onLeave = () => { px = -1e4; py = -1e4; schedule(); };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [marks, variant]);

  return (
    <svg ref={svgRef} key={variant} className={`ribbon rb-${variant}`} viewBox="0 0 1000 600" aria-hidden="true">
      {rows}
    </svg>
  );
}
