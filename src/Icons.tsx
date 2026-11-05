import { useId } from 'react';

/* Line icons (24×24, stroke = currentColor). Each has parts the CSS can animate on hover. */

export function SunMoonIcon({ dark }: { dark: boolean }) {
  const mask = `moon${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 24 24" className={`ic-theme ${dark ? 'is-dark' : 'is-light'}`} aria-hidden="true">
      <mask id={mask}>
        <rect x="0" y="0" width="24" height="24" fill="#fff" />
        <circle className="cut" cx="18" cy="6" r="7" fill="#000" />
      </mask>
      <circle className="core" cx="12" cy="12" r="5" mask={`url(#${mask})`} />
      <g className="rays">
        <path d="M12 1.5v2M12 20.5v2M3.5 12h-2M22.5 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4" />
      </g>
    </svg>
  );
}

export function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`ic-sound ${on ? 'is-on' : 'is-off'}`} aria-hidden="true">
      <path className="spk" d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
      <path className="wave w1" d="M15.5 9.5a3.6 3.6 0 0 1 0 5" />
      <path className="wave w2" d="M18 7a7.2 7.2 0 0 1 0 10" />
      <path className="mute" d="M16 9.5l5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ic-gh" aria-hidden="true">
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ic-in" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M7.5 10.5v6M7.5 7.4v.1M11.5 16.5v-6M11.5 13.2c0-1.6 1.1-2.7 2.5-2.7s2.5 1 2.5 2.7v3.3" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ic-mail" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path className="flap" d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ic-file" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5" />
    </svg>
  );
}

export function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`ic-menu ${open ? 'x' : ''}`} aria-hidden="true">
      <path className="l1" d="M4 7h16" />
      <path className="l2" d="M4 12h16" />
      <path className="l3" d="M4 17h16" />
    </svg>
  );
}
