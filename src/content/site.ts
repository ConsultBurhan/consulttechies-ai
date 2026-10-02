// Single source of truth for brand + navigation copy.
// Contact details are intentionally empty: none were supplied. Fill them in and the Contact page and footer pick them up.
export const SITE = {
  name: 'Babji Consult Techies',
  short: 'BCT',
  product: 'Context',
  productFull: 'BCT Context',
  url: 'https://consulttechies.ai', // placeholder canonical host — update before launch
  founded: 2023,
  contact: { email: '', phone: '', linkedin: '' },
} as const

export const NAV = [
  { to: '/product', label: 'Product' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/technology', label: 'Technology' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export const SERVICES = [
  { title: 'Enterprise AI', body: 'Assistants, data integration, knowledge systems and business intelligence built around how your organization works.', tag: 'Flagship' },
  { title: 'Web Development', body: 'Modern websites and web applications that are fast, clear and built to grow.' },
  { title: 'Application Development', body: 'Custom software shaped by your business requirements, not the other way round.' },
  { title: 'CRM Solutions', body: 'CRM management and optimization, so customer information works as hard as your team does.' },
] as const
