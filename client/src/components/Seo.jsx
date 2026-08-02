import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ 
  title, 
  description, 
  url, 
  image = 'https://excode.in/excode.svg', // Default OG image
  type = 'website',
  structuredData
}) => {
  const siteTitle = title ? `${title} | excode` : 'excode - Interactive Development Arena';
  const siteDescription = description || 'excode is an AI-powered developer skill assessment platform and interactive coding arena. Build, test, and deploy code in sandboxed environments.';

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Canonical URL to prevent duplicate content issues */}
      {url && <link rel="canonical" href={`https://excode.in${url}`} />}

      {/* Open Graph (LinkedIn, Facebook, Slack previews) */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={`https://excode.in${url}`} />}
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default Seo;
