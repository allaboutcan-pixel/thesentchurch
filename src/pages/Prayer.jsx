import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, ShieldCheck, Target, Clock, Heart, Users, Globe, ExternalLink } from 'lucide-react';
import MinistryNav from '../components/MinistryNav';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const SectionTitle = ({ children, icon: Icon }) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <Icon size={20} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">{children}</h2>
    </div>
);

const PrayerCard = ({ title, topics }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full"
    >
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            {title}
        </h3>
        <ul className="space-y-4 text-gray-600 flex-grow">
            {topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    <span className="leading-relaxed">{topic}</span>
                </li>
            ))}
        </ul>
    </motion.div>
);

const Prayer = () => {
    const { t } = useTranslation();
    const { config: siteConfig } = useSiteConfig();

    const banner = siteConfig?.prayerBanner || "/images/ministry_banner.jpg";
    const title = siteConfig?.prayerTitle || t('ministry.prayer.title');
    const subtitle = siteConfig?.prayerSubtitle || t('ministry.prayer.subtitle');
    const overlayOpacity = siteConfig?.prayerOverlayOpacity || 40;

    // Dynamic Style Settings
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

    const getTopics = (configValue, fallbackKey) => {
        if (configValue) {
            return configValue.split('\n').filter(line => line.trim() !== '');
        }
        const fallback = t(fallbackKey, { returnObjects: true });
        return Array.isArray(fallback) ? fallback : [];
    };

    const introImage = siteConfig?.prayerIntroImage || "https://drive.google.com/uc?export=download&id=1mc1PsV0gscCVVRtuaIyh4RBNPijTtXWf";

    return (
        <div className="min-h-screen bg-[#efebe9]">
            {/* Hero Section */}
            <div className="relative h-[50vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-105"
                    style={{ backgroundImage: `url(${banner})` }}
                />
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity / 100 }}
                />
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "text-3xl md:text-5xl drop-shadow-xl mb-10",
                            titleFont,
                            titleWeight,
                            titleItalic && "italic"
                        )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "4rem" }}
                        className="h-1.5 bg-accent mx-auto mb-12 rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={clsx(
                            "max-w-2xl mx-auto drop-shadow-lg",
                            subtitleFont,
                            subtitleWeight,
                            subtitleItalic && "italic"
                        )}
                        style={{
                            color: subtitleColor,
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>

            {/* Ministry Navigation - Added white background wrapper for better contrast/TEE style */}
            <div className="bg-white border-b border-stone-200 shadow-sm py-6">
                <div className="container mx-auto px-4">
                    <MinistryNav active="prayer" category="ministry" />
                </div>
            </div>

            <main className="container mx-auto px-6 py-20 max-w-6xl">
                {/* Introduction Section */}
                <section className="mb-32">
                    <div className="max-w-3xl mx-auto space-y-12 text-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-white/50 border border-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6 backdrop-blur-sm">
                                {t('ministry.prayer.intro_title')}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                {t('ministry.prayer.intro_subtitle')}
                            </h2>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
                            {t('ministry.prayer.intro_content')}
                        </p>

                        {/* Centered Photo Banner */}
                        <div className="pt-8 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5"
                            >
                                <img
                                    src={siteConfig?.prayerIntroImage || "/images/prayer_intro_banner.jpg"}
                                    alt="Prayer Ministry"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1445077100181-a33e9ac94bd6?q=80&w=2074&auto=format&fit=crop"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stacking Core Values, Goals, and Hours in 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <section className="space-y-6">
                        <SectionTitle icon={Target}>{t('ministry.prayer.section2_title')}</SectionTitle>
                        <div className="bg-white/80 p-8 rounded-3xl min-h-[180px] border border-stone-100 flex items-start justify-start text-stone-700 font-medium text-base shadow-sm whitespace-pre-line leading-relaxed transition-all hover:shadow-md hover:bg-white">
                            {siteConfig?.prayerCoreValues || "준비 중입니다."}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <SectionTitle icon={Users}>{t('ministry.prayer.section3_title')}</SectionTitle>
                        <div className="bg-white/80 p-8 rounded-3xl min-h-[180px] border border-stone-100 flex items-start justify-start text-stone-700 font-medium text-base shadow-sm whitespace-pre-line leading-relaxed transition-all hover:shadow-md hover:bg-white">
                            {siteConfig?.prayerGoals || "준비 중입니다."}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <SectionTitle icon={Clock}>{t('ministry.prayer.section4_title')}</SectionTitle>
                        <div className="bg-white/80 p-8 rounded-3xl min-h-[180px] border border-stone-100 flex items-start justify-start text-stone-700 font-medium text-base shadow-sm whitespace-pre-line leading-relaxed transition-all hover:shadow-md hover:bg-white">
                            {siteConfig?.prayerHours || "준비 중입니다."}
                        </div>
                    </section>
                </div>

                {/* Reordered: Prayer Topics moved here */}
                {/* Reordered: Prayer Topics moved here */}
                <section className="mb-32 pt-16 border-t border-stone-200">
                    <div className="flex flex-col items-center mb-12">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                            <Heart size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center">
                            보내심을 받은 생명의소리 교회 기도 제목
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* 2026 Church Topics */}
                        {siteConfig?.prayerChurchTopics2026 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-500 mb-8 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-accent rounded-full" />
                                    2026년 교회 기도제목
                                </h3>
                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                                    <ul className="space-y-6">
                                        {getTopics(siteConfig.prayerChurchTopics2026, 'ministry.prayer.church_topics_2026').map((topic, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="text-lg text-gray-700 leading-relaxed font-medium">{topic}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Weekly Topics */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-500 mb-8 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-accent rounded-full" />
                                금주의 기도제목
                            </h3>
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                                <ul className="space-y-6">
                                    {getTopics(siteConfig?.prayerCommonTopics, 'ministry.prayer.common_topics').map((topic, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-lg text-gray-700 leading-relaxed font-medium">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Request Button CTA */}
                <section className="relative max-w-[300px] mx-auto aspect-[3/4] rounded-none overflow-hidden mb-20 group border border-white/10 shadow-2xl">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/prayer_request_bg.jpg"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            alt=""
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1544427928-c49cddee11bb?q=80&w=2000&auto=format&fit=crop";
                            }}
                        />
                        <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-[1px] transition-all duration-500 group-hover:bg-stone-900/60" />
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col justify-between pt-24 pb-2 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-xl md:text-2xl font-black text-white break-keep drop-shadow-xl tracking-tight">
                                함께 기도해요
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <button className="group relative inline-flex items-center gap-2 px-5 py-2 bg-white text-stone-900 rounded-full font-bold shadow-lg hover:bg-accent hover:text-white transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Mail className="relative z-10" size={14} />
                                <span className="relative z-10 text-xs md:text-sm">{t('ministry.prayer.request_button')}</span>
                            </button>
                            <p className="text-[9px] text-white/40 font-medium tracking-wide">
                                {t('ministry.prayer.anonymous')} · {t('ministry.prayer.real_name')}
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Prayer;
