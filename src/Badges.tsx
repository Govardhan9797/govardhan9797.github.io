import type { PointerEvent, ReactNode } from 'react';
import type { Certification } from './data';
import { blip } from './sound';

/*
  Badge cards: the card tilts toward the mouse with a moving glare; on touch it
  presses in. Cards with a credential `url` open it in a new tab.
*/

function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--rx', `${((0.5 - y) * 16).toFixed(2)}deg`);
  el.style.setProperty('--ry', `${((x - 0.5) * 16).toFixed(2)}deg`);
  el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
  el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
}

function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

/** Drawn badge for credentials without an image */
function Tile({ c }: { c: Certification }) {
  const brand = c.issuer.split(' ')[0].toLowerCase();
  return (
    <span className={`badge-tile tile-${brand}`}>
      <b>{c.issuer}</b>
      <span>{c.name}</span>
    </span>
  );
}

function BadgeCard({ c }: { c: Certification }) {
  const body: ReactNode = (
    <>
      <span className="badge-art">
        {c.badge ? <img src={c.badge} alt="" width={340} height={340} loading="lazy" decoding="async" /> : <Tile c={c} />}
        <span className="glare" aria-hidden="true" />
      </span>
      <span className="badge-name">{c.name}</span>
      <span className="badge-meta">{c.issuer} · {c.date}</span>
      {c.url && <span className="badge-verify" aria-hidden="true">Verify ↗</span>}
    </>
  );

  return c.url ? (
    <a
      className="badge-card"
      href={c.url}
      target="_blank"
      rel="noreferrer"
      onPointerMove={tilt}
      onPointerLeave={untilt}
      onClick={() => blip('tap')}
      aria-label={`${c.name}, ${c.issuer}, ${c.date}. Verify credential (opens in a new tab)`}
    >
      {body}
    </a>
  ) : (
    <div className="badge-card is-static">{body}</div>
  );
}

export default function Badges({ items }: { items: Certification[] }) {
  return (
    <div className="badges-grid">
      {items.map((c) => <BadgeCard key={c.name} c={c} />)}
    </div>
  );
}
