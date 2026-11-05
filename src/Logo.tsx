/*
  Name wordmark: "Govardhan · Reddy" joined by a small broadcast-signal glyph
  (a nod to telecom). The glyph's waves pulse and the letters hop on hover.
*/

export default function Logo({ size = 'md', onClick }: { size?: 'md' | 'lg'; onClick?: () => void }) {
  return (
    <a href="#top" className={`logo logo-${size}`} onClick={onClick} aria-label="Govardhan Reddy, back to top">
      <span className="logo-word" aria-hidden="true">
        {'Govardhan'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${i * 28}ms` }}>{c}</span>)}
      </span>
      <svg className="logo-glyph" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="17" r="2.4" />
        <path className="w1" d="M8.2 13.2a5.4 5.4 0 0 1 7.6 0" />
        <path className="w2" d="M5.4 10.4a9.4 9.4 0 0 1 13.2 0" />
        <path className="w3" d="M2.6 7.6a13.4 13.4 0 0 1 18.8 0" />
      </svg>
      <span className="logo-word" aria-hidden="true">
        {'Reddy'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${(i + 10) * 28}ms` }}>{c}</span>)}
      </span>
    </a>
  );
}
