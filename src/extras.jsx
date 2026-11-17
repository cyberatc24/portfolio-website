import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useVelocity, useSpring, useTransform, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Github, Clock, KeyRound, Database, FileSpreadsheet, Mail, BellRing, Server, ShieldCheck, Code2, PiggyBank, Activity, Plus, Minus } from 'lucide-react';
import archive from './data/projects.json';
import { MotionContext, EASE, GITHUB } from './shared.js';
import './extras.css';

const findProject = title => archive.find(p => p.title === title);
const clamp01 = v => Math.min(1, Math.max(0, v));

// Same entrance as the kit's Reveal (y 32, blur 8px, 0.75s), so new sections feel native.
function Rise({ children, className = '', delay = 0, as = 'div', ...props }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32, filter: 'blur(8px)' } : false} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }} {...props}>{children}</Component>;
}

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const on = () => setMatch(list.matches);
    on();
    list.addEventListener('change', on);
    return () => list.removeEventListener('change', on);
  }, [query]);
  return match;
}

/* ── One builder, three sides (pinned; a type composition per chapter, all real text) ── */
// Each row mixes formats: o = outline, g = gradient, s = solid, i = serif italic, m = mono label, p = pill.
const chapters = [
  { num: '01', prefix: 'Cloud infrastructure,', word: 'MANAGED', text: '5+ years running AWS across 30+ production and non-production accounts: EC2, VPC, S3, RDS and Lambda, backed up, monitored and kept healthy.',
    type: [[['m', '// 30+ AWS ACCOUNTS']], [['o', 'EC2'], ['g', 'VPC'], ['i', '& S3,']], [['p', 'PROD · NON-PROD'], ['s', 'RDS']], [['i', 'backed up,'], ['o', 'MONITORED']], [['m', 'AWS BACKUP → CLOUDWATCH']]] },
  { num: '02', prefix: 'Security & governance,', word: 'ENFORCED', text: 'IAM roles, policies and access governance, with AWS Config, GuardDuty, Security Hub, Inspector and CloudTrail keeping every account audit-ready.',
    type: [[['m', '// LEAST PRIVILEGE'], ['i', 'by default']], [['o', 'IAM'], ['g', 'GOVERNANCE']], [['p', 'CONFIG'], ['p', 'GUARDDUTY'], ['p', 'SECURITY HUB']], [['s', 'AUDIT-READY'], ['i', 'every account']], [['m', 'CLOUDTRAIL · INSPECTOR · TAGGING']]] },
  { num: '03', prefix: 'Automation & optimization,', word: 'AUTOMATED', text: 'Lambda, EventBridge, Python and Terraform doing the repetitive work, and scheduling, rightsizing and Savings Plans that cut AWS costs by about 60%.',
    type: [[['m', '// LAMBDA · EVENTBRIDGE']], [['g', 'TERRAFORM'], ['i', '& python,']], [['o', '~60%'], ['p', 'COST REDUCTION']], [['i', 'scheduled,'], ['s', 'RIGHTSIZED']], [['m', '15 REPOS UPGRADED']]] },
];
const chapterOf = v => (v < 0.36 ? 0 : v < 0.7 ? 1 : 2);

export function Signal() {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useEffect(() => { setActive(chapterOf(scrollYProgress.get())); }, []);
  useMotionValueEvent(scrollYProgress, 'change', v => setActive(chapterOf(v)));
  const ch = chapters[active];
  const swap = { initial: enabled ? { opacity: 0, y: 40, filter: 'blur(10px)' } : false, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: enabled ? { opacity: 0, y: -28, filter: 'blur(10px)' } : { opacity: 0, transition: { duration: 0 } } };
  let n = 0;
  return <section id="signal" className="sig" ref={ref} aria-labelledby="signal-title">
    <div className="sig-sticky">
      <div className="sig-type" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} className="sig-type-set" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={enabled ? { opacity: 0, transition: { duration: 0.3 } } : { opacity: 0, transition: { duration: 0 } }}>
            <span className="sig-num">{ch.num}</span>
            {ch.type.map((row, r) => <div key={r} className="sig-row">
              {row.map(([kind, text]) => {
                const i = n++;
                return <motion.span key={text} className={`sig-t t-${kind}`} initial={swap.initial} animate={swap.animate} transition={{ duration: enabled ? 0.6 : 0, delay: enabled ? 0.05 + i * 0.05 : 0, ease: EASE }}>{text}</motion.span>;
              })}
            </div>)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="sig-copy">
        <span className="eyebrow">ONE ENGINEER / THREE PILLARS</span>
        <h2 id="signal-title" className="x-sr">One engineer, three pillars</h2>
        <ul className="x-sr">{chapters.map(c => <li key={c.num}>{c.prefix} {c.word.toLowerCase()}. {c.text}</li>)}</ul>
        <div className="sig-stage" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} className="sig-chapter" {...swap} transition={{ duration: enabled ? 0.55 : 0, ease: EASE }}>
              <p className="sig-prefix">{ch.prefix}</p>
              <p className="sig-word display">{ch.word}<span>.</span></p>
              <p className="sig-text">{ch.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="sig-steps" aria-hidden="true">
          {chapters.map((c, i) => <span key={c.num} className={i === active ? 'is-active' : ''}><b>{c.num}</b>{c.word}</span>)}
          <span className="sig-bar"><motion.i style={{ scaleX: scrollYProgress }}/></span>
        </div>
      </div>
    </div>
  </section>;
}

/* ── What I build (bento cards with a pointer spotlight) ── */
const services = [
  { num: '01', icon: Server, title: 'AWS infrastructure management', text: 'Day-to-day operation of multi-account AWS: EC2, VPC, S3, RDS and Lambda across production and non-production, with backups, certificates and limits kept in check.', tags: ['EC2', 'VPC', 'S3', 'RDS', 'Organizations'], example: 'Automated Data Export Pipeline', link: 'SEE THE DATA EXPORT PIPELINE', big: true },
  { num: '02', icon: ShieldCheck, title: 'Cloud security & IAM', text: 'IAM roles, policies and access governance, security groups and network security, with Config, GuardDuty, Security Hub and Inspector watching every account.', tags: ['IAM', 'Config', 'GuardDuty', 'Security Hub'], example: 'AWS Multi-Account Health Check & Reporting', link: 'SEE THE HEALTH CHECK', big: true },
  { num: '03', icon: Code2, title: 'Infrastructure as Code', text: 'Terraform and CloudFormation, versioned in Git: Terraform upgraded across 15 repositories and standardised.', tags: ['Terraform', 'CloudFormation', 'Git', 'CI/CD'], example: 'Terraform Infrastructure Upgrade', link: 'SEE THE TERRAFORM UPGRADE' },
  { num: '04', icon: PiggyBank, title: 'Cloud cost optimization', text: 'Rightsizing, EC2/RDS scheduling, Compute Optimizer and Savings Plans: about 60% off AWS infrastructure costs.', tags: ['Compute Optimizer', 'Savings Plans', 'Scheduling'], example: 'AWS Cost Optimization', link: 'SEE THE COST WORK' },
  { num: '05', icon: Activity, title: 'Monitoring & automation', text: 'CloudWatch and CloudTrail for visibility, Lambda, EventBridge, SES, Python and Bash for the checks and reports nobody should run by hand.', tags: ['CloudWatch', 'CloudTrail', 'Lambda', 'Python', 'Bash'], anchor: '#pipeline', link: 'SEE THE AUTOMATION FLOW' },
];
const spotlight = e => {
  if (e.pointerType !== 'mouse') return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export function Capabilities({ onProject }) {
  return <section id="services" className="cap section-wrap" aria-labelledby="cap-title">
    <Rise className="section-heading"><div><span className="eyebrow">WHAT I DO</span><h2 id="cap-title">BUILT TO <span className="accent">run.</span></h2></div><a className="text-link" href="#contact">GET IN TOUCH<ArrowRight size={21}/></a></Rise>
    <div className="cap-grid">{services.map((s, i) => {
      const project = s.example ? findProject(s.example) : null;
      const Icon = s.icon;
      return <Rise key={s.num} className={`cap-card ${s.big ? 'big' : ''}`} delay={i * 0.05} onPointerMove={spotlight}>
        <div className="cap-top"><span className="cap-num display">{s.num}</span><span className="cap-icon"><Icon size={19}/></span></div>
        {s.big && project && <div className="cap-media"><img src={project.image} alt="" loading="lazy" width="960" height="600"/></div>}
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <div className="cap-tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
        {project
          ? <button className="cap-link" onClick={() => onProject(project)}>{s.link}<ArrowUpRight size={16}/></button>
          : <a className="cap-link" href={s.anchor}>{s.link}<ArrowUpRight size={16}/></a>}
      </Rise>;
    })}</div>
  </section>;
}

/* ── The engineering side (HTML flow diagram, so screenshots and the swarm rebuild can see it) ── */
const STAGES = [
  { step: 'COLLECT', tool: 'Lambda + EventBridge schedules', text: 'Scheduled Lambda functions reach into each AWS account with IAM roles and gather what matters: backups, certificates, disk space, service limits, tags and health events.' },
  { step: 'GOVERN', tool: 'IAM · AWS Config · GuardDuty · Security Hub', text: 'Findings and configuration from AWS Config, GuardDuty, Security Hub and Inspector, checked against IAM and tagging governance so every account stays audit-ready.' },
  { step: 'MONITOR', tool: 'CloudWatch & CloudTrail', text: 'CloudWatch alarms, metrics and logs, and CloudTrail for who did what, so problems surface before anyone has to ask.' },
  { step: 'REPORT', tool: 'S3 + Amazon SES (+ SNS alerts)', text: 'Results land in S3 and go out by email through Amazon SES, with SNS for failures, turning manual checks into reports that arrive on their own.' },
  { step: 'CODIFY', tool: 'Terraform + CloudFormation', text: 'The infrastructure underneath is code: Terraform and CloudFormation, versioned in Git and deployed through CI/CD.' },
];

const FLOW = [
  { label: 'LAMBDA · EVENTBRIDGE', note: 'collectors' },
  { label: 'IAM · CONFIG · GUARDDUTY', note: 'findings' },
  { label: 'CLOUDWATCH · CLOUDTRAIL', note: 'signals' },
  { label: 'S3 · SES · SNS', note: 'reports' },
];
const SOURCES = ['PROD', 'NON-PROD', '30+ ACCOUNTS'];

function Wire({ dots = 2 }) {
  return <span className="pipe-wire">{Array.from({ length: dots }, (_, i) => <i key={i} style={{ '--d': `${(i / dots) * -2.4}s`, '--at': `${18 + (i * 60) / dots}%` }}/>)}</span>;
}

export function Pipeline() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!enabled || hold || !inView) return undefined;
    const id = setInterval(() => setActive(a => (a + 1) % STAGES.length), 3600);
    return () => clearInterval(id);
  }, [enabled, hold, inView]);
  const pick = i => { setActive(i); setHold(true); };
  return <section id="pipeline" className="pipe section-wrap" ref={ref} aria-labelledby="pipe-title">
    <Rise className="section-heading"><div><span className="eyebrow">THE AUTOMATION SIDE</span><h2 id="pipe-title">CHECKS THAT <span className="accent">run themselves.</span></h2></div><p className="pipe-intro">How health checks and reports move through a multi-account AWS estate, drawn as a general pattern from my health-check and reporting automation. Pick a stage to follow it.</p></Rise>
    <div className="pipe-grid" onPointerEnter={e => { if (e.pointerType === 'mouse') setHold(true); }} onPointerLeave={() => setHold(false)} onFocusCapture={() => setHold(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false); }}>
      <Rise className={`pipe-stage ${enabled ? 'is-live' : ''}`}>
        <div className="pipe-diagram" aria-hidden="true">
          <div className={`pipe-orch ${active === 4 ? 'is-active' : ''}`} onClick={() => pick(4)}>
            <span className="pipe-mono">05 / CODIFY</span>
            <strong>TERRAFORM · CLOUDFORMATION</strong>
            <span className="pipe-mono">infrastructure as code under every step</span>
          </div>
          <div className="pipe-row">
            <div className="pipe-sources"><span className="pipe-mono">SOURCES</span>{SOURCES.map(x => <span key={x} className="pipe-src">{x}</span>)}</div>
            {FLOW.map((n, i) => <React.Fragment key={n.label}>
              <Wire dots={i === 0 ? 3 : 2}/>
              <div className={`pipe-node ${i === active ? 'is-active' : ''} ${active === 4 ? 'is-ctrl' : ''}`} onClick={() => pick(i)}>
                <span className="pipe-mono">0{i + 1}</span>
                <strong>{STAGES[i].step}</strong>
                <span className="pipe-tool">{n.label}</span>
                <span className="pipe-mono pipe-note">{n.note}</span>
              </div>
            </React.Fragment>)}
          </div>
        </div>
        <span className="pipe-legend" aria-hidden="true"><i className="is-data"/>SIGNALS<i className="is-control"/>INFRASTRUCTURE AS CODE</span>
      </Rise>
      <ol className="pipe-list">{STAGES.map((s, i) => <Rise as="li" key={s.step} className={`pipe-item ${i === active ? 'is-active' : ''}`} delay={i * 0.04}>
        <button aria-expanded={i === active} aria-controls={`stage-${i}`} onClick={() => pick(i)}>
          <span className="pipe-step">0{i + 1}</span><span className="pipe-name"><strong>{s.step}</strong><small>{s.tool}</small></span>{i === active ? <Minus size={16}/> : <Plus size={16}/>}
        </button>
        <AnimatePresence initial={false}>{i === active && <motion.div id={`stage-${i}`} className="pipe-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: enabled ? 0.35 : 0, ease: EASE }}><p>{s.text}</p></motion.div>}</AnimatePresence>
      </Rise>)}</ol>
    </div>
  </section>;
}

/* ── Agents on the shelf (horizontal rail, pinned to the scroll on wide screens) ── */
const agents = archive.filter(p => p.rail);

export function AgentsRail({ onProject }) {
  const enabled = useContext(MotionContext);
  const wide = useMedia('(min-width: 801px)');
  const pinned = enabled && wide;
  const ref = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const overflowRef = useRef(0);
  const [overflow, setOverflow] = useState(0);
  const x = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useEffect(() => {
    if (!pinned) { x.set(0); return undefined; }
    const measure = () => {
      const o = Math.max(0, track.current.offsetWidth - viewport.current.clientWidth);
      overflowRef.current = o;
      setOverflow(o);
      x.set(-scrollYProgress.get() * o);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track.current);
    observer.observe(viewport.current);
    measure();
    return () => observer.disconnect();
  }, [pinned]);
  useMotionValueEvent(scrollYProgress, 'change', v => { if (pinned) x.set(-v * overflowRef.current); });
  return <section id="agents" ref={ref} className={`agents ${pinned ? 'is-pinned' : 'is-static'}`} style={pinned ? { height: `calc(100vh + ${overflow}px)` } : undefined} aria-labelledby="agents-title">
    <div className="agents-sticky" ref={viewport}>
      <Rise className="section-heading agents-head"><div><span className="eyebrow">CLOUD WORK ON THE RAIL</span><h2 id="agents-title">INFRASTRUCTURE THAT <span className="accent">works for you.</span></h2></div><p>The AWS work I’m proudest of, from automated multi-account reporting and an event-driven export pipeline to cost and Terraform work across whole estates.</p></Rise>
      <div className="agents-window">
        <motion.div className="agents-track" ref={track} style={{ x }} role="list">
          {agents.map(a => <motion.article className="agent-card" role="listitem" key={a.title} whileHover={enabled ? { y: -6 } : undefined} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
            <button onClick={() => onProject(a)} aria-label={`Open ${a.title}`}>
              <span className="agent-media"><img src={a.image} alt="" loading="lazy" width="960" height="600" draggable="false"/></span>
              <span className="agent-meta"><span className="agent-tag">{a.type === 'repo' ? 'GITHUB REPO' : a.category.toUpperCase()}</span><strong>{a.title}</strong><small>{a.description}</small></span>
              <span className="agent-arrow"><ArrowUpRight size={18}/></span>
            </button>
          </motion.article>)}
          <a className="agent-card agent-cta" role="listitem" href={GITHUB} target="_blank" rel="noopener noreferrer">
            <span className="display">SEE IT ALL<br/>ON GITHUB<span className="accent">.</span></span>
            <span className="agent-cta-link">github.com/sontakkevipul<ArrowUpRight size={18}/></span>
          </a>
        </motion.div>
      </div>
      <span className="agents-hint" aria-hidden="true">{pinned ? 'KEEP SCROLLING TO MOVE ALONG THE RAIL' : 'SWIPE ALONG THE RAIL'}<ArrowRight size={14}/></span>
    </div>
  </section>;
}

/* ── Project spotlight: the Automated Data Export Pipeline, with a CSS-animated concept console ── */
const features = [
  [Clock, 'Scheduled by EventBridge', 'A monthly rule starts the run with nobody at the keyboard.'],
  [KeyRound, 'Credentials from Secrets Manager', 'Lambda assumes an IAM role and reads the database secret at run time.'],
  [Database, 'Queried inside the VPC', 'Lambda and RDS talk through their own security groups.'],
  [FileSpreadsheet, 'CSV to Amazon S3', 'The result is written as a CSV and stored in S3.'],
  [Mail, 'Delivered by Amazon SES', 'The export goes out by email; CloudWatch logs it and SNS flags failures.'],
];
const rings = [['EXTRACT', 1, '#ff7a59'], ['STORE', 1, '#ffb38a'], ['DELIVER', 1, '#b9a3ff']];
const spotlightProject = findProject('Automated Data Export Pipeline');

export function Spotlight({ onProject }) {
  const enabled = useContext(MotionContext);
  const phone = useRef(null);
  const live = useInView(phone, { amount: 0.35 });
  return <section id="spotlight" className="mac section-wrap" aria-labelledby="mac-title">
    <div className="mac-grid">
      <Rise className="mac-copy">
        <span className="eyebrow">PROJECT SPOTLIGHT / AWS LAMBDA AUTOMATION</span>
        <h2 id="mac-title" className="display">DATA EXPORT<span className="mac-dot">.</span></h2>
        <p className="mac-lead">An event-driven AWS pipeline that pulls data from Amazon RDS, turns it into a CSV, stores it in S3 and emails it through SES, on schedule and without a manual step.</p>
        <ul className="mac-features">{features.map(([Icon, title, text]) => <li key={title}><span className="mac-icon"><Icon size={18}/></span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
        {spotlightProject && <div className="mac-actions"><button className="outline-button" onClick={() => onProject(spotlightProject)}>See the architecture<ArrowUpRight size={16}/></button><a className="text-link" href={spotlightProject.media} target="_blank" rel="noopener noreferrer"><Github size={16}/>VIEW THE REPO</a></div>}
      </Rise>
      <Rise className="mac-visual" delay={0.1}>
        <div ref={phone} className={`mac-phone is-console ${live && enabled ? 'is-live' : ''}`} aria-hidden="true">
          <div className="mac-bar"><span>DATA EXPORT</span><span className="mac-chip"><Clock size={11}/>MONTHLY</span></div>
          <div className="mac-plate">
            <span className="mac-food f1"/><span className="mac-food f2"/><span className="mac-food f3"/><span className="mac-food f4"/>
            <span className="mac-box b1"><em>RDS</em></span><span className="mac-box b2"><em>CSV</em></span><span className="mac-box b3"><em>S3 → SES</em></span>
            <span className="mac-scan"/>
          </div>
          <div className="mac-rings">{rings.map(([label, value, color], i) => <div key={label} className="mac-ring">
            <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" className="track"/><circle cx="22" cy="22" r="18" className="fill" style={{ '--v': value, '--c': color, '--d': `${i * 0.2}s` }}/></svg>
            <span>{label}</span>
          </div>)}</div>
          <div className="mac-tabs"><span className="is-on">RUN</span><span>LOGS</span><span>ALERTS</span></div>
        </div>
        <span className="mac-caption">CONCEPT ILLUSTRATION, NOT A SCREENSHOT</span>
      </Rise>
    </div>
  </section>;
}

/* ── Building in public (scroll-velocity marquee) ── */
const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min; };

function MarqueeRow({ text, base, className }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const inView = useInView(ref);
  const x = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1200], [0, 4], { clamp: false });
  const xPercent = useTransform(x, v => `${v}%`);
  useAnimationFrame((_, delta) => {
    if (!enabled || !inView) return;
    const f = factor.get();
    if (f < 0) direction.current = -1; else if (f > 0) direction.current = 1;
    let move = direction.current * base * (Math.min(delta, 50) / 1000);
    move += direction.current * move * f;
    x.set(wrap(-50, 0, x.get() + move));
  });
  return <div className={`bip-row ${className}`} ref={ref} aria-hidden="true">
    <motion.div className="bip-track" style={{ x: xPercent }}>{[0, 1].map(k => <span key={k}>{text}</span>)}</motion.div>
  </div>;
}

export function BuildInPublic() {
  return <section id="build" className="bip" aria-labelledby="bip-title">
    <MarqueeRow className="is-fill" base={-2} text="@SONTAKKEVIPUL ✦ BUILDING IN PUBLIC ✦ @SONTAKKEVIPUL ✦ BUILDING IN PUBLIC ✦ "/>
    <MarqueeRow className="is-outline" base={2.4} text="AWS ✦ AUTOMATION ✦ PYTHON ✦ TERRAFORM ✦ LINUX ✦ CLOUD SECURITY ✦ AI & DATA ✦ AWS ✦ AUTOMATION ✦ PYTHON ✦ TERRAFORM ✦ LINUX ✦ CLOUD SECURITY ✦ AI & DATA ✦ "/>
    <Rise className="bip-foot">
      <h2 id="bip-title" className="x-sr">Building in public on GitHub</h2>
      <p>AWS automation, Python and Bash projects, shared on GitHub as I learn and build, with a growing interest in AI and data analytics.</p>
      <a className="solid-button bip-cta" href={GITHUB} target="_blank" rel="noopener noreferrer"><Github size={18}/>FOLLOW @SONTAKKEVIPUL<ArrowUpRight size={18}/></a>
    </Rise>
  </section>;
}
