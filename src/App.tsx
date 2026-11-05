import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { profile, avatars, stats, about, skillGroups, programs, experience, certifications, education, type Role } from './data';
import Avatar, { type AvatarProps } from './Avatar';

type Theme = 'dark' | 'light';

/* Built-in animated avatar, or your own PNG if one is set in data.ts */
function Art({ src, ...props }: AvatarProps & { src?: string }) {
  return src ? <img className="avatar-img" src={src} alt="Avatar of Govardhan" /> : <Avatar {...props} />;
}

function HeroArt() {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="hero-art"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setHover((h) => !h)}
    >
      <span className="bubble" key={hover ? 'b' : 'a'}>{hover ? 'Let’s build something! 🚀' : 'Hey there! 👋'}</span>
      <span className="spark s1">✦</span>
      <span className="spark s2">✦</span>
      <span className="spark s3">✦</span>
      <span className="spark s4">✦</span>
      <Art src={avatars.hero} pose="wave" track />
    </div>
  );
}

const NAV = ['About', 'Experience', 'Skills', 'Certifications', 'Contact'];

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/* Fades content in once it scrolls into view */
function Reveal({ children, className = '', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`}>{children}</Tag>;
}

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} className="section">
      <Reveal><h2 className="label">{label}</h2></Reveal>
      {children}
    </section>
  );
}

/* Layered hills: an original, theme-aware illustration */
function Hills() {
  return (
    <svg className="hills" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
      <path className="h1" d="M0 150 C 180 60, 330 70, 470 140 S 760 230, 930 120 S 1260 40, 1440 130 V320 H0Z" />
      <path className="h2" d="M0 210 C 160 150, 300 160, 430 210 S 700 270, 900 190 S 1240 150, 1440 210 V320 H0Z" />
      <path className="h3" d="M0 260 C 220 220, 420 240, 640 270 S 1060 300, 1440 250 V320 H0Z" />
    </svg>
  );
}

function Job({ e }: { e: Role }) {
  const [open, setOpen] = useState(false);
  const shown = open ? e.points : e.points.slice(0, 2);
  return (
    <Reveal as="article" className="item">
      <div className="item-head">
        <h3>{e.role}</h3>
        <span className="when">{e.period}</span>
      </div>
      <p className="sub">{e.company} · {e.place}{e.current && <span className="now">current</span>}</p>
      <ul className="points">{shown.map((p) => <li key={p}>{p}</li>)}</ul>
      {e.points.length > 2 && (
        <button className="more" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Show less' : `Show ${e.points.length - 2} more`}
          <span className={`arrow ${open ? 'up' : ''}`}>↓</span>
        </button>
      )}
    </Reveal>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  });
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  const close = () => setMenu(false);

  return (
    <>
      <header className={`top ${scrolled ? 'scrolled' : ''}`}>
        <div className="bar">
          <a href="#top" className="brand" onClick={close}>
            Govardhan<span className="brand-dot">.</span>
          </a>
          <nav className={`nav ${menu ? 'open' : ''}`} aria-label="Main">
            {NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} onClick={close}>{n}</a>)}
          </nav>
          <div className="tools">
            <button className="tool" aria-label="Toggle colour theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              )}
            </button>
            <button className={`tool burger ${menu ? 'x' : ''}`} aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <svg viewBox="0 0 24 24"><path className="l1" d="M4 7h16" /><path className="l2" d="M4 12h16" /><path className="l3" d="M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <div className="hero">
          <div className="hero-inner">
          <HeroArt />
          <div className="hero-text">
            <p className="hello reveal in">Hi, I’m</p>
            <h1 className="reveal in">{profile.name}</h1>
            <p className="role reveal in">Software Engineer · DevOps · Cloud</p>
            <p className="intro reveal in">{profile.tagline}</p>
            <div className="actions reveal in">
              <a className="btn" href="#contact">Get in touch</a>
              <a className="link" href="#experience">See my work →</a>
              {profile.resume && <a className="link" href={profile.resume} target="_blank" rel="noreferrer">Résumé ↗</a>}
            </div>
            <p className="status reveal in"><span className="pulse" /> {profile.openTo} · {profile.location}</p>
          </div>
          </div>
          <Hills />
        </div>

        <div className="wrap">
          <Reveal className="stats">
            {stats.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
          </Reveal>

          <Section id="about" label="About me">
            <div className="with-art">
              <div>
                {about.map((p, i) => <Reveal key={i} as="p" className="prose">{p}</Reveal>)}
              </div>
              <Reveal className="side-art"><Art src={avatars.about} pose="laptop" label="Avatar typing on a laptop" /></Reveal>
            </div>
            <Reveal className="programs">
              <h3>Programs I’ve delivered</h3>
              <ul>
                {programs.map((p) => <li key={p.name}>{p.name}<em>{p.region}</em></li>)}
              </ul>
            </Reveal>
          </Section>

          <Section id="experience" label="Experience">
            {experience.map((e) => <Job key={e.role + e.period} e={e} />)}
          </Section>

          <Section id="skills" label="Skills">
            <div className="skills">
              {skillGroups.map((g) => (
                <Reveal key={g.title} className="skill">
                  <h3>{g.title}</h3>
                  <p>{g.items.join(' · ')}</p>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section id="certifications" label="Certifications">
            <Reveal as="ul" className="list">
              {certifications.map((c) => (
                <li key={c.name}>
                  <span className="name">{c.name}</span>
                  <span className="meta">{c.issuer} · {c.date}</span>
                </li>
              ))}
            </Reveal>
            <Reveal><h3 className="minor">Education</h3></Reveal>
            <Reveal as="ul" className="list">
              {education.map((e) => (
                <li key={e.degree}>
                  <span className="name">{e.degree}<small>{e.school}</small></span>
                  <span className="meta">{e.period}</span>
                </li>
              ))}
            </Reveal>
          </Section>

          <Section id="contact" label="Say hello">
            <div className="with-art">
            <div>
            <Reveal as="p" className="prose big">
              I’m open to Software Engineering and DevOps roles in Bengaluru. The fastest way to reach me is email.
            </Reveal>
            <Reveal className="contact">
              {profile.email && <a href={`mailto:${profile.email}`}><span>Email</span>{profile.email}</a>}
              {profile.phone && <a href={`tel:${profile.phone.replace(/\s/g, '')}`}><span>Phone</span>{profile.phone}</a>}
              {profile.phone && <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><span>WhatsApp</span>Message me</a>}
              <a href={profile.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span>govardhanreddydanduvari</a>
              <a href={profile.github} target="_blank" rel="noreferrer"><span>GitHub</span>Govardhan9797</a>
              {profile.resume && <a href={profile.resume} target="_blank" rel="noreferrer"><span>Résumé</span>View PDF</a>}
            </Reveal>
            </div>
            <Reveal className="side-art"><Art src={avatars.contact} pose="mail" label="Avatar holding a letter" /></Reveal>
            </div>
          </Section>
        </div>
      </main>

      <footer className="footer">
        <Reveal className="peek" aria-hidden="true"><Avatar pose="peek" track /></Reveal>
        <div className="wrap">© {new Date().getFullYear()} {profile.name}. Made with care in Bengaluru.</div>
      </footer>
    </>
  );
}
