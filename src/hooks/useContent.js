import { useEffect, useState } from 'react';
import { contentURL, siteURL } from '../lib/site.js';

function validate(name, data) {
  const text = value => typeof value === 'string' && value.trim().length > 0;
  if (name === 'benefits') {
    if (!data?.pass || !Array.isArray(data.merchants)) throw new Error('Invalid benefits data');
    const { pass } = data;
    if (![pass.title, pass.description, pass.instructions, pass.image, pass.purchaseUrl].every(text) || !Array.isArray(pass.eligibility) || !pass.eligibility.every(text)) throw new Error('Invalid pass');
    contentURL(pass.image);
    contentURL(pass.purchaseUrl);
    for (const merchant of data.merchants) {
      if (![merchant.name, merchant.discount, merchant.image].every(text)) throw new Error('Invalid merchant');
      contentURL(merchant.image);
      if (merchant.website || merchant.mapUrl) contentURL(merchant.website || merchant.mapUrl);
    }
  } else {
    if (!Array.isArray(data)) throw new Error(`Invalid ${name} data`);
    if (name === 'events') {
      for (const event of data) {
        if (![event.title, event.category, event.description].every(text) || (event.date && !Number.isFinite(Date.parse(event.date)))) throw new Error('Invalid event');
        if (event.url) contentURL(event.url, ['http:', 'https:', 'mailto:']);
        if (event.poster) contentURL(event.poster);
      }
    }
    if (name === 'partners') {
      for (const partner of data) {
        if (!text(partner.name) || !text(partner.logo)) throw new Error('Invalid partner');
        contentURL(partner.logo);
        if (partner.url) contentURL(partner.url);
      }
    }
  }
  return data;
}

export function useContent(name) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(siteURL(`data/${name}.json`), { signal: controller.signal });
        if (!response.ok) throw new Error(`Could not load ${name}: ${response.status}`);
        const data = validate(name, await response.json());
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      } catch (error) {
        if (!controller.signal.aborted) setState({ data: null, loading: false, error });
      }
    }
    load();
    return () => controller.abort();
  }, [name]);
  return state;
}
