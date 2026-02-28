import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dbService } from '../services/dbService';
import churchData from '../data/church_data.json';
import { Video, Users, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import clsx from 'clsx';
import { useSiteConfigValue } from '../context/SiteConfigContext';

const Worship = () => {
    const { t, i18n } = useTranslation();
    const { config, loading } = useSiteConfigValue();

    // Derived values from global config
    const headerBanner = config.newsBanner || config.worshipBanner || "/images/worship_banner.jpg";
    const height = config.newsHeight || config.worshipHeight || "medium";
    const bannerFit = config.newsBannerFit || config.worshipBannerFit || "cover";
    const overlayOpacity = config.newsOverlayOpacity !== undefined ? config.newsOverlayOpacity : (config.worshipOverlayOpacity !== undefined ? config.worshipOverlayOpacity : 40);

    const title = i18n.language === 'en' && (config.newsTitleEn || config.worshipTitleEn)
        ? (config.newsTitleEn || config.worshipTitleEn)
        : (config.newsTitle || config.worshipTitle);

    const subtitle = i18n.language === 'en' && (config.newsSubtitleEn || config.worshipSubtitleEn)
        ? (config.newsSubtitleEn || config.worshipSubtitleEn)
        : (config.newsSubtitle || config.worshipSubtitle);

    const titleFont = config.newsTitleFont || config.worshipTitleFont || "font-sans";
    const subtitleFont = config.newsSubtitleFont || config.worshipSubtitleFont || "font-sans";
    const titleColor = config.newsTitleColor || config.worshipTitleColor || "#ffffff";
    const subtitleColor = config.newsSubtitleColor || config.worshipSubtitleColor || "#ffffff";
    const titleItalic = config.newsTitleItalic !== undefined ? config.newsTitleItalic : (config.worshipTitleItalic !== undefined ? config.worshipTitleItalic : false);
    const subtitleItalic = config.newsSubtitleItalic !== undefined ? config.newsSubtitleItalic : (config.worshipSubtitleItalic !== undefined ? config.worshipSubtitleItalic : true);
    const titleWeight = config.newsTitleWeight || config.worshipTitleWeight || "font-bold";
    const subtitleWeight = config.newsSubtitleWeight || config.worshipSubtitleWeight || "font-medium";
    const titleSize = config.newsTitleSize || config.worshipTitleSize || 48;
    const subtitleSize = config.newsSubtitleSize || config.worshipSubtitleSize || 24;

    // Localized Service Data
    const services = (config.services || churchData.services || []).map(s => ({
        ...s,
        name: i18n.language === 'en' && s.nameEn ? s.nameEn : s.name,
        description: i18n.language === 'en' && s.descriptionEn ? s.descriptionEn : s.description
    }));

    const specialServices = config.specialServices || churchData.special_services || {};

    const otherMeetings = (config.otherMeetings || churchData.other_meetings || []).map(m => ({
        ...m,
        name: i18n.language === 'en' && m.nameEn ? m.nameEn : m.name,
        location: i18n.language === 'en' && m.locationEn ? m.locationEn : m.location
    }));

    // Handle hash navigation
    const { hash } = useLocation();
    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Worship Page Banner */}
            <section className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-screen" :
                    height === 'large' ? "h-[85vh]" :
                        height === 'medium' ? "h-[75vh]" :
                            "h-[50vh]"
            )}>
                <div className="absolute inset-0 z-0">
                    {isVideo(headerBanner) ? (
                        getYoutubeId(headerBanner) ? (
                            <div className="absolute inset-0 w-full h-full">
                                <iframe
                                    className={clsx(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans pointer-events-none transition-all duration-700 opacity-80",
                                        bannerFit === 'contain' ? "w-full h-full object-contain" : "w-[115%] h-[115%] min-w-full min-h-full object-cover"
                                    )}
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
                                className={clsx(
                                    "w-full h-full transition-all duration-700",
                                    bannerFit === 'contain' ? "object-contain" : "object-cover"
                                )}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        )
                    ) : (
                        <img
                            src={headerBanner}
                            alt="Worship Banner"
                            className={clsx(
                                "w-full h-full transition-all duration-700",
                                bannerFit === 'contain' ? "object-contain" : "object-cover"
                            )}
                            referrerPolicy="no-referrer"
                        />
                    )}
                    <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
                    <div
                        className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"
                        style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className={clsx(
                        "mb-4 tracking-tight animate-fade-in-up",
                        titleWeight,
                        titleFont,
                        titleItalic && "italic"
                    )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {title || t('worship.title')}
                    </h1>
                    <div className="w-20 h-1.5 bg-accent mx-auto mb-6 rounded-full" />
                    <p className={clsx(
                        "animate-fade-in-up delay-100",
                        subtitleWeight,
                        subtitleFont,
                        subtitleItalic && "italic"
                    )}
                        style={{
                            color: subtitleColor,
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {subtitle || "\"내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라\" (요한복음 14장 6절)"}
                    </p>
                </div>
            </section>

            {/* Main Content Sections */}
            <div className="container mx-auto px-4 py-20 font-sans">
                <div className="max-w-5xl mx-auto space-y-20">

                    {/* Sunday Service Section */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-10">
                            <Clock className="text-primary" size={32} />
                            <h2 className="text-3xl font-extrabold text-primary">{t('worship.sunday_service')} <span className="text-lg font-normal text-gray-400 ml-2">Sunday Service</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.map((service, index) => {
                                const isSpecial = index === 1;
                                return (
                                    <div key={index} className={clsx(
                                        "group relative rounded-3xl p-10 shadow-sm border transition-all duration-300 transform hover:-translate-y-1",
                                        isSpecial ? "bg-primary border-primary" : "bg-white border-gray-100 hover:shadow-xl hover:border-primary/20"
                                    )}>
                                        <div className={clsx(
                                            "absolute top-0 right-0 p-6 transition-opacity",
                                            isSpecial ? "opacity-10 text-white" : "opacity-5 group-hover:opacity-10"
                                        )}>
                                            <Clock size={80} />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className={clsx(
                                                "font-black text-sm uppercase tracking-widest mb-2",
                                                isSpecial ? "text-white/70" : "text-accent"
                                            )}>{t(service.name?.trim())}</span>
                                            <span className={clsx(
                                                "text-5xl font-black tracking-tighter",
                                                isSpecial ? "text-white" : "text-primary"
                                            )}>{service.time}</span>
                                            <p className={clsx(
                                                "mt-4 font-medium leading-relaxed",
                                                isSpecial ? "text-white/90" : "text-gray-500"
                                            )}>
                                                {i18n.language === 'en' && service.descriptionEn
                                                    ? service.descriptionEn
                                                    : t(service.description?.trim())}
                                            </p>
                                        </div>
                                        <div className={clsx(
                                            "h-1 w-12 mt-6 group-hover:w-24 transition-all duration-500 rounded-full",
                                            isSpecial ? "bg-white/50" : "bg-accent"
                                        )} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Secondary Meetings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Dawn Service Card */}
                        <div id="dawn" className="bg-secondary/30 rounded-3xl p-10 border border-gray-100 overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Video size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary">{t('worship.dawn_service')} <span className="text-sm font-normal text-gray-400">{t('worship.zoom_meeting')}</span></h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-8 uppercase">
                                        <span className="text-gray-800 font-bold text-lg md:text-xl whitespace-pre-line text-center leading-relaxed max-w-lg">
                                            {i18n.language === 'en' && (specialServices?.dawn?.scheduleEn || siteConfig?.specialServices?.dawn?.scheduleEn)
                                                ? (specialServices?.dawn?.scheduleEn || siteConfig?.specialServices?.dawn?.scheduleEn).split('\n').map(line => line.trim()).join('\n')
                                                : t((specialServices?.dawn?.schedule || churchData.special_services?.dawn?.schedule)?.trim())}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
                                        <span className="text-gray-500 font-medium">Zoom Link / ID</span>
                                        <span className="text-accent font-black text-2xl tracking-tight">{specialServices?.dawn?.link || churchData.special_services?.dawn?.link}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 text-center italic">{t('worship.online_desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Other Meetings Card */}
                        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-primary">{t('worship.others')} <span className="text-sm font-normal text-gray-400">Other Meetings</span></h3>
                            </div>

                            <div className="space-y-4">
                                {otherMeetings.map((meeting, idx) => (
                                    <div key={idx} className="group p-5 md:p-6 rounded-2xl border border-gray-50 hover:bg-gray-50 hover:border-gray-200 transition-all flex justify-between items-center gap-4">
                                        <div className="flex flex-col min-w-0">
                                            <span className={clsx(
                                                "font-bold text-gray-800 break-words",
                                                i18n.language === 'en' ? "text-[14px] md:text-[15px] leading-snug tracking-tight" : "text-lg"
                                            )}>{t(meeting.name?.trim())}</span>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                                <MapPin size={12} className="shrink-0" />
                                                <span className="truncate">{t(meeting.location?.trim())}</span>
                                            </div>
                                        </div>
                                        <div className="text-right whitespace-nowrap shrink-0">
                                            <span className={clsx(
                                                "font-black text-accent",
                                                i18n.language === 'en' ? "text-lg md:text-xl" : "text-xl"
                                            )}>{meeting.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Worship;
