import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Clock, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MinistryNav from '../components/MinistryNav';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const Prayer = () => {
    const { t } = useTranslation();
    const { config: siteConfig } = useSiteConfig();
    const type = 'prayer';

    const banner = siteConfig?.prayerBanner || "/images/ministry_banner.jpg";
    const bannerTitle = siteConfig?.prayerTitle || t('nav.prayer');
    const bannerSubtitle = siteConfig?.prayerSubtitle || t('ministry.prayer.subtitle');

    const bannerFit = siteConfig?.prayerBannerFit || 'cover';
    const overlayOpacity = siteConfig?.prayerOverlayOpacity || 40;
    const height = siteConfig?.prayerHeight || 'medium';

    const titleFont = siteConfig?.prayerTitleFont || 'font-sans';
    const subtitleFont = siteConfig?.prayerSubtitleFont || 'font-sans';
    const titleColor = siteConfig?.prayerTitleColor || '#ffffff';
    const subtitleColor = siteConfig?.prayerSubtitleColor || '#f8fafc';
    const titleItalic = siteConfig?.prayerTitleItalic || false;
    const subtitleItalic = siteConfig?.prayerSubtitleItalic || false;
    const titleWeight = siteConfig?.prayerTitleWeight || 'font-black';
    const subtitleWeight = siteConfig?.prayerSubtitleWeight || 'font-medium';
    const titleSize = siteConfig?.prayerTitleSize;
    const subtitleSize = siteConfig?.prayerSubtitleSize;



    const heroHeightClass = clsx(
        "relative w-full flex items-center justify-center overflow-hidden",
        height === 'full' ? "h-screen" :
            height === 'large' ? "h-[85vh]" :
                height === 'medium' ? "h-[75vh]" :
                    "h-[50vh]"
    );

    // Helper to parse newline-separated strings into arrays
    const parseTopics = (text) => {
        if (!text) return [];
        return text.split('\n').filter(line => line.trim() !== '');
    };

    const prayerSections = [
        {
            id: 'church',
            title: t('ministry.prayer.church_prayer_title'),
            icon: <Target className="w-6 h-6" />,
            topics: (siteConfig?.prayerChurchTopics || siteConfig?.prayerChurchTopics2026)
                ? parseTopics(siteConfig.prayerChurchTopics || siteConfig.prayerChurchTopics2026)
                : (t('ministry.prayer.church_topics', { returnObjects: true }) || [])
        },
        {
            id: 'common',
            title: t('ministry.prayer.common_prayer_title'),
            icon: <Heart className="w-6 h-6" />,
            topics: siteConfig?.prayerCommonTopics
                ? parseTopics(siteConfig.prayerCommonTopics)
                : (t('ministry.prayer.common_topics', { returnObjects: true }) || [])
        }
        // Pastor Prayer section removed as per request
        /*
        {
            id: 'pastor',
            title: t('ministry.prayer.pastor_prayer_title'),
            icon: <Quote className="w-6 h-6" />,
            topics: siteConfig?.prayerPastorTopics
                ? parseTopics(siteConfig.prayerPastorTopics)
                : (t('ministry.prayer.pastor_topics', { returnObjects: true }) || [])
        },
        */
    ];

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#efebe9] font-sans text-slate-800">
            {/* Hero Section */}
            <div className={heroHeightClass}>
                <div className="absolute inset-0 z-0">
                    <div
                        className={clsx(
                            "absolute inset-0 bg-no-repeat bg-center transform scale-105 transition-all duration-700",
                            bannerFit === 'contain' ? "bg-contain" : "bg-cover"
                        )}
                        style={{ backgroundImage: `url(${banner})` }}
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
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {bannerTitle}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "3.5rem" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 bg-green-500 mb-6 rounded-full mx-auto"
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
                            color: subtitleColor,
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
                    <MinistryNav active="prayer" category="ministry" />
                </div>
            </div>

            <main className="container mx-auto px-6 py-20 max-w-6xl">
                {/* 1. Intro Section (Refactored Layout: Title Top, Image Left, Text Right, Instructions Bottom) */}
                <div className="mb-20 animate-fade-in-up">
                    {/* Top: Center Title */}
                    <div className="text-center mb-32">
                        <span className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold tracking-widest uppercase rounded-full mb-6 backdrop-blur-sm shadow-sm">
                            {t('ministry.prayer.intro_title')}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-black text-blue-900 leading-tight">
                            {t('ministry.prayer.intro_subtitle')}
                        </h2>
                    </div>

                    {/* Middle: Grid (Image Left, Invitation Text Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                        {/* Left Column: Intro Image (Managed in Admin) */}
                        <div className="w-full h-full flex items-center justify-center">
                            {siteConfig?.prayerIntroImage ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-white aspect-[4/3]"
                                >
                                    <img
                                        src={siteConfig.prayerIntroImage}
                                        alt="Prayer Ministry Intro"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </motion.div>
                            ) : (
                                <div className="w-full rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center text-blue-400 gap-3 aspect-[4/3]">
                                    <Sparkles size={32} className="opacity-50" />
                                    <span className="font-bold text-lg text-center px-4">Admin &gt; 중보기도 관리에서<br />소개 이미지를 등록해주세요</span>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Invitation Text */}
                        <div className="text-left space-y-8">
                            <div className="text-lg md:text-xl text-stone-700 leading-relaxed font-bold break-keep"
                                dangerouslySetInnerHTML={{ __html: t('ministry.prayer.intro_desc') }}
                            />
                            <div className="w-20 h-1.5 bg-blue-400/30 rounded-full" />

                            {/* Moved Instructions Box (Smaller) */}
                            <div className="mt-8 p-5 bg-blue-900 rounded-[1.5rem] border border-blue-800 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30" />

                                <div className="text-sm md:text-base text-blue-50 leading-relaxed font-medium break-keep mb-4"
                                    dangerouslySetInnerHTML={{ __html: t('ministry.prayer.instructions_desc') }}
                                />

                                <div className="flex items-start gap-2 text-blue-200 text-xs md:text-sm font-medium">
                                    <Sparkles size={14} className="shrink-0 mt-0.5" />
                                    <span>{t('ministry.prayer.privacy_notice_full')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Values & Goals Section */}
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 mt-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-[2rem] shadow-xl border border-white/50"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <Heart size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-black text-blue-900 tracking-tight">
                                    {t('ministry.prayer.section2_title')}
                                </h3>
                            </div>
                            <div className="text-base md:text-lg text-stone-600 leading-[1.8] whitespace-pre-line font-medium break-keep pl-8">
                                {siteConfig?.prayerCoreValues !== undefined ? siteConfig.prayerCoreValues : t('ministry.prayer.values_default')}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-[2rem] shadow-xl border border-white/50"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                    <Target size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-black text-blue-900 tracking-tight">
                                    {t('ministry.prayer.section3_title')}
                                </h3>
                            </div>
                            <div className="text-base md:text-lg text-stone-600 leading-[1.8] whitespace-pre-line font-medium break-keep pl-4">
                                {siteConfig?.prayerGoals !== undefined ? siteConfig.prayerGoals : t('ministry.prayer.goals_default')}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Operating Hours Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mb-24 bg-blue-900/5 border border-blue-900/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-blue-900 uppercase tracking-widest">{t('ministry.prayer.section4_title')}</span>
                    </div>
                    <div className="h-px w-full md:w-px md:h-12 bg-blue-900/20" />
                    <div className="text-xl md:text-2xl font-sans font-bold text-blue-800">
                        {siteConfig?.prayerHours !== undefined ? siteConfig.prayerHours : "매주 주일 낮 12:30 | 2층 자모실"}
                    </div>
                </motion.div>

                {/* 3. Prayer Topics Section */}
                <div className="max-w-5xl mx-auto px-4 pb-32">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-blue-500 w-5 h-5" />
                            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Intercessory Ministry</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-4 tracking-tight">
                            {siteConfig?.prayerTopicsTitle || t('ministry.prayer.section1_title')}
                        </h2>
                        <div
                            className="text-lg text-stone-500 font-medium leading-relaxed max-w-2xl"
                            dangerouslySetInnerHTML={{ __html: (siteConfig?.prayerTopicsSubtitle || t('ministry.prayer.section1_desc')).replace(/\n/g, '<br/>') }}
                        />
                    </div>

                    <div className="space-y-8">
                        {prayerSections.map((section) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 md:p-10 rounded-[2rem] shadow-lg border border-white/50"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                                        {section.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-blue-900 tracking-tight">
                                        {section.title}
                                    </h3>
                                </div>

                                <div className="pl-4 md:pl-8">
                                    {section.topics.length > 0 ? (
                                        section.id === 'church' ? (
                                            <div className="space-y-6">
                                                {section.topics.length > 0 && (
                                                    <div className="text-xl md:text-2xl font-black text-blue-600 leading-tight mb-4">
                                                        {section.topics[0]}
                                                    </div>
                                                )}
                                                {section.topics.length > 1 && (
                                                    <ol className="list-decimal marker:text-blue-500 marker:font-black pl-5 space-y-4 text-stone-600 font-medium text-lg lg:text-xl leading-relaxed">
                                                        {section.topics.slice(1).map((topic, idx) => (
                                                            <li key={idx} className="pl-2">
                                                                {topic}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                )}
                                            </div>
                                        ) : (
                                            <ol className={clsx(
                                                "space-y-4 text-stone-600 font-medium text-lg lg:text-xl leading-relaxed pl-5",
                                                section.topics.length > 1 ? "list-decimal marker:text-blue-500 marker:font-black" : "list-none"
                                            )}>
                                                {section.topics.map((topic, idx) => (
                                                    <li key={idx} className="pl-2">
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ol>
                                        )
                                    ) : (
                                        <p className="text-stone-400 font-bold py-2">내용 준비 중</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. CTA Section */}
                <div className="text-center">
                    <div className="inline-flex flex-col items-center p-12 bg-white rounded-[2.5rem] shadow-xl max-w-2xl mx-auto border border-white/50 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20" />

                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-6">
                            <Send size={32} />
                        </div>

                        <h2 className="text-2xl md:text-4xl font-black text-blue-900 mb-6 tracking-tight">
                            함께 기도해요
                        </h2>

                        <p className="text-lg text-stone-600 mb-10 font-medium">
                            기도의 힘을 믿으시나요?<br className="hidden md:block" />
                            여러분의 기도 제목을 나눠주세요. 함께 기도하겠습니다.
                        </p>

                        <a
                            href="https://forms.gle/your-form-id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-blue-900 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:scale-105 transition-all active:scale-95"
                        >
                            <span>{t('ministry.prayer.request_button')}</span>
                            <Send size={18} />
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Prayer;
