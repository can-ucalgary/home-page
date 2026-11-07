import { Children } from 'react';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll.js';

export default function Carousel({ variant, children, busy = false }) {
  const partners = variant === 'partners';
  const id = partners ? 'partner-items' : 'benefit-track';
  const { trackRef, bounds, move } = useHorizontalScroll(Children.count(children));
  const content = <>
    <div className="partner-toolbar">
      {partners ? <span>OUR COMMUNITY PARTNERS <span lang="zh-Hans">合作伙伴</span></span> : <span>PARTNER OFFERS / 商家优惠</span>}
      <div className="partner-controls">
        <button type="button" id={partners ? 'partners-prev' : undefined} aria-label={partners ? 'Previous partners / 上一组合作伙伴' : 'Previous offers / 上一组优惠'} aria-controls={id} disabled={bounds.start} onClick={() => move(-1)}>←</button>
        <button type="button" id={partners ? 'partners-next' : undefined} aria-label={partners ? 'Next partners / 下一组合作伙伴' : 'Next offers / 下一组优惠'} aria-controls={id} disabled={bounds.end} onClick={() => move(1)}>→</button>
      </div>
    </div>
    <div id={id} className={partners ? 'partner-track' : 'benefit-grid benefit-track'} ref={trackRef} role="region" aria-label={partners ? 'Community partners — scroll horizontally / 合作伙伴，可横向滚动' : 'Merchant offers — scroll horizontally / 商家优惠，可横向滚动'} tabIndex={0} aria-busy={partners ? busy : undefined}>{children}</div>
  </>;
  return partners ? <div className="partner-carousel">{content}</div> : content;
}
