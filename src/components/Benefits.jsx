import { useState } from 'react';
import { useContent } from '../hooks/useContent.js';
import { useCategoryFilter } from '../hooks/useCategoryFilter.js';
import { contentURL, messages } from '../lib/site.js';
import CategoryFilter from './CategoryFilter.jsx';
import Carousel from './Carousel.jsx';
import ContentStatus from './ContentStatus.jsx';

export function PassOverview({ pass }) {
  return <div className="pass-overview">
    <img src={contentURL(pass.image)} alt={pass.title} loading="lazy" />
    <div className="pass-copy">
      <p className="eyebrow">{pass.year} ANNUAL PASS / 年度折扣卡</p><h3>{pass.title}</h3><p>{pass.description}</p>
      <p className="pass-validity">有效期 / Valid: {pass.validFrom} — {pass.validUntil}</p>
      <a className="button" href={contentURL(pass.purchaseUrl)}>Get the {pass.year} pass / 购买折扣卡 ↗</a>
      <details className="pass-details"><summary>使用方式与适用人群 / How to use & eligibility</summary><p>{pass.instructions}</p><ul>{pass.eligibility.map(group => <li key={group}>{group}</li>)}</ul></details>
    </div>
  </div>;
}

export function BenefitCard({ merchant }) {
  const [imageFailed, setImageFailed] = useState(false);
  const url = merchant.website || merchant.mapUrl;
  return <article className="benefit-card">
    <img src={contentURL(merchant.image)} alt={merchant.name} loading="lazy" hidden={imageFailed} onError={() => setImageFailed(true)} />
    <div className="benefit-card-copy">
      <p className="benefit-discount">{merchant.discount}</p><h3>{merchant.name}</h3>
      {merchant.address && <p className="benefit-address">{merchant.address}</p>}
      {merchant.wechat && <p className="benefit-address">WeChat / 微信: {merchant.wechat}</p>}
      {url && <a className="text-link" href={contentURL(url)} aria-label={`${merchant.name} — ${merchant.website ? 'website' : 'map'}`}>{merchant.website ? 'Visit website / 网站 ↗' : 'View map / 地图 ↗'}</a>}
    </div>
  </article>;
}

function BenefitListing({ merchants, carousel }) {
  if (!merchants.length) return <ContentStatus>{messages.benefits.empty}</ContentStatus>;
  const cards = merchants.map(merchant => <BenefitCard key={merchant.name} merchant={merchant} />);
  return carousel ? <Carousel variant="benefits">{cards}</Carousel> : <div className="benefit-grid">{cards}</div>;
}

function BenefitDirectory({ data }) {
  const filter = useCategoryFilter(data.merchants);
  return <><PassOverview pass={data.pass} /><CategoryFilter id="benefits-filters" items={data.merchants} filter={filter} noun="offers / 家商户" label="Benefit categories / 分类筛选" /><div className="benefit-listing"><BenefitListing merchants={filter.filtered} /></div></>;
}

export default function Benefits({ directory = false }) {
  const { data, loading, error } = useContent('benefits');
  return <div id="benefit-items" data-benefit-carousel={!directory ? 'true' : undefined} aria-busy={loading}>
    {loading || error ? <ContentStatus>{messages.benefits[loading ? 'loading' : 'error']}</ContentStatus> : directory ? <BenefitDirectory data={data} /> : <><PassOverview pass={data.pass} /><div className="benefit-listing"><BenefitListing merchants={data.merchants} carousel /></div></>}
  </div>;
}
