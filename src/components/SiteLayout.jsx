import { useEffect, useRef, useState } from 'react';
import { siteURL } from '../lib/site.js';
import { usePageMotion } from '../hooks/useMotion.js';

function Header({ page }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const home = page === 'home';
  const homeLink = hash => home ? hash : siteURL(hash);
  useEffect(() => {
    function outside(event) { if (!headerRef.current?.contains(event.target)) setOpen(false); }
    function escape(event) {
      if (event.key === 'Escape' && open) { setOpen(false); toggleRef.current?.focus(); }
    }
    const desktop = window.matchMedia('(min-width: 801px)');
    const close = () => setOpen(false);
    document.addEventListener('click', outside);
    document.addEventListener('keydown', escape);
    desktop.addEventListener('change', close);
    return () => { document.removeEventListener('click', outside); document.removeEventListener('keydown', escape); desktop.removeEventListener('change', close); };
  }, [open]);
  useEffect(() => {
    let frame;
    function update() {
      if (frame) return;
      frame = requestAnimationFrame(() => { setScrolled(window.scrollY > 20); frame = undefined; });
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, []);
  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} ref={headerRef}>
      <div className="container header-inner">
        <a className="brand" href={home ? '#home' : siteURL()} aria-label="UCalgary Chinese Alumni Network home">
          <img className="brand-logo" src={siteURL('assets/brand/logo.png')} width="500" height="500" alt="UCalgary Chinese Alumni Network logo" />
          <span className="brand-name"><strong lang="zh-Hans">卡大中国校友圈</strong><span>UCalgary Chinese Alumni Network</span></span>
        </a>
        <button className="menu-toggle" aria-expanded={open} aria-controls="navigation" ref={toggleRef} onClick={() => setOpen(value => !value)}>Menu <span aria-hidden="true">☰</span></button>
        <nav id="navigation" className={open ? 'is-open' : undefined} aria-label="Main navigation" onClick={event => { if (event.target.closest('a')) setOpen(false); }}>
          <a href={homeLink('#about')}>About <span lang="zh-Hans">关于</span></a>
          <a href={siteURL('events/')} aria-current={page === 'events' ? 'page' : undefined}>Events <span lang="zh-Hans">活动</span></a>
          <a href={siteURL('benefits/')} aria-current={page === 'benefits' ? 'page' : undefined}>Benefits <span lang="zh-Hans">福利</span></a>
          <a href={homeLink('#resources')}>Resources <span lang="zh-Hans">资源</span></a>
          <a className="button button-small" href={homeLink('#connect')}>Get connected <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}

function Footer({ page }) {
  return (
    <footer className="container">
      <div className="footer-main">
        <a href={page === 'home' ? '#home' : siteURL()} aria-label="Back to home"><img className="footer-logo" src={siteURL('assets/brand/logo.png')} width="500" height="500" alt="UCalgary 中国校友圈 — Chinese Alumni Network" /></a>
        <p>Rooted in a shared experience.<br />Growing through each other.</p>
        <a className="text-link" href={page === 'home' ? '#home' : '#main'}>Back to top ↑</a>
      </div>
      <div className="footer-bottom"><span>© <span id="year">{new Date().getFullYear()}</span> UCalgary Chinese Alumni Network. All rights reserved.</span><span lang="zh-Hans">兼爱互利，海纳百川</span></div>
    </footer>
  );
}

export default function SiteLayout({ page, children }) {
  usePageMotion();
  return <><a className="skip-link" href="#main">Skip to content</a><Header page={page} />{children}<Footer page={page} /></>;
}
