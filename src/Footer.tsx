import { useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { GitHubIcon, LinkedInIcon, MailIcon, FileIcon } from './Icons';
import { profile } from './data';
import { blip } from './sound';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Up late? Me too. 🌌';
  if (h < 12) return 'Good morning! ☀️';
  if (h < 17) return 'Good afternoon! 🌤️';
  if (h < 21) return 'Good evening! 🌙';
  return 'Good night! ✨';
}

const EXPLORE = ['About', 'Experience', 'Skills', 'Badges', 'Certifications', 'Contact'];

export default function Footer() {
  const [hello] = useState(greeting);
  const [swing, setSwing] = useState(false);

  const poke = () => {
    blip('pop');
    setSwing(false);
    requestAnimationFrame(() => setSwing(true));
  };

  return (
    <footer className="site-footer">
      {/* wavy top edge */}
      <svg className="foot-wave" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path className="fw1" d="M0 70 C 200 20, 360 30, 520 80 S 820 150, 1000 90 S 1300 20, 1440 60 V160 H0Z" />
        <path className="fw2" d="M0 110 C 240 70, 420 90, 640 120 S 1100 150, 1440 100 V160 H0Z" />
      </svg>

      <div className="foot-body">
        {/* the avatar hangs upside down from the wave; click to give it a swing */}
        <button type="button" className={`hang ${swing ? 'swing' : ''}`} onClick={poke}
          onAnimationEnd={(e) => { if (e.animationName === 'swing') setSwing(false); }}
          aria-label="Give the hanging avatar a little push">
          <Avatar pose="hang" track label="Avatar hanging upside down" />
        </button>

        <div className="foot-grid">
          <div className="foot-brand">
            <Logo size="lg" />
            <p className="foot-hello">{hello}</p>
            <p className="foot-note">Thanks for scrolling all the way down. If you’re hiring for DevOps or platform engineering, I’d love to talk.</p>
            {profile.email && <a className="btn foot-cta" href={`mailto:${profile.email}`}>Say hello →</a>}
          </div>

          <nav className="foot-col" aria-label="Explore">
            <h4>Explore</h4>
            {EXPLORE.map((n) => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}
          </nav>

          <div className="foot-col">
            <h4>Get in touch</h4>
            {profile.email && <a href={`mailto:${profile.email}`}>Email</a>}
            {profile.phone && <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a>}
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            {profile.resume && <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>}
          </div>
        </div>

        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} {profile.name} · Built with React + TypeScript in {profile.location.split(',')[0]}</p>
          <div className="foot-icons">
            {profile.email && <a className="tool" href={`mailto:${profile.email}`} aria-label="Email"><MailIcon /></a>}
            <a className="tool" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a className="tool" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
            {profile.resume && <a className="tool" href={profile.resume} target="_blank" rel="noreferrer" aria-label="Résumé (PDF)"><FileIcon /></a>}
          </div>
        </div>
      </div>
    </footer>
  );
}
