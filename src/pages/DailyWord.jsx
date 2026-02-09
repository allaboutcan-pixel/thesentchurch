import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, BookOpen, Quote, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';

const getDayName = (dateStr) => {
    if (!dateStr) return '';
    // Parse YYYY-MM-DD manually to prevent timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[date.getDay()];
};

const DailyWord = () => {
    const { t } = useTranslation();
    const [dailyWords, setDailyWords] = useState([]);
    const [latestWord, setLatestWord] = useState(null);
    const [archiveData, setArchiveData] = useState({}); // { year: { month: [items] } }
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
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
        const fetchData = async () => {
            try {
                const words = await dbService.getDailyWords();
                const config = await dbService.getSiteConfig();

                if (!isMounted) return;

                if (config) {
                    const prefix = 'resources'; // Unify with sermons/media page
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

                if (words.length > 0) {
                    const sorted = [...words].sort((a, b) => new Date(b.date) - new Date(a.date));
                    // User requested to only show 5 items in archive
                    const limitedWords = sorted.slice(0, 5);
                    setDailyWords(limitedWords);

                    // Use local date components to match user's device time (fixes UTC/KST/PST offset issues)
                    const d = new Date();
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const todayStr = `${year}-${month}-${day}`;
                    const todayWord = sorted.find(w => w.date === todayStr) || sorted[0];
                    setLatestWord(todayWord);

                    const grouped = {};
                    limitedWords.forEach(item => {
                        if (!item.date) return;
                        const [y, m] = item.date.split('-');
                        const year = y;
                        const month = parseInt(m, 10).toString();
                        if (!grouped[year]) grouped[year] = {};
                        if (!grouped[year][month]) grouped[year][month] = [];
                        grouped[year][month].push(item);
                    });
                    setArchiveData(grouped);

                    if (limitedWords.length > 0) {
                        const [ly, lm] = limitedWords[0].date.split('-');
                        setSelectedYear(ly);
                        setSelectedMonth(parseInt(lm, 10).toString());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch daily words:", error);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header Banner */}
            <section className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-[65vh] md:h-[85vh]" :
                    height === 'large' ? "h-[65vh]" :
                        height === 'medium' ? "h-[50vh] min-h-[400px]" :
                            "h-[25vh]"
            )}>
                <div className="absolute inset-0 z-0">
                    <img
                        src={headerBanner}
                        alt="Daily Word Banner"
                        className="w-full h-full object-cover"
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
                        "mb-3 animate-fade-in-up break-keep",
                        titleWeight,
                        titleFont,
                        titleItalic && "italic"
                    )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {title || t('resources.daily_word_title')}
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
                        {subtitle || t('resources.daily_word_subtitle')}
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

                {/* Latest Word Highlight */}
                {latestWord && (
                    <div className="max-w-4xl mx-auto mb-24 animate-fade-in px-2">
                        <div className="bg-slate-50 rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row shadow-primary/5">
                            <div className="md:w-3/5 md:aspect-auto relative overflow-hidden group">
                                <img
                                    src={latestWord.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                    alt="Today's Word"
                                    className="w-full h-auto md:h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                                <div className="absolute top-8 left-8">
                                    <div className="bg-white/95 backdrop-blur-md text-primary w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl">
                                        {getDayName(latestWord.date)}
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-8 md:hidden">
                                    <span className="bg-black/30 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20">
                                        {latestWord.date}
                                    </span>
                                </div>
                            </div>
                            <div className="md:w-2/5 p-6 md:p-14 flex flex-col justify-center relative bg-white">
                                <div className="hidden md:block mb-6">
                                    <span className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase">
                                        {latestWord.date}
                                    </span>
                                </div>
                                <Quote size={48} className="text-primary/5 absolute top-12 right-12" />
                                <h2 className="text-xl md:text-2xl font-black text-primary mb-8 leading-tight break-keep">
                                    {latestWord.verse || latestWord.title}
                                </h2>
                                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed italic break-keep whitespace-pre-wrap">
                                    " {latestWord.content} "
                                </p>
                            </div>
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
                                    {year}년
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
                                    {month}월
                                </button>
                            ))}
                        </div>

                        {/* Word Cards Grid */}
                        <div className="flex-grow">
                            {archiveData[selectedYear]?.[selectedMonth] ? (
                                <div className="flex flex-wrap justify-center gap-6">
                                    {archiveData[selectedYear][selectedMonth]
                                        .sort((a, b) => {
                                            const orderA = a.order ?? -1;
                                            const orderB = b.order ?? -1;
                                            if (orderA !== -1 && orderB !== -1) return orderB - orderA;
                                            if (orderA !== -1) return -1;
                                            if (orderB !== -1) return 1;
                                            return new Date(b.date) - new Date(a.date); // Descending
                                        })
                                        .map((word) => (
                                            <div key={word.id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 group hover:shadow-2xl transition-all flex flex-col hover:-translate-y-1 duration-300 shadow-lg shadow-slate-200/50">
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img
                                                        src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                                    {/* Card Badge UI */}
                                                    <div className="absolute top-6 left-6 flex items-center gap-2">
                                                        <div className="bg-white/95 backdrop-blur-md text-primary w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                                                            {getDayName(word.date)}
                                                        </div>
                                                        <span className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                                            {word.date}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-3 flex-grow flex flex-col text-center justify-between">
                                                    <h4 className="font-bold text-primary text-sm mb-2 line-clamp-1 mt-1">
                                                        {word.verse || word.title}
                                                    </h4>

                                                    <div className="flex justify-center mb-1">
                                                        <button
                                                            onClick={() => {
                                                                setLatestWord(word);
                                                                window.scrollTo({ top: 300, behavior: 'smooth' });
                                                            }}
                                                            className="px-4 py-1.5 bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all transform active:scale-95 border border-slate-100"
                                                        >
                                                            말씀 보기
                                                        </button>
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
                                    <p className="font-bold">이 달의 말씀 기록이 없습니다.</p>
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
