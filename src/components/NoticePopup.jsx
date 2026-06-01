import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NoticePopup = ({ notice }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
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
                
                {/* Image Section */}
                {notice.image && (
                    <div className="relative w-full bg-slate-50 border-b border-slate-100">
                        <img
                            src={notice.image}
                            alt={notice.title}
                            className="w-full h-auto max-h-[40vh] object-contain"
                            loading="eager"
                        />
                    </div>
                )}
                
                {/* Content Section */}
                <div className="px-6 py-6 flex flex-col gap-3">
                    <h4 className="text-slate-800 font-bold text-xl leading-snug">
                        {notice.title}
                    </h4>
                    {notice.date && (
                        <p className="text-slate-400 text-sm font-medium">
                            {notice.date}
                        </p>
                    )}
                    {notice.content && (
                        <p className="text-slate-600 mt-2 whitespace-pre-wrap text-sm md:text-base leading-relaxed max-h-[30vh] overflow-y-auto">
                            {notice.content}
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
