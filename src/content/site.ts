// Single source of truth for brand + navigation copy.
export const SITE = {
  name: 'Babji Consult Techies',
  short: 'BCT',
  product: 'Context',
  productFull: 'BCT Context',
  url: 'https://consulttechies.ai', // placeholder canonical host — update before launch
  founded: 2023,
  contact: { email: 'info@consulttechies.com', phone: '+916375652153', linkedin: '' },
  offices: [
    { name: 'Head office', country: 'India', lines: ['Mangalam Complex, 6th Floor, Office No. 613,', 'Durga Nursery Road, Udaipur,', 'Rajasthan, India'] },
    { name: 'USA office', country: 'United States', lines: ['5900 Balcones Drive, Suite 100,', 'Austin, TX 78731,', 'United States'] },
  ],
} as const

export const NAV = [
  { to: '/product', label: 'Product' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/technology', label: 'Technology' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

export const SERVICES = [
  { title: 'Enterprise AI assistants', body: 'Assistants that answer from your own data, documents and systems, built around how your organization works.', tag: 'Flagship' },
  { title: 'Data integration', body: 'Secure connections to databases, files and business systems, so every answer starts from the source.' },
  { title: 'Knowledge systems', body: 'Your documents and institutional knowledge, organized so people can simply ask.' },
  { title: 'Business intelligence', body: 'Analysis, forecasts and reports generated on request, with the evidence behind them.' },
] as const
