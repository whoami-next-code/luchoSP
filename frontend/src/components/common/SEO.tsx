import Head from 'next/head';
import { SEOProps } from '@/types';

export default function SEO({
  title = 'Industria SP - Soluciones Industriales de Vanguardia',
  description = 'Líderes en soluciones industriales con más de 15 años de experiencia. Especialistas en automatización, maquinaria pesada y servicios técnicos.',
  keywords = [
    'industria',
    'automatización',
    'maquinaria',
    'soluciones industriales',
    'servicios técnicos',
    'Venezuela',
  ],
  image = '/images/og-image.jpg',
  url = 'https://industria-sp.com',
  type = 'website',
  locale = 'es_VE',
  siteName = 'Industria SP',
  author = 'Industria SP',
  robots = 'index, follow',
  canonicalUrl,
  structuredData,
}: SEOProps) {
  const siteUrl = 'https://industria-sp.com';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullCanonicalUrl = canonicalUrl || `${siteUrl}${url}`;

  // Schema markup por defecto
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    description,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: fullImageUrl,
    telephone: '+58-212-123-4567',
    email: 'info@industria-sp.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Principal Industrial',
      addressLocality: 'Caracas',
      addressRegion: 'Distrito Capital',
      postalCode: '1010',
      addressCountry: 'VE',
    },
    sameAs: [
      'https://www.facebook.com/industriaSP',
      'https://www.linkedin.com/company/industria-sp',
      'https://www.instagram.com/industriaSP',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+58-212-123-4567',
      contactType: 'customer service',
      areaServed: 'VE',
      availableLanguage: 'Spanish',
    },
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@industriaSP" />
      <meta name="twitter:creator" content="@industriaSP" />

      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="Spanish" />
      <meta name="geo.region" content="VE-A" />
      <meta name="geo.placename" content="Caracas" />
      <meta name="geo.position" content="10.4806;-66.9036" />
      <meta name="ICBM" content="10.4806, -66.9036" />

      {/* Dublin Core Meta Tags */}
      <meta name="DC.title" content={title} />
      <meta name="DC.creator" content={author} />
      <meta name="DC.description" content={description} />
      <meta name="DC.publisher" content={siteName} />
      <meta name="DC.date" content={new Date().toISOString()} />
      <meta name="DC.type" content={type} />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.language" content="es" />
      <meta name="DC.coverage" content="Venezuela" />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: siteUrl,
              },
            ],
          }),
        }}
      />

      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            url: siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/search?q={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: siteName,
            description,
            image: fullImageUrl,
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Av. Principal Industrial',
              addressLocality: 'Caracas',
              addressRegion: 'Distrito Capital',
              postalCode: '1010',
              addressCountry: 'VE',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 10.4806,
              longitude: -66.9036,
            },
            telephone: '+58-212-123-4567',
            openingHours: [
              'Mo-Fr 08:00-18:00',
              'Sa 08:00-12:00',
            ],
            priceRange: '$$',
          }),
        }}
      />

      {/* Favicon and Apple Touch Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="theme-color" content="#ffffff" />

      {/* Alternate Languages */}
      <link rel="alternate" hrefLang="es-VE" href={siteUrl} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />
    </Head>
  );
}
