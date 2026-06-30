import { useState, useEffect } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NoticePopup = ({ notice }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t, i18n } = useTranslation();

    const images = notice?.images && notice.images.length > 0 
        ? notice.images 
        : (notice?.image ? [notice.image] : []);

    useEffect(() => {
        // Reset slide index when notice changes
        setCurrentSlide(0);

        // Only show if the notice exists and has showPopup true
        if (!notice || !notice.showPopup) return;

        const lastClosed = localStorage.getItem('notice_closed_date');

        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        if (lastClosed !== todayStr) {
            // Delay popup slightly for better UX
            const timer = setTimeout(() => setIsOpen(true), 150);
            return () => clearTimeout(timer);
        }
    }, [notice]);

    const handleClose = (dontShowToday = false) => {
        if (dontShowToday) {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            localStorage.setItem('notice_closed_date', todayStr);
        }
        setIsOpen(false);
    };

    if (!isOpen || !notice) return null;

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 flex flex-col">
                {/* Header */}
                <div className="bg-primary px-5 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="text-xl">📢</span> 공지사항 (Notice)
                    </h3>
                    <button
                        onClick={() => handleClose(false)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Multi-Image Slider/Carousel */}
                {images.length > 0 && (
                    <div className="w-full relative bg-slate-100 overflow-hidden aspect-video max-h-[60vh]">
                        <div 
                            className="flex h-full w-full transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {images.map((imgUrl, idx) => (
                                <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center bg-slate-100">
                                    <img
                                        src={imgUrl}
                                        alt={`${notice.title} - ${idx + 1}`}
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentSlide(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm z-20"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => setCurrentSlide(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm z-20"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Slide Indicators (Dots) */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                currentSlide === idx ? "bg-white w-4" : "bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="p-4 md:p-6 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-accent/10 text-accent rounded-md text-[10px] font-black uppercase tracking-wider">
                            Notice
                        </span>
                        <span className="text-xs font-medium text-slate-400">{notice.date}</span>
                    </div>
                    {notice.date && (
                        <p className="text-slate-400 text-sm font-medium">
                            {notice.date}
                        </p>
                    )}
                    <h4 className="text-slate-800 font-bold text-xl leading-snug">
                        {i18n.language === 'en' && notice.titleEn ? notice.titleEn : notice.title}
                    </h4>
                    {(i18n.language === 'en' && notice.contentEn ? notice.contentEn : notice.content) && (
                        <p className="text-slate-600 mt-2 whitespace-pre-wrap text-sm md:text-base leading-relaxed max-h-[30vh] overflow-y-auto">
                            {i18n.language === 'en' && notice.contentEn ? notice.contentEn : notice.content}
                        </p>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                    <button
                        onClick={() => handleClose(true)}
                        className="hover:text-slate-800 transition-colors flex items-center gap-1"
                    >
                        오늘 하루 보지 않기
                    </button>
                    <Link
                        to="/news/notice"
                        className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-all shadow-sm"
                        onClick={() => handleClose(false)}
                    >
                        <span>자세히 보기</span>
                        <ExternalLink size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoticePopup;
