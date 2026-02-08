import { useState, useEffect } from 'react';
import { X, ExternalLink, Quote, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return dayNames[date.getDay()];
};

const DailyWordPopup = ({ word }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!word) return;

        const lastClosed = localStorage.getItem('daily_word_closed_date');
        const todayStr = new Date().toISOString().split('T')[0];
        const isActuallyToday = word.date === todayStr;

        if (lastClosed !== todayStr && isActuallyToday) {
            // Delay popup for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [word]);

    const handleClose = (dontShowToday = false) => {
        if (dontShowToday) {
            localStorage.setItem('daily_word_closed_date', new Date().toISOString().split('T')[0]);
        }
        setIsOpen(false);
    };

    if (!isOpen || !word) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col">
                {/* Image Section - Prominent for image-based word */}
                <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden">
                    <img
                        src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                        alt="Today's Word"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Day Badge */}
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="bg-white/95 backdrop-blur-md text-primary w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                            {getDayName(word.date)}
                        </div>
                        <div className="bg-black/30 backdrop-blur-md text-white px-4 py-1 rounded-xl text-xs font-bold border border-white/20">
                            {word.date}
                        </div>
                    </div>

                    {/* Close Button UI optimized for background overlap */}
                    <button
                        onClick={() => handleClose(false)}
                        className="absolute top-6 right-6 p-2.5 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all z-10 border border-white/20"
                    >
                        <X size={20} />
                    </button>

                    {/* Verse overlay if content exists but is short */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <Quote size={24} fill="currentColor" className="opacity-50 mb-4" />
                        <p className="text-xl md:text-2xl font-black leading-tight break-keep mb-2">
                            "{word.content}"
                        </p>
                        {word.verse && (
                            <p className="font-bold text-accent text-sm">
                                {word.verse}
                            </p>
                        )}
                    </div>
                </div>

                {/* Simplified Actions Area */}
                <div className="p-6 md:p-8 bg-white flex flex-col gap-4">
                    <Link
                        to="/sermons/daily"
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-sm"
                        onClick={() => handleClose(false)}
                    >
                        <span>더 많은 말씀 보기</span>
                        <ExternalLink size={16} />
                    </Link>

                    <button
                        onClick={() => handleClose(true)}
                        className="text-gray-400 text-[11px] font-bold hover:text-gray-600 transition-colors uppercase tracking-widest"
                    >
                        {t('home.daily_word_popup_close')}
                    </button>
                </div>

                {/* Decorative Element */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
            </div>
        </div>
    );
};

export default DailyWordPopup;
