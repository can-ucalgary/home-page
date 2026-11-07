import { useEffect, useRef, useState } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    update();
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function usePageMotion() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    if (reduced || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    const elements = document.querySelectorAll('.about > div, .section-heading, .pillar, .events-layout, .partner-carousel, .opportunity-grid > a, .connect-inner');
    elements.forEach(element => {
      element.classList.add('reveal');
      if (element.matches('.pillar, .partner-carousel, .opportunity-grid > a')) {
        element.style.setProperty('--reveal-delay', `${Math.min(Array.from(element.parentElement.children).indexOf(element), 2) * 90}ms`);
      }
      observer.observe(element);
    });
    document.body.classList.add('motion-ready');
    return () => {
      observer.disconnect();
      document.body.classList.remove('motion-ready');
      elements.forEach(element => { element.classList.remove('reveal', 'is-visible'); element.style.removeProperty('--reveal-delay'); });
    };
  }, [reduced]);
}

export function useHeroPointer() {
  const ref = useRef(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');
  useEffect(() => {
    const hero = ref.current;
    if (!hero || reduced || !finePointer) return;
    let frame;
    function move(event) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`);
        hero.style.setProperty('--pointer-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`);
        frame = undefined;
      });
    }
    hero.addEventListener('pointermove', move, { passive: true });
    return () => { hero.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, [reduced, finePointer]);
  return ref;
}
