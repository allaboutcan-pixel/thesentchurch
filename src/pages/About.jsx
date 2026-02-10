import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import churchData from '../data/church_data.json';
import { Mail, Clock, Video, Users, MapPin, Phone, Youtube, Facebook, Instagram, ExternalLink } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { dbService } from '../services/dbService';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useLocation } from 'react-router-dom';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import clsx from 'clsx';

const About = () => {
    const { t, i18n } = useTranslation();
    const { config } = useSiteConfig();
    const location = useLocation();
    const [headerBanner, setHeaderBanner] = useState("/images/about_banner.jpg");
    const [title, setTitle] = useState(null);
    const [subtitle, setSubtitle] = useState(null);
    const [titleFont, setTitleFont] = useState("font-sans");
    const [subtitleFont, setSubtitleFont] = useState("font-sans");
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [subtitleColor, setSubtitleColor] = useState("#ffffff");
    const [titleItalic, setTitleItalic] = useState(false);
    const [subtitleItalic, setSubtitleItalic] = useState(false);
    const [titleWeight, setTitleWeight] = useState("font-bold");
    const [subtitleWeight, setSubtitleWeight] = useState("font-medium");
    const [titleSize, setTitleSize] = useState(48);
    const [subtitleSize, setSubtitleSize] = useState(24);
    const [overlayOpacity, setOverlayOpacity] = useState(40);
    const [height, setHeight] = useState("medium");

    // Force scroll to hash on mount/update with delay to handle layout shifts
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500); // 500ms delay to allow images/content to load
        }
    }, [location]);
    const visionImage = "/images/vision_card_bg.jpg";
    const missionImage = "https://drive.google.com/thumbnail?id=1K18zVZRrR2K-5i0SyjPQXtJbvvUwrd_9&sz=w2560";
    const ministryImage = "https://drive.google.com/thumbnail?id=12jIhyqVtd5vn93bMb2fOy8n3teQZXZsN&sz=w2560";
    const [staffList, setStaffList] = useState(churchData.intro.staff || []);
    const [pastorInfo, setPastorInfo] = useState(churchData.intro.pastor);

    // Worship Section Data
    const [services, setServices] = useState(churchData.services || []);
    const [specialServices, setSpecialServices] = useState(churchData.special_services || {});
    const [otherMeetings, setOtherMeetings] = useState(churchData.other_meetings || []);

    // Location Section Data
    const [locationConfig, setLocationConfig] = useState({
        address: churchData.general.address,
        phone: churchData.general.phone.join(', '),
        ...churchData.general
    });

    useEffect(() => {
        if (config) {
            if (config.aboutBanner) setHeaderBanner(config.aboutBanner);
            if (config.aboutTitle !== undefined) setTitle(config.aboutTitle);
            if (config.aboutSubtitle !== undefined) setSubtitle(config.aboutSubtitle);
            if (config.aboutTitleFont) setTitleFont(config.aboutTitleFont);
            if (config.aboutSubtitleFont) setSubtitleFont(config.aboutSubtitleFont);
            if (config.aboutTitleColor) setTitleColor(config.aboutTitleColor);
            if (config.aboutSubtitleColor) setSubtitleColor(config.aboutSubtitleColor);
            if (config.aboutTitleItalic !== undefined) setTitleItalic(config.aboutTitleItalic);
            if (config.aboutSubtitleItalic !== undefined) setSubtitleItalic(config.aboutSubtitleItalic);
            if (config.aboutTitleWeight) setTitleWeight(config.aboutTitleWeight);
            if (config.aboutSubtitleWeight) setSubtitleWeight(config.aboutSubtitleWeight);
            if (config.aboutTitleSize) setTitleSize(config.aboutTitleSize);
            if (config.aboutSubtitleSize) setSubtitleSize(config.aboutSubtitleSize);
            if (config.aboutOverlayOpacity !== undefined) setOverlayOpacity(config.aboutOverlayOpacity);
            if (config.aboutHeight) setHeight(config.aboutHeight);

            if (config.staff) setStaffList(config.staff);
            if (config.pastor) setPastorInfo(prev => ({ ...prev, ...config.pastor }));

            // Worship Data
            if (config.services) setServices(config.services);
            if (config.specialServices) setSpecialServices(config.specialServices);
            if (config.otherMeetings) setOtherMeetings(config.otherMeetings);

            // Location Data
            if (config.location) {
                setLocationConfig(prev => ({
                    ...prev,
                    address: config.location.address || prev.address,
                    phone: config.location.phone || prev.phone,
                    mapEmbed: config.location.mapEmbed || prev.mapEmbed
                }));
            }
        }
    }, [config]);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-[75vh] md:h-screen" :
                    height === 'large' ? "h-[70vh]" :
                        height === 'medium' ? "h-[60vh] min-h-[500px]" :
                            "h-[35vh]"
            )}>
                <div className="absolute inset-0 z-0">
                    {isVideo(headerBanner) ? (
                        getYoutubeId(headerBanner) ? (
                            <div className="absolute inset-0 w-full h-full">
                                <iframe
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] min-w-full min-h-full pointer-events-none object-cover opacity-80"
                                    src={`https://www.youtube.com/embed/${getYoutubeId(headerBanner)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(headerBanner)}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
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
                            alt="About Banner"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    )}
                </div>
                <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
                <div
                    className="absolute inset-0 bg-black/40 z-[1] pointer-events-none"
                    style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                />
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "font-bold mb-4 drop-shadow-sm",
                            titleFont,
                            titleItalic && "italic"
                        )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {title !== null ? title : t('about.title')}
                    </motion.h1>
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
                            "drop-shadow-md max-w-2xl mx-auto",
                            subtitleWeight,
                            subtitleFont,
                            subtitleItalic && "italic"
                        )}
                        style={{
                            color: subtitleColor,
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {subtitle || "\"주 예수를 믿으라 그리하면 너와 네 집이 구원을 얻으리라\" (사도행전 16장 31절)"}
                    </motion.p>
                </div>
            </div>

            {/* Pastor Section (Identity/Greetings) */}
            <section id="pastor" className="py-32 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-32 text-center">
                            <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">{t('about.pastor_label')}</span>
                            <h2 className="text-4xl font-bold text-primary">{t('about.pastor_title')}</h2>
                            <div className="w-16 h-1.5 bg-accent mt-12 rounded-full mx-auto" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="w-full md:w-5/12">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                                    <img
                                        src={pastorInfo.image || pastorInfo.photo} // Fallback for safety
                                        alt={pastorInfo.name}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        loading="lazy"
                                    />
                                </div>

                            </div>
                            <div className="w-full md:w-7/12">
                                <div className="prose prose-lg text-gray-600 max-w-none">
                                    <p className="mb-2 mt-12 leading-[2.2] whitespace-pre-line text-gray-700 break-keep">
                                        {i18n.language === 'en' ? t('pastor_message_full') : (pastorInfo.message || pastorInfo.greeting)}
                                    </p>
                                    <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-end">
                                        <p className="font-extrabold text-gray-900 flex items-baseline gap-2">
                                            <span className="text-xl">{pastorInfo.name}</span>
                                            {pastorInfo.englishName && (
                                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{pastorInfo.englishName}</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-primary font-black mt-0.5 uppercase tracking-tighter">{pastorInfo.role || t('nav.senior_pastor')}</p>
                                    </div>



                                    {/* Pastor History Section (Left Aligned) */}
                                    <div className="mt-40 pt-6 border-t border-gray-100">
                                        <h4 className="text-sm font-bold text-blue-600 mb-3">{t('about.pastor_history_title')}</h4>
                                        <ul className="space-y-1.5 pl-2">
                                            {(t('about.pastor_history', { returnObjects: true }) || pastorInfo.history || churchData.intro.pastor.history).map((item, idx) => (
                                                <li key={idx} className="text-sm text-gray-500 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full mt-1.5 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section (New Card Layout) */}
            <section id="intro" className="py-32 overflow-hidden scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">{t('about.intro_label')}</span>
                        <h2 className="text-3xl font-bold text-primary">{t('about.intro_title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Vision Card */}
                        <div className="relative group rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] flex flex-col p-8 text-white">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={visionImage}
                                    alt="Vision Background"
                                    className="w-full h-full object-cover object-left transform group-hover:scale-110 transition-transform duration-700"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-4 flex items-baseline gap-2 text-white">
                                    VISION <span className="text-xl font-bold opacity-80">{t('about.vision_title')}</span>
                                </h3>
                                <div className={clsx(
                                    "font-bold leading-relaxed opacity-95 whitespace-pre-wrap",
                                    i18n.language.startsWith('en') ? "text-xs md:text-sm" : "text-sm md:text-base"
                                )}>
                                    {t('about.vision_desc')}
                                </div>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="relative group rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] flex flex-col p-8 text-white">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={missionImage}
                                    alt="Mission Background"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-4 flex items-baseline gap-2 text-white">
                                    MISSION <span className="text-xl font-bold opacity-80">{t('about.mission_title')}</span>
                                </h3>
                                <div className={clsx(
                                    "font-bold opacity-95 whitespace-pre-wrap",
                                    i18n.language.startsWith('en') ? "text-[11px] md:text-xs leading-tight" : "text-xs md:text-sm leading-tight"
                                )}>
                                    {t('about.mission_desc')}
                                </div>
                            </div>
                        </div>

                        {/* Ministry Card (Core Values) */}
                        <div className="relative group rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] flex flex-col p-8 text-white">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={ministryImage}
                                    alt="Ministry Background"
                                    className="w-full h-full object-cover object-bottom transform group-hover:scale-110 transition-transform duration-700"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black mb-4 flex items-baseline gap-2 text-white">
                                    MINISTRY <span className="text-xl font-bold opacity-80">{t('about.values_title')}</span>
                                </h3>
                                <ul className="space-y-1 pl-4 py-1 border-l-2 border-accent/50">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                                        const text = t(`nav.val${num}`);
                                        const [title, desc] = text.includes(':') ? text.split(':') : [text, ''];
                                        return (
                                            <li key={num} className="leading-tight">
                                                <div className={clsx(
                                                    "font-black tracking-wide mb-0.5 opacity-100",
                                                    i18n.language.startsWith('en') ? "text-[11px] md:text-xs" : "text-xs md:text-sm"
                                                )}>
                                                    {title}
                                                </div>
                                                <div className={clsx(
                                                    "font-medium opacity-80 whitespace-pre-wrap",
                                                    i18n.language.startsWith('en') ? "text-[10px] md:text-[11px]" : "text-[11px] md:text-xs"
                                                )}>
                                                    {desc}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Affiliated Organizations Section */}
            <section id="affiliated_orgs" className="py-32 scroll-mt-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-16">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">AFFILIATED</span>
                        <h2 className="text-3xl font-bold text-primary">{t('about.affiliated_orgs_title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
                    </div>

                    <p className="text-gray-700 font-bold italic font-sans text-sm md:text-base leading-[2.5] max-w-4xl mx-auto mb-16 break-keep">
                        <Trans
                            i18nKey="about.denomination_info"
                            components={{
                                blue: <span className="text-primary" />,
                                br: <br />,
                                mbr: <br className="md:hidden" />
                            }}
                        />
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto px-2 md:px-0">
                        {/* 1. Korea Evangelical Holiness Church */}
                        <a
                            href="http://www.sungkyulusa.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group h-24 md:h-40 rounded-2xl md:rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center p-2 md:p-4"
                        >
                            <img
                                src={dbService.formatDriveImage("https://drive.google.com/file/d/1hDlHKMFvCefn4blOYJnBjS7coqx4QjVZ/view?usp=drive_link") + "?v=1"}
                                alt="예수교 대한 성결 교단"
                                className="h-10 md:h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100 transform group-hover:scale-110"
                            />
                        </a>

                        {/* 2. EFCC */}
                        <a
                            href="https://www.lpd-efcc.ca/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group h-24 md:h-40 rounded-2xl md:rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center p-2 md:p-4"
                        >
                            <img
                                src={dbService.formatDriveImage("https://drive.google.com/file/d/1F_bVHLk_kuptf_tXbUo9l-AywOQXIfCw/view?usp=drive_link") + "?v=1"}
                                alt="EFCC"
                                className="h-10 md:h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100 transform group-hover:scale-110"
                                loading="lazy"
                            />
                        </a>

                        {/* 3. Trinity Western University (Text Only) */}
                        <a
                            href="https://www.twu.ca/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group h-24 md:h-40 rounded-2xl md:rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center p-2 md:p-4"
                        >
                            <span className="text-[10px] md:text-xl font-black text-gray-400 group-hover:text-[#002856] transition-colors duration-300 text-center leading-tight">
                                Trinity Western<br />University
                            </span>
                        </a>

                        {/* 4. Trinity Evangelical Divinity School (TEDS) (Text Only) */}
                        <a
                            href="https://www.tiu.edu/divinity/?utm_source=googlemybusiness_TEDS&utm_medium=organic&utm_campaign=googlemybusiness"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group h-24 md:h-40 rounded-2xl md:rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center p-2 md:p-4"
                        >
                            <span className="text-[10px] md:text-xl font-black text-gray-400 group-hover:text-[#002856] transition-colors duration-300 text-center leading-tight">
                                Trinity Evangelical<br />Divinity School
                            </span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Staff Section */}
            <section id="staff" className="py-32 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">{t('about.staff_label')}</span>
                        <h2 className="text-3xl font-bold text-primary">{t('about.staff_title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {staffList.map((staff, index) => (
                            <div key={index} className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-lg hover:shadow-xl transition-shadow group">
                                <div className="w-48 aspect-[3/4] bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden shadow-inner relative">
                                    {staff.image ? (
                                        <img src={staff.image} alt={staff.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                                    ) : (
                                        <span className="text-6xl font-black opacity-20">{staff.name[0]}</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{staff.name}</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{staff.englishName}</p>
                                    <p className="text-accent font-medium mb-4 text-sm">
                                        {staff.role === '담임목사' ? t('nav.role_pastor') :
                                            staff.role === '유스 담당' ? t('nav.role_youth') :
                                                staff.role === '행정' ? t('nav.role_admin') : staff.role}
                                    </p>
                                    <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={14} />
                                        <a href={`mailto:${staff.email}`} className="hover:text-primary transition-colors">{staff.email}</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Worship Guide Section */}
            <section id="worship" className="py-32 bg-gray-50 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">WORSHIP</span>
                        <h2 className="text-3xl font-bold text-primary">{t('worship.title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
                        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{t('worship.verse')}</p>
                    </div>

                    <div className="max-w-5xl mx-auto space-y-16">
                        {/* Sunday Service */}
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-8">
                                <Clock className="text-primary" size={28} />
                                <h3 className="text-2xl font-bold text-primary">{t('worship.sunday_service')}</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {services.map((service, index) => {
                                    const isSpecial = index === 1;
                                    return (
                                        <div key={index} className={clsx(
                                            "rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow",
                                            isSpecial ? "bg-primary border-primary" : "bg-white border-gray-100"
                                        )}>
                                            <div className="flex flex-col">
                                                <span className={clsx(
                                                    "font-bold text-xs uppercase tracking-widest mb-2",
                                                    isSpecial ? "text-white/70" : "text-accent"
                                                )}>{t(service.name?.trim())}</span>
                                                <span className={clsx(
                                                    "text-4xl font-black tracking-tight mb-4",
                                                    isSpecial ? "text-white" : "text-primary"
                                                )}>{service.time}</span>
                                                {service.description && (
                                                    <p className={clsx(
                                                        "text-sm leading-relaxed",
                                                        isSpecial ? "text-white/90" : "text-gray-500"
                                                    )}>{t(service.description?.trim())}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Other Services Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Dawn Service */}
                            <div id="dawn" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm scroll-mt-32">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Video size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary">{t('worship.dawn_service')}</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                        <span className="text-gray-500 text-sm font-medium">{t('game_schedule', { defaultValue: 'Schedule' })}</span>
                                        {/* Use t() for schedule text if it matches known constant. otherwise display as is */}
                                        <span className="text-primary font-bold text-right">{t((specialServices?.dawn?.schedule || churchData.special_services?.dawn?.schedule)?.trim())}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <span className="block text-gray-400 text-xs mb-1">Zoom Link / ID</span>
                                        {(() => {
                                            const dawnLinkValue = specialServices?.dawn?.link || churchData.special_services?.dawn?.link;
                                            const isUrl = dawnLinkValue?.includes('http') || dawnLinkValue?.includes('zoom.us');
                                            const cleanId = dawnLinkValue?.replace(/[^0-9]/g, '');
                                            const finalLink = isUrl ? dawnLinkValue : (cleanId ? `https://zoom.us/j/${cleanId}` : null);

                                            return (
                                                <div className="flex items-center justify-between gap-2 mt-1 w-full">
                                                    <span className="text-accent font-black text-lg tracking-tight select-all">
                                                        {dawnLinkValue}
                                                    </span>

                                                    {finalLink && (
                                                        <a
                                                            href={finalLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:opacity-80 transition-opacity flex items-center"
                                                            title="Zoom 바로가기"
                                                        >
                                                            {/* Container to clip the scaled image */}
                                                            <div className="h-16 w-40 overflow-hidden flex items-center justify-center rounded-lg bg-white/0">
                                                                <img
                                                                    src="https://drive.google.com/thumbnail?id=1T--SPYZF9TLigoW9FRiyz0s5ntWDstZD&sz=w1000"
                                                                    alt="Zoom 바로가기"
                                                                    className="w-[120%] max-w-none object-cover transform scale-125"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        </a>
                                                    )}

                                                    {!finalLink && <span className="text-xs text-red-400 font-medium">(링크 설정 필요)</span>}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <p className="text-xs text-gray-400 text-center italic mt-2">{t('worship.online_desc')}</p>
                                </div>
                            </div>

                            {/* Other Meetings */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                        <Users size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-primary">{t('worship.others')}</h3>
                                </div>

                                <div className="space-y-3">
                                    {otherMeetings.map((meeting, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                                            <div className="mb-1 sm:mb-0">
                                                <h4 className="font-bold text-gray-800">{t(meeting.name?.trim())}</h4>
                                                <p className="text-xs text-accent font-medium">{t(meeting.location?.trim())}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-white text-primary text-sm font-bold rounded-lg border border-gray-100 shadow-sm min-w-[80px] text-center">
                                                    {meeting.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section id="location" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">LOCATION</span>
                        <h2 className="text-3xl font-bold text-primary">{t('location.title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
                    </div>

                    <div className="max-w-5xl mx-auto space-y-12">
                        {/* Map Section */}
                        <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                            {locationConfig.mapEmbed && locationConfig.mapEmbed.startsWith('<iframe') ? (
                                <div dangerouslySetInnerHTML={{ __html: locationConfig.mapEmbed }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
                            ) : (
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(locationConfig.address || "9025 Glover Rd, Fort Langley, BC")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Church Location"
                                ></iframe>
                            )}
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Address & SNS */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                        <div className="p-2 bg-accent/10 rounded-xl">
                                            <MapPin className="text-accent" size={24} />
                                        </div>
                                        {t('location.address_label')}
                                    </h3>
                                    <div className="pl-2 border-l-2 border-gray-100 ml-3">
                                        <p className="text-lg text-gray-700 font-bold leading-relaxed">{locationConfig.address}</p>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Social Media</p>
                                    <div className="flex gap-4">
                                        <a href={churchData.general.social.youtube} target="_blank" rel="noopener noreferrer"
                                            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm">
                                            <Youtube size={24} />
                                        </a>
                                        <a href={churchData.general.social.facebook} target="_blank" rel="noopener noreferrer"
                                            className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm">
                                            <Facebook size={24} />
                                        </a>
                                        <a href={churchData.general.social.instagram} target="_blank" rel="noopener noreferrer"
                                            className="p-3 bg-pink-50 text-pink-600 rounded-2xl hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm">
                                            <Instagram size={24} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                        <div className="p-2 bg-accent/10 rounded-xl">
                                            <Phone className="text-accent" size={24} />
                                        </div>
                                        {t('location.contact_label')}
                                    </h3>
                                    <div className="pl-2 border-l-2 border-gray-100 ml-3 space-y-6">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('location.phone')}</p>
                                            <div className="space-y-2">
                                                {typeof locationConfig.phone === 'string' ? (
                                                    (() => {
                                                        const phones = locationConfig.phone.split(/[,\/]/);
                                                        return phones.map((p, i) => (
                                                            <span key={i} className="block text-gray-800 font-bold text-lg leading-tight">{p.trim()}</span>
                                                        ));
                                                    })()
                                                ) : (
                                                    <span className="text-gray-700 font-bold text-lg">{locationConfig.phone}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('location.email')}</p>
                                            <a href={`mailto:${churchData.general.email}`} className="flex items-center gap-2 text-gray-700 font-medium hover:text-accent transition-colors group">
                                                <Mail size={16} className="text-gray-400 group-hover:text-accent" />
                                                <p>{churchData.general.email}</p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
