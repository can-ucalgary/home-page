import SiteLayout from './components/SiteLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import BenefitsPage from './pages/BenefitsPage.jsx';

export default function App() {
  const page = document.body.dataset.page || 'home';
  const pages = { home: HomePage, events: EventsPage, benefits: BenefitsPage };
  const Page = pages[page] || HomePage;
  return <SiteLayout page={page}><Page /></SiteLayout>;
}
