import { SiteConfig } from '@/types'

export function OrganizationSchema({ config, baseUrl }: { config: SiteConfig; baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.companyName,
    url: baseUrl,
    logo: `${baseUrl}${config.logo}`,
    description: config.description,
    address: { '@type': 'PostalAddress', streetAddress: config.address },
    contactPoint: { '@type': 'ContactPoint', telephone: config.hotline, contactType: 'customer service' },
    sameAs: [config.facebook, config.tiktok, config.youtube].filter(Boolean),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function LocalBusinessSchema({ config, baseUrl }: { config: SiteConfig; baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.companyName,
    image: `${baseUrl}${config.ogImage}`,
    telephone: config.hotline,
    email: config.email,
    address: { '@type': 'PostalAddress', streetAddress: config.address },
    openingHours: config.workingHours,
    url: baseUrl,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function WebsiteSchema({ config, baseUrl }: { config: SiteConfig; baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.companyName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbSchema({ items, baseUrl }: { items: { name: string; url: string }[]; baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ArticleSchema({ title, description, image, author, datePublished, dateModified, baseUrl }: {
  title: string; description: string; image: string; author: string; datePublished: string; dateModified: string; baseUrl: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image.startsWith('http') ? image : `${baseUrl}${image}`,
    author: { '@type': 'Person', name: author },
    datePublished,
    dateModified,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs.length) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProductSchema({ name, description, image, price, sku, baseUrl }: {
  name: string; description: string; image: string[]; price: number | null; sku: string; baseUrl: string
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image.length ? image : undefined,
    sku,
  }
  if (price !== null) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price,
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/san-pham/${sku}`,
    }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
