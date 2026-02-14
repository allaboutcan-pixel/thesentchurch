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

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
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
                        className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-xl"
                    >
                        {title}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "4rem" }}
                        className="h-1.5 bg-accent mx-auto mb-8 rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-lg"
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>

            {/* Ministry Navigation */}
            <div className="container mx-auto px-4 mt-12">
                <MinistryNav active="prayer" category="ministry" />
            </div>

            <main className="container mx-auto px-6 py-20 max-w-6xl">
                {/* Introduction Section */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-4">
                                    {t('ministry.prayer.intro_title')}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                    {t('ministry.prayer.intro_subtitle')}
                                </h2>
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                                {t('ministry.prayer.intro_content')}
                            </p>
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <ShieldCheck className="text-green-600 shrink-0" size={40} />
                                <p className="text-sm md:text-base font-medium text-slate-700 italic">
                                    {t('ministry.prayer.privacy_notice')}
                                </p>
                            </div>
                        </div>
                        <div className="relative group max-w-xl mx-auto lg:ml-auto">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[2.5rem] blur-2xl group-hover:opacity-100 opacity-50 transition-opacity" />
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                                <img
                                    src="https://drive.google.com/uc?export=download&id=1mc1PsV0gscCVVRtuaIyh4RBNPijTtXWf"
                                    alt="Intercessory Prayer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = "/images/prayer_intro.jpg"; }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stacking Core Values, Goals, and Hours Vertically */}
                <div className="flex flex-col gap-16 mb-32">
                    <section className="space-y-8">
                        <SectionTitle icon={Target}>{t('ministry.prayer.section2_title')}</SectionTitle>
                        <div className="bg-slate-50 p-12 rounded-3xl min-h-[200px] border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-xl">
                            Coming Soon
                        </div>
                    </section>

                    <section className="space-y-8">
                        <SectionTitle icon={Users}>{t('ministry.prayer.section3_title')}</SectionTitle>
                        <div className="bg-slate-50 p-12 rounded-3xl min-h-[200px] border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-xl">
                            Coming Soon
                        </div>
                    </section>

                    <section className="space-y-8">
                        <SectionTitle icon={Clock}>{t('ministry.prayer.section4_title')}</SectionTitle>
                        <div className="bg-slate-50 p-12 rounded-3xl min-h-[200px] border border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-medium text-center text-xl">
                            준비 중입니다.
                        </div>
                    </section>
                </div>

                {/* Reordered: Prayer Topics moved here */}
                <section className="mb-32 pt-16 border-t border-gray-100">
                    <SectionTitle icon={Heart}>{t('ministry.prayer.section1_title')}</SectionTitle>
                    <p className="text-lg text-gray-600 mb-12 max-w-3xl leading-relaxed whitespace-pre-line ml-0 lg:ml-20">
                        {t('ministry.prayer.section1_desc')}
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <PrayerCard
                            title={t('ministry.prayer.common_prayer_title')}
                            topics={t('ministry.prayer.common_topics', { returnObjects: true })}
                        />
                        <PrayerCard
                            title={t('ministry.prayer.pastor_prayer_title')}
                            topics={t('ministry.prayer.pastor_topics', { returnObjects: true })}
                        />
                        <PrayerCard
                            title={t('ministry.prayer.church_prayer_title')}
                            topics={t('ministry.prayer.church_topics', { returnObjects: true })}
                        />
                    </div>
                </section>

                {/* Request Button CTA */}
                <section className="relative max-w-[300px] mx-auto aspect-[3/4] rounded-none overflow-hidden mb-20 group border border-white/10 shadow-xl">
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
                        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[1px] transition-all duration-500 group-hover:bg-slate-900/60" />
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
                            <button className="group relative inline-flex items-center gap-2 px-5 py-2 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:bg-accent hover:text-white transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden">
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
