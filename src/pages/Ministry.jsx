import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import churchData from '../data/church_data.json';
import { useTranslation } from 'react-i18next';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Ministry = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [headerBanner, setHeaderBanner] = useState("/images/ministry_banner.jpg");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [titleFont, setTitleFont] = useState("font-sans");
    const [subtitleFont, setSubtitleFont] = useState("font-sans");
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [subtitleColor, setSubtitleColor] = useState("#ffffff");
    const [titleItalic, setTitleItalic] = useState(false);
    const [subtitleItalic, setSubtitleItalic] = useState(true);
    const [titleWeight, setTitleWeight] = useState("font-bold");
    const [subtitleWeight, setSubtitleWeight] = useState("font-medium");
    const [titleSize, setTitleSize] = useState(48);
    const [subtitleSize, setSubtitleSize] = useState(18);
    const [overlayOpacity, setOverlayOpacity] = useState(40);
    const [height, setHeight] = useState("medium");
    const [expandedSection, setExpandedSection] = useState(null);
    const [ministryList, setMinistryList] = useState(churchData.ministries);

    const formatDetail = (text) => {
        if (!text) return null;
        return (
            <div className="mt-8 pt-6 border-t border-gray-100 text-gray-700 space-y-6 animate-fade-in text-lg leading-[2.5]">
                {text.split('\n\n').map((paragraph, i) => (
                    <div key={i}>
                        {paragraph.split('\n').map((line, j) => {
                            const isHeader = /^\s*(대상|사역\s*표어|사역\s*비전|Target|Motto|Vision)/i.test(line);
                            return (
                                <div key={j} className={clsx(isHeader && j > 0 && "mt-8", "block")}>
                                    {line.split(/(\*\*.*?\*\*|대상|사역\s*표어|사역\s*비전|Target|Motto|Vision)/i).map((part, k) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={k}>{part.slice(2, -2)}</strong>;
                                        }
                                        if (/^(대상|사역\s*표어|사역\s*비전|Target|Motto|Vision)$/i.test(part)) {
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

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    useEffect(() => {
        // Scroll to section based on URL path (e.g. /ministry/tsc)
        const path = location.pathname.split('/').pop(); // Get last segment 'tsc' or 'tsy'
        if (path && (path === 'tsc' || path === 'tsy')) {
            // Slight delay to ensure DOM is ready
            setTimeout(() => {
                const element = document.getElementById(path);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Optionally auto-expand the section? User just asked to scroll, but expanding might be nice.
                    // Let's expanded it too for better UX
                    setExpandedSection(path);
                }
            }, 100);
        }
    }, [location.pathname]);

    useEffect(() => {
        let isMounted = true;
        const fetchBanner = async () => {
            const config = await dbService.getSiteConfig();
            if (!isMounted) return;

            if (config) {
                if (config.ministryBanner) setHeaderBanner(config.ministryBanner);
                if (config.ministryTitle) setTitle(config.ministryTitle);
                if (config.ministrySubtitle) setSubtitle(config.ministrySubtitle);
                if (config.ministryTitleFont) setTitleFont(config.ministryTitleFont);
                if (config.ministrySubtitleFont) setSubtitleFont(config.ministrySubtitleFont);
                if (config.ministryTitleColor) setTitleColor(config.ministryTitleColor);
                if (config.ministrySubtitleColor) setSubtitleColor(config.ministrySubtitleColor);
                if (config.ministryTitleItalic !== undefined) setTitleItalic(config.ministryTitleItalic);
                if (config.ministrySubtitleItalic !== undefined) setSubtitleItalic(config.ministrySubtitleItalic);
                if (config.ministryTitleWeight) setTitleWeight(config.ministryTitleWeight);
                if (config.ministrySubtitleWeight) setSubtitleWeight(config.ministrySubtitleWeight);
                if (config.ministryTitleSize) setTitleSize(config.ministryTitleSize);
                if (config.ministrySubtitleSize) setSubtitleSize(config.ministrySubtitleSize);
                if (config.ministryOverlayOpacity !== undefined) setOverlayOpacity(config.ministryOverlayOpacity);
                if (config.ministryHeight) setHeight(config.ministryHeight);
                if (config.ministryItems) setMinistryList(config.ministryItems);
            }
        };
        fetchBanner();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header with Banner */}
            <div className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-[65vh] md:h-[85vh]" :
                    height === 'large' ? "h-[65vh]" :
                        height === 'medium' ? "h-[50vh] min-h-[400px]" :
                            "h-[25vh]"
            )}>
                <div className="absolute inset-0 z-0">
                    {isVideo(headerBanner) ? (
                        getYoutubeId(headerBanner) ? (
                            <div className="absolute inset-0 w-full h-full">
                                <iframe
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] min-w-full min-h-full pointer-events-none object-cover opacity-80"
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
                                className="w-full h-full object-cover"
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
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
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
                        "mb-8 animate-fade-in-up",
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

            {/* Sunday School Introduction Section */}
            <div className="bg-white py-32">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed whitespace-pre-line break-keep">
                        {t('ministry.sunday_school_title')}
                    </h2>
                    <p className="text-base md:text-lg text-gray-500 font-medium italic leading-relaxed break-keep">
                        "{t('ministry.sunday_school_subtitle')}"
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto space-y-20">

                    {ministryList.map((ministry, index) => {
                        // Determine translated content
                        // If ministry.id exists (tsc, tsy), try to get translation from i18n
                        // This allows us to override DB/JSON content with localized static text if needed
                        const tName = ministry.id ? t(`ministry.${ministry.id}_name`) : ministry.name;
                        const tTarget = ministry.id ? t(`ministry.${ministry.id}_target`) : ministry.target;
                        // Check if translation key exists by comparing output to key name, or just use it if reliable. 
                        // i18next returns key if missing. safe way:
                        const tDesc = ministry.id ? t(`ministry.${ministry.id}_desc`) : ministry.description;
                        const tDetail = ministry.id ? t(`ministry.${ministry.id}_detail`) : ministry.detail;

                        // Fallback logic: if translation returns key (meaning missing), stick to original
                        // note: standard i18next returns key on miss. 
                        // However, we are confident we added keys for tsc and tsy.
                        // For other IDs, it might fail, so we should check.

                        // Priority Logic:
                        // If language is English, try to show the English translation first.
                        // If language is not English (Korean), prioritize the DB content (ministry.detail) so Admin changes are shown.

                        const isEn = i18n.language === 'en';
                        const tDetailValid = tDetail && tDetail !== `ministry.${ministry.id}_detail`;
                        const tDescValid = tDesc && tDesc !== `ministry.${ministry.id}_desc`;

                        const displayDetail = isEn
                            ? (tDetailValid ? tDetail : ministry.detail)
                            : (ministry.detail || (tDetailValid ? tDetail : ''));

                        // Similar logic for Description
                        const displayDesc = isEn
                            ? (tDescValid ? tDesc : ministry.description)
                            : (ministry.description || (tDescValid ? tDesc : ''));

                        const displayName = (tName && tName !== `ministry.${ministry.id}_name`) ? tName : ministry.name;
                        const displayTarget = (tTarget && tTarget !== `ministry.${ministry.id}_target`) ? tTarget : ministry.target;

                        return (
                            <React.Fragment key={ministry.id}>
                                <div id={ministry.id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-start scroll-mt-32`}>
                                    {/* Image Section */}
                                    <div className="w-full lg:w-1/2">
                                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative group">
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
                                    <div className="w-full lg:w-1/2 space-y-6">
                                        <div className="inline-block px-6 py-2 bg-green-600 rounded-full text-lg font-bold text-white mb-4 shadow-md">
                                            {displayTarget}
                                        </div>
                                        <h2 className="text-4xl font-bold text-primary">{displayName}</h2>
                                        <div className="w-20 h-1.5 bg-accent rounded-full" />
                                        <p className="text-xl text-gray-600 leading-relaxed">
                                            {displayDesc}
                                        </p>
                                        <button
                                            onClick={() => toggleSection(ministry.id)}
                                            className={`px-8 py-3 border-2 font-bold rounded-full transition-all duration-300 ${ministry.id === 'tsc'
                                                ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-white'
                                                : 'border-primary text-primary hover:bg-primary hover:text-white'
                                                }`}
                                        >
                                            {expandedSection === ministry.id ? t('ministry.fold') : t('ministry.learn_more')}
                                        </button>
                                        {expandedSection === ministry.id && (
                                            displayDetail ? formatDetail(displayDetail) : (
                                                <div className="mt-8 pt-6 border-t border-gray-100 text-gray-700 space-y-4 animate-fade-in text-lg italic">
                                                    {t('home.no_content_yet')}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                {index < ministryList.length - 1 && (
                                    <div className="w-full border-t-2 border-white my-20" />
                                )}
                            </React.Fragment>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default Ministry;
