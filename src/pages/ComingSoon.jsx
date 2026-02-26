import { motion } from 'framer-motion';
import React from 'react';
import MinistryNav from '../components/MinistryNav';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const ComingSoon = ({ type = 'mission' }) => {
    const { t, i18n } = useTranslation();
    const { config: siteConfig } = useSiteConfig();

    // Standard ministry/education banner and title settings
    // Fallback logic: Use specific banner if exists, else look for ministryItem, else fallback to general ministryBanner
    const ministryItem = siteConfig?.ministryItems?.find(m => m.id === type || (type === 'team' && m.id === 'team_ministry'));

    const banner = siteConfig?.[`${type}Banner`] || ministryItem?.image || siteConfig?.ministryBanner;
    const isEn = i18n.language === 'en' || i18n.language.startsWith('en-');
    const bannerTitle = (isEn && siteConfig?.[`${type}TitleEn`]) ? siteConfig[`${type}TitleEn`] : (isEn ? t(`nav.${type}`) : (siteConfig?.[`${type}Title`] || (type === 'tee' ? 'TEE' : (type === 'team' ? '팀사역' : (['mission', 'prayer'].includes(type) ? t(`nav.${type}`) : t('nav.ministry'))))));
    const bannerSubtitle = (isEn && siteConfig?.[`${type}SubtitleEn`]) ? siteConfig[`${type}SubtitleEn`] : (isEn ? (ministryItem?.descriptionEn || siteConfig?.ministrySubtitleEn || "") : (siteConfig?.[`${type}Subtitle`] || ministryItem?.description || siteConfig?.ministrySubtitle || ""));

    const bannerFit = siteConfig?.[`${type}BannerFit`] || 'cover';
    const overlayOpacity = siteConfig?.[`${type}OverlayOpacity`] || 40;
    const height = siteConfig?.[`${type}Height`] || 'medium';
    const bannerPosition = siteConfig?.[`${type}BannerPosition`] || 50;

    // Dynamic Style Settings
    const titleFont = siteConfig?.[`${type}TitleFont`] || 'font-sans';
    const subtitleFont = siteConfig?.[`${type}SubtitleFont`] || 'font-sans';
    const titleColor = siteConfig?.[`${type}TitleColor`] || '#ffffff';
    const subtitleColor = siteConfig?.[`${type}SubtitleColor`] || '#f8fafc';
    const titleItalic = siteConfig?.[`${type}TitleItalic`] || false;
    const subtitleItalic = siteConfig?.[`${type}SubtitleItalic`] || false;
    const titleWeight = siteConfig?.[`${type}TitleWeight`] || 'font-black';
    const subtitleWeight = siteConfig?.[`${type}SubtitleWeight`] || 'font-medium';
    const titleSize = siteConfig?.[`${type}TitleSize`];
    const subtitleSize = siteConfig?.[`${type}SubtitleSize`];

    const heroHeightClass = clsx(
        "relative w-full flex items-center justify-center overflow-hidden",
        height === 'full' ? "h-screen" :
            height === 'large' ? "h-[85vh]" :
                height === 'medium' ? "h-[75vh]" :
                    "h-[50vh]"
    );

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#efebe9]">
            {/* 1. Hero Banner Section at Top */}
            <div className={heroHeightClass}>
                <div className="absolute inset-0 z-0">
                    {banner ? (
                        <>
                            <div
                                className={clsx(
                                    "absolute inset-0 bg-no-repeat bg-center transform scale-105 transition-all duration-700",
                                    bannerFit === 'contain' ? "bg-contain" : "bg-cover"
                                )}
                                style={{
                                    backgroundImage: `url(${banner})`,
                                    backgroundPosition: `center ${bannerPosition}%`
                                }}
                            />
                            <div
                                className="absolute inset-0 bg-black/40"
                                style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                            />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-primary/80" />
                    )}
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center pt-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "text-4xl md:text-6xl drop-shadow-lg tracking-tight mb-8",
                            titleFont,
                            titleWeight,
                            titleItalic && "italic"
                        )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {bannerTitle}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "5rem" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1.5 bg-accent mx-auto mb-8 rounded-full"
                    />

                    {bannerSubtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={clsx(
                                "max-w-2xl mx-auto drop-shadow-md",
                                subtitleFont,
                                subtitleWeight,
                                subtitleItalic && "italic"
                            )}
                            style={{
                                color: subtitleColor,
                                fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                            }}
                        >
                            {bannerSubtitle}
                        </motion.p>
                    )}
                </div>
            </div>

            {/* 2. Coming Soon Content Section Below Banner (Matches User Image) */}
            <div className="flex-grow flex flex-col items-center justify-center py-24 px-6 bg-slate-50/30">
                <div className="max-w-2xl w-full text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full mb-8"></div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                            페이지 준비중입니다
                        </h2>
                        <p className="text-slate-500 font-medium text-lg md:text-xl">
                            We’re preparing this page.
                        </p>
                    </motion.div>

                    {/* Pill-shaped Black Button with Home Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center pt-4"
                    >
                        <Link
                            to="/"
                            className="group flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xl transition-all shadow-xl hover:bg-primary hover:shadow-primary/30 active:scale-95"
                        >
                            <Home size={24} className="group-hover:-translate-y-0.5 transition-transform" />
                            <span>메인으로 돌아가기</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* 3. Ministry Navigation at Bottom */}
            {['mission', 'prayer', 'team', 'tee', 'bible'].includes(type) && (
                <div className="w-full py-16 border-t border-slate-100 bg-white">
                    <div className="container mx-auto px-4">
                        <MinistryNav
                            active={type === 'mission' ? 'mission_evangelism' : (type === 'team' ? 'team_ministry' : type)}
                            category={['tee', 'bible'].includes(type) ? 'education' : 'ministry'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComingSoon;
