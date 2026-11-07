import { useEffect, useMemo, useState } from 'react';

export function useCategoryFilter(items) {
  const categories = useMemo(() => [...new Set(items.map(item => item.category || 'OTHER'))], [items]);
  const [requested, setRequested] = useState(() => new URL(window.location.href).searchParams.get('category') || '');
  const active = categories.includes(requested) ? requested : '';
  const filtered = active ? items.filter(item => (item.category || 'OTHER') === active) : items;

  useEffect(() => {
    function restore() { setRequested(new URL(window.location.href).searchParams.get('category') || ''); }
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);

  function select(category) {
    if (category === active) return;
    const url = new URL(window.location.href);
    if (category) url.searchParams.set('category', category);
    else url.searchParams.delete('category');
    window.history.pushState(null, '', url);
    setRequested(category);
  }
  return { categories, active, filtered, select };
}
