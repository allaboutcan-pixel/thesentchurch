import { useState, useEffect } from 'react';
import { X, ExternalLink, Quote, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const getDayName = (dateStr) => {
    if (!dateStr) return '';
    // Parse YYYY-MM-DD manually to prevent timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[date.getDay()];
};

const DailyWordPopup = ({ word }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!word) return;

        const lastClosed = localStorage.getItem('daily_word_closed_date');

        // Use local date for today (Fix timezone issue)
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const isActuallyToday = word.date === todayStr;

        if (lastClosed !== todayStr && isActuallyToday) {
            // Delay popup for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [word]);

    const handleClose = (dontShowToday = false) => {
        if (dontShowToday) {
            // Use local date for storage
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            localStorage.setItem('daily_word_closed_date', todayStr);
        }
        setIsOpen(false);
    };

    if (!isOpen || !word) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-sm rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col">
                {/* Image Section - Auto height to show full image */}
                <div className="relative w-full">
                    <img
                        src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                        alt="Today's Word"
                        className="w-full h-auto object-contain"
                    />
                    {/* Subtle gradient for text visibility if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Day Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-white/95 backdrop-blur-md text-primary w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-md border border-gray-100">
                            {getDayName(word.date)}
                        </div>
                        <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-md text-xs font-bold border border-white/20 shadow-sm">
                            {word.date}
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => handleClose(false)}
                        className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md rounded-full transition-all z-10 border border-white/20"
                    >
                        <X size={18} />
                    </button>

                    {/* Verse overlay - Compact */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-lg md:text-xl font-black leading-tight break-keep drop-shadow-lg">
                            "{word.content}"
                        </p>
                        {word.verse && (
                            <p className="font-bold text-accent text-[10px] md:text-xs mt-1 drop-shadow-md">
                                {word.verse.includes('이번주') ? (
                                    <>
                                        <span className="hidden md:inline">{word.verse.split('하나님의 한구절')[0]}하나님의 한구절 </span>
                                        <span>{word.verse.split('하나님의 한구절')[1] || word.verse}</span>
                                    </>
                                ) : (
                                    word.verse
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Minimized Actions Area */}
                <div className="px-4 py-3 bg-white flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <button
                        onClick={() => handleClose(true)}
                        className="hover:text-slate-600 transition-colors"
                    >
                        {t('home.daily_word_popup_close')}
                    </button>
                    <Link
                        to="/sermons/daily"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                        onClick={() => handleClose(false)}
                    >
                        <span>더 많은 말씀 보기</span>
                        <ExternalLink size={12} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DailyWordPopup;
