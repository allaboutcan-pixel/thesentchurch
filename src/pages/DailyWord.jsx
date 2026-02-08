import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, BookOpen, Quote } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { dbService } from '../services/dbService';

const DailyWord = () => {
    const { t } = useTranslation();
    const [dailyWords, setDailyWords] = useState([]);
    const [latestWord, setLatestWord] = useState(null);
    const [archiveData, setArchiveData] = useState({}); // { year: { month: [items] } }
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [headerBanner, setHeaderBanner] = useState("/images/about_banner.jpg");

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const words = await dbService.getDailyWords();
                const config = await dbService.getSiteConfig();

                if (!isMounted) return;

                if (config && config.aboutBanner) {
                    setHeaderBanner(config.aboutBanner);
                }

                if (words.length > 0) {
                    const sorted = [...words].sort((a, b) => new Date(b.date) - new Date(a.date));
                    setDailyWords(sorted);
                    setLatestWord(sorted[0]);

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
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={headerBanner}
                        alt="Daily Word Banner"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in-up">
                        오늘의 말씀
                    </h1>
                    <div className="w-16 h-1 bg-accent mx-auto mb-4 rounded-full" />
                    <p className="text-white/80 font-medium tracking-widest uppercase text-sm">Daily Bread for Soul</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Latest Word Highlight */}
                {latestWord && (
                    <div className="max-w-4xl mx-auto mb-24 animate-fade-in">
                        <div className="bg-slate-50 rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row shadow-primary/5">
                            <div className="md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden">
                                <img
                                    src={latestWord.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                    alt="Today's Word"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                                <div className="absolute bottom-6 left-6 md:hidden">
                                    <span className="bg-white/90 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                                        {latestWord.date}
                                    </span>
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                                <div className="hidden md:block mb-6">
                                    <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase">
                                        {latestWord.date}
                                    </span>
                                </div>
                                <Quote size={40} className="text-primary/10 absolute top-8 right-8" />
                                <h2 className="text-xl font-black text-primary mb-6 leading-tight break-keep">
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
                                지난 말씀 보기
                            </h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">지나간 오늘의 말씀들을 다시 묵상해보세요.</p>
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
                        <div className="md:w-48 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:border-r border-slate-100 pr-0 md:pr-6">
                            {archiveData[selectedYear] && Object.keys(archiveData[selectedYear]).sort((a, b) => b - a).map(month => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={clsx(
                                        "w-auto md:w-full px-5 py-3 rounded-xl flex items-center justify-between transition-all group shrink-0",
                                        selectedMonth === month
                                            ? "bg-slate-900 text-white shadow-xl"
                                            : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                    )}
                                >
                                    <span className="font-bold">{month}월</span>
                                    <ChevronRight size={16} className={clsx("transition-transform", selectedMonth === month ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                                </button>
                            ))}
                        </div>

                        {/* Word Cards Grid */}
                        <div className="flex-grow">
                            {archiveData[selectedYear]?.[selectedMonth] ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {archiveData[selectedYear][selectedMonth].map((word) => (
                                        <div key={word.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 group hover:shadow-xl transition-all flex flex-col">
                                            <div className="aspect-[16/10] relative overflow-hidden">
                                                <img
                                                    src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                        {word.date}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col">
                                                <h4 className="font-bold text-primary text-sm mb-3">
                                                    {word.verse || word.title}
                                                </h4>
                                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 break-keep italic">
                                                    "{word.content}"
                                                </p>
                                                <div className="mt-6 pt-6 border-t border-slate-50">
                                                    <button
                                                        onClick={() => setLatestWord(word)}
                                                        className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                                    >
                                                        자세히 보기 <ChevronRight size={14} />
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
