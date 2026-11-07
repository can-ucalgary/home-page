'use strict';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

// Keep the page visible without JavaScript or when reduced motion is requested.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.about > div, .section-heading, .pillar, .events-layout, .partner-carousel, .opportunity-grid > a, .connect-inner').forEach(element => {
    element.classList.add('reveal');
    if (element.matches('.pillar, .partner-carousel, .opportunity-grid > a')) {
      element.style.setProperty('--reveal-delay', `${Math.min(Array.from(element.parentElement.children).indexOf(element), 2) * 90}ms`);
    }
    revealObserver.observe(element);
  });
  document.body.classList.add('motion-ready');
}
const header = document.querySelector('.site-header');
let scrollFrame;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    scrollFrame = undefined;
  });
}, { passive: true });

if (!reducedMotion.matches && window.matchMedia('(pointer: fine)').matches) {
  const hero = document.querySelector('.hero');
  let pointerFrame;
  hero.addEventListener('pointermove', event => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
      hero.style.setProperty('--pointer-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
      pointerFrame = undefined;
    });
  }, { passive: true });
}

// JSON paths stay relative so they work under a GitHub Pages repository subpath.
async function readContent(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
  const items = await response.json();
  if (!Array.isArray(items)) throw new Error(`Expected an array in ${path}`);
  return items;
}
function contentElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}
function contentURL(value, protocols) {
  const url = new URL(value, document.baseURI);
  if (!protocols.includes(url.protocol)) throw new Error('Unsupported content URL');
  return url.href;
}
function showContentStatus(container, message) {
  const status = contentElement('p', 'content-status', message);
  status.setAttribute('role', 'status');
  container.replaceChildren(status);
}
async function displayEvents() {
  const container = document.querySelector('#event-items');
  try {
    const events = await readContent('data/events.json');
    const timestamp = event => event.date ? Date.parse(event.date) : -Infinity;
    // Undated events follow dated ones; stable sort preserves their JSON order.
    const latest = events.slice().sort((a, b) => {
      const left = timestamp(a), right = timestamp(b);
      return left === right ? 0 : right - left;
    }).slice(0, 3);
    const fragment = document.createDocumentFragment();
    for (const event of latest) {
      if (typeof event.title !== 'string' || !event.title.trim() || (event.date && !Number.isFinite(timestamp(event)))) throw new Error('Invalid event');
      const article = contentElement('article');
      const meta = contentElement('div', 'event-meta');
      meta.append(contentElement('span', 'event-type', event.category));
      if (event.date) {
        // Interpret calendar dates in UTC to avoid displaying the previous day locally.
        const time = contentElement('time', 'event-date', new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(event.date)));
        time.dateTime = event.date;
        meta.append(time);
      }
      const copy = contentElement('div', 'event-copy');
      copy.append(meta, contentElement('h3', '', event.title), contentElement('p', '', event.description));
      if (event.poster) {
        article.classList.add('event-with-poster');
        const posterLink = contentElement('a', 'event-poster-link');
        posterLink.href = contentURL(event.poster, ['http:', 'https:']);
        posterLink.target = '_blank';
        posterLink.rel = 'noopener';
        posterLink.setAttribute('aria-label', `View poster / 查看海报: ${event.title}`);
        const poster = document.createElement('img');
        poster.src = posterLink.href;
        poster.alt = `${event.title} — 活动海报`;
        poster.loading = 'lazy';
        posterLink.append(poster);
        article.append(posterLink);
      }
      article.append(copy);
      if (event.url) {
        const link = contentElement('a', 'event-detail-link', '↗');
        link.href = contentURL(event.url, ['http:', 'https:', 'mailto:']);
        link.setAttribute('aria-label', `Learn more: ${event.title}`);
        article.append(link);
      }
      fragment.append(article);
    }
    if (latest.length) container.replaceChildren(fragment);
    else showContentStatus(container, 'New events are on the way. / 更多活动敬请期待。');
  } catch (error) {
    console.error('Events:', error);
    showContentStatus(container, 'Events are temporarily unavailable. Please contact CAN below. / 活动暂时无法加载，请通过下方链接联系我们。');
  } finally {
    container.setAttribute('aria-busy', 'false');
  }
}
const partnerTrack = document.querySelector('#partner-items');
const previousPartners = document.querySelector('#partners-prev');
const nextPartners = document.querySelector('#partners-next');
function updatePartnerControls() {
  const maxScroll = partnerTrack.scrollWidth - partnerTrack.clientWidth;
  previousPartners.disabled = partnerTrack.scrollLeft <= 1;
  nextPartners.disabled = partnerTrack.scrollLeft >= maxScroll - 1;
}
function scrollPartners(direction) {
  partnerTrack.scrollBy({ left: direction * partnerTrack.clientWidth * 0.85, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}
previousPartners.addEventListener('click', () => scrollPartners(-1));
nextPartners.addEventListener('click', () => scrollPartners(1));
partnerTrack.addEventListener('scroll', updatePartnerControls, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(updatePartnerControls).observe(partnerTrack);
else window.addEventListener('resize', updatePartnerControls);
async function displayPartners() {
  try {
    const partners = await readContent('data/partners.json');
    const fragment = document.createDocumentFragment();
    for (const partner of partners) {
      if (typeof partner.name !== 'string' || !partner.name.trim() || typeof partner.logo !== 'string' || !partner.logo) throw new Error('Invalid partner');
      const card = contentElement(partner.url ? 'a' : 'div', 'partner-card');
      if (partner.url) card.href = contentURL(partner.url, ['http:', 'https:']);
      const image = document.createElement('img');
      image.src = contentURL(partner.logo, ['http:', 'https:']);
      image.alt = partner.name;
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        image.replaceWith(contentElement('span', 'partner-name', partner.name));
      }, { once: true });
      card.append(image, contentElement('span', 'partner-card-label', partner.name));
      fragment.append(card);
    }
    if (partners.length) partnerTrack.replaceChildren(fragment);
    else showContentStatus(partnerTrack, 'More community connections coming soon. / 更多合作伙伴敬请期待。');
  } catch (error) {
    console.error('Partners:', error);
    showContentStatus(partnerTrack, 'Partners are temporarily unavailable. Please contact CAN for resources. / 合作伙伴暂时无法加载，欢迎联系我们。');
  } finally {
    partnerTrack.setAttribute('aria-busy', 'false');
    updatePartnerControls();
  }
}
// Each section can succeed even when the other JSON file is unavailable.
displayEvents();
displayPartners();

async function displayBenefits() {
  const container = document.querySelector('#benefit-items');
  try {
    const response = await fetch('data/benefits.json');
    if (!response.ok) throw new Error(`Could not load benefits: ${response.status}`);
    const data = await response.json();
    if (!data.pass || !Array.isArray(data.merchants)) throw new Error('Invalid benefits data');
    const { pass, merchants } = data;
    const fragment = document.createDocumentFragment();
    const overview = contentElement('div', 'pass-overview');
    const image = document.createElement('img');
    image.src = contentURL(pass.image, ['http:', 'https:']);
    image.alt = pass.title;
    image.loading = 'lazy';
    const copy = contentElement('div', 'pass-copy');
    copy.append(contentElement('p', 'eyebrow', `${pass.year} ANNUAL PASS / 年度折扣卡`), contentElement('h3', '', pass.title), contentElement('p', '', pass.description));
    const validity = contentElement('p', 'pass-validity', `有效期 / Valid: ${pass.validFrom} — ${pass.validUntil}`);
    const purchase = contentElement('a', 'button', `Get the ${pass.year} pass / 购买折扣卡 ↗`);
    purchase.href = contentURL(pass.purchaseUrl, ['http:', 'https:']);
    copy.append(validity, purchase);
    const details = contentElement('details', 'pass-details');
    details.append(contentElement('summary', '', '使用方式与适用人群 / How to use & eligibility'), contentElement('p', '', pass.instructions));
    const eligibility = document.createElement('ul');
    for (const group of pass.eligibility) eligibility.append(contentElement('li', '', group));
    details.append(eligibility);
    copy.append(details);
    overview.append(image, copy);
    fragment.append(overview);
    const grid = contentElement('div', 'benefit-grid');
    for (const merchant of merchants) {
      const card = contentElement('article', 'benefit-card');
      const logo = document.createElement('img');
      logo.src = contentURL(merchant.image, ['http:', 'https:']);
      logo.alt = merchant.name;
      logo.loading = 'lazy';
      logo.addEventListener('error', () => { logo.hidden = true; }, { once: true });
      const body = contentElement('div', 'benefit-card-copy');
      body.append(contentElement('p', 'benefit-discount', merchant.discount), contentElement('h3', '', merchant.name));
      if (merchant.address) body.append(contentElement('p', 'benefit-address', merchant.address));
      if (merchant.wechat) body.append(contentElement('p', 'benefit-address', `WeChat / 微信: ${merchant.wechat}`));
      const url = merchant.website || merchant.mapUrl;
      if (url) {
        const link = contentElement('a', 'text-link', merchant.website ? 'Visit website / 网站 ↗' : 'View map / 地图 ↗');
        link.href = contentURL(url, ['http:', 'https:']);
        link.setAttribute('aria-label', `${merchant.name} — ${merchant.website ? 'website' : 'map'}`);
        body.append(link);
      }
      card.append(logo, body);
      grid.append(card);
    }
    if (merchants.length) fragment.append(grid);
    else fragment.append(contentElement('p', 'content-status', 'Partner offers will be added here. / 商家优惠即将更新。'));
    container.replaceChildren(fragment);
  } catch (error) {
    console.error('Benefits:', error);
    showContentStatus(container, 'Benefits are temporarily unavailable. Please contact CAN. / 福利暂时无法加载，欢迎联系我们。');
  } finally {
    container.setAttribute('aria-busy', 'false');
  }
}
displayBenefits();
