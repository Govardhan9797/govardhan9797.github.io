import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { profile, avatars, stats, about, skillGroups, programs, experience, certifications, education, type Role } from './data';
import Avatar, { type AvatarProps } from './Avatar';
import SignalWaves from './SignalWaves';
import Ribbon, { type RibbonStyle } from './Ribbon';
import Logo from './Logo';
import Footer from './Footer';
import { SunMoonIcon, SoundIcon, GitHubIcon, LinkedInIcon, MenuIcon } from './Icons';
import { blip, isSoundOn, setSoundOn } from './sound';

type Theme = 'dark' | 'light';

/* Built-in animated avatar, or your own PNG if one is set in data.ts */
function Art({ src, ...props }: AvatarProps & { src?: string }) {
  return src ? <img className="avatar-img" src={src} alt="Avatar of Govardhan" /> : <Avatar {...props} />;
}

const BACKDROPS: (RibbonStyle | 'signal')[] = ['twist', 'dots', 'signal'];
const GREETINGS = ['Hey there! 👋 Tap me', 'Switching signal… 📡', 'Let’s build something! 🚀'];

/* Hero avatar: tap to "boop" it, change the greeting and cycle the backdrop */
function HeroArt() {
  const [step, setStep] = useState(0);
  const [boop, setBoop] = useState(false);
  const backdrop = BACKDROPS[step % BACKDROPS.length];
  const onTap = () => {
    blip('pop');
    setStep((s) => s + 1);
    setBoop(false);
    requestAnimationFrame(() => setBoop(true));
  };
  return (
    <button type="button" className="hero-art" onClick={onTap} aria-label="Say hi to the avatar and change the backdrop">
      {backdrop === 'signal' ? <SignalWaves variant="dashes" /> : <Ribbon variant={backdrop} />}
      <span className="bubble" key={step}>{GREETINGS[step % GREETINGS.length]}</span>
      <span className="spark s1">✦</span>
      <span className="spark s2">✦</span>
      <span className="spark s3">✦</span>
      <span className="spark s4">✦</span>
      <span
        className={`avatar-wrap ${boop ? 'boop' : ''}`}
        onAnimationEnd={(e) => { if (e.animationName === 'boop') setBoop(false); }}
      >
        <Art src={avatars.hero} pose="sit" track />
      </span>
    </button>
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
        <button className="more" onClick={() => { blip('tap'); setOpen(!open); }} aria-expanded={open}>
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
  const [sound, setSound] = useState(isSoundOn);

  const toggleSound = () => {
    const next = !sound;
    setSoundOn(next);
    setSound(next);
    blip(next ? 'on' : 'off', true);
  };
  const toggleTheme = () => {
    blip(theme === 'dark' ? 'on' : 'off');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  const toggleMenu = () => {
    blip('tap');
    setMenu(!menu);
  };

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
          <Logo onClick={close} />
          <nav className={`nav ${menu ? 'open' : ''}`} aria-label="Main">
            {NAV.map((n) => <a key={n} href={`#${n.toLowerCase()}`} onClick={close}>{n}</a>)}
            <div className="nav-social">
              <a className="tool" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a>
              <a className="tool" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
            </div>
          </nav>
          <div className="tools">
            <button className="tool" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sounds off' : 'Turn sounds on'} title={sound ? 'Sounds on' : 'Sounds off'}>
              <SoundIcon on={sound} />
            </button>
            <button className="tool" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              <SunMoonIcon dark={theme === 'dark'} />
            </button>
            <a className="tool desk-only" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><GitHubIcon /></a>
            <a className="tool desk-only" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><LinkedInIcon /></a>
            <button className="tool burger" aria-label="Menu" aria-expanded={menu} onClick={toggleMenu}>
              <MenuIcon open={menu} />
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

      <Footer />
    </>
  );
}
