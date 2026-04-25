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
        : `${siteName} | 밴쿠버 랭리 한인교회`;

    // Include service times in default description for better snippet appearance
    const defaultDescription = i18n.language === 'ko'
        ? '밴쿠버 랭리 "보내심을 받은 생명의소리 교회". 주일예배: 1부 1:00 PM, 2부 2:00 PM. 성서적 기독교를 향해 나아가는 공동체입니다.'
        : 'The Church of the Sent in Langley, Vancouver. Sunday Service: 1:00 PM & 2:00 PM. A biblical Christian community.';

    const metaDescription = description || defaultDescription;
    const baseUrl = "https://thesentchurch.ca";
    const canonicalUrl = `${baseUrl}${path}`;

    // Base Structured Data (Organization/Church)
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Church",
        "@id": `${baseUrl}/#organization`,
        "name": siteName,
        "url": baseUrl + "/",
        "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/images/church_logo.jpg`
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "9025 Glover Road",
            "addressLocality": "Fort Langley",
            "addressRegion": "BC",
            "postalCode": "V1M 2R9",
            "addressCountry": "CA"
        },
        "telephone": "+1-604-315-7988",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": "13:00",
                "closes": "16:00"
            }
        ]
    };

    // WebSite data with SearchBox (Crucial for Sitelinks)
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl + "/",
        "name": siteName,
        "publisher": { "@id": `${baseUrl}/#organization` },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // BreadcrumbList (Helps Google show the hierarchy and sitelinks)
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": i18n.language === 'ko' ? '홈' : 'Home',
                "item": baseUrl + "/"
            }
        ]
    };

    if (path && path !== '/') {
        const segments = path.split('/').filter(Boolean);
        segments.forEach((segment, index) => {
            breadcrumbData.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": segment.charAt(0).toUpperCase() + segment.slice(1),
                "item": `${baseUrl}/${segments.slice(0, index + 1).join('/')}`
            });
        });
    }

    // Site Navigation Elements
    const navigationData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Main Navigation",
        "itemListElement": [
            {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": t('nav.guide') || (i18n.language === 'ko' ? '교회안내' : 'About'),
                "url": `${baseUrl}/about`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": t('nav.sermons_word') || (i18n.language === 'ko' ? '설교와 말씀' : 'Sermons'),
                "url": `${baseUrl}/sermons`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": t('nav.news') || (i18n.language === 'ko' ? '주보' : 'Bulletin'),
                "url": `${baseUrl}/news/bulletin`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 4,
                "name": t('nav.calendar') || (i18n.language === 'ko' ? '교회일정' : 'Calendar'),
                "url": `${baseUrl}/news/calendar`
            },
            {
                "@type": "SiteNavigationElement",
                "position": 5,
                "name": t('nav.gallery') || (i18n.language === 'ko' ? '갤러리' : 'Gallery'),
                "url": `${baseUrl}/news/gallery`
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
            <meta property="og:image" content={`${baseUrl}/images/church_logo.jpg`} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={`${baseUrl}/images/church_logo.jpg`} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbData)}
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
