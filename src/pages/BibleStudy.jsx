import React from 'react';
import { motion } from 'framer-motion';
import MinistryNav from '../components/MinistryNav';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-unused-vars
import { BookOpen, Map, Lightbulb, Users, ListChecks, Quote, Sprout, ArrowRight, Sun, Sparkles, Heart, Cross, MessageSquare, Calendar, Pencil, Image as ImageIcon } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { isVideo, getYoutubeId, getDriveId } from '../utils/mediaUtils';
import { Play } from 'lucide-react';
import clsx from 'clsx';

const BibleStudy = () => {
    const { t, i18n } = useTranslation();
    const { config: siteConfig } = useSiteConfig();
    const type = 'bible';

    const banner = siteConfig?.[`${type}Banner`] || siteConfig?.ministryBanner;
    const isEnglish = i18n.language.startsWith('en');

    // Fallback titles if config is missing
    const bannerTitle = (isEnglish && siteConfig?.[`${type}TitleEn`]) ? siteConfig[`${type}TitleEn`] : (siteConfig?.[`${type}Title`] || t('bible.banner_title'));
    const bannerSubtitle = (isEnglish && siteConfig?.[`${type}SubtitleEn`]) ? siteConfig[`${type}SubtitleEn`] : (siteConfig?.[`${type}Subtitle`] || t('bible.banner_subtitle'));

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
    const bibleStep1Image = siteConfig?.bibleStep1Image;
    const bibleStep2Image = siteConfig?.bibleStep2Image;
    const bibleStep3Image = siteConfig?.bibleStep3Image;
    const bibleStep4Image = siteConfig?.bibleStep4Image;

    const heroHeightClass = clsx(
        "relative w-full flex items-center justify-center overflow-hidden",
        height === 'full' ? "h-screen" :
            height === 'large' ? "h-[85vh]" :
                height === 'medium' ? "h-[75vh]" :
                    "h-[50vh]"
    );

    const curriculumThemes = [
        {
            id: 1,
            title: t('bible.theme1_title'),
            desc: t('bible.theme1_desc'),
            events: t('bible.theme1_events'),
            points: [t('bible.theme1_point1'), t('bible.theme1_point2')],
            color: 'bg-blue-500',
            icon: <Sun size={32} />,
            image: bibleStep1Image
        },
        {
            id: 2,
            title: t('bible.theme2_title'),
            desc: t('bible.theme2_desc'),
            events: t('bible.theme2_events'),
            points: [t('bible.theme2_point1'), t('bible.theme2_point2')],
            tip: t('bible.theme2_tip'),
            color: 'bg-blue-600',
            icon: <Sparkles size={32} />,
            image: bibleStep2Image
        },
        {
            id: 3,
            title: t('bible.theme3_title'),
            desc: t('bible.theme3_desc'),
            events: t('bible.theme3_events'),
            points: [t('bible.theme3_point1'), t('bible.theme3_point2')],
            color: 'bg-blue-700',
            icon: <Heart size={32} />,
            image: bibleStep3Image
        },
        {
            id: 4,
            title: t('bible.theme4_title'),
            desc: t('bible.theme4_desc'),
            events: t('bible.theme4_events'),
            points: [t('bible.theme4_point1'), t('bible.theme4_point2')],
            color: 'bg-blue-800',
            icon: <Cross size={32} />,
            image: bibleStep4Image
        },
    ];

    const scrollToContact = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#fdfbf7] font-sans text-slate-800 pb-20">
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
                    <MinistryNav active="bible" category="education" />
                </div>
            </div>

            {/* Section 1: Introduction */}
            <section className="py-32 bg-[#fdfbf7] relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-2xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-10"
                    >
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-widest uppercase mb-2">
                                {t('bible.intro_badge')}
                            </span>
                            <h2 className={clsx("font-sans font-black text-slate-900 break-keep", isEnglish ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl")}>
                                {t('bible.intro_title')}
                            </h2>
                        </div>

                        <div className={clsx("text-base md:text-xl text-slate-500 word-keep break-keep font-medium max-w-2xl mx-auto", isEnglish ? "leading-[2.2] md:leading-[2.5]" : "leading-[3.5]")}>
                            <p dangerouslySetInnerHTML={{ __html: t('bible.intro_desc') }} />
                        </div>

                        {/* Book Styled Card for Main Message */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, rotateY: -10 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="bg-blue-600 rounded-r-2xl rounded-l-sm shadow-2xl relative overflow-hidden max-w-md mx-auto flex min-h-[100px] group perspective-1000"
                        >
                            {/* Book Spine Area */}
                            <div className="w-5 md:w-8 bg-blue-800 shrink-0 relative border-r border-blue-400/40 shadow-inner flex flex-col justify-around py-4 items-center gap-2">
                                <div className="w-px h-full bg-white/10 absolute right-1" />
                                <div className="w-1 h-3 bg-blue-300/30 rounded-full" />
                                <div className="w-1 h-3 bg-blue-300/30 rounded-full" />
                                <div className="w-1 h-3 bg-blue-300/30 rounded-full" />
                            </div>

                            {/* Book Cover Area */}
                            <div className="flex-grow p-4 md:p-5 flex items-center justify-center relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-1 right-2 w-12 h-12 bg-blue-400/20 rounded-full border border-white/10 blur-xl" />

                                <h3
                                    className="relative z-10 text-sm md:text-base italic font-bold text-blue-50 leading-relaxed break-keep text-center tracking-wide"
                                    dangerouslySetInnerHTML={{ __html: `"${t('bible.intro_card_desc')}"` }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 1.5: Theological Difference */}
            <section className="py-20 bg-[#fdfbf7]">
                <div className="container mx-auto px-6 max-w-3xl text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-10 break-keep flex items-center justify-center gap-3">
                        <div className="p-2 bg-blue-600/10 text-blue-600 rounded-xl">
                            <Sparkles size={24} />
                        </div>
                        {t('bible.theo_diff_title')}
                    </h2>
                    <div className="space-y-8 text-slate-600 leading-loose text-base md:text-lg font-medium break-keep">
                        <p>
                            <p dangerouslySetInnerHTML={{ __html: t('bible.theo_diff_text1') }} />
                        </p>
                        <div className="w-full h-px bg-slate-200 my-8"></div>
                        <p className="text-slate-600 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t('bible.theo_diff_text2') }} />
                        <p>
                            <p dangerouslySetInnerHTML={{ __html: t('bible.theo_diff_text3') }} />
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: Curriculum */}
            < section className="py-32 bg-white" >
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-40 px-4">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8">{t('bible.curriculum_title')}</h2>
                        <p className="text-base md:text-lg text-slate-500 font-medium mb-10 break-keep">{t('bible.curriculum_subtitle')}</p>
                        <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-8">
                        {curriculumThemes.map((theme, idx) => (
                            <motion.div
                                key={theme.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="bg-[#fdfbf7] rounded-3xl border border-stone-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        {/* Left: Content */}
                                        <div className="p-6 md:p-8 flex flex-col items-start gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    "w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300",
                                                    theme.color
                                                )}>
                                                    {React.cloneElement(theme.icon, { size: 24 })}
                                                </div>
                                                <div>
                                                    <span className="text-blue-600 font-black text-[10px] tracking-wider uppercase block mb-0.5">{theme.desc}</span>
                                                    <h4 className="text-xl font-black text-slate-900">{theme.title}</h4>
                                                </div>
                                            </div>

                                            <div className="space-y-6 w-full">
                                                {/* Key Events */}
                                                <div className="bg-white/80 p-5 rounded-2xl border border-stone-100 shadow-sm">
                                                    <h5 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <Map size={14} /> {t('bible.key_events')}
                                                    </h5>
                                                    <p className="text-slate-700 font-bold break-keep" dangerouslySetInnerHTML={{ __html: theme.events }} />
                                                </div>

                                                {/* Learning Points */}
                                                <div className="space-y-4">
                                                    <h5 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2 px-1">
                                                        <Lightbulb size={14} /> {t('bible.learning_points')}
                                                    </h5>
                                                    <div className="space-y-3">
                                                        {theme.points.map((pt, pIdx) => (
                                                            <div key={pIdx} className="flex items-start gap-3 pl-1">
                                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                                                <p className="text-[17px] text-slate-600 leading-relaxed break-keep font-medium">
                                                                    {pt}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Tip (If exists) */}
                                                {theme.tip && t(theme.tip) !== theme.tip && (
                                                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                                                        <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <Sparkles size={14} /> 학습 팁
                                                        </h5>
                                                        <p className="text-sm text-blue-800 font-semibold break-keep leading-relaxed italic">
                                                            {t(theme.tip)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {theme.image ? (
                                            <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden bg-slate-50 flex items-center justify-center">
                                                {isVideo(theme.image) ? (
                                                    getYoutubeId(theme.image) ? (
                                                        <div className="w-full h-full bg-black">
                                                            <iframe
                                                                className="w-full h-full aspect-video"
                                                                src={`https://www.youtube.com/embed/${getYoutubeId(theme.image)}?autoplay=0&mute=0&controls=1`}
                                                                title={theme.title}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    ) : getDriveId(theme.image) ? (
                                                        <div className="w-full h-full bg-black">
                                                            <iframe
                                                                className="w-full h-full border-none"
                                                                src={`https://drive.google.com/file/d/${getDriveId(theme.image)}/preview`}
                                                                title={theme.title}
                                                                allow="autoplay"
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    ) : (
                                                        <video
                                                            src={theme.image}
                                                            className="w-full h-full object-cover bg-black"
                                                            controls
                                                            playsInline
                                                        />
                                                    )
                                                ) : (
                                                    <>
                                                        <img
                                                            src={theme.image}
                                                            alt={theme.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.classList.add('flex-col', 'gap-4', 'text-slate-300');
                                                                const icon = document.createElement('div');
                                                                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                                                const span = document.createElement('span');
                                                                span.innerText = '이미지를 불러올 수 없습니다';
                                                                span.className = 'text-sm font-medium';
                                                                e.target.parentElement.appendChild(icon);
                                                                e.target.parentElement.appendChild(span);
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="hidden lg:flex items-center justify-center bg-stone-50 border-l border-stone-100 min-h-[400px]">
                                                <div className="text-stone-300 flex flex-col items-center gap-4">
                                                    <ImageIcon size={48} className="opacity-50" />
                                                    <span className="text-sm font-medium">이미지 준비중</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Section 3: Study Guide */}
            < section className="py-12 bg-[#efebe9]" >
                <div className="container mx-auto px-6 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-stone-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 text-blue-50 opacity-20 hidden md:block">
                            <BookOpen size={80} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
                                    <Calendar size={20} />
                                </div>
                                {t('bible.guide_title')}
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { icon: <Calendar size={16} />, text: t('bible.guide_time') },
                                    { icon: <Pencil size={16} />, text: t('bible.guide_material') },
                                    { icon: <BookOpen size={16} />, text: t('bible.guide_method') }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-[#fdfbf7] rounded-xl border border-stone-50 hover:bg-white hover:shadow-sm transition-all">
                                        <div className="text-blue-600">{item.icon}</div>
                                        <p className="text-base md:text-lg font-bold text-slate-700">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* Section 4: Recommendations */}
            < section className="py-24 bg-blue-900 text-white relative overflow-hidden" >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
                    <h3 className="text-3xl font-black mb-12 text-blue-300">{t('bible.recommend_title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(t('bible.recommend_items', { returnObjects: true }) || []).map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300">
                                    <ListChecks size={24} />
                                </div>
                                <p className="text-base md:text-xl font-medium leading-relaxed break-keep">
                                    {item}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Section 5: Our Prayer */}
            < section className="py-24 bg-white" >
                <div className="container mx-auto px-6 max-w-5xl">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-stone-900 text-white rounded-[1.5rem] text-center relative overflow-hidden shadow-2xl max-w-2xl mx-auto"
                    >
                        <Quote className="w-6 h-6 text-stone-700 absolute top-5 left-5" />
                        <div className="relative z-10 max-w-xl mx-auto">
                            <p className="text-base md:text-lg font-medium leading-relaxed mb-3 break-keep italic">
                                <span className="md:hidden" dangerouslySetInnerHTML={{ __html: `"${t('bible.verse_mobile')}"` }} />
                                <span className="hidden md:block" dangerouslySetInnerHTML={{ __html: `"${t('bible.verse')}"` }} />
                            </p>
                            <p className="text-blue-400 font-bold tracking-widest uppercase text-xs">{t('bible.verse_ref')}</p>
                        </div>
                    </motion.div>

                    {/* Inquiry Button at the bottom */}
                    <div className="mt-40 text-center">
                        <motion.a
                            href="mailto:thesentheejoung@gmail.com"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-full font-black shadow-2xl hover:bg-blue-700 transition-all text-xl"
                        >
                            <MessageSquare size={24} />
                            {t('bible.inquiry_button')}
                        </motion.a>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default BibleStudy;


