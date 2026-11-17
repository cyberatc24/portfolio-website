import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, MapPin, Github, Linkedin, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import './styles.css';
import { MotionContext, EASE, GITHUB, LINKEDIN, EMAIL, RESUME } from './shared.js';
import { Signal, Capabilities, Pipeline, AgentsRail, Spotlight, BuildInPublic } from './extras.jsx';
import { createSwarm, swarmSkipped } from './swarm.js';
import './swarm.css';
const LOCATION = 'Pune, Maharashtra, India';
const categories = ['All', 'AWS Cloud', 'Automation', 'Infrastructure as Code', 'Security & Governance', 'Python', 'Linux', 'Analytics'];
const inCategory = (p, c) => c === 'All' || p.category === c || (p.also || []).includes(c);
const featured = ['Automated Data Export Pipeline', 'AWS Multi-Account Health Check & Reporting', 'AWS Cost Optimization'].map(key => archive.find(p => p.title === key)).filter(Boolean);
// Employment as published on Vipul's own portfolio repository. Verify titles and dates against the resume.
const experiences = [
  { date: '2024 – NOW', title: 'Senior Cloud & AI Engineer', place: 'Tata Consultancy Services (TCS)', text: 'Built a serverless multi-account health auditor that cut audit time from hours to minutes, and led a VMware to Azure VDI migration. Earned the AWS Certified AI Practitioner, Claude Certified Associate (CCAO-F) and IIT Kharagpur AI4ICPS credentials.' },
  { date: '2022 – 2024', title: 'FinOps & Cloud Automation Lead', place: 'Tata Consultancy Services (TCS)', text: 'Reduced AWS infrastructure costs by about 60% through EC2/RDS scheduling automation, rightsizing, Compute Optimizer and Savings Plans. Upgraded Terraform across 15 repositories and optimised NACLs and VPC endpoints through Terraform. Awarded the Xcelerate Award, ranked 3rd of 40.' },
  { date: '2021 – 2022', title: 'AWS System Engineer', place: 'Tata Consultancy Services (TCS)', text: 'Managed 30+ production and non-production AWS accounts, established IAM access governance and handled 50+ compliance requests a month. Received On-the-Spot Recognition for teamwork and timely delivery of client requirements.' },
  { date: 'EDUCATION', title: 'Master’s in Business Analytics', place: 'Sinhgad Institute of Business Administration and Computer Applications, Pune', text: 'Business analytics, data analysis and reporting, the base for my Power BI and data-driven work alongside cloud engineering.' },
  { date: 'EDUCATION', title: 'B.E. Electrical Engineering', place: 'AISSMS College of Engineering, Pune', text: 'An engineering foundation in systems thinking and analytical problem-solving.' },
];
const certificates = [
  { title: 'Xcelerate Award', year: 'RANKED 3RD OF 40 · AWS TRAINING & PROJECT DELIVERY', image: './Asset/img/credentials/xcelerate-award.jpg', kind: 'Award' },
  { title: 'On-the-Spot Recognition', year: 'TEAMWORK & TIMELY CLIENT DELIVERY', image: './Asset/img/credentials/on-the-spot.jpg', kind: 'Award' },
  { title: 'AWS Certified Solutions Architect – Associate', year: 'AMAZON WEB SERVICES', image: './Asset/img/credentials/aws-solutions-architect.jpg' },
  { title: 'AWS Certified CloudOps Engineer – Associate', year: 'AMAZON WEB SERVICES', image: './Asset/img/credentials/aws-cloudops-engineer.jpg' },
  { title: 'AWS Certified AI Practitioner', year: 'AMAZON WEB SERVICES', image: './Asset/img/credentials/aws-ai-practitioner.jpg' },
  { title: 'Claude Certified Associate – Foundations (CCAO-F)', year: 'ANTHROPIC', image: './Asset/img/credentials/claude-ccao-f.jpg' },
  { title: 'AI4ICPS Certificate Programme', year: 'IIT KHARAGPUR', image: './Asset/img/credentials/ai4icps.jpg' },
  { title: 'Lean Six Sigma Green Belt', year: 'CERTIFICATION', image: './Asset/img/credentials/lean-six-sigma.jpg' },
  { title: 'Google Analytics', year: 'GOOGLE', image: './Asset/img/credentials/google-analytics.jpg' },
  { title: 'Google Digital Marketing', year: 'GOOGLE', image: './Asset/img/credentials/google-digital-marketing.jpg' },
];

// The resume button downloads the PDF. If the file has not been added yet it falls back to an email request,
// so a missing file never shows a 404.
function useResume() {
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    let alive = true;
    fetch(RESUME, { method: 'HEAD' }).then(r => { if (alive) setAvailable(r.ok && !(r.headers.get('content-type') || '').includes('text/html')); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return available
    ? { href: RESUME, download: 'Vipul-Sontakke-Resume.pdf' }
    : { href: `mailto:${EMAIL}?subject=${encodeURIComponent('Resume request')}` };
}

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32, filter: 'blur(8px)' } : false} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    // Cached images can finish before React attaches onLoad.
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">VS.</span><span>Preview unavailable</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={e => {
      if (e.currentTarget.src.includes('maxresdefault.jpg')) e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
      else setState('error');
    }} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Aurora() {
  return <div className="aurora" aria-hidden="true"><span/><span/><span/></div>;
}

function CursorGlow() {
  const enabled = useContext(MotionContext);
  const x = useSpring(-600, { stiffness: 120, damping: 25 });
  const y = useSpring(-600, { stiffness: 120, damping: 25 });
  useEffect(() => {
    if (!enabled || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const move = e => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [enabled]);
  if (!enabled) return null;
  return <motion.div className="cursor-glow" aria-hidden="true" style={{ x, y }}/>;
}

function Ticker() {
  const enabled = useContext(MotionContext);
  const words = ['AWS CLOUD ENGINEERING', 'CLOUD SECURITY', 'INFRASTRUCTURE AUTOMATION', 'TERRAFORM', 'PYTHON', 'DEVOPS', 'IAM GOVERNANCE', 'COST OPTIMIZATION'];
  return <div className="ticker" aria-label={words.join(', ')}>
    <motion.div className="ticker-track" aria-hidden="true" animate={enabled ? { x: ['0%', '-50%'] } : { x: '0%' }} transition={enabled ? { duration: 28, ease: 'linear', repeat: Infinity } : { duration: 0 }}>
      {[0, 1].map(copy => <span className="ticker-set" key={copy}>{words.map(w => <span key={w}>{w}<i>✦</i></span>)}</span>)}
    </motion.div>
  </div>;
}

function Header({ enabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  const resume = useResume();
  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Vipul Sontakke, home">VIPUL<span>.</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">{[['portfolio', 'Work'], ['about', 'About'], ['experience', 'Journey'], ['contact', 'Contact']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Pause animation' : 'Turn animation on'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><a className="header-cta header-resume" {...resume} aria-label="Download Vipul Sontakke’s resume (PDF)"><Download size={15} /><span>Resume</span></a><a className="header-cta header-github" href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="Vipul Sontakke on GitHub (opens in a new tab)"><Github size={15} /><span>GitHub</span></a><a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Home'], ['portfolio', 'Work'], ['about', 'About'], ['experience', 'Journey'], ['contact', 'Contact']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}<div className="mobile-cta"><a className="header-cta header-resume" {...resume} onClick={() => setOpen(false)}><Download size={16} />Download resume</a><a className="header-cta header-github" href={GITHUB} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><Github size={16} />GitHub</a></div></motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>AWS CLOUD ENGINEER / AWS ADMINISTRATOR<br/><span className="muted">SECURITY · AUTOMATION · COST</span></span><span className="availability"><i />5+ YEARS ON AWS</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}}>{'PORTFOLIO'.split('').map((ch, i) => <motion.span key={i} className="hero-letter" style={{ '--i': i }} initial={enabled ? { y: '60%', opacity: 0, rotate: 6 } : false} animate={{ y: '0%', opacity: 1, rotate: 0 }} transition={{ duration: 1.1, delay: 0.08 * i, ease: EASE }}>{ch}</motion.span>)}</motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}><img src="./Asset/img/vipul-portrait.webp" alt="Vipul Sontakke in a black blazer and black T-shirt under warm coral and lilac studio light" width="1024" height="1536" fetchPriority="high" /></motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p><h1 className="display"><span className="x-sr">Vipul Sontakke, AWS Cloud Engineer. </span>VIPUL<span>.</span></h1><p className="hero-role">AWS CLOUD <br />ENGINEER</p><p className="hero-description">Engineering secure, automated and cost-efficient cloud infrastructure.<br />5+ years running AWS across 30+ production and non-production accounts.</p>
      <Magnetic href="#portfolio" className="primary-link">See my work <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> PUNE, INDIA</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Secure by default.<br />Automated by design.</p></div>
      <div className="hero-stats"><div><span className="display">5+<span></span></span><p>YEARS MANAGING<br/>AWS INFRASTRUCTURE</p></div><div><span className="display">30+<span></span></span><p>AWS ACCOUNTS:<br/>PROD & NON-PROD</p></div><div className="hero-award-stat"><span className="display">~60%<span></span></span><a href="#portfolio" aria-label="See the AWS cost optimization work">COST REDUCTION<ArrowUpRight size={12}/></a></div><a href={GITHUB} target="_blank" rel="noopener noreferrer"><Github size={16}/><span>@SONTAKKEVIPUL</span></a></div>
    </motion.div>
    <div className="hero-bottom"><button className="reel-button" onClick={() => onProject(featured[0])}><span className="play-circle"><Play size={12} fill="currentColor" /></span>OPEN FEATURED PROJECT<span className="muted">DATA EXPORT PIPELINE</span></button><span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">SELECTED WORK / AWS CLOUD</span></div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const video = ['youtube', 'drive'].includes(project.type);
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const tilt = e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8); ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
  };
  const untilt = () => { rx.set(0); ry.set(0); };
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <motion.button className="project-open" style={enabled ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : {}} onPointerMove={tilt} onPointerLeave={untilt} onClick={() => onOpen(project)} aria-label={`View ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.type === 'repo' ? 'GITHUB REPO' : project.type === 'case' ? 'PROFESSIONAL WORK' : project.type === 'render' ? 'BEFORE / AFTER' : video ? 'FILM / VIDEO' : project.type === 'website' ? 'WEBSITE' : 'STILL / IMAGE'}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></motion.button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>BUILT WITH<br/><strong>THE AWS SERVICES & TOOLS BEHIND THE WORK.</strong></p><div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'SHOW AS RAIL' : `SEE ALL (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Play logo animation' : 'Pause logo animation'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Previous logos"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Next logos"><ChevronRight size={17}/></button></>}</div></div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="AWS services and tools, scroll sideways to see them all">
      {showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => inCategory(p, category) && `${p.title} ${p.category} ${(p.also || []).join(' ')} ${p.role} ${(p.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'All' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>CLOUD WORK THAT RUNS<span className="accent">.</span></h2></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('All'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'SELECTED WORK' : 'ALL WORK'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Work categories">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Search</span><input aria-label="Search work" type="search" placeholder="Project, service or tool…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {projects.length === 0 && <div className="empty-state"><p>No work matches “{query}”.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('All'); }}>Reset search <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Show more work <Plus size={16}/></button><span>More on GitHub: @sontakkevipul</span></div>}
    <BrandStrip/>
  </section>;
}

const processSteps = [
  ['01', 'SEE EVERYTHING', 'Visibility first: resources, backups, certificates, limits and tags collected across every AWS account.'],
  ['02', 'SECURE IT', 'IAM roles and policies, access governance, security groups, and AWS Config, GuardDuty, Security Hub and Inspector findings.'],
  ['03', 'CODIFY IT', 'Infrastructure kept as code in Terraform and CloudFormation, versioned in Git and shipped through CI/CD.'],
  ['04', 'AUTOMATE IT', 'Lambda, EventBridge and Python take over the repetitive checks and reports, with Bash for the Linux side.'],
  ['05', 'OPTIMISE IT', 'Rightsizing, start/stop scheduling, Compute Optimizer and Savings Plans, so nothing runs that isn’t needed.'],
];
function Breakdown() {
  const scene = { renders: [{ solid: './Asset/img/work/schedule-before.jpg', final: './Asset/img/work/schedule-after.jpg' }] };
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  if (!scene) return null;
  const resize = url => url;
  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title"><Reveal className="breakdown-copy"><span className="eyebrow">A LOOK UNDER THE BILL</span><motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>ALWAYS ON.<br/><span className="accent">ON SCHEDULE.</span></motion.h2><p>Same environments. Fewer running hours.<br/>Drag to see the idea behind the ~60% AWS cost reduction: EC2 and RDS start/stop scheduling that switches non-production off when nobody needs it.</p><span className="breakdown-credit">AWS COST OPTIMIZATION<br/>EC2 · RDS · SCHEDULING · RIGHTSIZING</span></Reveal><Reveal className="comparison"><div className="comparison-stage" style={{'--cut': `${enabled || manual ? cut : 50}%`}}><MediaImage src={resize(scene.renders[0].solid)} alt="Before: an illustrative week where non-production EC2 and RDS run every hour, 168 hours"/><div className="comparison-final"><MediaImage src={resize(scene.renders[0].final)} alt="After: the same week scheduled to run on weekdays from 09:00 to 19:00 only, 50 hours"/></div><span className="comparison-label raw-label">ALWAYS ON</span><span className="comparison-label final-label">SCHEDULED</span><div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div><input aria-label="Compare always-on and scheduled non-production environments" aria-valuetext={`${cut}% always on, ${100-cut}% scheduled`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/></div><div className="comparison-caption"><span>ILLUSTRATIVE WEEK, NOT BILLING DATA</span><span>DRAG / SCROLL</span></div></Reveal></section>;
}
function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead"><div><span className="eyebrow">02 / BEHIND THE INFRASTRUCTURE</span><h2 className="display">SECURE BY DEFAULT.<br/>AUTOMATED BY <span className="accent">DESIGN.</span></h2></div><p>I’m Vipul Sontakke, an AWS Cloud Engineer in Pune with 5+ years managing AWS infrastructure across 30+ production and non-production accounts. I look after security and IAM governance, compliance and audit readiness, automate the repetitive work with Lambda, Terraform, Python and Bash, and keep costs down: one optimization initiative cut AWS infrastructure costs by about 60%. Alongside the cloud, I’m drawn to data analytics and AI.</p></Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel"><h3 className="panel-heading">ROLE & EDUCATION</h3><p className="eyebrow accent">RIGHT NOW</p><div className="education-row"><strong>AWS Cloud Engineer</strong><span>TCS</span><p>Multi-account AWS operations, security & governance, automation and cost.</p></div><div className="education-row"><strong>Master’s, Business Analytics</strong><span>Pune</span><p>Sinhgad Institute of Business Administration and Computer Applications.</p></div><div className="education-row"><strong>B.E., Electrical Engineering</strong><span>Pune</span><p>AISSMS College of Engineering.</p></div><p className="eyebrow accent skills-heading">TOOLKIT</p><div className="skill-tags">{['EC2 · VPC · S3 · RDS', 'IAM & Organizations', 'Lambda & EventBridge', 'CloudWatch & CloudTrail', 'Config · GuardDuty · Security Hub', 'Terraform', 'CloudFormation', 'Python', 'Bash & Linux', 'Docker', 'Git & CI/CD', 'Power BI'].map(s => <span key={s}>{s}</span>)}</div><div className="software-row">{[['aws-lambda.png', 'AWS Lambda'], ['terraform.svg', 'Terraform'], ['python.svg', 'Python'], ['linux.svg', 'Linux'], ['docker.svg', 'Docker'], ['claude.svg', 'Claude']].map(([file, name]) => <img key={file} src={`./Asset/svg/${file}`} alt={name} title={name} loading="lazy" width="28" height="28"/>)}</div></Reveal>
      <div className="process-panel"><Reveal><h3 className="panel-heading">HOW I RUN A CLOUD</h3></Reveal><div className="process-list"><div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>{processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}><span className="process-num display">{num}</span><span className="process-node"/><div><h4>{title}</h4><p>{text}</p></div></Reveal>)}</div></div>
      <Reveal className="quote-panel"><span className="quote-mark display">“</span><blockquote>Secure it.<br/>Automate it.<br/><em>Never leave<br/>it wasteful.</em></blockquote><span className="handwriting">Vipul</span><div className="quote-bottom">LET’S BUILD<br/>SOMETHING RELIABLE.<span className="quote-symbol" aria-hidden="true">✳</span></div></Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  const resume = useResume();
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / THE JOURNEY</span><h2>5+ YEARS. 30+ ACCOUNTS. ONE CLOUD<span className="accent">.</span></h2></div><a className="text-link" {...resume}>DOWNLOAD RESUME<Download size={16}/></a></Reveal>
    <div className="journey-grid"><div className="experience-list">{experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title + job.place}><button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="experience-date">{job.date}</span><span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>{open === i ? <Minus size={18}/> : <Plus size={18}/>}</button><AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.text}</p></motion.div>}</AnimatePresence></Reveal>)}</div>
    <Reveal className="awards-panel"><p className="eyebrow">AWARDS & CERTIFICATIONS</p><h3 className="display">CERTIFIED.<br/><span className="accent">RECOGNISED.</span></h3><div className="award-list">{certificates.map((cert, i) => <button key={cert.title} onClick={() => onProject({ ...cert, type: 'image', media: '', category: cert.kind || 'Certification', role: cert.year, description: cert.kind === 'Award' ? 'Awarded at Tata Consultancy Services.' : 'A professional certification held by Vipul Sontakke.', note: 'Illustrative card, not the issuer’s official badge.' })}><span>{String(i + 1).padStart(2, '0')}</span><span>{cert.title}<small>{cert.year}</small></span><ArrowUpRight size={19}/></button>)}</div></Reveal></div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `Hi Vipul, I’m ${data.get('name')}.\n\nTopic: ${data.get('type')}\n\n${data.get('message')}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`${data.get('type')}: ${data.get('name')}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">04 / GET IN TOUCH</span><h2 className="display">LET’S WORK<br/>TOGETHER<span className="accent">.</span></h2><p>Have a cloud to secure,<br/>automate or optimise?</p><Magnetic href={`mailto:${EMAIL}`} className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>START A CONVERSATION</Magnetic></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href={`mailto:${EMAIL}`}><Mail/><span><small>EMAIL</small>{EMAIL}</span><ArrowUpRight size={16}/></a><a href={GITHUB} target="_blank" rel="noopener noreferrer"><Github/><span><small>GITHUB</small>@sontakkevipul</span><ArrowUpRight size={16}/></a><a href={LINKEDIN} target="_blank" rel="noopener noreferrer"><Linkedin/><span><small>LINKEDIN</small>in/vipul-sontakke</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>BASED IN</small>{LOCATION}</span></div></Reveal>
    <Reveal className="contact-reel" delay={0.2}><button onClick={() => onProject(featured[0])} aria-label="Open the Automated Data Export Pipeline project"><div className="reel-screen"><span className="reel-screen-top">VIPUL.<span>FEATURED / PROJECT</span></span><MediaImage src={featured[0]?.image} alt="Automated Data Export Pipeline architecture"/><span className="reel-screen-title display">SECURE.<br/><span>AUTOMATED.</span></span><span className="play-circle"><Play size={18} fill="currentColor"/></span></div><span className="reel-caption">EVENTBRIDGE → LAMBDA → RDS → S3 → SES</span></button></Reveal></div>
    <Reveal><details className="project-brief"><summary>Send me a message <Plus size={19}/></summary><form onSubmit={send}><label>Your name<input name="name" required placeholder="Name or company" autoComplete="name" maxLength="100"/></label><label>Topic<select name="type"><option>AWS cloud engineering role</option><option>Cloud security & IAM governance</option><option>Infrastructure automation & Terraform</option><option>AWS cost optimization</option><option>Something else</option></select></label><label className="brief-message">Message<textarea name="message" required rows="3" placeholder="What you’re working on and how I can help…" maxLength="3000"/></label><button className="solid-button" type="submit">Continue to email <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Your message is ready in your email app. Press Send there to deliver it.' : `Your message opens as a draft email to ${EMAIL}.`}</p></form></details></Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [renderMode, setRenderMode] = useState('final');
  const [shot, setShot] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);
  const enabled = useContext(MotionContext);
  const activeShot = project.type === 'render' ? project.renders[shot] : null;
  const embedType = activeShot?.video ? 'youtube' : activeShot?.drive ? 'drive' : project.type;
  const embedMedia = activeShot?.video || activeShot?.drive?.match(/\/d\/([^/]+)/)?.[1] || project.media;
  const isVideo = ['youtube', 'drive'].includes(embedType);
  const availableModes = [['layout', 'Layout'], ['solid', 'First frame'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Last frame']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.type === 'render' ? rendered : ['repo', 'case', 'image'].includes(project.type) ? project.media : project.media || project.image;
  const linkLabel = project.linkLabel || (project.type === 'repo' ? 'View on GitHub' : project.type === 'website' ? 'Visit website' : 'Open original');
  const changeShot = next => { setMediaLoaded(false); setMediaFailed(false); setShot(next); };
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);
  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => { if (!mediaLoaded) setMediaFailed(true); }, 14000);
    return () => clearTimeout(timer);
  }, [mediaLoaded, retried, isVideo, embedMedia]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.94, opacity: 0 } : false} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={enabled ? { type: 'spring', stiffness: 260, damping: 26 } : { duration: 0 }}>
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Close project"><X/></button></div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>The preview could not load. Open the original to watch it.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Try again</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Loading film…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Frame">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Previous shot" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Next shot" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p>{project.tags && <div className="dialog-tags">{project.tags.map(t => <span key={t}>{t}</span>)}</div>}{project.note && <p className="dialog-note">{project.note}</p>}</div>{sourceUrl && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{project.type === 'repo' && <Github size={15}/>}{linkLabel}<ExternalLink size={15}/></a>}</div>
      {isVideo && <p className="embed-note">If the owner restricts the video, use “Open original”.</p>}
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('vs-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  // Swarm rebuild runs only while Motion is on; turning Motion off removes it and shows everything at once.
  React.useLayoutEffect(() => { if (!enabled || swarmSkipped()) return; const swarm = createSwarm(); return () => swarm.destroy(); }, [enabled]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('vs-motion', motionOn ? 'off' : 'on'); } catch {} };
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <Aurora/>
      <CursorGlow/>
      <a className="skip-link" href="#portfolio">Skip to work</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        <Hero onProject={setProject}/>
        <Ticker/>
        <Portfolio onProject={setProject}/>
        <Signal/>
        <Capabilities onProject={setProject}/>
        <Breakdown/>
        <About/>
        <Pipeline/>
        <AgentsRail onProject={setProject}/>
        <Spotlight onProject={setProject}/>
        <Journey onProject={setProject}/>
        <BuildInPublic/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">VIPUL<span>.</span></a>
        <span>© {new Date().getFullYear()} VIPUL SONTAKKE · AWS CLOUD ENGINEER. SECURE. AUTOMATED. NEVER WASTEFUL.</span>
        <div>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="Vipul Sontakke on GitHub"><Github size={17}/></a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="Vipul Sontakke on LinkedIn"><Linkedin size={17}/></a>
          <a href="#home" aria-label="Back to top"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
