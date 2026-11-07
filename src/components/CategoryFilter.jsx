import { categoryLabels } from '../lib/site.js';

export default function CategoryFilter({ id, items, filter, noun, label }) {
  return (
    <div className="directory-filters" id={id}>
      <p className="eyebrow">BROWSE BY CATEGORY / 按分类浏览</p>
      <div className="filter-options" role="group" aria-label={label}>
        {['', ...filter.categories].map(category => {
          const count = category ? items.filter(item => (item.category || 'OTHER') === category).length : items.length;
          return <button key={category} className="filter-button" type="button" data-category={category} aria-pressed={category === filter.active} onClick={() => filter.select(category)}>{category ? categoryLabels[category] || category : 'All / 全部'} ({count})</button>;
        })}
      </div>
      <p className="filter-result" role="status" aria-live="polite" aria-atomic="true">{`${filter.filtered.length} / ${items.length} ${noun} · ${filter.active ? categoryLabels[filter.active] || filter.active : 'All / 全部'}`}</p>
    </div>
  );
}
