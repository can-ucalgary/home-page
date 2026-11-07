import { useMemo } from 'react';
import { useContent } from '../hooks/useContent.js';
import { useCategoryFilter } from '../hooks/useCategoryFilter.js';
import { contentURL, formatEventDate, messages, sortEvents } from '../lib/site.js';
import CategoryFilter from './CategoryFilter.jsx';
import ContentStatus from './ContentStatus.jsx';

export function EventCard({ event, directory = false }) {
  return (
    <article className={event.poster ? 'event-with-poster' : undefined}>
      {event.poster && <a className="event-poster-link" href={contentURL(event.poster)} target="_blank" rel="noopener" aria-label={`View poster / 查看海报: ${event.title}`}><img src={contentURL(event.poster)} alt={`${event.title} — 活动海报`} loading="lazy" /></a>}
      <div className="event-copy">
        <div className="event-meta"><span className="event-type">{event.category}</span>{event.date && <time className="event-date" dateTime={event.date}>{formatEventDate(event.date)}</time>}</div>
        <h3>{event.title}</h3><p>{event.description}</p>
      </div>
      {event.url && <a className="event-detail-link" href={contentURL(event.url, ['http:', 'https:', 'mailto:'])} aria-label={`Learn more: ${event.title}`}>{directory ? 'View details / 活动详情 ↗' : '↗'}</a>}
    </article>
  );
}

function EventDirectory({ events }) {
  const filter = useCategoryFilter(events);
  return <>
    <CategoryFilter id="events-filters" items={events} filter={filter} noun="events / 场活动" label="Event categories / 分类筛选" />
    <div id="event-items" className="event-directory" data-all-events="true" aria-busy="false">{filter.filtered.length ? filter.filtered.map(event => <EventCard key={event.url || event.title} event={event} directory />) : <ContentStatus>{messages.events.empty}</ContentStatus>}</div>
  </>;
}

export default function Events({ directory = false }) {
  const { data, loading, error } = useContent('events');
  const events = useMemo(() => data ? sortEvents(data) : [], [data]);
  if (!loading && !error && directory) return <EventDirectory events={events} />;
  return <div id="event-items" className={directory ? 'event-directory' : undefined} data-all-events={directory ? 'true' : undefined} aria-busy={loading}>
    {loading || error ? <ContentStatus>{messages.events[loading ? 'loading' : 'error']}</ContentStatus> : events.length ? events.slice(0, 3).map(event => <EventCard key={event.url || event.title} event={event} />) : <ContentStatus>{messages.events.empty}</ContentStatus>}
  </div>;
}
