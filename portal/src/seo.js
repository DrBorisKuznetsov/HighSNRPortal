export const siteOrigin = 'https://highsnr.org';

export const defaultSocialImage = {
  path: '/social-preview.png',
  width: 1200,
  height: 627,
  alt: 'HighSNR Lab portal preview with research, tools, publications, and videos.',
};

export function getPageTitle(metadata) {
  return metadata.title === 'HighSNR Lab' ? metadata.title : `${metadata.title} | HighSNR Lab`;
}

export function getCanonicalUrl(metadata) {
  const canonicalPath = metadata.canonicalPath ?? metadata.path ?? '/';
  return `${siteOrigin}${canonicalPath === '/' ? '/' : `${canonicalPath}/`}`;
}

export function getRobotsContent(metadata) {
  if (!metadata.noIndex) return 'index, follow';
  return `noindex, ${metadata.noFollow ? 'nofollow' : 'follow'}`;
}

export function getSocialImage(metadata) {
  return {
    url: `${siteOrigin}${metadata.image ?? defaultSocialImage.path}`,
    width: metadata.imageWidth ?? defaultSocialImage.width,
    height: metadata.imageHeight ?? defaultSocialImage.height,
    alt: metadata.imageAlt ?? defaultSocialImage.alt,
  };
}

export function buildStructuredData(metadata) {
  const url = getCanonicalUrl(metadata);
  const title = getPageTitle(metadata);
  const socialImage = getSocialImage(metadata);
  const organizationId = `${siteOrigin}/#organization`;
  const websiteId = `${siteOrigin}/#website`;
  const pageId = `${url}#webpage`;
  const page = {
    '@type': metadata.schemaType ?? 'WebPage',
    '@id': pageId,
    url,
    name: title,
    description: metadata.description,
    isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
    inLanguage: 'en',
  };

  if (metadata.schemaType === 'TechArticle') {
    Object.assign(page, {
      headline: metadata.title,
      author: {
        '@type': 'Person',
        name: metadata.author ?? 'Boris Kuznetsov',
        url: `${siteOrigin}/about`,
      },
      image: socialImage.url,
      mainEntityOfPage: { '@id': pageId },
      datePublished: metadata.datePublished,
      dateModified: metadata.dateModified ?? metadata.datePublished,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'HighSNR Lab',
        url: `${siteOrigin}/`,
        founder: {
          '@type': 'Person',
          name: 'Boris Kuznetsov',
          url: `${siteOrigin}/about`,
        },
        sameAs: [
          'https://github.com/DrBorisKuznetsov',
          'https://www.youtube.com/@High_SNR_Channel',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${siteOrigin}/`,
        name: 'HighSNR Lab',
        publisher: { '@id': organizationId },
        inLanguage: 'en',
      },
      page,
    ],
  };
}
