import { useState, useEffect } from 'react';
import { X, ExternalLink, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { getDayName } from '../utils/dateUtils';

const DailyWordBanner = ({ word }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (!word || !word.date || typeof word.date !== 'string') return;

        const lastClosed = localStorage.getItem('daily_word_closed_date');

        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const isActuallyToday = word.date === todayStr;

        if (lastClosed !== todayStr && isActuallyToday) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [word]);

    const handleClose = (dontShowToday = false) => {
        if (dontShowToday) {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            localStorage.setItem('daily_word_closed_date', todayStr);
        }
        setIsVisible(false);
    };

    if (!word) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed top-0 inset-x-0 z-[200] px-4 py-3"
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-4 p-4 pr-12 relative group">
                            {/* Close Button */}
                            <button
                                onClick={() => handleClose(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Image Thumbnail */}
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg border-2 border-white">
                                <img
                                    src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=200"}
                                    alt="Daily Word"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                                        {i18n.language === 'ko' ? '오늘의 말씀' : 'Daily Word'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {word.date} ({getDayName(word.date)})
                                    </span>
                                </div>
                                <h3 className="text-slate-800 font-bold text-sm md:text-base line-clamp-1 italic font-serif">
                                    "{word.content}"
                                </h3>
                                {word.verse && (
                                    <p className="text-primary font-bold text-[11px] mt-0.5">
                                        — {word.verse}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 shrink-0">
                                <Link
                                    to="/sermons/daily"
                                    onClick={() => handleClose(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                                >
                                    <span>{i18n.language === 'ko' ? '묵상하기' : 'Meditate'}</span>
                                    <ExternalLink size={14} />
                                </Link>
                                <button
                                    onClick={() => handleClose(true)}
                                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors hidden md:block"
                                >
                                    {t('home.daily_word_popup_close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DailyWordBanner;
