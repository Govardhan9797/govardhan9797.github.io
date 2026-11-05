import { useEffect, useId, useRef } from 'react';

/*
  Original chibi developer avatar with soft 3D "clay" shading:
  gradients for volume, blurred shadows for depth, and specular highlights.
  Drawn in SVG so it stays sharp at any size, follows the site theme and animates.
  Poses: 'wave' (hero) · 'laptop' (about) · 'mail' (contact) · 'peek' (footer)
*/

export type Pose = 'wave' | 'laptop' | 'mail' | 'peek';

export interface AvatarProps {
  pose?: Pose;
  /** Eyes follow the mouse pointer */
  track?: boolean;
  label?: string;
}

const LINE = '#140f1c';
const MOUTH = '#6b2735';

const FACE = 'M62 94 C62 58 158 58 158 94 C158 128 136 150 110 152 C84 150 62 128 62 94Z';
const BACK_HAIR = 'M56 104 C44 60 72 30 110 30 C150 30 178 60 164 106 C160 120 150 128 146 130 L74 130 C68 126 58 118 56 104Z';
const FRINGE = 'M58 96 C54 58 80 36 112 36 C146 36 168 60 162 96 L154 76 L148 94 L136 70 L126 88 L114 66 L102 88 L90 70 L80 92 L70 76Z';
const AHOGE = 'M112 38 C114 20 128 12 140 16 C128 20 120 28 118 40Z';
const HOODIE = 'M70 218 C70 182 84 160 110 158 C136 160 150 182 150 218 Q150 226 142 226 L78 226 Q70 226 70 218Z';

const heart = (x: number, y: number, s = 1): string =>
  `M${x} ${y + 6 * s} C${x - 8 * s} ${y} ${x - 9 * s} ${y - 7 * s} ${x - 4 * s} ${y - 8 * s} ` +
  `C${x - 2 * s} ${y - 8 * s} ${x} ${y - 6 * s} ${x} ${y - 5 * s} ` +
  `C${x} ${y - 6 * s} ${x + 2 * s} ${y - 8 * s} ${x + 4 * s} ${y - 8 * s} ` +
  `C${x + 9 * s} ${y - 7 * s} ${x + 8 * s} ${y} ${x} ${y + 6 * s}Z`;

export default function Avatar({ pose = 'wave', track = false, label }: AvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name: string) => `${uid}${name}`;
  const url = (name: string) => `url(#${uid}${name})`;
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

  const defs = (
    <defs>
      <radialGradient id={id('skin')} cx="0.38" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#f9d4ae" />
        <stop offset="0.5" stopColor="#e4a979" />
        <stop offset="1" stopColor="#bd7f53" />
      </radialGradient>
      <linearGradient id={id('skinDark')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d99c6d" />
        <stop offset="1" stopColor="#ad7045" />
      </linearGradient>
      <linearGradient id={id('hair')} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#453c60" />
        <stop offset="0.45" stopColor="#221c30" />
        <stop offset="1" stopColor="#0f0c15" />
      </linearGradient>
      <linearGradient id={id('hood')} gradientUnits="userSpaceOnUse" x1="0" y1="132" x2="0" y2="228">
        <stop offset="0" style={{ stopColor: 'color-mix(in srgb, var(--sub) 72%, #fff)' }} />
        <stop offset="0.5" style={{ stopColor: 'var(--sub)' }} />
        <stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--sub) 58%, #000)' }} />
      </linearGradient>
      <radialGradient id={id('iris')} cx="0.5" cy="0.72" r="0.65">
        <stop offset="0" stopColor="#b9aaff" />
        <stop offset="0.45" stopColor="#6a54d1" />
        <stop offset="1" stopColor="#221849" />
      </radialGradient>
      <linearGradient id={id('sclera')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ddd8ea" />
        <stop offset="0.4" stopColor="#ffffff" />
      </linearGradient>
      <linearGradient id={id('pants')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3d4866" />
        <stop offset="1" stopColor="#1d2435" />
      </linearGradient>
      <linearGradient id={id('white')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#cdd2de" />
      </linearGradient>
      <linearGradient id={id('lid')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f3f5f9" />
        <stop offset="1" stopColor="#c3c9d6" />
      </linearGradient>
      <filter id={id('soft')} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id={id('softer')} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
  );

  const eye = (cx: number, i: number, closed = false) =>
    closed ? (
      <g>
        <path d={`M${cx - 10} 113 Q${cx} 102 ${cx + 10} 113`} stroke={LINE} strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <path d={`M${cx + 10} 113 l3 -2`} stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    ) : (
      <g className="av-eye">
        <clipPath id={id(`e${i}`)}><ellipse cx={cx} cy="111" rx="10" ry="12" /></clipPath>
        <ellipse cx={cx} cy="111" rx="10" ry="12" fill={url('sclera')} />
        <g clipPath={url(`e${i}`)}>
          <g ref={(el) => { look.current[i] = el; }} transform={restLook}>
            <ellipse cx={cx} cy="112.5" rx="8" ry="10" fill={url('iris')} />
            <ellipse cx={cx} cy="114" rx="3.6" ry="4.6" fill="#120c28" />
            <ellipse cx={cx - 2.8} cy="107.5" rx="3.2" ry="3.6" fill="#fff" />
            <circle cx={cx + 3} cy="117" r="1.6" fill="#fff" opacity=".9" />
          </g>
          <ellipse cx={cx} cy="99" rx="13" ry="5" fill="#1a1230" opacity=".3" filter={url('soft')} />
        </g>
        <path d={`M${cx - 12} 103 Q${cx} 94 ${cx + 12} 103`} stroke={LINE} strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <path d={i === 0 ? `M${cx - 12} 103 l-3 -2.5` : `M${cx + 12} 103 l3 -2.5`} stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    );

  const head = (
    <g>
      <path fill={url('hair')} d={BACK_HAIR} />
      {/* ears */}
      <ellipse cx="62" cy="108" rx="8" ry="11" fill={url('skinDark')} />
      <ellipse cx="158" cy="108" rx="8" ry="11" fill={url('skinDark')} />
      <path d="M60 103 Q64.5 108 61 114" stroke="#94603d" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".7" />
      <path d="M160 103 Q155.5 108 159 114" stroke="#94603d" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".7" />
      {/* face with soft shading */}
      <path fill={url('skin')} d={FACE} />
      <path d="M66 90 Q110 114 154 90 L154 80 Q110 102 66 80Z" fill="#6e4024" opacity=".38" filter={url('soft')} />
      <path d="M149 84 C158 100 155 122 139 139" stroke="#fff" strokeOpacity=".3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* hair */}
      <path fill={url('hair')} d={FRINGE} />
      <path d="M80 54 C94 42 120 39 138 47" stroke="#71679a" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".5" />
      <path d="M90 61 C101 53 116 51 128 54" stroke="#9389bb" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".45" />
      <path fill={url('hair')} d={AHOGE} />
      {/* eyes */}
      {eye(90, 0)}
      {eye(130, 1, wink)}
      {/* blush, cheek gloss, nose */}
      <ellipse cx="78" cy="127" rx="9" ry="5" fill="#ff6b8e" opacity=".5" filter={url('soft')} />
      <ellipse cx="142" cy="127" rx="9" ry="5" fill="#ff6b8e" opacity=".5" filter={url('soft')} />
      <ellipse cx="82" cy="123.5" rx="3" ry="1.5" fill="#fff" opacity=".35" />
      <ellipse cx="146" cy="123.5" rx="3" ry="1.5" fill="#fff" opacity=".3" />
      <path d="M108.5 120 Q112 123.5 108 125.5" stroke="#a5683f" strokeWidth="1.9" fill="none" strokeLinecap="round" opacity=".75" />
      <circle cx="110" cy="119.5" r="1.1" fill="#fff" opacity=".55" />
      {/* mouth */}
      {mouthOpen ? (
        <g>
          <path d="M101 131 Q110 146 119 131Z" fill={MOUTH} />
          <path d="M103 131.6 Q110 134 117 131.6 L116.2 133.4 Q110 135.4 103.8 133.4Z" fill="#fff" opacity=".92" />
          <path d="M104.5 138.5 Q110 134.5 115.5 138.5 Q110 143.5 104.5 138.5Z" fill="#ec8796" />
        </g>
      ) : (
        <path d="M102 133 Q110 140 118 133" stroke={MOUTH} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}
    </g>
  );

  const hand = (cx: number, cy: number, r = 8, className?: string) => (
    <circle className={className} cx={cx} cy={cy} r={r} fill={url('skin')} />
  );

  if (pose === 'peek') {
    return (
      <svg ref={svgRef} className="avatar" viewBox="48 14 124 126" role="img" aria-label={label || 'Avatar peeking'}>
        {defs}
        {head}
        {hand(78, 136, 9)}
        {hand(142, 136, 9)}
      </svg>
    );
  }

  const legs = (
    <g>
      <rect x="91" y="220" width="14" height="20" rx="3" fill={url('pants')} />
      <rect x="115" y="220" width="14" height="20" rx="3" fill={url('pants')} />
      <ellipse cx="97" cy="242" rx="11.5" ry="6.5" fill={url('white')} />
      <ellipse cx="123" cy="242" rx="11.5" ry="6.5" fill={url('white')} />
      <path d="M86 244.5 Q97 249 108 244.5 M112 244.5 Q123 249 134 244.5" stroke="#aab1c1" strokeWidth="1.6" fill="none" />
    </g>
  );

  const body = (
    <g>
      <rect x="103" y="144" width="14" height="18" fill={url('skinDark')} />
      <ellipse cx="110" cy="152" rx="11" ry="5" fill="#5a3216" opacity=".5" filter={url('soft')} />
      <path fill={url('hood')} d={HOODIE} />
      <path className="av-hood" d="M88 162 Q110 182 132 162 Q126 172 110 175 Q94 172 88 162Z" />
      <ellipse cx="94" cy="184" rx="13" ry="9" fill="#fff" opacity=".2" filter={url('soft')} />
      <path className="av-hood" opacity=".85" d="M90 210 L130 210 L126 222 L94 222Z" />
      <path d="M104 172 L102 189 M116 172 L118 189" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
      <circle cx="102" cy="190" r="2.3" fill="#fff" />
      <circle cx="118" cy="190" r="2.3" fill="#fff" />
      <text className="av-logo" x="110" y="204" textAnchor="middle">{'</>'}</text>
    </g>
  );

  const sleeve = (d: string) => <path className="av-sleeve" stroke={url('hood')} d={d} />;

  return (
    <svg ref={svgRef} className="avatar" viewBox="0 0 220 258" role="img" aria-label={label || 'Avatar of Govardhan'}>
      {defs}
      <ellipse className="av-shadow" cx="110" cy="249" rx="50" ry="7" fill="#000" filter={url('softer')} />
      <g className="av-bob">
        {pose !== 'laptop' && legs}
        {body}
        {head}

        {pose === 'wave' && (
          <g>
            {sleeve('M78 178 Q66 194 70 210')}
            {hand(71, 213)}
            <g className="av-wave">
              {sleeve('M142 178 Q158 166 163 146')}
              {hand(164, 137, 9)}
              <path d="M158 131 l-3 -6 M163 129 l-1 -7 M168 130 l1 -6" stroke="#e4a979" strokeWidth="4" strokeLinecap="round" />
            </g>
          </g>
        )}

        {pose === 'laptop' && (
          <g>
            {sleeve('M80 178 Q66 190 64 204')}
            {sleeve('M140 178 Q154 190 156 204')}
            <rect x="60" y="184" width="100" height="62" rx="7" fill={url('lid')} stroke="#b4bbc9" strokeWidth="1.5" />
            <path d="M66 190 L154 190" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
            <circle cx="110" cy="213" r="12" fill="var(--label)" />
            <text x="110" y="217" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif">GR</text>
            <path d={heart(84, 233, 0.8)} fill="var(--sub)" />
            <rect x="128" y="226" width="22" height="11" rx="3" fill="#2b3245" />
            <text x="139" y="234" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontFamily="monospace">k8s</text>
            <rect x="48" y="244" width="124" height="7" rx="3.5" fill="#aeb5c4" />
            {hand(63, 206, 8, 'av-type')}
            {hand(157, 206, 8, 'av-type r')}
            {/* coffee */}
            <path d="M200 226 Q210 228 208 236 Q206 242 200 240" stroke="#e7eaf0" strokeWidth="3.5" fill="none" />
            <rect x="178" y="220" width="23" height="27" rx="4" fill={url('white')} />
            <rect x="178" y="228" width="23" height="6" fill="var(--label)" />
            <path className="av-steam" d="M185 214 Q181 208 185 202 Q189 196 185 190" />
            <path className="av-steam s2" d="M194 214 Q190 208 194 202 Q198 196 194 190" />
          </g>
        )}

        {pose === 'mail' && (
          <g>
            {sleeve('M80 178 Q70 190 82 198')}
            {sleeve('M140 178 Q150 190 138 198')}
            <g className="av-letter">
              <rect x="84" y="184" width="56" height="38" rx="4" fill="#000" opacity=".25" filter={url('soft')} />
              <rect x="82" y="180" width="56" height="38" rx="4" fill={url('white')} />
              <path d="M84 183 L110 201 L136 183" stroke="#b9bfcc" strokeWidth="2" fill="none" strokeLinejoin="round" />
              <path d={heart(110, 206, 0.9)} fill="var(--label)" />
              {hand(83, 199)}
              {hand(137, 199)}
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
