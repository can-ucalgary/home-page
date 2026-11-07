import { siteURL } from '../lib/site.js';

const content = {
  events: {
    eyebrow: 'IN GOOD COMPANY / 校友活动',
    title: 'Find your next', emphasis: 'connection.',
    intro: 'Conversations, creativity, and a community to grow with.',
    introChinese: '从职业交流到艺术创作，找到属于你的下一场相遇。',
    contactTitle: 'Have an idea for our next gathering?',
    contactChinese: '欢迎分享活动创意，或与我们一起策划下一次相聚。',
    label: 'All events / 全部活动'
  },
  benefits: {
    eyebrow: 'MORE FROM YOUR COMMUNITY / 校友福利',
    title: 'More possibilities.', emphasis: 'More benefits.',
    intro: 'Your annual pass to a little more from your community.',
    introChinese: '探索年度折扣卡与合作商家优惠，发现身边更多好去处。',
    contactTitle: 'Have a question about the pass?',
    contactChinese: '想了解折扣卡或成为合作商家？欢迎联系我们。',
    label: 'Annual pass and offers / 年度折扣卡与商家优惠'
  }
};

export default function DirectoryLayout({ page, children }) {
  const copy = content[page];
  return <main id="main">
    <section className="directory-hero"><div className="container">
      <a className="breadcrumb" href={siteURL()}>← Home / 首页</a><p className="eyebrow">{copy.eyebrow}</p>
      <div className="directory-intro"><h1>{copy.title}<br /><em>{copy.emphasis}</em></h1><div><p>{copy.intro}</p><p lang="zh-Hans">{copy.introChinese}</p></div></div>
    </div></section>
    <section className="section container directory-content" aria-label={copy.label}>{children}</section>
    <aside className="container directory-contact"><div><h2>{copy.contactTitle}</h2><p lang="zh-Hans">{copy.contactChinese}</p></div><a className="button" href="mailto:can.ucalgary@gmail.com">Get in touch / 联系我们 ↗</a></aside>
  </main>;
}
