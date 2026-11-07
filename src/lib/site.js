// HTML entrypoints declare their path back to the site root. This also works
// beneath a GitHub Pages repository prefix, without a router or server fallback.
const siteRoot = new URL(document.documentElement.dataset.siteRoot || './', window.location.href);

export function siteURL(value = '') {
  return new URL(value, siteRoot).href;
}

export function contentURL(value, protocols = ['http:', 'https:']) {
  const url = new URL(value, siteRoot);
  if (!protocols.includes(url.protocol)) throw new Error('Unsupported content URL');
  return url.href;
}

export function sortEvents(events) {
  const timestamp = event => event.date ? Date.parse(event.date) : -Infinity;
  return events.slice().sort((left, right) => {
    const a = timestamp(left), b = timestamp(right);
    return a === b ? 0 : b - a;
  });
}

export function formatEventDate(date) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
  }).format(new Date(date));
}

export const categoryLabels = {
  'CAREER & CONNECTION': 'Career & connection / 职业交流',
  'PERSONAL FINANCE': 'Personal finance / 个人理财',
  'COMMUNITY & CONNECTION': 'Community & connection / 社交互动',
  'BAKERY & DESSERTS': 'Bakery & desserts / 烘焙甜点',
  DINING: 'Dining / 餐饮',
  'MEAL DELIVERY': 'Meal delivery / 餐食配送',
  SHOPPING: 'Shopping / 购物',
  'HEALTH & WELLNESS': 'Health & wellness / 健康养生'
};

export const messages = {
  events: {
    loading: 'Loading events… / 正在加载活动',
    empty: 'New events are on the way. / 更多活动敬请期待。',
    error: 'Events are temporarily unavailable. Please contact CAN below. / 活动暂时无法加载，请通过下方链接联系我们。'
  },
  partners: {
    loading: 'Loading partners… / 正在加载合作伙伴',
    empty: 'More community connections coming soon. / 更多合作伙伴敬请期待。',
    error: 'Partners are temporarily unavailable. Please contact CAN for resources. / 合作伙伴暂时无法加载，欢迎联系我们。'
  },
  benefits: {
    loading: 'Loading benefits… / 正在加载福利',
    empty: 'Partner offers will be added here. / 商家优惠即将更新。',
    error: 'Benefits are temporarily unavailable. Please contact CAN. / 福利暂时无法加载，欢迎联系我们。'
  }
};
