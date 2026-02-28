import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import churchData from '../data/church_data.json';
import sermonsInitialData from '../data/sermons.json';
import { dbService } from '../services/dbService';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { isVideo, getYoutubeId, getDriveId } from '../utils/mediaUtils';
import QuickLinks from '../components/QuickLinks';
import CalendarWidget from '../components/CalendarWidget';
import clsx from 'clsx';

// Lazy load the popup to reduce initial bundle size
const DailyWordPopup = lazy(() => import('../components/DailyWordPopup'));

const DEFAULT_HERO_IMAGE = ""; // Set to empty to avoid accidental flashes

const Home = () => {
    // ... items ...
    const [latestSermon, setLatestSermon] = useState(sermonsInitialData[0] || {});
    const [latestDailyWord, setLatestDailyWord] = useState(null);
    const [heroImage, setHeroImage] = useState("");
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroTitleSize, setHeroTitleSize] = useState(64);
    const [heroSubtitleSize, setHeroSubtitleSize] = useState(24);
    const [heroTitleColor, setHeroTitleColor] = useState("#FFFFFF");
    const [heroSubtitleColor, setHeroSubtitleColor] = useState("#FFFFFF");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [heroTitleItalic, setHeroTitleItalic] = useState(false);
    const [heroSubtitleItalic, setHeroSubtitleItalic] = useState(false);
    const [heroTitleWeight, setHeroTitleWeight] = useState("font-bold");
    const [heroSubtitleWeight, setHeroSubtitleWeight] = useState("font-medium");
    const [heroTitleFont, setHeroTitleFont] = useState("font-sans");
    const [heroSubtitleFont, setHeroSubtitleFont] = useState("font-sans");
    const [heroOverlayOpacity, setHeroOverlayOpacity] = useState(50);
    const [heroHeight, setHeroHeight] = useState("full");
    const [heroBannerFit, setHeroBannerFit] = useState("cover");
    const { config, loading: configLoading } = useSiteConfig();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        let isMounted = true;
        const fetchLiveContent = async () => {
            try {
                // Fetch in parallel for better performance
                const [liveSermons, liveDailyWords] = await Promise.all([
                    dbService.getSermons(),
                    dbService.fetchItems('daily_word', 7) // Enough context to find today's word
                ]);

                if (!isMounted) return;

                if (Array.isArray(liveSermons) && liveSermons.length > 0) {
                    // Safety check: extract ID for all sermons to handle malformed data
                    const cleanedSermons = liveSermons.map(s => {
                        if (s && s.youtubeId && s.youtubeId.length > 11) {
                            const extractedId = getYoutubeId(s.youtubeId);
                            if (extractedId) return { ...s, youtubeId: extractedId };
                        }
                        return s;
                    });
                    if (isMounted) setLatestSermon(cleanedSermons[0] || {});
                }

                if (Array.isArray(liveDailyWords) && liveDailyWords.length > 0) {
                    // Use local date to match user's device time (fixes UTC/KST issues)
                    const d = new Date();
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const todayStr = `${year}-${month}-${day}`;
                    // Find word exactly for today to support scheduling
                    const todayWord = liveDailyWords.find(w => w && w.date === todayStr);

                    // User Request: If it's Sunday (0) and no word for today, look for tomorrow (Monday)
                    let displayWord = todayWord;
                    if (!displayWord && d.getDay() === 0) {
                        const tomorrow = new Date(d);
                        tomorrow.setDate(d.getDate() + 1);
                        const tomStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                        displayWord = liveDailyWords.find(w => w && w.date === tomStr);
                    }

                    // If no word for today or tomorrow (e.g. general fallback), find the last available past word
                    // Important fallback: Always show something if data exists (sorted[0] is the most recent)
                    const validWords = liveDailyWords.filter(w => w && w.date);
                    const lastWord = validWords.filter(w => w.date < todayStr).sort((a, b) => new Date(b.date) - new Date(a.date))[0] || validWords[0];

                    if (isMounted) setLatestDailyWord(displayWord || lastWord || null);
                }

                if (config && isMounted) {
                    if (config.heroImage) setHeroImage(config.heroImage);

                    // Multi-language support for Hero
                    const title = i18n.language === 'en' && config.heroTitleEn ? config.heroTitleEn : config.heroTitle;
                    const subtitle = i18n.language === 'en' && config.heroSubtitleEn ? config.heroSubtitleEn : config.heroSubtitle;

                    if (title) setHeroTitle(title);
                    if (subtitle) setHeroSubtitle(subtitle);

                    if (config.heroTitleColor) setHeroTitleColor(config.heroTitleColor);
                    if (config.heroSubtitleColor) setHeroSubtitleColor(config.heroSubtitleColor);
                    if (config.heroTitleItalic !== undefined) setHeroTitleItalic(config.heroTitleItalic);
                    if (config.heroSubtitleItalic !== undefined) setHeroSubtitleItalic(config.heroSubtitleItalic);
                    if (config.heroTitleSize) setHeroTitleSize(config.heroTitleSize);
                    if (config.heroSubtitleSize) setHeroSubtitleSize(config.heroSubtitleSize);
                    if (config.heroTitleFont) setHeroTitleFont(config.heroTitleFont);
                    else if (config.titleFont) setHeroTitleFont(config.titleFont);

                    if (config.heroSubtitleFont) setHeroSubtitleFont(config.heroSubtitleFont);
                    else if (config.subtitleFont) setHeroSubtitleFont(config.subtitleFont);

                    if (config.heroOverlayOpacity !== undefined) setHeroOverlayOpacity(config.heroOverlayOpacity);
                    else if (config.overlayOpacity !== undefined) setHeroOverlayOpacity(config.overlayOpacity);

                    if (config.heroHeight) setHeroHeight(config.heroHeight);
                    if (config.heroBannerFit) setHeroBannerFit(config.heroBannerFit);
                    if (config.youtubeUrl) setYoutubeUrl(config.youtubeUrl);
                }
            } catch (e) {
                if (isMounted) console.warn("Could not fetch live content, using defaults.");
            }
        };
        fetchLiveContent();
        return () => { isMounted = false; };
    }, [config, i18n.language]);

    useEffect(() => {
        // Immediately reset video loaded state when image/video source changes
        // to prevent "flicker" of the previous video
        setIsVideoLoaded(false);
    }, [heroImage]);

    const posterUrl = useMemo(() => {
        if (!heroImage || typeof heroImage !== 'string') return "";

        try {
            const ytId = getYoutubeId(heroImage);
            if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

            // Google Drive handling
            if (heroImage.includes('drive.google.com')) {
                // If it's strictly an image (thumbnail), just return it
                if (heroImage.includes('thumbnail')) return heroImage;

                // If it's a video (or generic drive link), try to get the thumbnail as poster
                const driveId = getDriveId(heroImage);
                if (driveId) {
                    // Return high-res thumbnail for poster (w1280 is sufficient and faster)
                    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1280`;
                }
                return "";
            }

            if (isVideo(heroImage)) return "";
            return heroImage;
        } catch (e) {
            console.error("Error calculating poster URL:", e);
            return "";
        }
    }, [heroImage]);


    return (
        <div className="min-h-screen">
            <Suspense fallback={null}>
                <DailyWordPopup word={latestDailyWord} />
            </Suspense>
            {/* Hero Section (Main Banner) */}
            <section className={clsx(
                "relative flex items-center justify-center overflow-hidden bg-black", // Changed to bg-black for cleaner transitions
                heroHeight === 'full' ? "h-screen" :
                    heroHeight === 'large' ? "h-[85vh]" :
                        heroHeight === 'medium' ? "h-[75vh]" :
                            "h-[50vh]"
            )}>
                <div className={clsx(
                    "absolute inset-0 z-0",
                    heroImage?.includes('drive.google.com') && "hero-video-mask"
                )}>
                    {/* 1. Poster Layer (Visible until video loads) */}
                    {posterUrl && ( // Removed DEFAULT_HERO_IMAGE fallback here
                        <img
                            src={posterUrl}
                            alt="Background"
                            className={clsx(
                                "absolute inset-0 w-full h-full z-0 transition-opacity duration-1000", // Slower fade for smoother switch
                                heroBannerFit === 'contain' ? "object-contain" : "object-cover",
                                isVideoLoaded ? "opacity-0" : "opacity-100"
                            )}
                            referrerPolicy="no-referrer"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                        />
                    )}

                    {/* 2. Video Layer (Fades in) */}
                    <div className={clsx(
                        "absolute inset-0 z-10 transition-opacity duration-1000 pointer-events-none", // Slower fade-in
                        isVideoLoaded ? "opacity-100" : "opacity-0",
                        // Aggressively mask the top part of Drive videos if they show info bars initially
                        heroImage?.includes('drive.google.com') && "hero-video-mask"
                    )}>
                        {(heroImage && (isVideo(heroImage) || (typeof heroImage === 'string' && heroImage.includes('drive.google.com') && !heroImage.includes('thumbnail')))) ? (
                            getYoutubeId(heroImage) ? (
                                <div className="absolute inset-0 w-full h-full">
                                    <iframe
                                        className={clsx(
                                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans pointer-events-none transition-all",
                                            heroBannerFit === 'contain' ? "w-full h-full object-contain" : "w-[115%] h-[115%] min-w-full min-h-full object-cover"
                                        )}
                                        src={`https://www.youtube.com/embed/${getYoutubeId(heroImage)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(heroImage)}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        title="Background Video"
                                        onLoad={() => setIsVideoLoaded(true)}
                                    ></iframe>
                                </div>
                            ) : (
                                <video
                                    key={heroImage}
                                    src={heroImage.includes('drive.google.com') ? dbService.formatDriveVideo(heroImage) : heroImage}
                                    className={clsx(
                                        "w-full h-full transition-all",
                                        heroBannerFit === 'contain' ? "object-contain" : "object-cover"
                                    )}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    onLoadedData={() => setIsVideoLoaded(true)}
                                    onError={(e) => {
                                        console.error("Video load error", e);
                                        setIsVideoLoaded(false);
                                    }}
                                />
                            )
                        ) : null}
                    </div>

                    <div className="absolute inset-0 bg-primary/30 mix-blend-multiply z-20 pointer-events-none" />
                    <div
                        className="absolute inset-0 bg-black/40 z-20 pointer-events-none"
                        style={{ backgroundColor: `rgba(0,0,0, ${heroOverlayOpacity / 100})` }}
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-30 container mx-auto px-4 text-center">
                    {!configLoading && (
                        <>
                            <h2
                                className={clsx(
                                    "mb-12 tracking-wide opacity-90 animate-fade-in-up",
                                    heroSubtitleItalic && "italic",
                                    heroSubtitleWeight || "font-medium",
                                    heroSubtitleFont || "font-sans"
                                )}
                                style={{
                                    color: heroSubtitleColor || '#FFFFFF',
                                    fontSize: heroSubtitleSize ? `${heroSubtitleSize}px` : undefined
                                }}
                            >
                                {heroSubtitle || (i18n.language === 'en' ? 'Welcome to The Sent Church' : t('home.hero_subtitle'))}
                            </h2>
                            <h1
                                className={clsx(
                                    "mb-8 leading-tight animate-fade-in-up delay-100",
                                    heroTitleItalic && "italic",
                                    heroTitleWeight || "font-bold",
                                    heroTitleFont || "font-sans"
                                )}
                                style={{
                                    color: heroTitleColor || '#FFFFFF',
                                    fontSize: heroTitleSize ? `${heroTitleSize}px` : undefined
                                }}
                            >
                                {heroTitle || (i18n.language === 'en' ? 'A Community of Faith and Love' : t('home.hero_title'))}
                            </h1>
                        </>
                    )}
                </div>
            </section>



            {/* Sermon Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2">{t('home.media_title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-gray-900 overflow-hidden shadow-2xl aspect-video relative border border-white/10 group cursor-pointer" onClick={() => setLatestSermon(prev => ({ ...prev, isPlaying: true }))}>
                            {latestSermon.isPlaying ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${latestSermon.youtubeId}?autoplay=1&rel=0&origin=${window.location.origin}`}
                                    title={latestSermon.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <>
                                    <img
                                        src={`https://img.youtube.com/vi/${latestSermon.youtubeId}/hqdefault.jpg`}
                                        alt={latestSermon.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 text-white rounded-full flex items-center justify-center pl-1 shadow-2xl group-hover:scale-110 transition-transform">
                                            <Play size={32} fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">
                                        {t('home.click_to_play')}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="mt-16 text-center flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
                            <div>
                                <p className="text-accent font-black text-base mb-4 tracking-wide uppercase">
                                    {latestSermon.date} • {(i18n.language === 'en' && latestSermon.preacherEn) ? latestSermon.preacherEn : (latestSermon.preacher || t('home.preacher_default'))}
                                </p>
                                <h3 className="text-primary text-lg md:text-2xl font-black leading-snug">
                                    {(i18n.language === 'en' && latestSermon.titleEn) ? latestSermon.titleEn : (latestSermon.title || t('home.latest_word'))}
                                </h3>
                            </div>
                            <a
                                href={(() => {
                                    if (!youtubeUrl) return "https://www.youtube.com/@churchofthesent7763";
                                    if (youtubeUrl.startsWith('http')) return youtubeUrl;
                                    return `https://${youtubeUrl}`;
                                })()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1.5 text-primary/60 hover:text-red-600 transition-all group px-4 py-3 rounded-2xl hover:bg-red-50"
                            >
                                <div className="flex items-center gap-2 text-sm md:text-base font-black">
                                    <Youtube size={20} fill="currentColor" />
                                    <span>YouTube</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] md:text-xs font-bold opacity-70 group-hover:opacity-100">
                                    <span>{t('home.go_to')}</span>
                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Menu Section */}
            <section className="py-24 bg-secondary relative z-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-primary mt-2">{t('home.quick_menu_title')}</h2>
                        <div className="w-16 h-1 bg-accent mx-auto mt-6" />
                    </div>
                    <QuickLinks services={config?.services || churchData.services} />
                </div>
            </section>

            {/* Church Calendar Section */}
            <section className="py-20 bg-secondary">
                <div id="calendar" className="container mx-auto px-4 scroll-mt-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-8">
                            <h3 className="text-2xl font-black text-primary">{t('home.calendar_title')}</h3>
                        </div>
                        <CalendarWidget />
                    </div>
                </div>
            </section>
        </div>
    );
};


const QuickMenuCard = ({ title, subtitle, desc, link, image }) => (
    <Link to={link} className="group relative overflow-hidden rounded-2xl h-64 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block">
        <div className="absolute inset-0">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">{subtitle}</p>
            <h3 className="text-2xl font-black mb-3 group-hover:text-accent transition-colors">{title}</h3>
            {desc && (
                <div className="space-y-1 mt-2 border-t border-white/20 pt-2">
                    {desc.map((line, i) => (
                        <p key={i} className="text-sm font-medium text-white/90">{line}</p>
                    ))}
                </div>
            )}
        </div>
    </Link>
);

export default Home;
