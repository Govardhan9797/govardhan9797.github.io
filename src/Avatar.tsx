import { useEffect, useId, useRef } from 'react';

/*
  Original anime / chibi-style developer avatar, drawn in SVG so it stays
  sharp at any size, follows the site theme, and can animate.
  Poses: 'wave' (hero) · 'laptop' (about) · 'mail' (contact) · 'peek' (footer)
*/

const SKIN = '#dba272';
const SKIN_SHADE = '#c0855a';
const HAIR = '#1f1b2b';
const HAIR_HI = '#3d3656';
const PANTS = '#2b3245';
const MOUTH = '#7a3442';

export type Pose = 'wave' | 'laptop' | 'mail' | 'peek';

export interface AvatarProps {
  pose?: Pose;
  /** Eyes follow the mouse pointer */
  track?: boolean;
  label?: string;
}

const heart = (x: number, y: number, s = 1): string =>
  `M${x} ${y + 6 * s} C${x - 8 * s} ${y} ${x - 9 * s} ${y - 7 * s} ${x - 4 * s} ${y - 8 * s} ` +
  `C${x - 2 * s} ${y - 8 * s} ${x} ${y - 6 * s} ${x} ${y - 5 * s} ` +
  `C${x} ${y - 6 * s} ${x + 2 * s} ${y - 8 * s} ${x + 4 * s} ${y - 8 * s} ` +
  `C${x + 9 * s} ${y - 7 * s} ${x + 8 * s} ${y} ${x} ${y + 6 * s}Z`;

export default function Avatar({ pose = 'wave', track = false, label }: AvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const svgRef = useRef<SVGSVGElement>(null);
  const look = useRef<(SVGGElement | null)[]>([]);

  // Eyes follow the pointer
  useEffect(() => {
    if (!track) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = svgRef.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.42);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        const tx = ((dx / d) * 2.8 * k).toFixed(2);
        const ty = ((dy / d) * 2.4 * k).toFixed(2);
        look.current.forEach((g) => g && g.setAttribute('transform', `translate(${tx} ${ty})`));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [track]);

  const wink = pose === 'mail';
  const mouthOpen = pose === 'wave' || pose === 'mail';
  const restLook = pose === 'laptop' ? 'translate(0 2.5)' : undefined;

  const eye = (cx: number, i: number, closed = false) =>
    closed ? (
      <path d={`M${cx - 10} 113 Q${cx} 102 ${cx + 10} 113`} stroke={HAIR} strokeWidth="3.6" fill="none" strokeLinecap="round" />
    ) : (
      <g className="av-eye">
        <clipPath id={`${uid}e${i}`}><ellipse cx={cx} cy="111" rx="10" ry="12" /></clipPath>
        <ellipse cx={cx} cy="111" rx="10" ry="12" fill="#fff" />
        <g clipPath={`url(#${uid}e${i})`}>
          <g ref={(el) => { look.current[i] = el; }} transform={restLook}>
            <ellipse cx={cx} cy="112" rx="7.8" ry="10" fill="#2a2142" />
            <ellipse cx={cx} cy="115" rx="5.6" ry="6.5" fill="#6a55c8" />
            <circle cx={cx - 2.6} cy="107.5" r="3" fill="#fff" />
            <circle cx={cx + 2.6} cy="116" r="1.5" fill="#fff" />
          </g>
        </g>
        <path d={`M${cx - 12} 103 Q${cx} 94 ${cx + 12} 103`} stroke={HAIR} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </g>
    );

  const head = (
    <g>
      {/* back hair, ears, face */}
      <path fill={HAIR} d="M56 104 C44 60 72 30 110 30 C150 30 178 60 164 106 C160 120 150 128 146 130 L74 130 C68 126 58 118 56 104Z" />
      <ellipse cx="62" cy="108" rx="8" ry="11" fill={SKIN_SHADE} />
      <ellipse cx="158" cy="108" rx="8" ry="11" fill={SKIN_SHADE} />
      <path fill={SKIN} d="M62 94 C62 58 158 58 158 94 C158 128 136 150 110 152 C84 150 62 128 62 94Z" />
      {/* fringe + shine + ahoge */}
      <path fill={HAIR} d="M58 96 C54 58 80 36 112 36 C146 36 168 60 162 96 L154 76 L148 94 L136 70 L126 88 L114 66 L102 88 L90 70 L80 92 L70 76Z" />
      <path fill={HAIR_HI} opacity=".85" d="M84 52 C98 42 118 40 134 47 C118 47 102 51 90 59Z" />
      <path fill={HAIR} d="M112 38 C114 20 128 12 140 16 C128 20 120 28 118 40Z" />
      {/* eyes */}
      {eye(90, 0)}
      {eye(130, 1, wink)}
      {/* blush, nose, mouth */}
      <ellipse cx="78" cy="127" rx="8" ry="4.5" fill="#ff7a9a" opacity=".45" />
      <ellipse cx="142" cy="127" rx="8" ry="4.5" fill="#ff7a9a" opacity=".45" />
      <path d="M109 121 Q111.5 124 108 125.5" stroke={SKIN_SHADE} strokeWidth="2" fill="none" strokeLinecap="round" />
      {mouthOpen ? (
        <g>
          <path d="M101 131 Q110 146 119 131Z" fill={MOUTH} />
          <path d="M104.5 138 Q110 134 115.5 138 Q110 143.5 104.5 138Z" fill="#e8838f" />
        </g>
      ) : (
        <path d="M102 133 Q110 140 118 133" stroke={MOUTH} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}
    </g>
  );

  if (pose === 'peek') {
    return (
      <svg ref={svgRef} className="avatar" viewBox="48 14 124 126" role="img" aria-label={label || 'Avatar peeking'}>
        {head}
        <circle cx="78" cy="136" r="9" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1.5" />
        <circle cx="142" cy="136" r="9" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="1.5" />
      </svg>
    );
  }

  const legs = (
    <g>
      <rect x="91" y="220" width="14" height="20" rx="3" fill={PANTS} />
      <rect x="115" y="220" width="14" height="20" rx="3" fill={PANTS} />
      <ellipse cx="97" cy="242" rx="11" ry="6" fill="#f5f5f7" stroke="#c8ccd6" strokeWidth="1.5" />
      <ellipse cx="123" cy="242" rx="11" ry="6" fill="#f5f5f7" stroke="#c8ccd6" strokeWidth="1.5" />
    </g>
  );

  const body = (
    <g>
      <rect x="103" y="144" width="14" height="18" fill={SKIN_SHADE} />
      <path className="av-hoodie" d="M70 218 C70 182 84 160 110 158 C136 160 150 182 150 218 Q150 226 142 226 L78 226 Q70 226 70 218Z" />
      <path className="av-hood" d="M88 162 Q110 182 132 162 Q126 172 110 175 Q94 172 88 162Z" />
      <path className="av-hood" d="M90 210 L130 210 L126 222 L94 222Z" />
      <path d="M104 172 L102 189 M116 172 L118 189" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
      <circle cx="102" cy="190" r="2.3" fill="#fff" />
      <circle cx="118" cy="190" r="2.3" fill="#fff" />
      <text className="av-logo" x="110" y="204" textAnchor="middle">{'</>'}</text>
    </g>
  );

  return (
    <svg ref={svgRef} className="avatar" viewBox="0 0 220 258" role="img" aria-label={label || 'Anime-style avatar of Govardhan'}>
      <ellipse className="av-shadow" cx="110" cy="250" rx="48" ry="6" />
      <g className="av-bob">
        {pose !== 'laptop' && legs}
        {body}
        {head}

        {pose === 'wave' && (
          <g>
            <path className="av-sleeve" d="M78 178 Q66 194 70 210" />
            <circle cx="71" cy="213" r="8" fill={SKIN} />
            <g className="av-wave">
              <path className="av-sleeve" d="M142 178 Q158 166 163 146" />
              <circle cx="164" cy="137" r="9" fill={SKIN} />
              <path d="M158 131 l-3 -6 M163 129 l-1 -7 M168 130 l1 -6" stroke={SKIN} strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        )}

        {pose === 'laptop' && (
          <g>
            <path className="av-sleeve" d="M80 178 Q66 190 64 204" />
            <path className="av-sleeve" d="M140 178 Q154 190 156 204" />
            <rect x="60" y="184" width="100" height="62" rx="7" fill="#dfe3ec" stroke="#b9bfcc" strokeWidth="2" />
            <circle cx="110" cy="213" r="12" fill="var(--label)" />
            <text x="110" y="217" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif">GR</text>
            <path d={heart(84, 233, 0.8)} fill="var(--sub)" />
            <rect x="128" y="226" width="22" height="11" rx="3" fill={PANTS} />
            <text x="139" y="234" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontFamily="monospace">k8s</text>
            <rect x="48" y="244" width="124" height="7" rx="3.5" fill="#b9bfcc" />
            <circle className="av-type" cx="63" cy="206" r="8" fill={SKIN} />
            <circle className="av-type r" cx="157" cy="206" r="8" fill={SKIN} />
            {/* coffee */}
            <path d="M200 226 Q210 228 208 236 Q206 242 200 240" stroke="#f5f5f7" strokeWidth="3.5" fill="none" />
            <rect x="178" y="220" width="23" height="27" rx="4" fill="#f5f5f7" />
            <rect x="178" y="228" width="23" height="6" fill="var(--label)" />
            <path className="av-steam" d="M185 214 Q181 208 185 202 Q189 196 185 190" />
            <path className="av-steam s2" d="M194 214 Q190 208 194 202 Q198 196 194 190" />
          </g>
        )}

        {pose === 'mail' && (
          <g>
            <path className="av-sleeve" d="M80 178 Q70 190 82 198" />
            <path className="av-sleeve" d="M140 178 Q150 190 138 198" />
            <g className="av-letter">
              <rect x="82" y="180" width="56" height="38" rx="4" fill="#fff" stroke="#d4d7e0" strokeWidth="1.5" />
              <path d="M84 183 L110 201 L136 183" stroke="#c3c7d2" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <path d={heart(110, 206, 0.9)} fill="var(--label)" />
              <circle cx="83" cy="199" r="8" fill={SKIN} />
              <circle cx="137" cy="199" r="8" fill={SKIN} />
            </g>
            <path className="av-heart" d={heart(172, 70, 1)} fill="var(--label)" />
            <path className="av-heart h2" d={heart(186, 100, 0.7)} fill="var(--sub)" />
            <path className="av-heart h3" d={heart(160, 40, 0.6)} fill="var(--label)" />
          </g>
        )}
      </g>
    </svg>
  );
}
