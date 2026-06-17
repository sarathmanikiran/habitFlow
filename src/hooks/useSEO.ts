import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
}

export function useSEO({ title, description, canonical, keywords, image, type }: SEOProps) {
  useEffect(() => {
    // Update Document Title
    const formattedTitle = title.includes('HabitFlow') ? title : `${title} | HabitFlow`;
    document.title = formattedTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords || "AI habit tracker, habit tracker for students, productivity app, self improvement app, streak tracker");

    // Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const currentCanonical = canonical || window.location.origin + window.location.pathname;
    canonicalLink.setAttribute('href', currentCanonical);

    // Update Open Graph and Twitter Tags dynamically
    const defaultImage = `${window.location.origin}/og-image.png`;
    const activeImage = image || defaultImage;

    const opengraphTags: Record<string, string> = {
      'og:title': formattedTitle,
      'og:description': description,
      'og:image': activeImage,
      'og:url': currentCanonical,
      'og:type': type || 'website',
      'twitter:title': formattedTitle,
      'twitter:description': description,
      'twitter:image': activeImage,
      'twitter:url': currentCanonical,
    };

    Object.entries(opengraphTags).forEach(([key, val]) => {
      const isOg = key.startsWith('og:');
      const attribute = isOg ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    });
  }, [title, description, canonical, keywords, image, type]);
}
