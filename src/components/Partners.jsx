import { useState } from 'react';
import { useContent } from '../hooks/useContent.js';
import { contentURL, messages } from '../lib/site.js';
import Carousel from './Carousel.jsx';
import ContentStatus from './ContentStatus.jsx';

function PartnerCard({ partner }) {
  const [imageFailed, setImageFailed] = useState(false);
  const children = <>{imageFailed ? <span className="partner-name">{partner.name}</span> : <img src={contentURL(partner.logo)} alt={partner.name} loading="lazy" onError={() => setImageFailed(true)} />}<span className="partner-card-label">{partner.name}</span></>;
  return partner.url ? <a className="partner-card" href={contentURL(partner.url)}>{children}</a> : <div className="partner-card">{children}</div>;
}

export default function Partners() {
  const { data, loading, error } = useContent('partners');
  return <Carousel variant="partners" busy={loading}>
    {loading || error ? <ContentStatus>{messages.partners[loading ? 'loading' : 'error']}</ContentStatus> : data.length ? data.map(partner => <PartnerCard key={partner.name} partner={partner} />) : <ContentStatus>{messages.partners.empty}</ContentStatus>}
  </Carousel>;
}
