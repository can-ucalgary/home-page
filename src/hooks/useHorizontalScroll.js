import { useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery } from './useMotion.js';

export function useHorizontalScroll(itemCount) {
  const trackRef = useRef(null);
  const [bounds, setBounds] = useState({ start: true, end: true });
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function update() {
      const start = track.scrollLeft <= 1;
      const end = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
      setBounds(previous => previous.start === start && previous.end === end ? previous : { start, end });
    }
    update();
    track.addEventListener('scroll', update, { passive: true });
    const observer = 'ResizeObserver' in window ? new ResizeObserver(update) : null;
    observer?.observe(track);
    if (!observer) window.addEventListener('resize', update);
    return () => { track.removeEventListener('scroll', update); observer?.disconnect(); window.removeEventListener('resize', update); };
  }, [itemCount]);
  function move(direction) {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: reduced ? 'instant' : 'smooth' });
  }
  return { trackRef, bounds, move };
}
