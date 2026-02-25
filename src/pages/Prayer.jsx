import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Heart, Target, Clock, Send, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MinistryNav from '../components/MinistryNav';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const Prayer = () => {
    const { t, i18n } = useTranslation();
    const { config: siteConfig } = useSiteConfig();
    const type = 'prayer';

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formStatus, setFormStatus] = useState('idle');
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        request: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.contact || !formData.request) {
            alert(t('ministry.prayer.form_validation_error'));
            return;
        }

        setFormStatus('sending');

        // EmailJS Configuration from Site Config
        const SERVICE_ID = siteConfig?.emailjsServiceId;
        const TEMPLATE_ID = siteConfig?.emailjsTemplateId;
        const PUBLIC_KEY = siteConfig?.emailjsPublicKey;

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            alert(t('ministry.prayer.emailjs_missing'));
            setFormStatus('idle');
            return;
        }

        const templateParams = {
            from_name: formData.name,
            from_contact: formData.contact,
            message: formData.request,
            to_email: siteConfig?.emailjsReceivers || 'thesentnamgyu@gmail.com, thesentheejoung@gmail.com, leahkang22@gmail.com'
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            .then(() => {
                setFormStatus('success');
                alert(t('ministry.prayer.form_success'));
                setFormData({ name: '', contact: '', request: '' });
                setFormStatus('idle');
                setIsModalOpen(false);
            }, (error) => {
                console.error('FAILED...', error);
                setFormStatus('error');
                alert(t('ministry.prayer.form_error'));
                setFormStatus('idle');
            });
    };

    const banner = siteConfig?.prayerBanner || "/images/ministry_banner.jpg";
    const bannerTitle = (i18n.language === 'en' && siteConfig?.prayerTitleEn && siteConfig.prayerTitleEn !== "A church built on prayer") ? siteConfig.prayerTitleEn : (siteConfig?.prayerTitle || t('nav.prayer'));
    const bannerSubtitle = (i18n.language === 'en' && siteConfig?.prayerSubtitleEn) ? siteConfig.prayerSubtitleEn : (siteConfig?.prayerSubtitle || t('ministry.prayer.subtitle'));

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
            topics: (i18n.language === 'en' && (siteConfig?.prayerChurchTopicsEn || siteConfig?.prayerChurchTopics2026En))
                ? parseTopics(siteConfig.prayerChurchTopicsEn || siteConfig.prayerChurchTopics2026En)
                : (siteConfig?.prayerChurchTopics || siteConfig?.prayerChurchTopics2026)
                    ? parseTopics(siteConfig.prayerChurchTopics || siteConfig.prayerChurchTopics2026)
                    : (t('ministry.prayer.church_topics', { returnObjects: true }) || [])
        },
        {
            id: 'common',
            title: t('ministry.prayer.common_prayer_title'),
            icon: <Heart className="w-6 h-6" />,
            topics: (i18n.language === 'en' && siteConfig?.prayerCommonTopicsEn)
                ? parseTopics(siteConfig.prayerCommonTopicsEn)
                : siteConfig?.prayerCommonTopics
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
                        <h2 className="text-2xl md:text-4xl font-black text-blue-900 leading-loose">
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
                                    <span className="font-bold text-lg text-center px-4" dangerouslySetInnerHTML={{ __html: t('ministry.prayer.no_content_yet') }} />
                                </div>
                            )}
                        </div>

                        {/* Right Column: Invitation Text */}
                        <div className="text-left space-y-8">
                            <div className="text-lg md:text-xl text-stone-700 leading-loose font-bold break-keep"
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
                                    {(i18n.language === 'en' && siteConfig?.prayerCoreValuesTitleEn) ? siteConfig.prayerCoreValuesTitleEn : (siteConfig?.prayerCoreValuesTitle || t('ministry.prayer.section2_title'))}
                                </h3>
                            </div>
                            <div className="text-base md:text-lg text-stone-600 leading-[1.8] whitespace-pre-line font-medium break-keep pl-8">
                                {i18n.language === 'en'
                                    ? (siteConfig?.prayerCoreValuesEn || siteConfig?.prayerCoreValues || t('ministry.prayer.values_default'))
                                    : (siteConfig?.prayerCoreValues !== undefined ? siteConfig.prayerCoreValues : t('ministry.prayer.values_default'))}
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
                                    {(i18n.language === 'en' && siteConfig?.prayerGoalsTitleEn) ? siteConfig.prayerGoalsTitleEn : (siteConfig?.prayerGoalsTitle || t('ministry.prayer.section3_title'))}
                                </h3>
                            </div>
                            <div className="text-base md:text-lg text-stone-600 leading-[1.8] whitespace-pre-line font-medium break-keep pl-4">
                                {(() => {
                                    const rawText = i18n.language === 'en'
                                        ? (siteConfig?.prayerGoalsEn || siteConfig?.prayerGoals || t('ministry.prayer.goals_default'))
                                        : (siteConfig?.prayerGoals !== undefined ? siteConfig.prayerGoals : t('ministry.prayer.goals_default'));

                                    // Strip existing newlines and rebuild with responsive control
                                    const cleanText = rawText.replace(/\n/g, ' ');

                                    // For English, we might want different break logic or just simple wrapping
                                    if (i18n.language === 'en') {
                                        return <div>{rawText}</div>;
                                    }

                                    const formatted = cleanText
                                        .replace(/중보기도부는 기도로 교회를 세우고,/g, '중보기도부는 기도로 교회를 세우고,<br />')
                                        .replace(/성도들의 삶과 교회의 모든 사역이/g, '성도들의 삶과 교회의 모든 사역이<br class="md:hidden" />')
                                        .replace(/하나님의 /g, '하나님의<br class="hidden md:block" /> ')
                                        .replace(/뜻 안에서 /g, '뜻 안에서<br class="md:hidden" /> ')
                                        .replace(/이루어지도록 중보하며,/g, '이루어지도록 중보하며,<br />')
                                        .replace(/성도들이 함께 기도의 자리로 /g, '성도들이 함께 기도의 자리로<br class="md:hidden" /> ')
                                        .replace(/나아가도록 돕는 /g, '나아가도록 돕는<br class="hidden md:block" /> ')
                                        .replace(/영적 기도 공동체가 /g, '영적 기도 공동체가<br class="md:hidden" /> ');

                                    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
                                })()}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Operating Hours Box */}
                <div className="max-w-5xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-24 bg-blue-900/5 border border-blue-900/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-700 font-bold">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold text-blue-900 uppercase tracking-widest">
                                {(i18n.language === 'en' && siteConfig?.prayerHoursTitleEn) ? siteConfig.prayerHoursTitleEn : (siteConfig?.prayerHoursTitle || t('ministry.prayer.section4_title'))}
                            </span>
                        </div>
                        <div className="h-px w-full md:w-px md:h-12 bg-blue-900/20" />
                        <div className="text-xl font-sans font-bold text-blue-800 whitespace-pre-line leading-relaxed">
                            {i18n.language === 'en'
                                ? (siteConfig?.prayerHoursEn || siteConfig?.prayerHours || t('ministry.prayer.hours_default'))
                                : (siteConfig?.prayerHours !== undefined ? siteConfig.prayerHours : t('ministry.prayer.hours_default'))}
                        </div>
                    </motion.div>
                </div>

                {/* 3. Prayer Topics Section */}
                <div className="max-w-5xl mx-auto px-4 pb-32">
                    <div className="mb-20 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="text-blue-500 w-5 h-5" />
                            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Intercessory Ministry</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-blue-900 mb-6 tracking-tight">
                            {i18n.language === 'en'
                                ? (siteConfig?.prayerTopicsTitleEn || siteConfig?.prayerTopicsTitle || t('ministry.prayer.section1_title'))
                                : (siteConfig?.prayerTopicsTitle || t('ministry.prayer.section1_title'))}
                        </h2>
                        <div
                            className="text-lg text-stone-500 font-medium leading-relaxed max-w-2xl mx-auto break-keep"
                            dangerouslySetInnerHTML={{
                                __html: (i18n.language === 'en'
                                    ? (siteConfig?.prayerTopicsSubtitleEn || siteConfig?.prayerTopicsSubtitle || t('ministry.prayer.section1_desc'))
                                    : (siteConfig?.prayerTopicsSubtitle || t('ministry.prayer.section1_desc'))).replace(/\n/g, '<br/>')
                            }}
                        />
                    </div>

                    <div className="space-y-16">
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
                                        <p className="text-stone-400 font-bold py-2">{t('home.no_content_yet')}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. CTA Section / Banner Flow */}
                <div className="text-center pb-24">
                    {/* Banner Header */}
                    <div className="mb-16 max-w-2xl mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-black text-blue-900 mb-6 tracking-tight">
                            {t('ministry.prayer.invite_title')}
                        </h2>
                        <div className="space-y-3">
                            <p className="text-lg md:text-xl text-stone-700 font-bold leading-relaxed">
                                {t('ministry.prayer.invite_desc1')}
                            </p>
                            <p className="text-lg md:text-xl text-stone-700 font-bold leading-relaxed">
                                {t('ministry.prayer.invite_desc2')}
                            </p>
                            <p className="text-base text-stone-500 font-medium leading-relaxed pt-2">
                                {t('ministry.prayer.invite_privacy')}
                            </p>
                        </div>
                        <div className="mt-10 w-16 h-1 bg-blue-200 mx-auto rounded-full" />
                    </div>

                    <div className="relative max-w-sm mx-auto shadow-2xl overflow-hidden bg-white group cursor-pointer aspect-[3/4] rounded-3xl"
                        onClick={() => setIsModalOpen(true)}
                    >
                        {/* Background Image */}
                        {siteConfig?.prayerRequestImage && (
                            <div className="absolute inset-0">
                                <img
                                    src={siteConfig?.prayerRequestImage}
                                    alt="Prayer Request Background"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Bottom vignette only to help button visibility if needed */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            </div>
                        )}

                        {!siteConfig?.prayerRequestImage && (
                            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                <ImageIcon size={48} className="text-slate-300" />
                            </div>
                        )}

                        <div className="relative h-full flex flex-col items-center justify-end pb-12">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsModalOpen(true);
                                }}
                                className="px-10 py-4 bg-white text-blue-900 rounded-2xl font-black text-base hover:bg-blue-50 transition-all shadow-2xl active:scale-95 flex items-center gap-2 border border-slate-100"
                            >
                                <Send size={20} className="text-blue-600" />
                                {t('ministry.prayer.form_submit')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Prayer Request Modal */}
                {
                    isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                            >
                                <div className="p-8 pb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-black text-blue-900">{t('ministry.prayer.form_title')}</h3>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">{t('ministry.prayer.form_name')}</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-300"
                                            placeholder={t('ministry.prayer.form_name_placeholder')}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">{t('ministry.prayer.form_contact')}</label>
                                        <input
                                            type="text"
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-300"
                                            placeholder={t('ministry.prayer.form_contact_placeholder')}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">{t('ministry.prayer.form_request')}</label>
                                        <textarea
                                            value={formData.request}
                                            onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium h-40 resize-none placeholder:text-slate-300"
                                            placeholder={t('ministry.prayer.form_request_placeholder')}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formStatus === 'sending'}
                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                                    >
                                        {formStatus === 'sending' ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                {t('ministry.prayer.form_sending')}
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                {t('ministry.prayer.form_submit')}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-[10px] text-slate-400 font-medium whitespace-pre-line">
                                        {t('ministry.prayer.form_notice')}
                                    </p>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};

export default Prayer;
