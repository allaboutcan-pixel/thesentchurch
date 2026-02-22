import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Video, Heart, Settings, PieChart, Music, Coffee, HandHeart } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import churchData from '../data/church_data.json';
import MinistryNav from '../components/MinistryNav';
import clsx from 'clsx';

const iconMap = {
    Users,
    Video,
    Heart,
    Settings,
    PieChart,
    Music,
    Coffee
};

const TeamMinistry = () => {
    const { t, i18n } = useTranslation();
    const { config: siteConfig } = useSiteConfig();

    const banner = siteConfig?.teamBanner || "/images/ministry_banner.jpg";
    const isEnglish = i18n.language.startsWith('en');
    const title = isEnglish ? t('team_ministry.title') : (siteConfig?.teamTitle || t('team_ministry.title'));
    const subtitle = isEnglish ? t('team_ministry.subtitle') : (siteConfig?.teamSubtitle || t('team_ministry.subtitle'));
    const overlayOpacity = siteConfig?.teamOverlayOpacity || 40;

    // Dynamic Style Settings
    const titleFont = siteConfig?.teamTitleFont || 'font-sans';
    const subtitleFont = siteConfig?.teamSubtitleFont || 'font-sans';
    const titleColor = siteConfig?.teamTitleColor || '#ffffff';
    const subtitleColor = siteConfig?.teamSubtitleColor || '#f8fafc';
    const titleItalic = siteConfig?.teamTitleItalic || false;
    const subtitleItalic = siteConfig?.teamSubtitleItalic || false;
    const titleWeight = siteConfig?.teamTitleWeight || 'font-black';
    const subtitleWeight = siteConfig?.teamSubtitleWeight || 'font-medium';
    const titleSize = siteConfig?.teamTitleSize;
    const subtitleSize = siteConfig?.teamSubtitleSize;

    // Get team ministries from site config (Firebase) or fallback to static data
    const teams = (siteConfig?.teamMinistryItems && siteConfig.teamMinistryItems.length > 0)
        ? siteConfig.teamMinistryItems
        : (churchData.team_ministries || []);

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
                            "text-3xl md:text-5xl drop-shadow-xl mb-6",
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
                        className="h-1.5 bg-accent mx-auto mb-8 rounded-full"
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

            {/* Ministry Navigation */}
            <div className="bg-white border-b border-stone-200 shadow-sm py-6">
                <div className="container mx-auto px-4">
                    <MinistryNav active="team" category="ministry" />
                </div>
            </div>

            <main className="container mx-auto px-6 py-20 max-w-6xl">
                {/* Intro Section */}
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold tracking-widest uppercase rounded-full mb-6 backdrop-blur-sm shadow-sm">
                        {t('team_ministry.intro_badge')}
                    </span>
                    <h2 className="text-xl md:text-3xl font-black text-blue-900 mb-8 leading-tight">
                        {t('team_ministry.intro_title')}
                    </h2>
                    <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: t('team_ministry.intro_desc') }} />
                </div>

                {/* Teams Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {teams.map((team, index) => {
                        const Icon = iconMap[team.icon] || HandHeart;
                        const isEnglish = i18n.language.startsWith('en');

                        return (
                            <motion.div
                                key={team.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50"
                            >
                                {/* Image Overlay */}
                                <div className="relative h-80 overflow-hidden">
                                    <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <img
                                        src={team.image}
                                        alt={isEnglish ? (team.englishName || team.name) : team.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg text-primary">
                                        <Icon size={20} />
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                            {team.name}
                                        </h3>
                                        <p className="text-sm font-bold text-accent uppercase tracking-wider">
                                            {team.englishName}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 leading-loose text-sm md:text-base">
                                        {team.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Join CTA */}
                <div className="mt-24 text-center">
                    <div className="inline-flex flex-col items-center p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg max-w-2xl mx-auto">
                        <HandHeart className="text-primary mb-4" size={48} />
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                            {t('team_ministry.cta_title')}
                        </h3>
                        <p className="text-stone-600 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('team_ministry.cta_desc') }} />
                        <a
                            href="mailto:thesentnamgyu@gmail.com"
                            className="inline-block px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary/90 hover:scale-105 transition-all active:scale-95"
                        >
                            {t('team_ministry.cta_button')}
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeamMinistry;

// Force deployment trigger
