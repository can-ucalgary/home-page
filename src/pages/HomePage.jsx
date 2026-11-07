import Events from '../components/Events.jsx';
import Partners from '../components/Partners.jsx';
import Benefits from '../components/Benefits.jsx';
import { useHeroPointer } from '../hooks/useMotion.js';
import { siteURL } from '../lib/site.js';

function HomeHero() {
  const heroRef = useHeroPointer();
  return (
    <section ref={heroRef} className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-backdrop" aria-hidden="true"><img src={siteURL('assets/images/campus.jpeg')} width="1280" height="994" alt="University of Calgary campus" fetchPriority="high" /><div className="hero-aura"></div><div className="hero-grain"></div></div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" aria-hidden="true"></span> UCALGARY CHINESE ALUMNI NETWORK</p>
          <h1 id="hero-title"><span>Shared roots.</span><span>Stronger</span><span className="hero-last">connections<span className="hero-period">.</span></span></h1>
          <p className="hero-chinese" lang="zh-Hans">兼爱互利，海纳百川</p>
        </div>
        <div className="hero-panel">
          <span className="panel-symbol" aria-hidden="true">↗</span>
          <p className="panel-kicker">A CONNECTION BEYOND GRADUATION</p>
          <p className="hero-description">A shared beginning.<br />A world of <em>possibility.</em></p>
          <p className="panel-body">Where Chinese and Chinese-speaking alumni connect, support one another, and grow together.</p>
          <div className="hero-actions"><a className="button" href="#connect">Find your community <span aria-hidden="true">↗</span></a><a className="text-link" href="#about">Get to know CAN <span aria-hidden="true">↓</span></a></div>
          <div className="hero-note"><span className="note-mark" aria-hidden="true">✳</span><span>A UCalgary Alumni affinity community.</span></div>
        </div>
      </div>
      <div className="container hero-bottom"><span>CALGARY, ALBERTA · CONNECTED EVERYWHERE</span><a href="#about">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a><span lang="zh-Hans">与校友相连，与社区同行</span></div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section container about" id="about" aria-labelledby="about-title">
      <div><p className="eyebrow">01 / WHO WE ARE <span lang="zh-Hans">关于我们</span></p><h2 id="about-title">Many paths.<br />One community.</h2><p className="chinese-subtitle" lang="zh-Hans">共筑校友社区网络，打造资源共享平台</p></div>
      <div className="about-copy"><p className="lead">Our UCalgary experience is a beginning.<br />What we build together comes next.</p><p>UCalgary Chinese Alumni Network (CAN) is an affinity community under the UCalgary Alumni Association. We bring Chinese and Chinese-speaking alumni together through professional growth, cultural connection, and meaningful engagement with UCalgary.</p><p>Our purpose is to build an inclusive community, a supportive alumni network, and a long-term ecosystem of shared resources.</p><a className="text-link" href="mailto:can.ucalgary@gmail.com">Say hello to CAN <span aria-hidden="true">↗</span></a></div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="pillars section" aria-labelledby="pillars-title">
      <div className="container"><div className="section-heading"><div><p className="eyebrow">02 / WHAT BRINGS US TOGETHER</p><h2 id="pillars-title">Three pillars. Shared possibility.</h2></div><span className="chinese-subtitle" lang="zh-Hans">鼎立三柱</span></div>
        <div className="pillar-grid">
          <article className="pillar"><div className="pillar-top"><span className="pillar-icon" aria-hidden="true">↗</span><span>01</span></div><p className="pillar-cn" lang="zh-Hans">职业发展</p><h3>Career development</h3><p>Build connections that move you forward. Industry networking, professional workshops, career panels, entrepreneurship meetups, and mentorship.</p><a className="text-link" href="#events">Connect and grow <span aria-hidden="true">↗</span></a></article>
          <article className="pillar"><div className="pillar-top"><span className="pillar-icon" aria-hidden="true">◎</span><span>02</span></div><p className="pillar-cn" lang="zh-Hans">社区融入</p><h3>Community engagement</h3><p>Find a sense of belonging. Art workshops, family-friendly gatherings, outdoor activities, cultural heritage, and language exchange.</p><a className="text-link" href="#events">Find common ground <span aria-hidden="true">↗</span></a></article>
          <article className="pillar"><div className="pillar-top"><span className="pillar-icon" aria-hidden="true">✳</span><span>03</span></div><p className="pillar-cn" lang="zh-Hans">AI赋能</p><h3>AI empowerment</h3><p>Our vision: a Chinese-language enabled AI chatbot connecting alumni with UCalgary programs, civic information, mental health supports, and community services.</p><a className="text-link" href="mailto:can.ucalgary@gmail.com?subject=CAN%20AI%20initiative">Explore the initiative <span aria-hidden="true">↗</span></a></article>
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section className="section container" id="events" aria-labelledby="events-title">
      <div className="section-heading"><div><p className="eyebrow">03 / IN GOOD COMPANY <span lang="zh-Hans">校友活动</span></p><h2 id="events-title">Good things happen together.</h2></div><a className="text-link" href="events/">View all events / 全部活动 <span aria-hidden="true">↗</span></a></div>
      <div className="events-layout"><div className="events-image"><img src={siteURL('assets/images/community.jpg')} width="1600" height="1067" alt="Hands joined together in a gesture of support and community" /><div className="image-label"><span lang="zh-Hans">相遇，是故事的开始。</span><span>Make a connection. Start a conversation.</span></div></div>
      <div className="event-list"><p className="eyebrow">LATEST FROM OUR COMMUNITY / 最新活动</p>
        <Events />
        
        <a className="text-link event-contact" href="mailto:can.ucalgary@gmail.com?subject=Upcoming%20CAN%20events">Ask about our next gathering <span aria-hidden="true">↗</span></a>
      </div></div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="resources section" id="resources" aria-labelledby="resources-title"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">04 / OUR COMMUNITY NETWORK <span lang="zh-Hans">社区资源</span></p><h2 id="resources-title">Collaborators. Resources.<br />Above all, friends.</h2></div><p className="section-aside" lang="zh-Hans">是合作伙伴，是资源，更是朋友。<br /><span lang="en">Stronger connections open more doors.</span></p></div>
      <Partners />
      <div className="resource-bottom"><p>Looking for a community resource or alumni connection?</p><a className="text-link" href="mailto:can.ucalgary@gmail.com?subject=Community%20resources">Let’s connect you <span aria-hidden="true">↗</span></a></div>
    </div></section>
  );
}

function BenefitsSection() {
  return (
    <section className="section container benefits" id="benefits" aria-labelledby="benefits-title">
      <div className="section-heading"><div><p className="eyebrow">05 / MORE FROM YOUR COMMUNITY <span lang="zh-Hans">校友福利</span></p><h2 id="benefits-title">A little more, together.</h2></div><a className="text-link" href="benefits/">Explore all benefits / 全部福利 <span aria-hidden="true">↗</span></a></div>
      <Benefits />
      
    </section>
  );
}

function OpportunitiesSection() {
  return (
    <section className="section container opportunities" id="opportunities" aria-labelledby="opportunities-title"><p className="eyebrow">06 / MAKE A DIFFERENCE <span lang="zh-Hans">参与机会</span></p><div className="section-heading"><h2 id="opportunities-title">There’s a place for<br />what you bring.</h2><p className="section-aside">Share your experience. Bring an idea.<br />Help shape what our community becomes.</p></div><div className="opportunity-grid"><a href="mailto:can.ucalgary@gmail.com?subject=Getting%20involved%20with%20CAN"><span>01 / GET INVOLVED</span><h3>Give your time.</h3><p>Ask how you can support our community and events.</p><b aria-hidden="true">↗</b></a><a href="mailto:can.ucalgary@gmail.com?subject=Partnering%20with%20CAN"><span>02 / COLLABORATE</span><h3>Build with us.</h3><p>Start a conversation about partnering with CAN.</p><b aria-hidden="true">↗</b></a></div></section>
  );
}

function ConnectSection() {
  return (
    <section className="connect" id="connect" aria-labelledby="connect-title"><div className="container connect-inner"><div><p className="eyebrow">YOUR NEXT CONNECTION STARTS HERE</p><h2 id="connect-title">Stay connected.<br />Stay involved.</h2><p lang="zh-Hans">与校友相连，与社区同行。</p></div><div className="connect-actions"><p>Community updates, upcoming events, and opportunities to connect, give back, and grow together.</p><a className="button button-light" href="mailto:can.ucalgary@gmail.com?subject=Stay%20connected%20with%20CAN&body=Hello%20CAN%2C%0A%0AI%20would%20like%20to%20learn%20how%20to%20join%20the%20network%20and%20receive%20community%20updates.%0A%0AName%3A%0AUCalgary%20connection%20(optional)%3A%0A">Email us to get connected <span aria-hidden="true">↗</span></a><p className="contact-note">Opens your email app. You can also write to<br /><a href="mailto:can.ucalgary@gmail.com">can.ucalgary@gmail.com</a></p><div className="social-links"><a href="https://www.instagram.com/can.ucalgary/">Instagram ↗</a><a href="https://www.linkedin.com/company/ucalgary-chinese-alumni-network/">LinkedIn ↗</a></div></div></div></section>
  );
}

export default function HomePage() {
  return <main id="main"><HomeHero /><AboutSection /><PillarsSection /><EventsSection /><PartnersSection /><BenefitsSection /><OpportunitiesSection /><ConnectSection /></main>;
}
