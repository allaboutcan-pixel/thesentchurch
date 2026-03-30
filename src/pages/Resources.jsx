import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { Download, Calendar, Image as ImageIcon, FileText, Play, X, ChevronRight, ChevronLeft, BookOpen, Quote, Music, Maximize, Bell, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import bulletinsInitialData from '../data/bulletins.json';
import { dbService } from '../services/dbService';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import { safeSplitDate } from '../utils/dateUtils';
import CalendarWidget from '../components/CalendarWidget';
import SEO from '../components/SEO';

const Resources = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isClearingState = useRef(false);
    const [activeTab, setActiveTab] = useState('sermon');
    // eslint-disable-next-line no-unused-vars
    const [bulletins, setBulletins] = useState(bulletinsInitialData);
    const [latestBulletin, setLatestBulletin] = useState(null);
    const [activePage, setActivePage] = useState(1);
    const [archiveData, setArchiveData] = useState({}); // { year: { month: [items] } }

    const [sermons, setSermons] = useState([]);
    const [latestSermon, setLatestSermon] = useState(null);
    const [sermonArchiveData, setSermonArchiveData] = useState({}); // { year: { month: [items] } }

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedSermonYear, setSelectedSermonYear] = useState(new Date().getFullYear().toString());
    const [selectedSermonMonth, setSelectedSermonMonth] = useState((new Date().getMonth() + 1).toString());

    const [columns, setColumns] = useState([]);
    const [latestColumn, setLatestColumn] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [columnArchiveData, setColumnArchiveData] = useState({});
    const [selectedColumnYear, setSelectedColumnYear] = useState(new Date().getFullYear().toString());
    const [selectedColumnMonth, setSelectedColumnMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedArchiveColumn, setSelectedArchiveColumn] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [notices, setNotices] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const [galleryItems, setGalleryItems] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedArchiveBulletin, setSelectedArchiveBulletin] = useState(null);
    const [activeArchivePage, setActiveArchivePage] = useState(1);
    // eslint-disable-next-line no-unused-vars
    const [isBulletinFullScreen, setIsBulletinFullScreen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [playingSermonId, setPlayingSermonId] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [showSermonModal, setShowSermonModal] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);

    // Filter sermons for the grid
    const featuredSermons = sermons.slice(0, 5);

    const scrollToTop = () => {
        window.scrollTo(0, 0);
        setTimeout(() => window.scrollTo(0, 0), 100);
    };

    const { config: siteConfig, loading: configLoading } = useSiteConfig();
    const [galleryGroups, setGalleryGroups] = useState([]);
    const [selectedGalleryGroup, setSelectedGalleryGroup] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const prefix = location.pathname.startsWith('/news') ? 'news' : 'resources';

    const headerBanner = siteConfig?.[`${prefix}Banner`] || "/images/sermons_banner.jpg";
    const title = i18n.language.startsWith('en') && siteConfig?.[`${prefix}TitleEn`] ? siteConfig[`${prefix}TitleEn`] : siteConfig?.[`${prefix}Title`];
    const subtitle = i18n.language.startsWith('en') && siteConfig?.[`${prefix}SubtitleEn`] ? siteConfig[`${prefix}SubtitleEn`] : siteConfig?.[`${prefix}Subtitle`];
    const titleFont = siteConfig?.[`${prefix}TitleFont`] || "font-sans";
    const subtitleFont = siteConfig?.[`${prefix}SubtitleFont`] || "font-sans";
    const titleColor = siteConfig?.[`${prefix}TitleColor`] || "#ffffff";
    const subtitleColor = siteConfig?.[`${prefix}SubtitleColor`] || "#ffffff";
    const titleItalic = siteConfig?.[`${prefix}TitleItalic`] ?? false;
    const subtitleItalic = siteConfig?.[`${prefix}SubtitleItalic`] ?? true;
    const titleWeight = siteConfig?.[`${prefix}TitleWeight`] || "font-black";
    const subtitleWeight = siteConfig?.[`${prefix}SubtitleWeight`] || "font-medium";
    const titleSize = siteConfig?.[`${prefix}TitleSize`] || 48;
    const subtitleSize = siteConfig?.[`${prefix}SubtitleSize`] || 24;
    const overlayOpacity = siteConfig?.[`${prefix}OverlayOpacity`] ?? siteConfig?.overlayOpacity ?? 40;
    const height = siteConfig?.[`${prefix}Height`] || siteConfig?.[`${prefix}HeroHeight`] || siteConfig?.heroHeight || "large";
    const bannerFit = siteConfig?.[`${prefix}BannerFit`] || siteConfig?.bannerFit || "cover";

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0
        })
    };

    const paginate = (newDirection) => {
        if (!selectedGalleryGroup) return;
        setDirection(newDirection);
        setCurrentImageIndex((prevIndex) => (prevIndex + newDirection + selectedGalleryGroup.items.length) % selectedGalleryGroup.items.length);
    };

    const getPreviewSource = (url) => {
        if (!url) return null;
        const ytId = getYoutubeId(url);
        if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
            }
        }
        return null;
    };

    useEffect(() => {
        setPlayingSermonId(null);
    }, [activeTab, selectedSermonYear, selectedSermonMonth]);

    // Initialize tab based on pathname
    useEffect(() => {
        if (location.pathname.includes('gallery')) setActiveTab('gallery');
        else if (location.pathname.includes('column')) setActiveTab('column');
        else if (location.pathname.includes('calendar')) setActiveTab('calendar');
        else if (location.pathname.includes('bulletin')) setActiveTab('bulletin');
        else if (location.pathname.includes('sermon') || location.pathname.includes('/sermons')) setActiveTab('sermon');
        else if (location.pathname.includes('news') || location.pathname.includes('/news')) setActiveTab('bulletin');
    }, [location.pathname]);

    // Handle opening specific items from route state
    useEffect(() => {
        if (!isDataLoaded || !location.state?.openItem || isClearingState.current) return;

        const item = location.state.openItem;
        const itemCategory = item.category || item.type;
        setActiveTab(itemCategory);

        setTimeout(() => {
            if (itemCategory === 'sermon') {
                if (item.youtubeId) setPlayingSermonId(item.id);
            } else if (itemCategory === 'bulletin') {
                setSelectedArchiveBulletin(item);
            } else if (itemCategory === 'column') {
                setSelectedArchiveColumn(item);
            } else if (itemCategory === 'gallery') {
                const group = galleryGroups.find(g => g.date === item.date && g.title === item.title);
                if (group) {
                    setSelectedGalleryGroup(group);
                    const idx = group.items.findIndex(i => i.id === item.id);
                    setCurrentImageIndex(idx >= 0 ? idx : 0);
                } else {
                    setSelectedVideo(item);
                }
            }
        }, 150);

        isClearingState.current = true;
        navigate(location.pathname, { replace: true, state: {} });
    }, [isDataLoaded, location.state, galleryGroups, navigate, location.pathname]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Fetch all data in parallel for speed optimization
                const [liveBulletins, liveGallery, liveSermons, liveColumns, liveNotices] = await Promise.all([
                    dbService.getBulletins().catch(() => []),
                    dbService.getGallery().catch(() => []),
                    dbService.getSermons().catch(() => []),
                    dbService.getColumns().catch(() => []),
                    dbService.fetchItems('notices').catch(() => [])
                ]);

                if (!isMounted) return;

                // Process Bulletins
                if (liveBulletins.length > 0) {
                    const sorted = [...liveBulletins].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setBulletins(sorted);
                    setLatestBulletin(sorted[0]);

                    const grouped = {};
                    sorted.forEach(item => {
                        const [year, month] = safeSplitDate(item.date);
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setArchiveData(grouped);

                    if (sorted[0]) {
                        const [ly, lm] = safeSplitDate(sorted[0].date);
                        setSelectedYear(ly);
                        setSelectedMonth(lm);
                    }
                }

                // Process Gallery - Group by date and title
                if (liveGallery.length > 0) {
                    setGalleryItems(liveGallery);
                    
                    const groupsMap = new Map();
                    // Sort all items by date desc first
                    const sortedGallery = [...liveGallery].sort((a, b) => {
                        const dateDiff = new Date(b.date || 0) - new Date(a.date || 0);
                        if (dateDiff !== 0) return dateDiff;

                        const aIndex = typeof a.orderIndex === 'number' ? a.orderIndex : 999;
                        const bIndex = typeof b.orderIndex === 'number' ? b.orderIndex : 999;
                        if (aIndex !== bIndex) return aIndex - bIndex;

                        const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
                        const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
                        return timeB - timeA;
                    });
                    
                    sortedGallery.forEach(item => {
                        const groupKey = `${item.date}_${item.title}`;
                        if (!groupsMap.has(groupKey)) {
                            groupsMap.set(groupKey, {
                                id: item.id,
                                date: item.date,
                                title: item.title,
                                titleEn: item.titleEn,
                                items: []
                            });
                        }
                        groupsMap.get(groupKey).items.push(item);
                    });
                    
                    setGalleryGroups(Array.from(groupsMap.values()));
                }

                // Process Sermons
                if (liveSermons.length > 0) {
                    // Safety check: extract ID for all sermons to handle malformed data
                    const cleanedSermons = liveSermons.map(s => {
                        if (s.youtubeId && s.youtubeId.length > 11) {
                            const extractedId = getYoutubeId(s.youtubeId);
                            if (extractedId) return { ...s, youtubeId: extractedId };
                        }
                        return s;
                    });
                    setSermons(cleanedSermons);
                    setLatestSermon(cleanedSermons[0]);

                    const grouped = {};
                    cleanedSermons.forEach(item => {
                        const [year, month] = safeSplitDate(item.date);
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setSermonArchiveData(grouped);

                    if (cleanedSermons[0]) {
                        const [ly, lm] = safeSplitDate(cleanedSermons[0].date);
                        setSelectedSermonYear(ly);
                        setSelectedSermonMonth(lm);
                    }
                }

                // Process Columns
                if (liveColumns.length > 0) {
                    const sorted = [...liveColumns].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setColumns(sorted);
                    setLatestColumn(sorted[0]);

                    const grouped = {};
                    sorted.forEach(item => {
                        const [year, month] = safeSplitDate(item.date);
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setColumnArchiveData(grouped);

                    if (sorted[0]) {
                        const [ly, lm] = safeSplitDate(sorted[0].date);
                        setSelectedColumnYear(ly);
                        setSelectedColumnMonth(lm);
                    }
                }

                // Process Notices
                if (liveNotices.length > 0) setNotices(liveNotices);

                setIsDataLoaded(true);
            } catch (error) {
                console.warn("Resources: Failed to fetch some data in parallel", error);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    if (configLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <SEO
                title={title || t('nav.news')}
                description={subtitle || (i18n.language === 'ko' ? "보내심을 받은 생명의소리 교회 설보, 주보, 교회 소식 및 갤러리입니다." : "Sermons, bulletins, church news, and gallery for The Church of the Sent.")}
                path={prefix === 'news' ? '/news' : '/resources'}
            />
            {/* Header with Banner */}
            <section className={clsx(
                "relative w-full flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-screen" :
                    height === 'large' ? "h-[60vh] md:h-[85vh]" :
                        height === 'medium' ? "h-[50vh] md:h-[75vh]" :
                            "h-[40vh] md:h-[50vh]"
            )}>
                {/* Background Image Container - Easy to replace later */}
                <div className={clsx(
                    "absolute inset-0 z-0 pointer-events-none",
                    headerBanner?.includes('drive.google.com') && "hero-video-mask"
                )}>
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
                            alt="Resources Banner"
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

                {/* Banner Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className={clsx(
                        "mb-2 md:mb-8 animate-fade-in-up",
                        titleWeight,
                        titleFont,
                        titleItalic && "italic"
                    )}
                        style={{
                            color: titleColor || '#ffffff',
                            fontSize: titleSize ? (titleSize > 32 ? 'clamp(24px, 8vw, 48px)' : `${titleSize}px`) : undefined
                        }}
                    >
                        {title || t('resources.banner_title') || ""}
                    </h1>
                    <div className="w-12 h-1 bg-accent mx-auto mb-4 md:mb-8 rounded-full animate-fade-in-up delay-75 md:w-20 md:h-1.5" />
                    <h2 className={clsx(
                        "tracking-wide opacity-90 animate-fade-in-up delay-100",
                        subtitleWeight,
                        subtitleFont,
                        subtitleItalic && "italic"
                    )}
                        style={{
                            color: subtitleColor || '#ffffff',
                            fontSize: subtitleSize ? (subtitleSize > 20 ? 'clamp(16px, 4vw, 24px)' : `${subtitleSize}px`) : undefined
                        }}
                    >
                        {subtitle || t('resources.banner_subtitle') || ""}
                    </h2>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex rounded-xl shadow-sm bg-gray-100 p-1" role="group">
                        {/* Tab filtering based on route to separate Sermons from News */}
                        {location.pathname.includes('/sermons') ? (
                            <>
                                <TabButton
                                    active={activeTab === 'sermon'}
                                    onClick={() => setActiveTab('sermon')}
                                    icon={<Play size={18} />}
                                    label={t('nav.sunday_sermon')}
                                />
                                <Link
                                    to="/sermons/daily"
                                    className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all text-slate-400 hover:text-primary hover:bg-white/50 whitespace-nowrap"
                                >
                                    <Quote size={18} />
                                    <span>{t('nav.daily_word')}</span>
                                </Link>
                                <TabButton
                                    active={activeTab === 'column'}
                                    onClick={() => setActiveTab('column')}
                                    icon={<BookOpen size={18} />}
                                    label={t('nav.column')}
                                />
                            </>
                        ) : (
                            <>


                                <TabButton
                                    active={activeTab === 'bulletin'}
                                    onClick={() => setActiveTab('bulletin')}
                                    icon={<FileText size={18} />}
                                    label={t('nav.bulletin')}
                                />
                                <TabButton
                                    active={activeTab === 'calendar'}
                                    onClick={() => setActiveTab('calendar')}
                                    icon={<Calendar size={18} />}
                                    label={t('nav.calendar')}
                                />
                                <TabButton
                                    active={activeTab === 'gallery'}
                                    onClick={() => setActiveTab('gallery')}
                                    icon={<ImageIcon size={18} />}
                                    label={t('nav.gallery')}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}

                {/* Sunday Sermon Content (Playlist Style) */}
                {activeTab === 'sermon' && (
                    <div className="space-y-8 md:space-y-24 pb-20 md:pb-40 animate-fade-in">
                        {/* Featured Player & Recent List */}
                        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-24 max-w-[1200px] mx-auto transition-all bg-transparent">
                            {/* Main Player */}
                            <div className="lg:w-[65%] lg:pt-16">
                                {latestSermon ? (
                                    <div className="bg-slate-900 overflow-hidden shadow-2xl border border-white/10">
                                        <div className="aspect-video relative group cursor-pointer" onClick={() => setLatestSermon(prev => ({ ...prev, isPlaying: true }))}>
                                            {latestSermon.isPlaying ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${latestSermon.youtubeId}?autoplay=1&rel=0&vq=hd1080&origin=${window.location.origin}`}
                                                    className="w-full h-full border-none"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title={latestSermon.title}
                                                ></iframe>
                                            ) : (
                                                <>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${latestSermon.youtubeId}/hqdefault.jpg`}
                                                        alt={latestSermon.title}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center pl-1 shadow-2xl group-hover:scale-110 transition-transform">
                                                            <Play size={32} fill="currentColor" />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="p-3 md:p-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">{t('resources.latest_sermon')}</span>
                                                <span className="text-white/40 text-sm font-medium">{latestSermon.date}</span>
                                            </div>
                                            <h2 className="text-sm md:text-xl font-black text-white mb-2 leading-tight truncate">
                                                {((i18n.language === 'en' && latestSermon.titleEn) ? latestSermon.titleEn : (latestSermon.title || "")) || ""}
                                            </h2>
                                            <div className="flex items-center gap-2 text-white/60">
                                                <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center">
                                                    <Play size={10} className="text-accent" />
                                                </div>
                                                <span className="font-bold text-sm">{(i18n.language === 'en' && latestSermon.preacherEn) ? latestSermon.preacherEn : (latestSermon.preacher || (i18n.language.startsWith('en') ? 'Pastor Namgyu Lee' : '이남규 목사'))}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-[2.5rem] aspect-video flex items-center justify-center text-slate-300">
                                        {t('resources.no_sermons')}
                                    </div>
                                )}
                            </div>

                            {/* Recent Playlist Sidebar */}
                            <div className="lg:w-[35%] flex flex-col gap-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        <Play size={20} className="text-primary" />
                                        {t('home.latest_word')}
                                    </h3>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('resources.video_count', { count: sermons.length })}</span>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                                    {sermons.slice(0, 5).map((sermon, idx) => (
                                        <div
                                            key={sermon.id || idx}
                                            onClick={() => setLatestSermon(sermon)}
                                            className={clsx(
                                                "group flex gap-4 p-3 rounded-2xl cursor-pointer transition-all border border-transparent",
                                                latestSermon?.id === sermon.id ? "bg-primary/5 border-primary/20" : "bg-white hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="relative w-32 aspect-video shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                                <img
                                                    src={`https://img.youtube.com/vi/${sermon.youtubeId}/mqdefault.jpg`}
                                                    alt={sermon.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                                                    <Play size={14} className="text-white" fill="white" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center min-w-0">
                                                <h4 className={clsx(
                                                    "text-sm font-black line-clamp-2 leading-snug mb-1",
                                                    latestSermon?.id === sermon.id ? "text-primary" : "text-slate-800"
                                                )}>
                                                    {(i18n.language === 'en' && sermon.titleEn) ? sermon.titleEn : sermon.title}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400">{sermon.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sermon Archive Section */}
                        <div id="sermon-archive" className="space-y-8">
                            <div className="border-b-4 border-slate-100 pb-6 space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <Calendar size={28} className="text-primary" />
                                    {t('home.sermon_archive')}
                                </h3>
                                <p className="text-slate-400 font-medium text-sm mt-1 italic">{t('home.sermon_archive_desc')}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {Object.keys(sermonArchiveData).sort((a, b) => b - a).map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedSermonYear(year)}
                                        className={clsx(
                                            "px-4 py-1.5 rounded-full font-black text-xs transition-all",
                                            selectedSermonYear === year
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        )}
                                    >
                                        {year}{i18n.language.startsWith('ko') ? '년' : ''}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Month Sidebar */}
                                <div className="lg:w-48 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 lg:border-r border-slate-100 pr-0 lg:pr-6">
                                    {sermonArchiveData[selectedSermonYear] && Object.keys(sermonArchiveData[selectedSermonYear]).sort((a, b) => b - a).map(month => (
                                        <button
                                            key={month}
                                            onClick={() => setSelectedSermonMonth(month)}
                                            className={clsx(
                                                "w-auto lg:w-full px-5 py-3 rounded-xl flex items-center justify-between transition-all group shrink-0",
                                                selectedSermonMonth === month
                                                    ? "bg-slate-900 text-white shadow-xl"
                                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                            )}
                                        >
                                            <span className="font-bold">{month}{i18n.language.startsWith('ko') ? '월' : ''}</span>
                                            <ChevronRight size={16} className={clsx("transition-transform", selectedSermonMonth === month ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                                        </button>
                                    ))}
                                </div>

                                {/* Sermon List View */}
                                <div className="flex-grow space-y-2 max-w-3xl">
                                    {sermonArchiveData[selectedSermonYear]?.[selectedSermonMonth]?.map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => {
                                                setSelectedVideo(item);
                                                setShowSermonModal(true);
                                            }}
                                            className="group bg-white border border-slate-100 rounded-lg py-2 px-3 flex items-center justify-between hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="min-w-[30px] border-r border-slate-100 pr-3 flex justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                                                        {item.date ? item.date.split?.('-')?.slice?.(1)?.join?.('.') : ''}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors truncate">
                                                        {(i18n.language === 'en' && item.titleEn) ? item.titleEn : item.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                <Play size={10} className="text-slate-300 group-hover:text-primary transition-colors" fill="currentColor" />
                                            </div>
                                        </div>
                                    ))}
                                    {(!sermonArchiveData[selectedSermonYear] || !sermonArchiveData[selectedSermonYear][selectedSermonMonth]) && (
                                        <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                            <div className="bg-slate-50 p-6 rounded-full">
                                                <Calendar size={48} className="opacity-20" />
                                            </div>
                                            <p className="font-bold">{t('resources.no_archive_sermons')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulletin Content */}
                {activeTab === 'bulletin' && (
                    <div className="space-y-24 pb-24 animate-fade-in">
                        {latestBulletin ? (
                            <div className="bg-slate-900 rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 max-w-5xl lg:max-w-[1400px] mx-auto transition-all">
                                <div className="flex flex-col lg:flex-row items-center lg:gap-12 p-0 lg:p-14">
                                    <div className="w-full lg:w-[35%] p-5 md:p-8 lg:p-0 border-b lg:border-b-0 border-white/10 flex flex-col justify-center gap-3 lg:gap-6 shrink-0">
                                        <div className="space-y-1 lg:space-y-6 text-white w-full">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] lg:text-[10px] font-black tracking-widest uppercase mb-1 lg:mb-0">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                                {t('resources.latest_bulletin')}
                                            </div>
                                            <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-white leading-tight mb-1 lg:mb-0 line-clamp-2 lg:line-clamp-none">
                                                {(i18n.language === 'en' && latestBulletin.titleEn) ? latestBulletin.titleEn : latestBulletin.title}
                                            </h2>
                                            <div className="flex items-center gap-3 lg:gap-2 text-white/40 text-xs flex-row md:text-lg lg:text-sm font-medium">
                                                <Calendar size={14} className="text-accent lg:w-4 lg:h-4" />
                                                {latestBulletin.date || ""}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-3 pt-1 lg:pt-2 w-full">
                                            <button
                                                onClick={() => {
                                                    setSelectedArchiveBulletin(latestBulletin);
                                                    setActiveArchivePage(activePage);
                                                    setIsBulletinFullScreen(true);
                                                }}
                                                className="col-span-2 w-full py-2 md:py-2.5 lg:py-2.5 lg:px-6 bg-white text-slate-900 rounded-xl lg:rounded-xl font-bold text-[11px] lg:text-sm flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-slate-100 transition-all shadow-lg lg:hover:scale-105 lg:active:scale-95"
                                            >
                                                <Maximize size={14} className="lg:w-4 lg:h-4" />
                                                {i18n.language.startsWith('en') ? 'View Full Screen' : '전체 화면으로 보기'}
                                            </button>
                                            <a
                                                href={dbService.formatDriveDownloadLink(latestBulletin.fileUrl)}
                                                download
                                                className="col-span-2 w-full py-2 md:py-2.5 lg:py-2.5 lg:px-6 bg-white/5 lg:bg-white/10 text-white/60 lg:text-white rounded-xl lg:rounded-xl font-bold text-[11px] lg:text-sm flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-white/10 lg:hover:bg-white/20 transition-all lg:border lg:border-white/20"
                                            >
                                                <Download size={14} className="lg:w-4 lg:h-4" />
                                                {i18n.language.startsWith('en') ? 'Download File' : '파일 다운로드'}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Responsive Viewer (Preview) */}
                                    <div className="lg:w-[65%] w-full space-y-4 lg:space-y-6 flex flex-col items-center">
                                        {latestBulletin.fileUrl2 && (
                                            <div className="flex bg-white/5 p-1 rounded-full lg:rounded-2xl w-fit border border-white/10 mx-auto lg:mx-0 mt-3 lg:mt-0">
                                                <button
                                                    onClick={() => setActivePage(1)}
                                                    className={clsx(
                                                        "px-4 lg:px-6 py-1.5 lg:py-2 rounded-full lg:rounded-xl text-[10px] lg:text-xs font-black transition-all",
                                                        activePage === 1 ? "bg-white text-primary shadow-lg" : "text-white/40 hover:text-white"
                                                    )}
                                                >
                                                    PAGE 01
                                                </button>
                                                <button
                                                    onClick={() => setActivePage(2)}
                                                    className={clsx(
                                                        "px-4 lg:px-6 py-1.5 lg:py-2 rounded-full lg:rounded-xl text-[10px] lg:text-xs font-black transition-all",
                                                        activePage === 2 ? "bg-white text-primary shadow-lg" : "text-white/40 hover:text-white"
                                                    )}
                                                >
                                                    PAGE 02
                                                </button>
                                            </div>
                                        )}
                                        <div className="w-full aspect-[4/5] lg:aspect-[16/10] bg-white rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
                                            <div className="w-full h-full overflow-hidden">
                                                <iframe
                                                    src={dbService.formatDriveLink(activePage === 1 ? latestBulletin.fileUrl : latestBulletin.fileUrl2)}
                                                    className="w-full transition-opacity bulletin-preview-iframe"
                                                    title="Latest Bulletin Preview"
                                                    loading="lazy"
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                <p>{t('resources.no_bulletins')}</p>
                            </div>
                        )}


                        {/* 2. Past Archive Section */}
                        <div className="space-y-8">
                            <div className="border-b-4 border-slate-100 pb-6 space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <Calendar size={28} className="text-primary" />
                                    {t('home.past_bulletins')}
                                </h3>
                                <p className="text-slate-400 font-medium text-sm mt-1 italic">{t('home.past_bulletins_desc')}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {Object.keys(archiveData).sort((a, b) => b - a).map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={clsx(
                                            "px-4 py-1.5 rounded-full font-black text-[10px] transition-all",
                                            selectedYear === year
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        )}
                                    >
                                        {year}{i18n.language.startsWith('ko') ? '년' : ''}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8 min-h-[400px]">
                                {/* Month Sidebar */}
                                <div className="lg:w-40 flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-4 lg:pb-0 lg:border-r border-slate-100 pr-0 lg:pr-4">
                                    {archiveData[selectedYear] && Object.keys(archiveData[selectedYear]).sort((a, b) => b - a).map(month => (
                                        <button
                                            key={month}
                                            onClick={() => setSelectedMonth(month)}
                                            className={clsx(
                                                "w-auto lg:w-full px-4 py-2 rounded-lg flex items-center justify-between transition-all group shrink-0",
                                                selectedMonth === month
                                                    ? "bg-slate-900 text-white shadow-lg"
                                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                            )}
                                        >
                                            <span className="font-bold">{month}{i18n.language.startsWith('ko') ? '월' : ''}</span>
                                            <ChevronRight size={16} className={clsx("transition-transform", selectedMonth === month ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                                        </button>
                                    ))}
                                </div>

                                {/* Bulletin List View */}
                                <div className="flex-grow space-y-2 max-w-3xl">
                                    {archiveData[selectedYear]?.[selectedMonth]?.map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => {
                                                setSelectedArchiveBulletin(item);
                                                setActiveArchivePage(1);
                                                setIsBulletinFullScreen(true);
                                            }}
                                            className="group bg-white border border-slate-100 rounded-lg py-2 px-3 flex items-center justify-between hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="min-w-[30px] border-r border-slate-100 pr-3 flex justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                                                        {(() => {
                                                            if (!item.date) return "";
                                                            const p = item.date.split?.('-') || [];
                                                            if (i18n.language.startsWith('en')) return item.date.substring?.(5) || ""; // MM-DD
                                                            return p.length >= 3 ? `${parseInt(p[1], 10)}.${parseInt(p[2], 10)}` : item.date;
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors truncate">
                                                        {(i18n.language === 'en' && item.titleEn) ? item.titleEn : item.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                <FileText size={10} className="text-slate-300 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                    {(!archiveData[selectedYear] || !archiveData[selectedYear][selectedMonth]) && (
                                        <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                            <div className="bg-slate-50 p-6 rounded-full">
                                                <Calendar size={48} className="opacity-20" />
                                            </div>
                                            <p className="font-bold">{t('resources.no_archive_bulletins')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pastoral Column Content */}
                {activeTab === 'column' && (
                    <div className="space-y-24 pb-24 animate-fade-in">
                        {latestColumn ? (
                            <div className="bg-slate-900 rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 max-w-5xl lg:max-w-[1400px] mx-auto transition-all">
                                <div className="flex flex-col lg:flex-row items-center lg:gap-12 p-0 lg:p-14">
                                    <div className="w-full lg:w-[35%] p-5 md:p-8 lg:p-0 border-b lg:border-b-0 border-white/10 flex flex-col justify-center gap-3 lg:gap-6 shrink-0">
                                        <div className="space-y-1 lg:space-y-6 text-white w-full">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] lg:text-[10px] font-black tracking-widest uppercase mb-1 lg:mb-0">
                                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                                {t('resources.latest_column')}
                                            </div>
                                            <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-white leading-tight mb-1 lg:mb-0 line-clamp-2 lg:line-clamp-none">
                                                {(i18n.language === 'en' && latestColumn.titleEn) ? latestColumn.titleEn : latestColumn.title}
                                            </h2>
                                            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-1">
                                                <p className="text-white/40 text-xs md:text-lg lg:text-sm font-medium">
                                                    <Calendar size={14} className="text-accent inline mr-1 lg:w-4 lg:h-4 lg:mr-2" />
                                                    {latestColumn.date || ""}
                                                </p>
                                                <p className="text-white/80 text-xs md:text-base lg:text-base font-bold">
                                                    {t('resources.author_prefix')}{(i18n.language === 'en' && latestColumn.authorEn) ? latestColumn.authorEn : (latestColumn.author || (i18n.language.startsWith('en') ? 'Pastor Namgyu Lee' : '이남규 목사'))}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-3 pt-1 lg:pt-2 w-full">
                                            <a
                                                href={dbService.formatDriveLink(latestColumn.fileUrl)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`${latestColumn.facebookUrl ? 'col-span-1' : 'col-span-2'} w-full py-2 md:py-2.5 lg:py-2.5 lg:px-6 bg-white text-slate-900 rounded-xl lg:rounded-xl font-bold text-[11px] lg:text-sm flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-slate-100 transition-all shadow-lg lg:hover:scale-105 lg:active:scale-95`}
                                            >
                                                <BookOpen size={14} className="lg:w-4 lg:h-4" />
                                                {t('resources.view_larger')}
                                            </a>
                                            {latestColumn.facebookUrl && (
                                                <a
                                                    href={latestColumn.facebookUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full col-span-1 py-2 md:py-2.5 lg:py-2.5 lg:px-6 bg-[#1877F2] text-white rounded-xl lg:rounded-xl font-bold text-[11px] lg:text-sm flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-[#1877F2]/90 transition-all shadow-lg lg:active:scale-95"
                                                >
                                                    <ExternalLink size={14} className="lg:w-4 lg:h-4" />
                                                    {i18n.language.startsWith('en') ? 'Original Article' : '원문 바로가기'}
                                                </a>
                                            )}
                                            <a
                                                href={dbService.formatDriveDownloadLink(latestColumn.fileUrl)}
                                                download
                                                className="col-span-2 w-full py-2 md:py-2.5 lg:py-2.5 lg:px-6 bg-white/5 lg:bg-white/10 text-white/60 lg:text-white rounded-xl lg:rounded-xl font-bold text-[11px] lg:text-sm flex items-center justify-center gap-1.5 lg:gap-2 hover:bg-white/10 lg:hover:bg-white/20 transition-all lg:border lg:border-white/20"
                                            >
                                                <Download size={14} className="lg:w-4 lg:h-4" />
                                                {t('resources.download')}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Responsive Viewer (Preview) */}
                                    <div className="lg:w-[65%] w-full space-y-6 flex flex-col items-center">
                                        <div className="w-full aspect-[4/5] lg:aspect-[16/10] bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
                                            {latestColumn.fileType === 'video' ? (
                                                <iframe
                                                    src={(() => {
                                                        const url = latestColumn.fileUrl || '';
                                                        const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
                                                        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
                                                        if (url.includes('drive.google.com')) return dbService.formatDriveLink(url);
                                                        return url;
                                                    })()}
                                                    className="w-full h-full border-none opacity-80 hover:opacity-100 transition-opacity"
                                                    title={(i18n.language === 'en' && latestColumn.titleEn) ? latestColumn.titleEn : latestColumn.title}
                                                    allowFullScreen
                                                ></iframe>
                                            ) : latestColumn.fileType === 'image' ? (
                                                <img
                                                    src={latestColumn.fileUrl}
                                                    alt={(i18n.language === 'en' && latestColumn.titleEn) ? latestColumn.titleEn : latestColumn.title}
                                                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <iframe
                                                    src={dbService.formatDriveLink(latestColumn.fileUrl)}
                                                    className="w-full h-full border-none opacity-80 hover:opacity-100 transition-opacity"
                                                    title={(i18n.language === 'en' && latestColumn.titleEn) ? latestColumn.titleEn : latestColumn.title}
                                                ></iframe>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                <p>등록된 신학 칼럼이 없습니다.</p>
                            </div>
                        )}


                        {/* 2. Column Archive */}
                        <div className="space-y-8">
                            <div className="border-b-4 border-slate-100 pb-6 space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <FileText size={28} className="text-primary" />
                                    {t('home.past_columns')}
                                </h3>
                                <p className="text-slate-400 font-medium text-sm mt-1 italic">{t('home.past_columns_desc')}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {Object.keys(columnArchiveData).sort((a, b) => b - a).map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedColumnYear(year)}
                                        className={clsx(
                                            "px-4 py-1.5 rounded-full font-black text-xs transition-all",
                                            selectedColumnYear === year
                                                ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                        )}
                                    >
                                        {year}{i18n.language.startsWith('ko') ? '년' : ''}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8 min-h-[400px]">
                                {/* Month Sidebar */}
                                <div className="lg:w-48 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 lg:border-r border-slate-100 pr-0 lg:pr-6">
                                    {columnArchiveData[selectedColumnYear] && Object.keys(columnArchiveData[selectedColumnYear]).sort((a, b) => b - a).map(month => (
                                        <button
                                            key={month}
                                            onClick={() => setSelectedColumnMonth(month)}
                                            className={clsx(
                                                "w-auto lg:w-full px-5 py-3 rounded-xl flex items-center justify-between transition-all group shrink-0",
                                                selectedColumnMonth === month
                                                    ? "bg-slate-900 text-white shadow-xl"
                                                    : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                            )}
                                        >
                                            <span className="font-bold">{month}{i18n.language.startsWith('ko') ? '월' : ''}</span>
                                            <ChevronRight size={16} className={clsx("transition-transform", selectedColumnMonth === month ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                                        </button>
                                    ))}
                                </div>

                                {/* Column List View */}
                                <div className="flex-grow space-y-2 max-w-3xl">
                                    {columnArchiveData[selectedColumnYear]?.[selectedColumnMonth]?.map((item, idx) => (
                                        <div
                                            key={item.id || idx}
                                            onClick={() => setSelectedArchiveColumn(item)}
                                            className="group bg-white border border-slate-100 rounded-lg py-2 px-3 flex items-center justify-between hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="min-w-[30px] border-r border-slate-100 pr-3 flex justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">{item.date}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors truncate">
                                                        {(i18n.language === 'en' && item.titleEn) ? item.titleEn : item.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                <div className="text-slate-300 group-hover:text-primary transition-colors">
                                                    {item.fileType === 'video' ? <Play size={10} fill="currentColor" /> :
                                                        item.fileType === 'image' ? <ImageIcon size={10} /> :
                                                            <BookOpen size={10} />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!columnArchiveData[selectedColumnYear] || !columnArchiveData[selectedColumnYear][selectedColumnMonth]) && (
                                        <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                            <div className="bg-slate-50 p-6 rounded-full">
                                                <FileText size={48} className="opacity-20" />
                                            </div>
                                            <p className="font-bold">선택하신 날짜의 신학 칼럼이 없습니다.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gallery' && (
                    <div className="space-y-24 pb-48 pt-32 animate-fade-in">
                        <div className="border-b-4 border-slate-100 pb-6 space-y-4">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <FileText size={28} className="text-primary shrink-0" />
                                {t('resources.gallery_view_title')}
                            </h3>
                            <p className="text-slate-400 font-medium text-sm mt-1 italic">{t('resources.gallery_subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {galleryGroups.map((group, idx) => {
                                const mainImg = group.items[0];
                                let thumbnailUrl = mainImg.thumbnailUrl || mainImg.url;

                                if (!mainImg.thumbnailUrl && mainImg.type === 'video') {
                                    if (mainImg.url.includes('youtube.com') || mainImg.url.includes('youtu.be')) {
                                        const ytId = mainImg.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
                                        if (ytId) thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                                    }
                                } else if (!mainImg.thumbnailUrl && mainImg.url.includes('drive.google.com')) {
                                    const idMatch = mainImg.url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || mainImg.url.match(/\/d\/([a-zA-Z0-9_-]+)/) || mainImg.url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                                    if (idMatch && idMatch[1]) thumbnailUrl = `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
                                }

                                return (
                                    <div
                                        key={idx}
                                        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-50 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                                        onClick={() => {
                                            setSelectedGalleryGroup(group);
                                            setCurrentImageIndex(0);
                                        }}
                                    >
                                        <div className="w-full h-full relative">
                                            {mainImg.type === 'video' && mainImg.url.includes('drive.google.com') ? (
                                                <div className="w-full h-full relative">
                                                    <iframe
                                                        src={dbService.formatDriveLink(mainImg.url)}
                                                        className="w-full h-full object-contain pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
                                                        title={group.title}
                                                        tabIndex="-1"
                                                    />
                                                    <div className="absolute inset-0 z-10 bg-transparent" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full overflow-hidden">
                                                    <img
                                                        src={thumbnailUrl}
                                                        alt={(i18n.language === 'en' && group.titleEn) ? group.titleEn : group.title}
                                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}

                                            {/* Count Badge for Albums */}
                                            {group.items.length > 1 && (
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-white border border-white/20 z-20 flex items-center gap-1.5 shadow-lg">
                                                    <ImageIcon size={10} />
                                                    {group.items.length}
                                                </div>
                                            )}

                                            {/* Video Indicator */}
                                            {group.items.some(i => i.type === 'video') && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors">
                                                    <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform shadow-lg">
                                                        <Play size={16} fill="currentColor" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Title Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-[11px] font-bold truncate">
                                                    {(i18n.language === 'en' && group.titleEn) ? group.titleEn : group.title}
                                                </p>
                                                <p className="text-white/60 text-[9px] mt-0.5">{group.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {galleryGroups.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-400 font-medium font-sans">
                                    아직 등록된 사진이나 영상이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {activeTab === 'calendar' && (
                    <div className="animate-fade-in max-w-4xl mx-auto py-32">
                        <CalendarWidget />
                    </div>
                )}
            </div>


            {/* Video/Album Modal Viewer */}
            {(selectedVideo || selectedGalleryGroup) && (
                <div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in"
                    onClick={() => {
                        setSelectedVideo(null);
                        setSelectedGalleryGroup(null);
                    }}
                >
                    {/* Content Slideshow */}
                    <div 
                        className={clsx(
                            "relative w-full max-w-6xl flex items-center justify-center h-full",
                            (selectedGalleryGroup?.items[currentImageIndex]?.type === 'audio' || selectedVideo?.type === 'audio') ? "aspect-auto p-12 bg-white rounded-2xl" : 
                            (selectedGalleryGroup?.items[currentImageIndex]?.type === 'image' || selectedVideo?.type === 'image') ? "aspect-auto min-h-[40vh] max-h-[85vh]" : "aspect-video"
                        )}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Group Navigation */}
                        {selectedGalleryGroup && selectedGalleryGroup.items.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 z-20 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(-1);
                                    }}
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    className="absolute right-4 z-20 w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        paginate(1);
                                    }}
                                >
                                    <ChevronRight size={32} />
                                </button>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1.5 rounded-full text-white/80 text-[10px] font-black z-20 border border-white/10">
                                    {(currentImageIndex + 1).toString().padStart(2, '0')} / {selectedGalleryGroup.items.length.toString().padStart(2, '0')}
                                </div>
                            </>
                        )}

                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="absolute inset-0 flex items-center justify-center w-full h-full"
                            >
                                {(() => {
                                    const item = selectedGalleryGroup ? selectedGalleryGroup.items[currentImageIndex] : selectedVideo;
                                    if (!item) return null;

                                    if (item.type === 'audio') {
                                        return (
                                            <div className="flex flex-col items-center gap-8 py-4">
                                                <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center text-primary animate-pulse">
                                                    <Music size={64} />
                                                </div>
                                                <div className="text-center">
                                                    <h3 className="text-2xl font-black text-primary mb-2">
                                                        {(i18n.language === 'en' && item.titleEn) ? item.titleEn : item.title}
                                                    </h3>
                                                    <p className="text-gray-400 font-medium">{item.date}</p>
                                                </div>
                                                <audio src={item.url} controls autoPlay className="w-full max-w-md" />
                                            </div>
                                        );
                                    } else if (item.type === 'image') {
                                        return (
                                            <img
                                                src={item.url}
                                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                                                alt={selectedGalleryGroup ? selectedGalleryGroup.title : item.title}
                                            />
                                        );
                                    } else if (isVideo(item.url)) {
                                        return (
                                            <video src={item.url} controls autoPlay className="w-full h-full rounded-xl" />
                                        );
                                    } else {
                                        return (
                                            <iframe
                                                src={(() => {
                                                    let url = item.url;
                                                    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                                                        const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
                                                        if (ytId) url = `https://www.youtube.com/embed/${ytId}?autoplay=1&vq=hd1080`;
                                                    } else if (url && url.includes('drive.google.com')) {
                                                        const driveId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                                                        if (driveId) url = `https://drive.google.com/file/d/${driveId[1]}/preview`;
                                                    }
                                                    return url;
                                                })()}
                                                className="w-full h-full border-none rounded-xl"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={selectedGalleryGroup ? selectedGalleryGroup.title : item.title}
                                            ></iframe>
                                        );
                                    }
                                })()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Thumbnail Strip */}
                    {selectedGalleryGroup && selectedGalleryGroup.items.length > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-4 max-w-full px-4 scrollbar-hide">
                            {selectedGalleryGroup.items.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDirection(idx > currentImageIndex ? 1 : -1);
                                        setCurrentImageIndex(idx);
                                    }}
                                    className={clsx(
                                        "w-16 h-10 md:w-20 md:h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative group",
                                        currentImageIndex === idx ? "border-primary scale-110 shadow-lg z-10" : "border-white/10 opacity-40 hover:opacity-100"
                                    )}
                                >
                                    <img 
                                        src={item.thumbnailUrl || (item.type === 'video' ? getPreviewSource(item.url) : item.url)} 
                                        className="w-full h-full object-contain"
                                        alt={`Thumbnail ${idx}`}
                                    />
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <Play size={12} fill="white" className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Meta info below slideshow */}
                    <div className="mt-8 text-center text-white space-y-2 pointer-events-none">
                        <h3 className="text-2xl font-black">
                            {selectedGalleryGroup ? (
                                (i18n.language === 'en' && selectedGalleryGroup.titleEn) ? selectedGalleryGroup.titleEn : selectedGalleryGroup.title
                            ) : (
                                (i18n.language === 'en' && selectedVideo.titleEn) ? selectedVideo.titleEn : selectedVideo.title
                            )}
                        </h3>
                        <p className="text-white/40 font-bold tracking-widest">{selectedGalleryGroup ? selectedGalleryGroup.date : selectedVideo.date}</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVideo(null);
                                setSelectedGalleryGroup(null);
                            }}
                            className="mt-6 py-2 md:py-3 px-8 bg-white/10 text-white rounded-full font-bold text-sm hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 pointer-events-auto mx-auto"
                        >
                            {i18n.language === 'en' ? 'Close' : '닫기'}
                        </button>
                        </div>
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[110]"
                            onClick={() => {
                                setSelectedVideo(null);
                                setSelectedGalleryGroup(null);
                            }}
                        >
                            <X size={32} />
                        </button>
                    </div>
                )}

            {/* Column Modal Viewer */}
            {
                selectedArchiveColumn && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setSelectedArchiveColumn(null)}
                    >
                        <div
                            className="w-full max-w-5xl bg-slate-900 rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 flex flex-col lg:flex-row h-[90vh] lg:h-auto lg:max-h-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Info Section */}
                            <div className="lg:w-1/3 p-5 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center gap-3 md:gap-8 shrink-0">
                                <div>
                                    <div className="text-accent font-black tracking-widest text-[10px] md:text-xs mb-1 md:mb-4 uppercase">Pastoral Column</div>
                                    <h3 className="text-lg md:text-3xl font-black text-white leading-tight mb-1 md:mb-4 line-clamp-2">
                                        {(i18n.language === 'en' && selectedArchiveColumn.titleEn) ? selectedArchiveColumn.titleEn : selectedArchiveColumn.title}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <p className="text-white/40 text-xs md:text-lg font-medium">{selectedArchiveColumn.date}</p>
                                        <p className="text-white/60 text-xs md:text-base font-bold">
                                            {t('resources.author_prefix')} {(i18n.language === 'en' && selectedArchiveColumn.authorEn) ? selectedArchiveColumn.authorEn : (selectedArchiveColumn.author || (i18n.language.startsWith('en') ? 'Pastor Namgyu Lee' : '이남규 목사'))}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3 py-2 md:py-4">
                                    <a
                                        href={dbService.formatDriveLink(selectedArchiveColumn.fileUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${selectedArchiveColumn.facebookUrl ? 'col-span-1' : 'col-span-2 lg:col-span-1'} w-full py-2 md:py-3 bg-white text-slate-900 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm flex items-center justify-center gap-1.5 md:gap-3 hover:bg-slate-100 transition-all shadow-lg active:scale-95`}
                                    >
                                        <BookOpen size={14} />
                                        {i18n.language.startsWith('en') ? 'View Larger' : '전체 화면으로 보기'}
                                    </a>
                                    {selectedArchiveColumn.facebookUrl && (
                                        <a
                                            href={selectedArchiveColumn.facebookUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-2 md:py-3 bg-[#1877F2] text-white rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm flex items-center justify-center gap-1.5 md:gap-3 hover:bg-[#1877F2]/90 transition-all shadow-lg active:scale-95 col-span-1"
                                        >
                                            <ExternalLink size={14} />
                                            {i18n.language.startsWith('en') ? 'Original Article' : '원문 바로가기'}
                                        </a>
                                    )}
                                    <a
                                        href={dbService.formatDriveDownloadLink(selectedArchiveColumn.fileUrl)}
                                        download
                                        className="w-full py-2 md:py-3 bg-white/5 text-white/60 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-1.5 md:gap-3 col-span-1"
                                    >
                                        <Download size={14} />
                                        {i18n.language.startsWith('en') ? 'Download File' : '파일 다운로드'}
                                    </a>
                                    <button
                                        onClick={() => setSelectedArchiveColumn(null)}
                                        className="w-full py-2 md:py-3 bg-white/10 text-white rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm hover:bg-white/20 transition-all col-span-1 flex items-center justify-center"
                                    >
                                        {i18n.language.startsWith('en') ? 'Close' : '닫기'}
                                    </button>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="flex-grow bg-slate-900 lg:min-h-0 flex items-center justify-center overflow-hidden">
                                {selectedArchiveColumn.fileType === 'video' ? (
                                    <iframe
                                        src={(() => {
                                            const url = selectedArchiveColumn.fileUrl || '';
                                            const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
                                            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                                        })()}
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : selectedArchiveColumn.fileType === 'image' ? (
                                    <img
                                        src={selectedArchiveColumn.fileUrl}
                                        className="w-full h-full object-contain"
                                        alt={(i18n.language === 'en' && selectedArchiveColumn.titleEn) ? selectedArchiveColumn.titleEn : selectedArchiveColumn.title}
                                    />
                                ) : (
                                    <iframe
                                        src={dbService.formatDriveLink(selectedArchiveColumn.fileUrl)}
                                        className="w-full h-full border-none"
                                        title="Column Modal Preview"
                                    ></iframe>
                                )}
                            </div>
                            <button
                                className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full transition-all"
                                onClick={() => setSelectedArchiveColumn(null)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )}

            {/* Bulletin Modal Viewer */}
            {
                selectedArchiveBulletin && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setSelectedArchiveBulletin(null)}
                    >
                        <div
                            className="w-full max-w-5xl bg-slate-900 rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 flex flex-col lg:flex-row h-[90vh] lg:h-auto lg:max-h-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Info Section */}
                            <div className="lg:w-1/3 p-5 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center gap-3 md:gap-8 shrink-0">
                                <div>
                                    <div className="text-accent font-black tracking-widest text-[10px] md:text-xs mb-1 md:mb-4 uppercase">Weekly Bulletin</div>
                                    <h3 className="text-lg md:text-3xl font-black text-white leading-tight mb-1 md:mb-4 line-clamp-2">
                                        {(i18n.language === 'en' && selectedArchiveBulletin.titleEn) ? selectedArchiveBulletin.titleEn : selectedArchiveBulletin.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-white/40 text-xs md:text-lg font-medium">
                                        <Calendar size={14} className="text-accent" />
                                        {selectedArchiveBulletin.date}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3 pt-1 md:pt-4">
                                    <button
                                        onClick={() => setIsBulletinFullScreen(true)}
                                        className="col-span-1 w-full py-2 md:py-3 bg-white text-slate-900 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm flex items-center justify-center gap-1.5 md:gap-3 hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]"
                                    >
                                        <Maximize size={14} />
                                        {i18n.language.startsWith('en') ? 'View Full Screen' : '전체 화면으로 보기'}
                                    </button>
                                    <a
                                        href={dbService.formatDriveDownloadLink(selectedArchiveBulletin.fileUrl)}
                                        download
                                        className="col-span-1 w-full py-2 md:py-3 bg-white/5 text-white/60 rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-1.5 md:gap-3"
                                    >
                                        <Download size={14} />
                                        {i18n.language.startsWith('en') ? 'Download File' : '파일 다운로드'}
                                    </a>
                                    <button
                                        onClick={() => setSelectedArchiveBulletin(null)}
                                        className="col-span-2 lg:col-span-1 w-full py-2 md:py-3 bg-white/10 text-white rounded-xl md:rounded-2xl font-black text-[11px] md:text-sm hover:bg-white/20 transition-all flex items-center justify-center"
                                    >
                                        {i18n.language.startsWith('en') ? 'Close' : '닫기'}
                                    </button>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="flex-grow bg-slate-900 lg:min-h-0 flex flex-col items-center justify-center relative group overflow-hidden">


                                {selectedArchiveBulletin.fileUrl2 && (
                                    <>
                                        {/* Side Navigation Arrows */}
                                        <div className="absolute inset-y-0 left-0 flex items-center p-4 z-30">
                                            <button
                                                onClick={() => setActiveArchivePage(1)}
                                                disabled={activeArchivePage === 1}
                                                className={clsx(
                                                    "w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/10 shadow-xl",
                                                    activeArchivePage === 1 ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible hover:bg-white hover:text-slate-900 active:scale-95"
                                                )}
                                                aria-label="Previous Page"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                        </div>
                                        <div className="absolute inset-y-0 right-0 flex items-center p-4 z-30">
                                            <button
                                                onClick={() => setActiveArchivePage(2)}
                                                disabled={activeArchivePage === 2}
                                                className={clsx(
                                                    "w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/10 shadow-xl",
                                                    activeArchivePage === 2 ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible hover:bg-white hover:text-slate-900 active:scale-95"
                                                )}
                                                aria-label="Next Page"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>

                                        {/* Page Indicator */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white/80 text-[10px] font-black tracking-[0.2em] shadow-lg">
                                            {activeArchivePage.toString().padStart(2, '0')} / 02
                                        </div>
                                    </>
                                )}

                                <div className="w-full h-full overflow-hidden bg-white">
                                    <iframe
                                        src={dbService.formatDriveLink(activeArchivePage === 1 ? selectedArchiveBulletin.fileUrl : selectedArchiveBulletin.fileUrl2)}
                                        className="w-full bulletin-preview-iframe"
                                        title="Bulletin Modal Preview"
                                    ></iframe>
                                </div>
                            </div>
                            <button
                                className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-red-500 text-white p-3 rounded-full transition-all backdrop-blur-md shadow-lg"
                                onClick={() => setSelectedArchiveBulletin(null)}
                                title="닫기"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )}

            {/* Video Playback Modal */}
            {showSermonModal && selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
                        onClick={() => {
                            setShowSermonModal(false);
                            setSelectedVideo(null);
                        }}
                    />
                    <div className="relative w-full max-w-5xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-in border border-white/10">
                        {/* Modal Header */}
                        <div className="absolute top-6 right-6 z-10">
                            <button
                                onClick={() => {
                                    setShowSermonModal(false);
                                    setSelectedVideo(null);
                                }}
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all group active:scale-95"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&vq=hd1080`}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={selectedVideo.title}
                            ></iframe>
                        </div>

                        {/* Legend Detail */}
                        <div className="p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-primary/20 text-primary text-[11px] font-black rounded-lg uppercase tracking-widest">{selectedVideo.date}</span>
                                <span className="text-white/40 text-sm font-black uppercase tracking-widest">Sunday Sermon</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                {(i18n.language === 'en' && selectedVideo.titleEn) ? selectedVideo.titleEn : selectedVideo.title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Full-Screen Bulletin Viewer */}
            {isBulletinFullScreen && selectedArchiveBulletin && (
                <div className="fixed inset-0 z-[200] bg-slate-950 animate-fade-in flex flex-col">
                    {/* Header bar with close button */}
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/10 z-30">
                        <div className="flex items-center gap-4">
                            <h3 className="text-white font-black">{selectedArchiveBulletin.title}</h3>
                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{selectedArchiveBulletin.date}</span>
                            <div className="h-4 w-px bg-white/10 mx-2" />
                            <a
                                href={dbService.formatDriveDownloadLink(selectedArchiveBulletin.fileUrl)}
                                download
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg text-[10px] font-black tracking-widest uppercase transition-all"
                            >
                                <Download size={14} />
                                파일 다운로드
                            </a>
                        </div>
                        <button
                            onClick={() => {
                                setIsBulletinFullScreen(false);
                                setSelectedArchiveBulletin(null);
                            }}
                            className="bg-white/10 hover:bg-red-500 text-white p-2 md:p-3 rounded-full transition-all group active:scale-95"
                            title="전체 화면 닫기"
                        >
                            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex-grow relative flex items-center justify-center bg-black overflow-hidden group/fs">
                        {/* Side Navigation Arrows (Full Screen) */}
                        {selectedArchiveBulletin.fileUrl2 && (
                            <>
                                <div className="absolute inset-y-0 left-0 flex items-center p-4 md:p-8 z-30 pointer-events-none">
                                    <button
                                        onClick={() => setActiveArchivePage(1)}
                                        disabled={activeArchivePage === 1}
                                        className={clsx(
                                            "w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-2xl pointer-events-auto",
                                            activeArchivePage === 1 ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible hover:bg-white hover:text-slate-900 active:scale-95 transition-opacity"
                                        )}
                                    >
                                        <ChevronLeft size={32} />
                                    </button>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center p-4 md:p-8 z-30 pointer-events-none">
                                    <button
                                        onClick={() => setActiveArchivePage(2)}
                                        disabled={activeArchivePage === 2}
                                        className={clsx(
                                            "w-16 h-16 md:w-20 md:h-20 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-2xl pointer-events-auto",
                                            activeArchivePage === 2 ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible hover:bg-white hover:text-slate-900 active:scale-95 transition-opacity"
                                        )}
                                    >
                                        <ChevronRight size={32} />
                                    </button>
                                </div>

                                {/* Page Indicator (Full Screen) */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 px-6 py-3 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white font-black tracking-[0.3em] shadow-2xl text-sm transition-opacity">
                                    {activeArchivePage.toString().padStart(2, '0')} / 02
                                </div>
                            </>
                        )}

                        <div className="w-full h-full overflow-hidden bg-white">
                            <iframe
                                src={dbService.formatDriveLink(activeArchivePage === 1 ? selectedArchiveBulletin.fileUrl : selectedArchiveBulletin.fileUrl2)}
                                className="w-full bulletin-fullscreen-iframe"
                                title="Full Screen Bulletin Viewer"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap",
            active
                ? "bg-white text-primary shadow-lg"
                : "text-slate-400 hover:text-primary hover:bg-white/50"
        )}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Resources;
