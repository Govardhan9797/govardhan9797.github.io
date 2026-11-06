// ✏️ All site content lives here. Edit this file to update the portfolio.

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  roles: string[];
  tagline: string;
  location: string;
  openTo: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resume: string;
}

/** One image for both themes, or a light/dark pair that swaps with the theme. '' = built-in illustration. */
export type AvatarImage = string | { light: string; dark: string };

export interface Avatars {
  hero: AvatarImage;
  about: AvatarImage;
  contact: AvatarImage;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  icon: string;
  items: string[];
}

export interface Program {
  name: string;
  region: string;
  flag?: string;
}

export interface Role {
  role: string;
  company: string;
  period: string;
  place: string;
  current?: boolean;
  points: string[];
  tags: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  note?: string;
}

export const profile: Profile = {
  name: 'Govardhan Reddy Danduvari',
  shortName: 'Govardhan',
  initials: 'GR',
  roles: ['Software Engineer', 'DevOps Engineer', 'Cloud & Kubernetes', 'Telecom BSS / OSS'],
  tagline:
    'I deploy, automate and keep mission-critical telecom platforms running — from Kubernetes clusters to Kafka streams — for operators across Asia and Africa.',
  location: 'Bengaluru, India',
  openTo: 'Open to Software / DevOps roles · On-site & Hybrid',
  email: 'dandugovardhanreddy@gmail.com',
  phone: '+91 83330 56201', // shown on the site; set to '' to hide
  linkedin: 'https://www.linkedin.com/in/govardhanreddydanduvari/',
  github: 'https://github.com/Govardhan9797',
  resume: 'resume.pdf', // served from public/resume.pdf
};

// Optional: use your own avatar pictures (e.g. a 3D render of yourself made in Blender).
// 1. Put the images in the repo's public/ folder (transparent PNG or WebP, ~800px wide).
// 2. Set the file name here. A single image:      hero: 'me.webp'
//    Or a pair that swaps with the theme:          hero: { light: 'me-light.webp', dark: 'me-dark.webp' }
// Leave '' to use the built-in animated illustration.
export const avatars: Avatars = {
  hero: '',
  about: '',
  contact: '',
};

export const stats: Stat[] = [
  { value: '6', label: 'Global telecom programs' },
  { value: '9', label: 'Cloud certifications' },
  { value: '2+', label: 'Years at 6D Technologies' },
  { value: '3', label: 'Envs managed: Dev · UAT · Prod' },
];

export const about: string[] = [
  'I’m a Software Engineer at 6D Technologies, delivering Telecom OSS and Digital BSS solutions for operators such as Singtel, Vodafone Idea, Tata Play Fiber, Telkomsel, CellCard and ICTA Kenya.',
  'My work sits where software meets operations: core Mediation modules and CDR processing, containerised microservices on Kubernetes, CI/CD with Jenkins, AWS infrastructure, and the deep-dive debugging that keeps production stable.',
  'I hold a B.E. in Electronics & Communication Engineering, and outside work I create 3D art in Blender and edit video.',
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Cloud & DevOps',
    icon: '☁️',
    items: ['Kubernetes', 'Docker', 'Harbor', 'Jenkins CI/CD', 'Git', 'Terraform', 'AWS (EC2, ECR, S3, Lambda, VPC)', 'Google Cloud', 'Amazon Bedrock'],
  },
  {
    title: 'Telecom Platforms',
    icon: '📡',
    items: ['Digital BSS', 'Telecom OSS', 'Mediation & CDR processing', 'CRM validation', 'Production deployment', 'Microservices'],
  },
  {
    title: 'Data & Observability',
    icon: '📊',
    items: ['Apache Kafka', 'MySQL', 'MongoDB', 'BigQuery', 'Grafana', 'Root-cause analysis'],
  },
  {
    title: 'Automation & Code',
    icon: '⚙️',
    items: ['Linux / Shell scripting', 'Python', 'Robot Framework', 'Selenium', 'Full-stack web'],
  },
  {
    title: 'Creative',
    icon: '🎬',
    items: ['Blender 3D modelling', 'Adobe Premiere Pro', 'Video editing'],
  },
];

export const programs: Program[] = [
  { name: 'Singtel', region: 'Singapore' },
  { name: 'VIL Postpaid', region: 'India', flag: '🇮🇳' },
  { name: 'Tata Play Fiber', region: 'India', flag: '🇮🇳' },
  { name: 'TSEL', region: 'Indonesia', flag: '🇮🇩' },
  { name: 'CellCard', region: 'Cambodia', flag: '🇰🇭' },
  { name: 'ICTA', region: 'Kenya', flag: '🇰🇪' },
];

export const experience: Role[] = [
  {
    role: 'Software Engineer',
    company: '6D Technologies',
    period: 'Mar 2025 — Present',
    place: 'Bengaluru · On-site',
    current: true,
    points: [
      'Key contributor to core Mediation modules: CDR processing, file-based workflows, microservices and database configuration.',
      'Deploy containerised microservices across Dev, UAT and Production with Docker, Kubernetes and Harbor; manage Pods, Deployments, Services, ConfigMaps and Secrets.',
      'Run highly available AWS infrastructure (EC2, ECR, S3, Lambda, VPC, Secrets Manager) and use Amazon Bedrock for cloud-based telecom components.',
      'Lead root-cause analysis across K8s logs, MySQL and Kafka event streams; automate monitoring with shell scripts and Grafana dashboards.',
      'Built automated UI and feature-validation suites for CellCard Cambodia with Robot Framework and Selenium.',
      'Validated CRM implementation for ICTA Kenya and fixed production defects.',
    ],
    tags: ['Kubernetes', 'AWS', 'Kafka', 'Jenkins', 'Grafana', 'Robot Framework'],
  },
  {
    role: 'Software Implementation Engineer',
    company: '6D Technologies',
    period: 'Oct 2024 — Mar 2025',
    place: 'Apprenticeship',
    points: ['Software implementation and integration engineering for telecom BSS deployments.'],
    tags: ['Implementation', 'Integration'],
  },
  {
    role: 'IT System Administrator',
    company: 'Kriya NextWealth',
    period: 'Nov 2023 — May 2024',
    place: 'Mysore · On-site',
    points: [
      'Supported IT infrastructure for BPO operations serving US and UK clients, including Walmart and Tesco processes.',
      'Enforced endpoint security: USB restrictions, access controls and locked-down workstations.',
      'Configured VPNs, business apps and servers; troubleshot LAN, Wi-Fi and ISP issues to minimise downtime.',
      'Owned onboarding and offboarding: system setup, access provisioning and documentation.',
    ],
    tags: ['Linux', 'Networking', 'Endpoint security'],
  },
  {
    role: 'Full-stack Developer Intern',
    company: 'JSpiders',
    period: 'Dec 2022 — Jun 2023',
    place: 'Mysore · On-site',
    points: ['Built full-stack websites across several domains with a range of frameworks, working in pairs under senior supervision.'],
    tags: ['Python', 'Full-stack'],
  },
];

export const certifications: Certification[] = [
  { name: 'Manage Kubernetes in Google Cloud', issuer: 'Google', date: 'Aug 2026' },
  { name: 'Implement CI/CD Pipelines on Google Cloud', issuer: 'Google', date: 'Aug 2026' },
  { name: 'Monitoring in Google Cloud', issuer: 'Google', date: 'Aug 2026' },
  { name: 'Implement Cloud Storage & Data Protection', issuer: 'Google', date: 'Aug 2026' },
  { name: 'Analyze Sentiment with Natural Language API', issuer: 'Google', date: 'Aug 2026' },
  { name: 'Build Infrastructure with Terraform on Google Cloud', issuer: 'Google', date: 'Jul 2026' },
  { name: 'Build a Data Warehouse with BigQuery', issuer: 'Google', date: 'Jul 2026' },
  { name: 'App Building with AppSheet', issuer: 'Google', date: 'Jul 2026' },
  { name: 'MongoDB Overview: Core Concepts & Architecture', issuer: 'MongoDB', date: 'Sep 2026' },
];

export const education: Education[] = [
  {
    degree: 'B.E., Electronics & Communication Engineering',
    school: 'Maharaja Institute of Technology · VTU',
    period: '2019 — 2023',
    note: 'Volleyball · Blender · Adobe Premiere Pro',
  },
  { degree: 'Intermediate (MPC)', school: 'Narayana Junior College, Tirupati', period: '2017 — 2019' },
  { degree: 'Secondary School', school: 'Master Minds High School, Madanapalle', period: '2015 — 2017' },
];
