import React, { useEffect } from 'react';
import MinistryNav from '../components/MinistryNav';
import { dbService } from '../services/dbService';
import churchData from '../data/church_data.json';
import { useTranslation } from 'react-i18next';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { useSiteConfigValue } from '../context/SiteConfigContext';

const Ministry = () => {
    const { t, i18n } = useTranslation();
    const { config, loading } = useSiteConfigValue();
    const location = useLocation();

    // Derived values from global config
    const headerBanner = config.ministryBanner || "/images/ministry_banner.jpg";
    const height = config.ministryHeight || "medium";
    const bannerFit = config.ministryBannerFit || "cover";
    const overlayOpacity = config.ministryOverlayOpacity !== undefined ? config.ministryOverlayOpacity : 40;

    const isEn = i18n.language === 'en' || i18n.language.startsWith('en-');
    const title = isEn && config.ministryTitleEn ? config.ministryTitleEn : (config.ministryTitle || "");
    const subtitle = isEn && config.ministrySubtitleEn ? config.ministrySubtitleEn : (config.ministrySubtitle || "");

    const titleFont = config.ministryTitleFont || "font-sans";
    const subtitleFont = config.ministrySubtitleFont || "font-sans";
    const titleColor = config.ministryTitleColor || "#ffffff";
    const subtitleColor = config.ministrySubtitleColor || "#ffffff";
    const titleItalic = config.ministryTitleItalic !== undefined ? config.ministryTitleItalic : false;
    const subtitleItalic = config.ministrySubtitleItalic !== undefined ? config.ministrySubtitleItalic : true;
    const titleWeight = config.ministryTitleWeight || "font-bold";
    const subtitleWeight = config.ministrySubtitleWeight || "font-medium";
    const titleSize = config.ministryTitleSize || 48;
    const subtitleSize = config.ministrySubtitleSize || 18;

    const siteConfig = config; // Keep naming for compatibility in JSX

    // Helper to filter items based on path
    const getFilteredItems = (items) => {
        const currentPath = location.pathname.split('/').pop();
        if (currentPath === 'ministry') {
            return items.filter(m => ['tsc', 'tsy'].includes(m.id));
        } else if (currentPath === 'mission') {
            return items.filter(m => m.id === 'mission_evangelism');
        }
        return items;
    };

    const currentItems = config.ministryItems || churchData.ministries;
    const ministryList = getFilteredItems(currentItems.map(m => ({
        ...m,
        name: i18n.language === 'en' && m.nameEn ? m.nameEn : m.name,
        target: i18n.language === 'en' && m.targetEn ? m.targetEn : m.target,
        description: i18n.language === 'en' && m.descriptionEn ? m.descriptionEn : m.description,
        detail: i18n.language === 'en' && m.detailEn ? m.detailEn : m.detail
    })));

    const formatDetail = (text) => {
        if (!text) return null;
        return (
            <div className="mt-8 pt-6 border-t border-gray-100 text-gray-700 space-y-6 animate-fade-in text-lg leading-[2.5]">
                {text.split('\n\n').map((paragraph, i) => (
                    <div key={i}>
                        {paragraph.split('\n').map((line, j) => {
                            const isHeader = /^\s*(대상|사역\s*표어|사역\s*비전|Target|Motto|Vision|\[?Our\s*Theme\]?)/i.test(line);
                            return (
                                <div key={j} className={clsx(isHeader && j > 0 && "mt-8", "block")}>
                                    {line.split(/(\*\*.*?\*\*|대상|사역\s*표어|사역\s*비전|Target|Motto|Vision|Our\s*Theme)/i).map((part, k) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={k}>{part.slice(2, -2)}</strong>;
                                        }
                                        if (/^(대상|사역\s*표어|사역\s*비전|Target|Motto|Vision|Our\s*Theme)$/i.test(part)) {
                                            return <span key={k} className="font-bold text-primary text-xl">{part}</span>;
                                        }
                                        return part;
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        // Scroll to section based on URL path (e.g. /ministry/tsc)
        const path = location.pathname.split('/').pop();
        const pathMap = {
            'ministry': 'nextgen',
            'tee': 'tee',
            'team': 'team_ministry',
            'mission': 'mission_evangelism',
            'prayer': 'prayer'
        };
        const targetId = pathMap[path] || 'nextgen';

        if (path && (path === 'tsc' || path === 'tsy' || path === 'mission' || path === 'tee' || path === 'team')) {
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }, [location.pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#efebe9]">
            {/* Header with Banner */}
            <div className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-screen" :
                    height === 'large' ? "h-[85vh]" :
                        height === 'medium' ? "h-[75vh]" :
                            "h-[50vh]"
            )}>
                <div className={clsx(
                    "absolute inset-0 z-0 pointer-events-none",
                    headerBanner?.includes('drive.google.com') && "hero-video-mask"
                )}>
                    {isVideo(headerBanner) ? (
                        getYoutubeId(headerBanner) ? (
                            <div className="absolute inset-0 w-full h-full">
                                <iframe
                                    className={clsx(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans pointer-events-none transition-all duration-700 opacity-80",
                                        bannerFit === 'contain' ? "w-full h-full object-contain" : "w-[115%] h-[115%] min-w-full min-h-full object-cover"
                                    )}
                                    src={`https://www.youtube.com/embed/${getYoutubeId(headerBanner)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(headerBanner)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(headerBanner)}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    title="Background Video"
                                ></iframe>
                            </div>
                        ) : (
                            <video
                                key={headerBanner}
                                src={headerBanner.includes('drive.google.com') ? dbService.formatDriveVideo(headerBanner) : headerBanner}
                                className={clsx(
                                    "w-full h-full transition-all duration-700",
                                    bannerFit === 'contain' ? "object-contain" : "object-cover"
                                )}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        )
                    ) : (
                        <img
                            src={headerBanner}
                            alt="Ministry Banner"
                            className={clsx(
                                "w-full h-full transition-all duration-700",
                                bannerFit === 'contain' ? "object-contain" : "object-cover"
                            )}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                        />
                    )}
                    <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
                    <div
                        className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"
                        style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                    />
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className={clsx(
                        "mb-8 animate-fade-in-up break-keep",
                        titleWeight,
                        titleFont,
                        titleItalic && "italic"
                    )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {title || t('ministry.title')}
                    </h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "5rem" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1.5 bg-accent mx-auto mb-8 rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={clsx(
                            "max-w-2xl mx-auto",
                            "animate-fade-in-up delay-100",
                            subtitleWeight,
                            subtitleFont,
                            subtitleItalic && "italic"
                        )}
                        style={{
                            color: subtitleColor,
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {subtitle || t('ministry.subtitle')}
                    </motion.p>
                </div>
            </div>

            {/* Quick Menu Nav */}
            <div className="container mx-auto px-4 mt-12">
                <MinistryNav
                    active={location.pathname.includes('/tee') ? 'tee' : (location.pathname.includes('/team') ? 'team_ministry' : (location.pathname.includes('/mission') ? 'mission_evangelism' : 'nextgen'))}
                    category={(location.pathname.includes('/team') || location.pathname.includes('/mission')) ? 'ministry' : 'education'}
                />
            </div>

            {/* Sunday School Introduction Section */}
            <div className="bg-white pb-32 pt-32">
                <div className="max-w-4xl mx-auto text-center px-4">
                    {/* Desktop Version: Keep as is */}
                    {/* Desktop & Default Korean Title (siteConfig prioritized) */}
                    <h2 className="hidden md:block text-2xl md:text-3xl font-black text-blue-900 mb-6 leading-relaxed whitespace-pre-line break-keep">
                        {i18n.language === 'en'
                            ? t('ministry.sunday_school_title')
                            : (siteConfig?.sundaySchoolTitle || t('ministry.sunday_school_title'))}
                    </h2>
                    {/* Mobile Title: Same as desktop source but may have separate styling */}
                    <h2
                        className="block md:hidden text-xl font-bold text-blue-900 mb-6 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: i18n.language === 'en'
                                ? t('ministry.sunday_school_title').replace(/\n/g, '<br/>')
                                : (siteConfig?.sundaySchoolTitle || t('ministry.sunday_school_title')).replace(/\n/g, '<br/>')
                        }}
                    />

                    {/* Description Section */}
                    {i18n.language === 'en' ? (
                        (siteConfig?.sundaySchoolDescriptionEn || t('ministry.sunday_school_description')) && (
                            <p
                                className="text-lg md:text-xl text-gray-600 font-medium leading-[2] break-keep whitespace-pre-line mb-8"
                                dangerouslySetInnerHTML={{ __html: siteConfig?.sundaySchoolDescriptionEn || t('ministry.sunday_school_description') }}
                            />
                        )
                    ) : (
                        <>
                            {/* Desktop Korean Description */}
                            <p className="hidden md:block text-lg md:text-xl text-gray-600 font-medium leading-[1.8] break-keep whitespace-pre-line mb-8">
                                {siteConfig?.sundaySchoolDescription || t('ministry.sunday_school_description')}
                            </p>
                            {/* Mobile Korean Description (with requested line breaks) */}
                            <p
                                className="block md:hidden text-lg text-gray-600 font-medium leading-[2] mb-8"
                                dangerouslySetInnerHTML={{
                                    __html: siteConfig?.sundaySchoolDescription
                                        ? siteConfig.sundaySchoolDescription.replace(/\n/g, '<br/>')
                                        : t('ministry.sunday_school_desc_mobile')
                                }}
                            />
                        </>
                    )}
                    <p
                        className="text-base md:text-lg text-gray-500 font-medium italic leading-[2] break-keep whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                            __html: i18n.language === 'en'
                                ? (siteConfig?.sundaySchoolSubtitleEn || t('ministry.subtitle_verse'))
                                : (window.innerWidth < 768
                                    ? `"${siteConfig?.sundaySchoolSubtitle || t('ministry.sunday_school_subtitle_mobile') || t('ministry.sunday_school_subtitle')}"`
                                    : `"${siteConfig?.sundaySchoolSubtitle || t('ministry.sunday_school_subtitle')}"`)
                        }}
                    />
                </div>
            </div>

            <div className="w-full">
                <div className="flex flex-col">

                    {ministryList.map((ministry, index) => {
                        const isEn = i18n.language === 'en';

                        // Translation Helper
                        const getTranslation = (dbVal, dbEnVal, i18nKey) => {
                            if (isEn) {
                                if (dbEnVal && !dbEnVal.toLowerCase().includes("built on prayer")) return dbEnVal;
                                const translated = t(i18nKey);
                                if (translated !== i18nKey) return translated;
                                return (dbVal && dbVal.toLowerCase().includes("built on prayer")) ? "" : (dbVal || '');
                            }
                            return dbVal || t(i18nKey);
                        };

                        const displayName = getTranslation(ministry.name, ministry.nameEn, `ministry.${ministry.id}_name`);
                        const displayTarget = getTranslation(ministry.target, ministry.targetEn, `ministry.${ministry.id}_target`);
                        const displayDesc = getTranslation(ministry.description, ministry.descriptionEn, `ministry.${ministry.id}_desc`);
                        const displayDetail = getTranslation(ministry.detail, ministry.detailEn, `ministry.${ministry.id}_detail`);

                        // Check if this section should have the brown background
                        // IDs: 'team_ministry', 'mission_evangelism', 'prayer', 'tsc', 'tsy'
                        const isBrownBg = ['team_ministry', 'mission_evangelism', 'prayer', 'tsc', 'tsy'].includes(ministry.id);

                        return (
                            <div
                                key={ministry.id}
                                id={ministry.id}
                                className={clsx(
                                    "w-full py-24 scroll-mt-[60px]",
                                    isBrownBg ? "bg-[#efebe9]" : "bg-white"
                                )}
                            >
                                <div className="container mx-auto px-6 max-w-6xl">
                                    <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-start`}>
                                        {/* Image Section */}
                                        <div className="w-full lg:w-1/2">
                                            <div className={clsx(
                                                "aspect-video rounded-2xl overflow-hidden shadow-2xl relative group",
                                                isBrownBg && "ring-4 ring-white/50"
                                            )}>
                                                <div className={`absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500`} />
                                                <img
                                                    src={ministry.image}
                                                    alt={displayName}
                                                    referrerPolicy="no-referrer"
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 sepia-[.15] saturate-[.85] contrast-[1.10] brightness-[1.05]"
                                                />
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="w-full lg:w-1/2 space-y-8">
                                            <div>
                                                <div className={clsx(
                                                    "inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4 shadow-sm",
                                                    "bg-green-50 border border-green-200 text-green-600"
                                                )}>
                                                    {displayTarget}
                                                </div>
                                                <h2 className={clsx(
                                                    "text-3xl md:text-4xl font-black tracking-tight mb-6",
                                                    isBrownBg ? "text-blue-900" : "text-gray-900"
                                                )}>
                                                    {displayName}
                                                </h2>
                                                <div className={clsx(
                                                    "w-20 h-1.5 rounded-full",
                                                    (isBrownBg && !['tsc', 'tsy'].includes(ministry.id)) ? "bg-[#8d6e63]" : "bg-accent"
                                                )} />
                                            </div>

                                            <p className={clsx(
                                                "text-lg md:text-xl leading-relaxed font-medium",
                                                isBrownBg ? "text-stone-600" : "text-gray-600"
                                            )}>
                                                {displayDesc}
                                            </p>

                                            <div className="pt-2">
                                                {displayDetail ? formatDetail(displayDetail) : (
                                                    <div className={clsx(
                                                        "p-6 rounded-2xl border border-dashed flex items-center justify-center min-h-[100px]",
                                                        isBrownBg ? "bg-white/50 border-stone-300 text-stone-500" : "bg-gray-50 border-gray-200 text-gray-400"
                                                    )}>
                                                        <span className="italic font-medium">{t('home.no_content_yet')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default Ministry;
