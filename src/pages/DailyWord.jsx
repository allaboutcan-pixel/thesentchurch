import { useState, useEffect } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Calendar, ChevronRight, BookOpen, Quote, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';
import { getDayName, safeSplitDate } from '../utils/dateUtils';

const DailyWord = () => {
    const { t, i18n } = useTranslation();
    const [dailyWords, setDailyWords] = useState([]);
    const [latestWord, setLatestWord] = useState(null);
    const [archiveData, setArchiveData] = useState({}); // { year: { month: [items] } }
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const { config: siteConfig, loading: configLoading } = useSiteConfig();
    const prefix = 'resources'; // Unify with sermons/media page

    if (configLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const headerBanner = siteConfig?.[`${prefix}Banner`] || "/images/sermons_banner.jpg";
    const title = i18n.language.startsWith('en') && siteConfig?.[`${prefix}TitleEn`] ? siteConfig[`${prefix}TitleEn`] : (siteConfig?.[`${prefix}Title`] || t('resources.daily_word_title'));
    const subtitle = i18n.language.startsWith('en') && siteConfig?.[`${prefix}SubtitleEn`] ? siteConfig[`${prefix}SubtitleEn`] : (siteConfig?.[`${prefix}Subtitle`] || t('resources.daily_word_subtitle'));
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
    const overlayOpacity = siteConfig?.[`${prefix}OverlayOpacity`] ?? 40;
    // eslint-disable-next-line no-unused-vars
    const height = siteConfig?.[`${prefix}Height`] || "medium";
    const bannerFit = siteConfig?.[`${prefix}BannerFit`] || "cover";

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const words = await dbService.getDailyWords();
                if (!isMounted) return;

                if (words.length > 0) {
                    const sorted = [...words].sort((a, b) => {
                        const dateA = a.date ? new Date(a.date) : new Date(0);
                        const dateB = b.date ? new Date(b.date) : new Date(0);
                        return dateB - dateA;
                    });
                    const displayList = sorted.slice(0, 10);
                    setDailyWords(displayList);

                    const d = new Date();
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const todayStr = `${year}-${month}-${day}`;

                    const todayWord = sorted.find(w => w.date === todayStr);

                    let displayWord = todayWord;
                    if (!displayWord && d.getDay() === 0) {
                        const tomorrow = new Date(d);
                        tomorrow.setDate(d.getDate() + 1);
                        const tomStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                        displayWord = sorted.find(w => w.date === tomStr);
                    }

                    const lastWord = sorted.find(w => w.date < todayStr) || sorted[0];
                    setLatestWord(displayWord || lastWord);

                    const grouped = {};
                    displayList.forEach(item => {
                        if (!item || !item.date) return;
                        const [year, month] = safeSplitDate(item.date);
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setArchiveData(grouped);

                    if (displayList.length > 0) {
                        const [year, month] = safeSplitDate(displayList[0].date);
                        setSelectedYear(year);
                        setSelectedMonth(month);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch daily words:", error);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [i18n.language]);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Banner */}
            <section className="relative w-full flex items-center justify-center overflow-hidden h-[50vh] md:h-[75vh]">
                <div className="absolute inset-0 z-0">
                    <img
                        src={headerBanner}
                        alt="Daily Word Banner"
                        className={clsx(
                            "w-full h-full transition-all duration-700",
                            bannerFit === 'contain' ? "object-contain" : "object-cover"
                        )}
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
                    <div
                        className="absolute inset-0 bg-black/30 z-[1] pointer-events-none"
                        style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
                    />
                </div>
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
                        {i18n.language.startsWith('en') ? (title || t('resources.daily_word_title')) : t('resources.daily_word_title')}
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
                        {i18n.language.startsWith('en') ? (subtitle || t('resources.daily_word_subtitle')) : t('resources.daily_word_subtitle')}
                    </h2>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Tabs - Unified with Resources.jsx */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex rounded-xl shadow-sm bg-gray-100 p-1" role="group">
                        <Link
                            to="/sermons"
                            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all text-slate-400 hover:text-primary hover:bg-white/50 whitespace-nowrap"
                        >
                            <Play size={18} />
                            <span>{t('nav.sunday_sermon')}</span>
                        </Link>
                        <button
                            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all bg-white text-primary shadow-lg whitespace-nowrap"
                        >
                            <Quote size={18} />
                            <span>{t('nav.daily_word')}</span>
                        </button>
                        <Link
                            to="/sermons/column"
                            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all text-slate-400 hover:text-primary hover:bg-white/50 whitespace-nowrap"
                        >
                            <BookOpen size={18} />
                            <span>{t('nav.column')}</span>
                        </Link>
                    </div>
                </div>

                {/* Latest Word Highlight - Open Book Style with Page Turning */}
                {dailyWords.length > 0 && (
                    <div className="max-w-5xl mx-auto mb-24 animate-fade-in px-4 relative">
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => {
                                const currentIndex = dailyWords.findIndex(w => w.id === latestWord.id);
                                if (currentIndex < dailyWords.length - 1) {
                                    setLatestWord(dailyWords[currentIndex + 1]);
                                }
                            }}
                            disabled={!latestWord || dailyWords.findIndex(w => w.id === latestWord.id) >= dailyWords.length - 1}
                            className="absolute left-2 top-1/2 -translate-y-1/2 md:-translate-x-12 z-30 p-2 md:p-3 text-stone-400 hover:text-stone-600 disabled:opacity-0 transition-all bg-white/60 md:bg-transparent rounded-full backdrop-blur-md md:backdrop-blur-none shadow-lg md:shadow-none border border-white/50 md:border-none"
                            aria-label="Previous Day"
                        >
                            <ChevronRight size={24} className="rotate-180 md:w-10 md:h-10" />
                        </button>
                        <button
                            onClick={() => {
                                const currentIndex = dailyWords.findIndex(w => w.id === latestWord.id);
                                if (currentIndex > 0) {
                                    setLatestWord(dailyWords[currentIndex - 1]);
                                }
                            }}
                            disabled={!latestWord || dailyWords.findIndex(w => w.id === latestWord.id) <= 0}
                            className="absolute right-2 top-1/2 -translate-y-1/2 md:translate-x-12 z-30 p-2 md:p-3 text-stone-400 hover:text-stone-600 disabled:opacity-0 transition-all bg-white/60 md:bg-transparent rounded-full backdrop-blur-md md:backdrop-blur-none shadow-lg md:shadow-none border border-white/50 md:border-none"
                            aria-label="Next Day"
                        >
                            <ChevronRight size={24} className="md:w-10 md:h-10" />
                        </button>

                        {/* Book Container */}
                        <div className="relative bg-[#fdfbf7] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-300/50 flex flex-col md:flex-row min-h-[500px]">

                            {/* Spine/Gutter Effect (Center Shadow) - Desktop Only */}
                            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 pointer-events-none z-20 hidden md:block"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04) 45%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.04) 55%, transparent)' }}>
                            </div>

                            {/* Content with Animation */}
                            <AnimatePresence mode="wait">
                                {latestWord && (
                                    <motion.div
                                        key={latestWord.id || latestWord.date}
                                        className="contents"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        {/* Left Page (Image) - Mobile: Top Half */}
                                        <div className="md:w-1/2 relative overflow-hidden group border-b md:border-b-0 md:border-r border-stone-200/50 bg-stone-100/50">
                                            <img
                                                src={latestWord.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                                alt="Today's Word"
                                                className="w-full h-auto max-h-[500px] md:h-full object-contain transition-transform duration-1000"
                                            />
                                            {/* Vertical Gutter Shadow for Mobile */}
                                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/5 to-transparent pointer-events-none md:hidden" />
                                            {/* Inner Shadow for page curl effect (Desktop) */}
                                            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/10 to-transparent pointer-events-none hidden md:block" />

                                            <div className="absolute top-6 left-6">
                                                <div className="bg-white/90 backdrop-blur-sm text-stone-800 w-12 h-12 rounded-lg flex items-center justify-center font-serif font-bold text-xl shadow-md border border-stone-100/50">
                                                    {getDayName(latestWord.date)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Page (Text) - Mobile: Bottom Half */}
                                        <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center relative min-h-[300px] md:min-h-0">
                                            {/* Inner Shadow for page curl effect (Desktop) */}
                                            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/5 to-transparent pointer-events-none hidden md:block" />
                                            {/* Top Shadow for Mobile Gutter */}
                                            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/5 to-transparent pointer-events-none md:hidden" />

                                            <div className="absolute top-6 right-6 opacity-30">
                                                <Quote size={28} className="text-stone-400 md:w-8 md:h-8" />
                                            </div>
                                            <div className="mb-4 md:mb-6">
                                                <span className="text-stone-500 text-[10px] md:text-xs font-serif tracking-widest uppercase border-b border-stone-300 pb-1">
                                                    {latestWord.date}
                                                </span>
                                            </div>

                                            <h2 className="text-xl md:text-2xl font-black text-stone-800 mb-4 md:mb-6 leading-tight break-keep font-serif">
                                                {(() => {
                                                    const text = latestWord.verse || latestWord.title;
                                                    if (!text) return null;

                                                    // Regex to catch "이번 주 ... 한 구절" variations
                                                    const introRegex = /["']?이번\s*주.*?한\s*구절["']?/i;
                                                    const englishIntroRegex = /a\s*verse\s*for\s*today/i;

                                                    // Remove intro parts and "A Verse for Today"
                                                    return text.replace(introRegex, '').replace(englishIntroRegex, '').trim();
                                                })()}
                                            </h2>

                                            {(() => {
                                                // Check if content is just the intro text or "A Verse for Today"
                                                const introRegex = /["']?이번\s*주.*?한\s*구절["']?/i;
                                                const englishIntroRegex = /a\s*verse\s*for\s*today/i;

                                                const isIntro = introRegex.test(latestWord.content) || englishIntroRegex.test(latestWord.content);

                                                return (
                                                    <p className={clsx(
                                                        "leading-relaxed break-keep whitespace-pre-wrap font-serif",
                                                        isIntro ? "text-stone-500 text-xs mb-4 font-medium" : "text-stone-600 text-sm md:text-base"
                                                    )}>
                                                        {latestWord.content}
                                                    </p>
                                                );
                                            })()}

                                            {/* Page Number Footer style */}
                                            <div className="mt-8 md:mt-12 flex justify-center md:justify-end">
                                                <span className="text-amber-900/80 text-[10px] font-serif tracking-widest font-bold">The Church of the Sent</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Archive Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="border-b-4 border-slate-100 pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <Calendar size={28} className="text-primary" />
                                {t('resources.daily_word_title')}
                            </h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">{t('resources.daily_word_archive_desc')}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {Object.keys(archiveData).sort((a, b) => b - a).map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-full font-black text-xs transition-all",
                                        selectedYear === year
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                    )}
                                >
                                    {year}{i18n.language.startsWith('ko') ? '년' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 min-h-[400px]">
                        {/* Month Sidebar */}
                        <div className="md:w-32 flex flex-wrap md:flex-col content-start gap-2 md:border-r border-slate-100 pr-0 md:pr-6 mb-6 md:mb-0">
                            {archiveData[selectedYear] && Object.keys(archiveData[selectedYear]).sort((a, b) => b - a).map(month => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={clsx(
                                        "px-4 py-2 rounded-lg text-sm font-bold transition-all shrink-0",
                                        selectedMonth === month
                                            ? "bg-slate-900 text-white shadow-md"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                    )}
                                >
                                    {month}{i18n.language.startsWith('ko') ? '월' : ''}
                                </button>
                            ))}
                        </div>

                        {/* Word Cards Grid */}
                        <div className="flex-grow">
                            {archiveData[selectedYear]?.[selectedMonth] ? (
                                <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                                    {archiveData[selectedYear][selectedMonth]
                                        .sort((a, b) => {
                                            const orderA = a.order ?? -1;
                                            const orderB = b.order ?? -1;
                                            if (orderA !== -1 && orderB !== -1) return orderB - orderA;
                                            if (orderA !== -1) return -1;
                                            if (orderB !== -1) return 1;

                                            // Defensive null check for dates
                                            const dateA = a.date ? new Date(a.date) : new Date(0);
                                            const dateB = b.date ? new Date(b.date) : new Date(0);
                                            return dateB - dateA; // Descending
                                        })
                                        .filter(word => word && word.date) // <--- Safety guard
                                        .map((word) => (
                                            <div
                                                key={word.id}
                                                onClick={() => {
                                                    setLatestWord(word);
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                }}
                                                className="w-full bg-white rounded-xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 group hover:shadow-2xl transition-all flex flex-col hover:-translate-y-1 duration-300 shadow-sm md:shadow-lg shadow-slate-200/50 cursor-pointer"
                                            >
                                                <div className="aspect-square md:aspect-video relative overflow-hidden">
                                                    <img
                                                        src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                                        alt="Preview"
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-t md:from-black/20" />

                                                    {/* Card Badge UI - Mobile Compact */}
                                                    <div className="absolute top-2 left-2 md:top-6 md:left-6 flex items-center gap-1 md:gap-2">
                                                        <div className="bg-white/95 backdrop-blur-md text-primary w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black text-xs md:text-lg shadow-sm md:shadow-lg">
                                                            {word?.date ? getDayName(word.date) : '-'}
                                                        </div>
                                                        <span className="hidden md:block bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                                            {word?.date || 'Unknown'}
                                                        </span>
                                                    </div>

                                                    {/* Mobile Title Overlay */}
                                                    <div className="absolute bottom-2 left-2 right-2 md:hidden">
                                                        <h4 className="font-bold text-white text-[10px] line-clamp-2 drop-shadow-md">
                                                            {word.verse?.includes?.('하나님의 한구절') ? word.verse.split?.('하나님의 한구절')[1]?.trim() : (word.verse || word.title)}
                                                        </h4>
                                                    </div>
                                                </div>

                                                {/* Desktop Content */}
                                                <div className="hidden md:flex p-3 flex-grow flex-col text-center justify-between">
                                                    <h4 className="font-bold text-primary text-[11px] md:text-sm mb-2 line-clamp-1 mt-1 transition-all">
                                                        {word.verse?.includes?.('하나님의 한구절') ? word.verse.split?.('하나님의 한구절')[1]?.trim() : (word.verse || word.title)}
                                                    </h4>

                                                    <div className="flex justify-center mb-1">
                                                        <span className="px-4 py-1.5 bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-full group-hover:bg-primary group-hover:text-white transition-all transform border border-slate-100">
                                                            {i18n.language.startsWith('en') ? 'View Word' : '말씀 보기'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                                    <div className="bg-slate-50 p-8 rounded-full">
                                        <BookOpen size={48} className="opacity-20" />
                                    </div>
                                    <p className="font-bold">{i18n.language.startsWith('en') ? 'No word records for this month.' : '이 달의 말씀 기록이 없습니다.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyWord;
