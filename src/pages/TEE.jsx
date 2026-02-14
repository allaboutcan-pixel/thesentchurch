import { motion } from 'framer-motion';
import React from 'react';
import MinistryNav from '../components/MinistryNav';
import { useTranslation } from 'react-i18next';
import { BookOpen, GraduationCap, Target, Heart, CheckCircle2, Globe2, Quote } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const TEE = () => {
    const { t } = useTranslation();
    const { config: siteConfig } = useSiteConfig();
    const type = 'tee';

    const banner = siteConfig?.[`${type}Banner`] || siteConfig?.ministryBanner;
    const bannerTitle = siteConfig?.[`${type}Title`] || t('tee.banner_title');
    const bannerSubtitle = siteConfig?.[`${type}Subtitle`] || t('tee.banner_subtitle');

    const bannerFit = siteConfig?.[`${type}BannerFit`] || 'cover';
    const overlayOpacity = siteConfig?.[`${type}OverlayOpacity`] || 40;
    const height = siteConfig?.[`${type}Height`] || 'medium';

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

    const smartKeys = ['s', 'm', 'a', 'r', 't'];

    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            {/* Hero Section */}
            <div className={heroHeightClass}>
                <div className="absolute inset-0 z-0">
                    <div
                        className={clsx(
                            "absolute inset-0 bg-no-repeat bg-center transform scale-105 transition-all duration-700",
                            bannerFit === 'contain' ? "bg-contain" : "bg-cover"
                        )}
                        style={{ backgroundImage: `url(${banner || '/images/ministry_banner.jpg'})` }}
                    />
                    <div
                        className="absolute inset-0 bg-black/40"
                        style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                    />
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center pt-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "text-2xl md:text-4xl drop-shadow-lg tracking-tight mb-6",
                            titleFont,
                            titleWeight,
                            titleItalic && "italic"
                        )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize / 1.5}px` : undefined
                        }}
                    >
                        {bannerTitle}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "4rem" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 bg-accent mb-6 rounded-full mx-auto"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={clsx(
                            "max-w-xl drop-shadow-md mx-auto",
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
                </div>
            </div>

            {/* Ministry Nav */}
            <div className="w-full py-8 bg-slate-50 border-b border-slate-100">
                <div className="container mx-auto px-4">
                    <MinistryNav active="tee" category="education" />
                </div>
            </div>

            {/* Content Section 1: Intro & Bible */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex flex-col gap-16 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-bold">
                                <BookOpen size={16} />
                                <span>{t('nav.tee')}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                                {t('tee.intro_title')}
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{ __html: t('tee.intro_desc') }} />
                            <p className="text-slate-500 font-medium max-w-2xl">
                                {t('tee.intro_subdesc')}
                            </p>
                        </motion.div>

                        {/* Bible Verse Styled as Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-8 border-t border-slate-100"
                        >
                            <div className="max-w-2xl space-y-3">
                                <p className="text-base md:text-lg font-light text-slate-400 leading-relaxed italic break-keep text-center">
                                    {t('tee.bible_verse')}
                                </p>
                                <p className="text-sm font-medium text-slate-400">
                                    {t('tee.bible_ref')}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-20 p-8 bg-primary rounded-2xl text-center shadow-xl shadow-primary/20"
                    >
                        <div className="flex flex-col items-center justify-center gap-6">
                            <div className="flex items-center gap-4">
                                <Globe2 size={40} className="text-accent" />
                                <div className="text-center">
                                    <div className="text-2xl font-black">{t('tee.global_title')}</div>
                                </div>
                            </div>
                            <p className="text-white/90 font-medium max-w-xl mx-auto text-lg break-keep text-center" dangerouslySetInnerHTML={{ __html: t('tee.global_desc') }} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section 2: Goals & Values */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="flex flex-col gap-12">
                        {/* Goals Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
                                <Target size={28} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-2">{t('tee.goal_title')}</h3>
                                <h4 className="text-2xl font-black text-slate-900 mb-4">{t('tee.goal_subtitle')}</h4>
                                <p className="text-primary font-bold mb-6 italic">{t('tee.goal_quote')}</p>
                                <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
                                    <p>{t('tee.goal_desc')}</p>
                                    <p className="text-sm border-t border-slate-100 pt-4 italic">{t('tee.goal_desc2')}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Values Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                <Heart size={28} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-2">{t('tee.value_title')}</h3>
                                <h4 className="text-2xl font-black text-slate-900 mb-6">{t('tee.value_subtitle')}</h4>
                                <p className="text-slate-800 font-bold mb-6">{t('tee.value_desc')}</p>
                                <ul className="space-y-3 mb-8 flex flex-col items-center">
                                    {t('tee.value_list', { returnObjects: true }).map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-600 font-semibold">
                                            <CheckCircle2 size={18} className="text-primary" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-4 bg-slate-50 rounded-xl text-sm font-medium text-slate-500 italic whitespace-pre-line text-center">
                                    {t('tee.value_summary')}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Section 3: Features & SMART */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="container mx-auto px-6 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8 text-center"
                    >
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t('tee.fruits_title')}</h2>
                        <div className="w-12 h-1 bg-accent rounded-full mx-auto" />
                        <p className="text-lg md:text-xl text-slate-700 font-bold leading-loose break-keep">
                            {t('tee.fruits_desc')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Bottom Nav Spacer */}
            <div className="h-24 bg-white" />
        </div>
    );
};

export default TEE;
