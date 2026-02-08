import { useState, useEffect } from 'react';
import { X, ExternalLink, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const DailyWordPopup = ({ word }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!word) return;

        const lastClosed = localStorage.getItem('daily_word_closed_date');
        const today = new Date().toDateString();

        if (lastClosed !== today) {
            // Delay popup for better UX
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [word]);

    const handleClose = (dontShowToday = false) => {
        if (dontShowToday) {
            localStorage.setItem('daily_word_closed_date', new Date().toDateString());
        }
        setIsOpen(false);
    };

    if (!isOpen || !word) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Close Button */}
                <button
                    onClick={() => handleClose(false)}
                    className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all z-10"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="p-8 md:p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-2xl mb-6">
                        <Quote size={24} fill="currentColor" className="opacity-50" />
                    </div>

                    <h2 className="text-primary font-bold text-sm uppercase tracking-widest mb-4">
                        {t('home.daily_word_popup_title')}
                    </h2>

                    <div className="space-y-6">
                        <p className="text-xl md:text-2xl font-black text-gray-800 leading-snug break-keep">
                            "{word.content}"
                        </p>

                        {word.verse && (
                            <p className="text-primary font-bold text-base">
                                — {word.verse}
                            </p>
                        )}
                    </div>

                    <div className="mt-12 flex flex-col gap-4">
                        <Link
                            to="/sermons/daily"
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                            onClick={() => handleClose(false)}
                        >
                            <span>{t('home.daily_word_view_more')}</span>
                            <ExternalLink size={16} />
                        </Link>

                        <button
                            onClick={() => handleClose(true)}
                            className="text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
                        >
                            {t('home.daily_word_popup_close')}
                        </button>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
            </div>
        </div>
    );
};

export default DailyWordPopup;
