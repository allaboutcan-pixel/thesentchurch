import React from 'react';
import { motion } from 'framer-motion';
import MinistryNav from '../components/MinistryNav';
import { useTranslation } from 'react-i18next';
import { BookOpen, Target, Heart, CheckCircle2, Globe2, Leaf, Sprout, Award, Scroll, Quote, ExternalLink, Download } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const TEE = () => {
    const { t, i18n } = useTranslation();
    const { config: siteConfig } = useSiteConfig();
    const type = 'tee';

    const banner = siteConfig?.[`${type}Banner`] || siteConfig?.ministryBanner;
    const isEnglish = i18n.language.startsWith('en');
    const bannerTitle = isEnglish ? t('tee.banner_title') : (siteConfig?.[`${type}Title`] || t('tee.banner_title'));
    const bannerSubtitle = isEnglish ? t('tee.banner_subtitle') : (siteConfig?.[`${type}Subtitle`] || t('tee.banner_subtitle'));

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

    const smartItems = [
        { letter: 'S', title: t('tee.smart_s_title'), desc: t('tee.smart_s_desc') },
        { letter: 'M', title: t('tee.smart_m_title'), desc: t('tee.smart_m_desc') },
        { letter: 'A', title: t('tee.smart_a_title'), desc: t('tee.smart_a_desc') },
        { letter: 'R', title: t('tee.smart_r_title'), desc: t('tee.smart_r_desc') },
        { letter: 'T', title: t('tee.smart_t_title'), desc: t('tee.smart_t_desc') },
    ];

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#fdfbf7] font-sans text-slate-800">
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
                            "text-3xl md:text-5xl drop-shadow-xl tracking-tight mb-4",
                            titleFont,
                            titleWeight,
                            titleItalic && "italic"
                        )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize / 1.3}px` : undefined
                        }}
                    >
                        {bannerTitle}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "3rem" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 bg-[#8d6e63] mb-6 rounded-full mx-auto"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={clsx(
                            "max-w-xl drop-shadow-md mx-auto opacity-90 text-white font-bold",
                            subtitleFont,
                            subtitleWeight,
                            subtitleItalic && "italic"
                        )}
                        style={{
                            color: '#ffffff', // Explicitly setting white color
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {bannerSubtitle}
                    </motion.p>
                </div>
            </div>

            {/* Ministry Nav */}
            <div className="w-full py-6 bg-white border-b border-stone-200 shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <MinistryNav active="tee" category="education" />
                </div>
            </div>

            {/* 1. Intro Section (White Background) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-8"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-blue-600 text-blue-700 text-sm font-bold tracking-widest uppercase mb-4">
                            Introduction
                        </span>
                        <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900">
                            {t('tee.intro_title')}
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed word-keep break-keep">
                            <p dangerouslySetInnerHTML={{ __html: t('tee.intro_desc') }} />
                            <p dangerouslySetInnerHTML={{ __html: t('tee.intro_subdesc') }} />
                        </div>

                        {/* Bible Verse Box */}
                        <div className="mt-12 p-8 md:p-10 bg-white rounded-xl border-l-4 border-blue-600 shadow-md max-w-3xl mx-auto">
                            <Quote className="w-8 h-8 text-blue-400 mb-4 mx-auto opacity-50" />
                            <p
                                className="text-lg md:text-xl font-sans italic text-slate-700 mb-4 leading-relaxed break-keep"
                                dangerouslySetInnerHTML={{ __html: `"${t('tee.bible_verse')}"` }}
                            />
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">
                                {t('tee.bible_ref')}
                            </p>
                        </div>
                    </motion.div>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-30 blur-3xl" />
            </section>

            {/* 2. Goals Section (Warm Grey/Beige Background) */}
            <section className="py-24 bg-[#efebe9]">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Ministry Goal */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-600"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                                    <Target size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{t('tee.ministry_goal_title')}</h3>
                            </div>

                            <div className="flex-1 flex items-center justify-center py-4">
                                <h4 className="text-2xl md:text-3xl font-sans font-bold text-[#3e2723] text-center">
                                    {t('tee.ministry_goal_subtitle')}
                                </h4>
                            </div>

                            <div className="h-px bg-slate-200 w-full mb-6 mt-auto" />
                            <p className="text-lg font-black text-center text-slate-700 italic font-sans">
                                {t('tee.ministry_goal_quote')}
                            </p>
                        </motion.div>

                        {/* Core Goal */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-400"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                                    <Sprout size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{t('tee.core_goal_title')}</h3>
                            </div>
                            <div className="text-slate-700 leading-relaxed text-lg space-y-4">
                                <p dangerouslySetInnerHTML={{ __html: t('tee.core_goal_desc') }} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Core Values & Features (White) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                        {/* Value: Application */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col h-full space-y-6 bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-600"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <Heart size={20} className="text-blue-500" />
                                    {t('tee.core_value_title')}
                                </h3>
                                <h2 className="text-xl font-sans font-bold text-slate-900 mb-4">
                                    {t('tee.core_value_subtitle')}
                                </h2>
                                <p className="text-base text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('tee.core_value_desc') }} />
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-blue-100 mt-auto">
                                <p className="text-sm font-medium text-center text-slate-800 whitespace-pre-line leading-loose italic font-sans">
                                    {t('tee.core_value_box')}
                                </p>
                            </div>


                        </motion.div>

                        {/* Features List */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col h-full bg-blue-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                        >
                            {/* Bg decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2" />

                            <div className="relative z-10 flex flex-col h-full justify-center">
                                <h3 className="text-2xl font-bold mb-8 flex items-center justify-center gap-3">
                                    <Award className="text-white" />
                                    <span className="text-white">{t('tee.features_title')}</span>
                                </h3>
                                <div className="space-y-6 text-blue-50 text-xl leading-relaxed whitespace-pre-line font-light text-center">
                                    <span className="md:hidden">{t('tee.features_desc_mobile')}</span>
                                    <span className="hidden md:block">{t('tee.features_desc')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Methods (SMART) - Stone/Light Brown Bg */}
            < section className="py-20 bg-[#faf8f5]" >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-sans font-bold text-slate-900 mb-8">
                            {t('tee.method_title')}
                        </h2>
                        <p className="text-stone-500 font-medium">S.M.A.R.T Principles</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {smartItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500 text-center hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="text-4xl font-black text-blue-200 mb-3">{item.letter}</div>
                                <h4 className="text-lg font-bold text-slate-700 mb-2">{item.title.split('–')[1].trim()}</h4>
                                <p className="text-sm text-slate-500 break-keep">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* 5. Fruits (Conclusion) - Simple Clean White */}
            < section className="py-24 bg-white text-center" >
                <div className="container mx-auto px-6 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
                            <Leaf size={32} />
                        </div>
                        <h2 className="text-3xl font-sans font-bold text-slate-900 mb-8">
                            {t('tee.fruits_title')}
                        </h2>
                        <p className="text-xl text-slate-600 leading-loose break-keep font-light">
                            <span className="md:hidden" dangerouslySetInnerHTML={{ __html: t('tee.fruits_desc_mobile') }} />
                            <span className="hidden md:block" dangerouslySetInnerHTML={{ __html: t('tee.fruits_desc') }} />
                        </p>
                    </motion.div>

                    {/* TEE Link Button */}
                    <div className="mt-16 text-center">
                        <a
                            href="https://ktee.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block transition-transform hover:scale-105"
                        >
                            <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                                <span className="font-bold">TEE Korea 바로가기</span>
                                <ExternalLink size={18} />
                            </div>
                        </a>
                    </div>
                </div>
            </section >

            {/* Spacer for global footer */}
            < div className="h-12 bg-white" />
        </div >
    );
};

export default TEE;
