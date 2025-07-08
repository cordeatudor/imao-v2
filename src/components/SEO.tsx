import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  metaPhrases?: string[];
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords = [], 
  image, 
  url,
  metaPhrases = [] 
}) => {
  const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop';
  const defaultUrl = 'https://imobiliarealtfel.ro';

  // Generate meta phrases if not provided
  const defaultMetaPhrases = [
    'Agenție imobiliară premium în Arad',
    'Experiență imobiliară diferită',
    'Servicii imobiliare personalizate',
    'Echipă multilingvă dedicată',
    'Consultanță imobiliară profesională'
  ];

  const allMetaPhrases = [...metaPhrases, ...defaultMetaPhrases];

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title} | Imobiliare Altfel</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Google Site Verification */}
      <meta name="google-site-verification" content="P2IYjQ_-5z4iB-cA0TaJt3fxxb26ecHyAEq4p3a21Gs" />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Meta phrases */}
      {allMetaPhrases.map((phrase, index) => (
        <meta key={index} name={`meta-phrase-${index + 1}`} content={phrase} />
      ))}

      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="ro" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Imobiliare Altfel" />
    </Helmet>
  );
};

export default SEO;