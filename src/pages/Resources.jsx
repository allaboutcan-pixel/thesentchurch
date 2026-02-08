import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Download, Calendar, Image as ImageIcon, FileText, Play, X, Music, ChevronRight, BookOpen, Quote, Video, Maximize } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import bulletinsInitialData from '../data/bulletins.json';
import { dbService } from '../services/dbService';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import CalendarWidget from '../components/CalendarWidget';

const Resources = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('sermon');
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
    const [columnArchiveData, setColumnArchiveData] = useState({});
    const [selectedColumnYear, setSelectedColumnYear] = useState(new Date().getFullYear().toString());
    const [selectedColumnMonth, setSelectedColumnMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedArchiveColumn, setSelectedArchiveColumn] = useState(null);
    const [notices, setNotices] = useState([]);

    const [galleryItems, setGalleryItems] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedArchiveBulletin, setSelectedArchiveBulletin] = useState(null);
    const [activeArchivePage, setActiveArchivePage] = useState(1);
    const [playingSermonId, setPlayingSermonId] = useState(null);
    const [showSermonModal, setShowSermonModal] = useState(false);
    const [isConfigLoaded, setIsConfigLoaded] = useState(false);

    // Filter sermons for the grid
    const featuredSermons = sermons.slice(0, 5);

    useEffect(() => {
        setPlayingSermonId(null);
    }, [activeTab, selectedSermonYear, selectedSermonMonth]);

    const [headerBanner, setHeaderBanner] = useState("/images/sermons_banner.jpg");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [titleFont, setTitleFont] = useState("font-sans");
    const [subtitleFont, setSubtitleFont] = useState("font-sans");
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [subtitleColor, setSubtitleColor] = useState("#ffffff");
    const [titleItalic, setTitleItalic] = useState(false);
    const [subtitleItalic, setSubtitleItalic] = useState(true);
    const [titleWeight, setTitleWeight] = useState("font-black");
    const [subtitleWeight, setSubtitleWeight] = useState("font-medium");
    const [titleSize, setTitleSize] = useState(48);
    const [subtitleSize, setSubtitleSize] = useState(24);
    const [overlayOpacity, setOverlayOpacity] = useState(40);
    const [height, setHeight] = useState("medium");

    useEffect(() => {
        let isMounted = true;
        const fetchBanner = async () => {
            const config = await dbService.getSiteConfig();
            if (!isMounted) return;

            if (config) {
                const prefix = location.pathname.startsWith('/news') ? 'news' : 'resources';

                if (config[`${prefix}Banner`]) setHeaderBanner(config[`${prefix}Banner`]);
                if (config[`${prefix}Title`]) setTitle(config[`${prefix}Title`]);
                if (config[`${prefix}Subtitle`]) setSubtitle(config[`${prefix}Subtitle`]);
                if (config[`${prefix}TitleFont`]) setTitleFont(config[`${prefix}TitleFont`]);
                if (config[`${prefix}SubtitleFont`]) setSubtitleFont(config[`${prefix}SubtitleFont`]);
                if (config[`${prefix}TitleColor`]) setTitleColor(config[`${prefix}TitleColor`]);
                if (config[`${prefix}SubtitleColor`]) setSubtitleColor(config[`${prefix}SubtitleColor`]);
                if (config[`${prefix}TitleItalic`] !== undefined) setTitleItalic(config[`${prefix}TitleItalic`]);
                if (config[`${prefix}SubtitleItalic`] !== undefined) setSubtitleItalic(config[`${prefix}SubtitleItalic`]);
                if (config[`${prefix}TitleWeight`]) setTitleWeight(config[`${prefix}TitleWeight`]);
                if (config[`${prefix}SubtitleWeight`]) setSubtitleWeight(config[`${prefix}SubtitleWeight`]);
                if (config[`${prefix}TitleSize`]) setTitleSize(config[`${prefix}TitleSize`]);
                if (config[`${prefix}SubtitleSize`]) setSubtitleSize(config[`${prefix}SubtitleSize`]);
                if (config[`${prefix}OverlayOpacity`] !== undefined) setOverlayOpacity(config[`${prefix}OverlayOpacity`]);
                if (config[`${prefix}Height`]) setHeight(config[`${prefix}Height`]);
            }
        };
        fetchBanner();
        return () => { isMounted = false; };
    }, []);

    const getPreviewSource = (url) => {
        if (!url) return null;
        const ytId = getYoutubeId(url);
        if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
            }
        }
        return null;
    };

    useEffect(() => {
        // More robust scroll to top for mobile navigation
        const scrollToTop = () => {
            window.scrollTo(0, 0);
            // Double-check after a short delay for layout shifts
            setTimeout(() => window.scrollTo(0, 0), 100);
        };

        requestAnimationFrame(scrollToTop);

        if (location.pathname.includes('gallery')) {
            setActiveTab('gallery');
        } else if (location.pathname.includes('column')) {
            setActiveTab('column');
        } else if (location.pathname.includes('calendar')) {
            setActiveTab('calendar');
        } else if (location.pathname.includes('bulletin')) {
            setActiveTab('bulletin');
        } else if (location.pathname.includes('sermon') || location.pathname.includes('/sermons')) {
            setActiveTab('sermon');
        } else if (location.pathname.includes('news') || location.pathname.includes('/news')) {
            setActiveTab('bulletin'); // Default to bulletin for News
        } else {
            setActiveTab('sermon'); // Default to sermon
        }
    }, [location]);

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
                        if (!item.date) return;
                        const [y, m] = item.date.split('-');
                        const year = y;
                        const month = parseInt(m, 10).toString();
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setArchiveData(grouped);

                    const [ly, lm] = sorted[0].date.split('-');
                    setSelectedYear(ly);
                    setSelectedMonth(parseInt(lm, 10).toString());
                }

                // Process Gallery
                setGalleryItems(liveGallery);

                // Process Sermons
                if (liveSermons.length > 0) {
                    const sorted = [...liveSermons].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setSermons(sorted);
                    setLatestSermon(sorted[0]);

                    const grouped = {};
                    sorted.forEach(item => {
                        if (!item.date) return;
                        const [y, m] = item.date.split('-');
                        const year = y;
                        const month = parseInt(m, 10).toString();
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setSermonArchiveData(grouped);

                    const [ly, lm] = sorted[0].date.split('-');
                    setSelectedSermonYear(ly);
                    setSelectedSermonMonth(parseInt(lm, 10).toString());
                }

                // Process Columns
                if (liveColumns.length > 0) {
                    const sorted = [...liveColumns].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setColumns(sorted);
                    setLatestColumn(sorted[0]);

                    const grouped = {};
                    sorted.forEach(item => {
                        if (!item.date) return;
                        const [y, m] = item.date.split('-');
                        const year = y;
                        const month = parseInt(m, 10).toString();
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setColumnArchiveData(grouped);
                    const [ly, lm] = sorted[0].date.split('-');
                    setSelectedColumnYear(ly);
                    setSelectedColumnMonth(parseInt(lm, 10).toString());
                }

                // Process Notices
                if (liveNotices.length > 0) setNotices(liveNotices);

            } catch (error) {
                console.warn("Failed to fetch some resources in parallel:", error);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header with Banner */}
            <section className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-[65vh] md:h-[85vh]" :
                    height === 'large' ? "h-[65vh]" :
                        height === 'medium' ? "h-[50vh] min-h-[400px]" :
                            "h-[25vh]"
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
                            alt="Resources Banner"
                            className="w-full h-full object-cover"
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
                        "mb-8 animate-fade-in-up break-keep",
                        titleWeight,
                        titleFont,
                        titleItalic && "italic"
                    )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {title || t('resources.banner_title')}
                    </h1>
                    <div className="w-20 h-1.5 bg-accent mx-auto mb-8 rounded-full animate-fade-in-up delay-75" />
                    <h2 className={clsx(
                        "tracking-wide opacity-90 animate-fade-in-up delay-100",
                        subtitleWeight,
                        subtitleFont,
                        subtitleItalic && "italic"
                    )}
                        style={{
                            color: subtitleColor,
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {subtitle || t('resources.banner_subtitle')}
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
                    <div className="space-y-24 pb-40 animate-fade-in">
                        {/* Featured Player & Recent List */}
                        <div className="flex flex-col lg:flex-row items-center gap-24 max-w-[1200px] mx-auto transition-all bg-transparent">
                            {/* Main Player */}
                            <div className="lg:w-[65%] lg:pt-16">
                                {latestSermon ? (
                                    <div className="bg-slate-900 overflow-hidden shadow-2xl border border-white/10">
                                        <div className="aspect-video relative group cursor-pointer" onClick={() => setLatestSermon(prev => ({ ...prev, isPlaying: true }))}>
                                            {latestSermon.isPlaying ? (
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${latestSermon.youtubeId}?autoplay=1&rel=0&vq=hd1080`}
                                                    className="w-full h-full border-none"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title={latestSermon.title}
                                                ></iframe>
                                            ) : (
                                                <>
                                                    <img
                                                        src={`https://img.youtube.com/vi/${latestSermon.youtubeId}/maxresdefault.jpg`}
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
                                        <div className="p-4 md:p-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase">Latest Sermon</span>
                                                <span className="text-white/40 text-sm font-medium">{latestSermon.date}</span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                                                {latestSermon.title}
                                            </h2>
                                            <div className="flex items-center gap-2 text-white/60">
                                                <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center">
                                                    <Play size={10} className="text-accent" />
                                                </div>
                                                <span className="font-bold text-sm">{latestSermon.preacher || (i18n.language.startsWith('en') ? 'Pastor Nam-Gyu Lee' : '이남규 목사')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-[2.5rem] aspect-video flex items-center justify-center text-slate-300">
                                        등록된 설교 영상이 없습니다.
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
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{sermons.length} Videos</span>
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
                                                    {sermon.title}
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
                                        {year}년
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
                                            <span className="font-bold">{month}{i18n.language.startsWith('en') ? '' : '월'}</span>
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
                                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">{item.date.split('-').slice(1).join('.')}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors truncate">
                                                        {item.title}
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
                                            <p className="font-bold">선택하신 날짜의 말씀이 없습니다.</p>
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
                            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 max-w-[1400px] mx-auto transition-all">
                                <div className="p-8 md:p-14 flex flex-col lg:flex-row gap-12 items-center">
                                    <div className="lg:w-[35%] text-white space-y-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-black tracking-widest uppercase">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                            Latest Bulletin
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black leading-tight text-white">
                                            {latestBulletin.title}
                                        </h2>
                                        <div className="flex items-center gap-3 text-white/60 text-sm font-medium">
                                            <Calendar size={16} className="text-accent" />
                                            {latestBulletin.date || ""}
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <a
                                                href={dbService.formatDriveLink(latestBulletin.fileUrl)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5 text-sm"
                                            >
                                                <BookOpen size={16} />
                                                주보 크게 보기
                                            </a>
                                            <a
                                                href={dbService.formatDriveDownloadLink(latestBulletin.fileUrl)}
                                                download
                                                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20 text-sm"
                                            >
                                                <Download size={16} />
                                                다운로드
                                            </a>
                                        </div>
                                    </div>

                                    {/* Responsive Viewer (Preview) */}
                                    <div className="lg:w-[65%] w-full space-y-6">
                                        {latestBulletin.fileUrl2 && (
                                            <div className="flex bg-white/5 p-1 rounded-2xl w-fit border border-white/10 mx-auto lg:mx-0">
                                                <button
                                                    onClick={() => setActivePage(1)}
                                                    className={clsx(
                                                        "px-6 py-2 rounded-xl text-xs font-black transition-all",
                                                        activePage === 1 ? "bg-white text-primary shadow-lg" : "text-white/40 hover:text-white"
                                                    )}
                                                >
                                                    PAGE 01
                                                </button>
                                                <button
                                                    onClick={() => setActivePage(2)}
                                                    className={clsx(
                                                        "px-6 py-2 rounded-xl text-xs font-black transition-all",
                                                        activePage === 2 ? "bg-white text-primary shadow-lg" : "text-white/40 hover:text-white"
                                                    )}
                                                >
                                                    PAGE 02
                                                </button>
                                            </div>
                                        )}
                                        <div className="aspect-[16/10] bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
                                            <iframe
                                                src={dbService.formatDriveLink(activePage === 1 ? latestBulletin.fileUrl : latestBulletin.fileUrl2)}
                                                className="w-full h-full border-none opacity-80 hover:opacity-100 transition-opacity"
                                                title="Latest Bulletin Preview"
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                <p>등록된 주보가 없습니다.</p>
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
                                        {year}년
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
                                            <span className="font-bold">{month}{i18n.language.startsWith('en') ? '' : '월'}</span>
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
                                            }}
                                            className="group bg-white border border-slate-100 rounded-lg py-2 px-3 flex items-center justify-between hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="min-w-[30px] border-r border-slate-100 pr-3 flex justify-center">
                                                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                                                        {(() => {
                                                            if (!item.date) return "";
                                                            const p = item.date.split('-');
                                                            if (i18n.language.startsWith('en')) return item.date.substring(5); // MM-DD
                                                            return p.length >= 3 ? `${parseInt(p[1], 10)}.${parseInt(p[2], 10)}` : item.date;
                                                        })()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors truncate">
                                                        {item.title}
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
                                            <p className="font-bold">선택하신 날짜의 주보가 없습니다.</p>
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
                            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 max-w-[1400px] mx-auto transition-all">
                                <div className="p-8 md:p-14 flex flex-col lg:flex-row gap-12 items-center">
                                    <div className="lg:w-[35%] text-white space-y-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-[10px] font-black tracking-widest uppercase">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                                            Latest Column
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black leading-tight text-white">
                                            {latestColumn.title}
                                        </h2>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3 text-white/60 text-sm font-medium">
                                                <Calendar size={16} className="text-accent" />
                                                {latestColumn.date || ""}
                                            </div>
                                            <div className="text-white/80 font-bold">
                                                작성: {latestColumn.author || '이남규 목사'}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <a
                                                href={dbService.formatDriveLink(latestColumn.fileUrl)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5 text-sm"
                                            >
                                                <BookOpen size={16} />
                                                칼럼 크게 보기
                                            </a>
                                            <a
                                                href={dbService.formatDriveDownloadLink(latestColumn.fileUrl)}
                                                download
                                                className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all border border-white/20 text-sm"
                                            >
                                                <Download size={16} />
                                                다운로드
                                            </a>
                                        </div>
                                    </div>

                                    {/* Responsive Viewer (Preview) */}
                                    <div className="lg:w-[65%] w-full space-y-6">
                                        <div className="aspect-[16/10] bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl">
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
                                                    title={latestColumn.title}
                                                    allowFullScreen
                                                ></iframe>
                                            ) : latestColumn.fileType === 'image' ? (
                                                <img
                                                    src={latestColumn.fileUrl}
                                                    alt={latestColumn.title}
                                                    className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <iframe
                                                    src={dbService.formatDriveLink(latestColumn.fileUrl)}
                                                    className="w-full h-full border-none opacity-80 hover:opacity-100 transition-opacity"
                                                    title={latestColumn.title}
                                                ></iframe>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                <p>등록된 칼럼이 없습니다.</p>
                            </div>
                        )}


                        {/* 2. Column Archive */}
                        <div className="space-y-8">
                            <div className="border-b-4 border-slate-100 pb-6 space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <FileText size={28} className="text-primary" />
                                    지난 목회 칼럼 보기
                                </h3>
                                <p className="text-slate-400 font-medium text-sm mt-1 italic">이남규 목사님의 목회 칼럼 보관함입니다.</p>
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
                                        {year}년
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
                                            <span className="font-bold">{month}월</span>
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
                                                        {item.title}
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
                                            <p className="font-bold">선택하신 날짜의 목회 칼럼이 없습니다.</p>
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
                            {galleryItems.map((img, idx) => {
                                // 1. Prioritize manually uploaded thumbnail
                                let thumbnailUrl = img.thumbnailUrl || img.url;

                                // 2. Auto-extraction fallback if no manual thumbnail exists
                                if (!img.thumbnailUrl && img.type === 'video') {
                                    if (img.url.includes('youtube.com') || img.url.includes('youtu.be')) {
                                        const ytId = img.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
                                        if (ytId) {
                                            thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
                                        }
                                    } else if (img.url.includes('drive.google.com')) {
                                        const driveMatch = img.url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                                            img.url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                                            img.url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

                                        const driveId = driveMatch ? driveMatch[1] : null;
                                        if (driveId) {
                                            // Using authuser=0 and sz=w800 for better balancing of quality/speed
                                            thumbnailUrl = `https://drive.google.com/thumbnail?authuser=0&sz=w800&id=${driveId}`;
                                        }
                                    }
                                }

                                return (
                                    <div key={img.id || idx} className="flex flex-col group">
                                        <div
                                            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-50 shadow-sm hover:shadow-xl transition-all border border-gray-100"
                                            onClick={() => (img.type === 'video' || img.type === 'audio') && setSelectedVideo(img)}
                                        >
                                            {img.type === 'audio' ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white text-primary">
                                                    <Music size={32} className="opacity-30 mb-2" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors">
                                                        <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                            <Play size={16} fill="currentColor" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="group relative w-full h-full">
                                                    {/* Special handling for Drive Videos (Use iframe for reliable preview) */}
                                                    {(img.type === 'video' && img.url.includes('drive.google.com')) ? (
                                                        <div className="w-full h-full relative">
                                                            <iframe
                                                                src={dbService.formatDriveLink(img.url)}
                                                                className="w-full h-full object-cover pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
                                                                title={img.title}
                                                                tabIndex="-1"
                                                            />
                                                            {/* Overlay to capture clicks for modal */}
                                                            <div className="absolute inset-0 z-10 bg-transparent" />
                                                        </div>
                                                    ) : (
                                                        /* Standard handling for YouTube/Images */
                                                        <div className="group relative w-full h-full">
                                                            {img.type === 'video' ? (
                                                                <div className="w-full h-full relative">
                                                                    {getPreviewSource(img.url) ? (
                                                                        <img
                                                                            src={getPreviewSource(img.url)}
                                                                            alt={img.title}
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                            loading="lazy"
                                                                        />
                                                                    ) : (
                                                                        <video
                                                                            src={`${img.url}#t=0.001`}
                                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                            preload="metadata"
                                                                            onLoadedMetadata={(e) => {
                                                                                e.target.currentTime = 0.001;
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={thumbnailUrl}
                                                                    alt=""
                                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                    loading="lazy"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        const fallback = e.target.parentElement.querySelector('.thumbnail-fallback');
                                                                        if (fallback) fallback.style.display = 'flex';
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Fallback for broken thumbnails */}
                                            <div className="thumbnail-fallback hidden absolute inset-0 flex-col items-center justify-center bg-slate-100 text-slate-300">
                                                <Play size={32} className="opacity-20 mb-2" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight text-center px-4">미리보기를<br />불러올 수 없습니다</span>
                                            </div>

                                            {img.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-colors">
                                                    <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform shadow-lg">
                                                        <Play size={16} fill="currentColor" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Clean Hover Overlay for Title */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                <p className="text-white text-xs font-bold truncate">{img.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {galleryItems.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-400 font-medium font-sans">
                                    아직 등록된 사진이나 영상이 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {activeTab === 'calendar' && (
                    <div className="animate-fade-in max-w-5xl mx-auto py-32">
                        <CalendarWidget />
                    </div>
                )}
            </div>

            {/* Video Modal Player */}
            {
                selectedVideo && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <X size={32} />
                        </button>

                        <div
                            className={clsx(
                                "w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl relative",
                                selectedVideo.type === 'audio' ? "aspect-auto p-12 bg-white" : "aspect-video"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedVideo.type === 'audio' ? (
                                <div className="flex flex-col items-center gap-8 py-4">
                                    <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center text-primary animate-pulse">
                                        <Music size={64} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-primary mb-2">{selectedVideo.title}</h3>
                                        <p className="text-gray-400 font-medium">{selectedVideo.date}</p>
                                    </div>
                                    <audio
                                        src={selectedVideo.url}
                                        controls
                                        autoPlay
                                        className="w-full max-w-md"
                                    />
                                </div>
                            ) : isVideo(selectedVideo.url) ? (
                                <video
                                    src={selectedVideo.url}
                                    controls
                                    autoPlay
                                    className="w-full h-full"
                                />
                            ) : (
                                <iframe
                                    src={(() => {
                                        let url = selectedVideo.url;
                                        // Convert YouTube to HD Embed if needed
                                        if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                                            const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
                                            if (ytId) {
                                                url = `https://www.youtube.com/embed/${ytId}?autoplay=1&vq=hd1080`;
                                            }
                                        } else if (url && url.includes('drive.google.com')) {
                                            // Ensure Drive link is in preview/HD mode
                                            if (!url.includes('/preview')) {
                                                const driveId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                                                    url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                                                    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                                                if (driveId) url = `https://drive.google.com/file/d/${driveId[1]}/preview`;
                                            }
                                        }
                                        return url;
                                    })()}
                                    className="w-full h-full border-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={selectedVideo.title}
                                ></iframe>
                            )}
                            <div className={clsx(
                                "absolute left-0 right-0 text-center font-bold",
                                selectedVideo.type === 'audio' ? "hidden" : "bottom-[-40px] text-white"
                            )}>
                                {selectedVideo.title}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Column Modal Viewer */}
            {
                selectedArchiveColumn && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setSelectedArchiveColumn(null)}
                    >
                        <div
                            className="w-full max-w-5xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 flex flex-col lg:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full transition-all"
                                onClick={() => setSelectedArchiveColumn(null)}
                            >
                                <X size={24} />
                            </button>

                            {/* Info Section */}
                            <div className="lg:w-1/3 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center gap-8">
                                <div>
                                    <div className="text-accent font-black tracking-widest text-xs mb-4 uppercase">Pastoral Column</div>
                                    <h3 className="text-3xl font-black text-white leading-tight mb-4">{selectedArchiveColumn.title}</h3>
                                    <p className="text-white/40 text-lg font-medium">{selectedArchiveColumn.date}</p>
                                    <p className="text-white/60 font-bold mt-2">작성: {selectedArchiveColumn.author || '이남규 목사'}</p>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <a
                                        href={dbService.formatDriveLink(selectedArchiveColumn.fileUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
                                    >

                                        전체 화면으로 보기
                                    </a>
                                    <a
                                        href={dbService.formatDriveDownloadLink(selectedArchiveColumn.fileUrl)}
                                        download
                                        className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-black text-sm hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <Download size={18} />
                                        파일 다운로드
                                    </a>
                                    <button
                                        onClick={() => setSelectedArchiveColumn(null)}
                                        className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all"
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="flex-grow bg-slate-900 aspect-square lg:aspect-auto flex items-center justify-center">
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
                                        alt={selectedArchiveColumn.title}
                                    />
                                ) : (
                                    <iframe
                                        src={dbService.formatDriveLink(selectedArchiveColumn.fileUrl)}
                                        className="w-full h-full border-none"
                                        title="Column Modal Preview"
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Bulletin Modal Viewer */}
            {
                selectedArchiveBulletin && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                        onClick={() => setSelectedArchiveBulletin(null)}
                    >
                        <div
                            className="w-full max-w-5xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10 flex flex-col lg:flex-row"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-red-500 text-white p-3 rounded-full transition-all backdrop-blur-md shadow-lg"
                                onClick={() => setSelectedArchiveBulletin(null)}
                                title="닫기"
                            >
                                <X size={24} />
                            </button>


                            {/* Info Section */}
                            <div className="lg:w-1/3 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center gap-8">
                                <div>
                                    <div className="text-accent font-black tracking-widest text-xs mb-4 uppercase">Weekly Bulletin</div>
                                    <h3 className="text-3xl font-black text-white leading-tight mb-4">{selectedArchiveBulletin.title}</h3>
                                    <div className="flex items-center gap-2 text-white/40 text-lg font-medium">
                                        <Calendar size={20} className="text-accent" />
                                        {selectedArchiveBulletin.date}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-4">
                                    <a
                                        href={dbService.formatDriveLink(selectedArchiveBulletin.fileUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-100 transition-all"
                                    >
                                        <BookOpen size={18} />
                                        전체 화면으로 보기
                                    </a>
                                    <a
                                        href={dbService.formatDriveDownloadLink(selectedArchiveBulletin.fileUrl)}
                                        download
                                        className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-black text-sm hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
                                    >
                                        <Download size={18} />
                                        파일 다운로드
                                    </a>
                                    <button
                                        onClick={() => setSelectedArchiveBulletin(null)}
                                        className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all"
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="flex-grow bg-slate-900 aspect-square lg:aspect-auto flex flex-col items-center justify-center relative group">


                                {selectedArchiveBulletin.fileUrl2 && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex bg-black/50 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                                        <button
                                            onClick={() => setActiveArchivePage(1)}
                                            className={clsx(
                                                "px-6 py-2 rounded-xl text-xs font-black transition-all",
                                                activeArchivePage === 1 ? "bg-white text-primary shadow-lg" : "text-white/40 hover:text-white"
                                            )}
                                        >
                                            PAGE 01
                                        </button>
                                        <button
                                            onClick={() => setActiveArchivePage(2)}
                                            className={clsx(
                                                "px-6 py-2 rounded-xl text-xs font-black transition-all",
                                                activeArchivePage === 2 ? "bg-white text-primary shadow-lg" : "text-white/40 hover:text-white"
                                            )}
                                        >
                                            PAGE 02
                                        </button>
                                    </div>
                                )}

                                <iframe
                                    src={dbService.formatDriveLink(activeArchivePage === 1 ? selectedArchiveBulletin.fileUrl : selectedArchiveBulletin.fileUrl2)}
                                    className="w-full h-full border-none"
                                    title="Bulletin Modal Preview"
                                ></iframe>
                            </div>
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
                                {selectedVideo.title}
                            </h3>
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
