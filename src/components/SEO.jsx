import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * SEO Component to handle dynamic meta tags and structured data (JSON-LD)
 * @param {Object} props
 * @param {string} props.title - Page title (optional)
 * @param {string} props.description - Meta description (optional)
 * @param {string} props.path - Current path (optional)
 * @param {string} props.type - Page type: 'website' or 'article' (default: 'website')
 * @param {Object} props.structuredData - Additional JSON-LD data (optional)
 */
const SEO = ({
    title,
    description,
    path = '',
    type = 'website',
    structuredData = null
}) => {
    const { t, i18n } = useTranslation();

    const siteName = i18n.language === 'ko'
        ? '보내심을 받은 생명의소리 교회'
        : 'The Church of the Sent';

    const fullTitle = title
        ? `${title} | ${siteName}`
        : siteName;

    const defaultDescription = i18n.language === 'ko'
        ? '밴쿠버 랭리 "보내심을 받은 생명의소리 교회". 주일예배: 1부 1:00 PM(봉사자), 2부 2:00 PM(대예배). 성서적 기독교를 향해 나아가는 공동체입니다.'
        : 'The Church of the Sent in Langley. Sunday Service: 1:00 PM & 2:00 PM. A biblical Christian community.';

    const metaDescription = description || defaultDescription;
    const canonicalUrl = `https://thesentchurch.ca${path}`;

    // Base Structured Data (Organization/Church)
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Church",
        "@id": "https://thesentchurch.ca/#organization",
        "name": siteName,
        "url": "https://thesentchurch.ca/",
        "logo": {
            "@type": "ImageObject",
            "url": "https://thesentchurch.ca/images/church_logo.jpg"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "9025 Glover Road",
            "addressLocality": "Fort Langley",
            "addressRegion": "BC",
            "postalCode": "V1M 2R9",
            "addressCountry": "CA"
        },
        "telephone": "+1-604-315-7988"
    };

    // WebSite data with SearchBox (Crucial for Sitelinks)
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://thesentchurch.ca/#website",
        "url": "https://thesentchurch.ca/",
        "name": siteName,
        "publisher": { "@id": "https://thesentchurch.ca/#organization" },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://thesentchurch.ca/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    // Site Navigation Elements (Help Google understand the menu structure for Sitelinks)
    const navigationData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": t('nav.home') || (i18n.language === 'ko' ? '홈' : 'Home'),
                "url": "https://thesentchurch.ca/"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": t('nav.guide') || (i18n.language === 'ko' ? '교회안내' : 'About'),
                "url": "https://thesentchurch.ca/about"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": t('nav.sermons_word') || (i18n.language === 'ko' ? '설교와 말씀' : 'Sermons'),
                "url": "https://thesentchurch.ca/sermons"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 4,
                "name": t('nav.education') || (i18n.language === 'ko' ? '교육' : 'Education'),
                "url": "https://thesentchurch.ca/ministry"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 5,
                "name": t('nav.ministry') || (i18n.language === 'ko' ? '사역' : 'Ministry'),
                "url": "https://thesentchurch.ca/ministry/team"
            },
            {
                "@type": "SiteNavigationElement",
                "position": 6,
                "name": t('nav.news') || (i18n.language === 'ko' ? '교회소식' : 'News'),
                "url": "https://thesentchurch.ca/news"
            }
        ]
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={canonicalUrl} />
            <html lang={i18n.language} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:image" content="https://thesentchurch.ca/images/church_logo.jpg" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content="https://thesentchurch.ca/images/church_logo.jpg" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(navigationData)}
            </script>

            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
