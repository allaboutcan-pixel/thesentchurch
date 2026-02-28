import { useState, useEffect } from 'react';
import { X, Send, Mail, Phone, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { createPortal } from 'react-dom';

const ContactModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });
    const [isClosing, setIsClosing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            setFormData({ name: '', phone: '', message: '' }); // Reset form on close
        }, 300); // Match transition duration
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const subject = `[홈페이지 문의] ${formData.name}님으로부터의 문의입니다.`;
        const body = `
[문의 내용]
${formData.message}

--------------------------------------------------
보내는 분: ${formData.name}
연락처: ${formData.phone}
--------------------------------------------------
        `.trim();

        const mailtoLink = `mailto:thesentnamgyu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;

        // Optional: Close modal after sending
        handleClose();
    };

    if (!mounted) return null;
    if (!isOpen && !isClosing) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    isClosing ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                className={clsx(
                    "bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 transform",
                    isClosing ? "scale-95 opacity-0 translate-y-4" : "scale-100 opacity-100 translate-y-0"
                )}
            >
                {/* Header */}
                <div className="bg-primary px-6 py-5 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{t('home.first_step')}</h2>
                            <p className="text-xs text-white/80 font-light">{t('contact.subtitle')}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('contact.name')}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                                placeholder={t('contact.name_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('contact.phone')}</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                                placeholder={t('contact.phone_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">{t('contact.message')}</label>
                        <textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all min-h-[120px] resize-none"
                            placeholder={t('contact.message_placeholder')}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            {t('home.first_step')}
                        </button>
                        <p className="text-[10px] text-gray-400 text-center mt-3">
                            {t('contact.mail_notice')}
                        </p>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-1">Direct Email</p>
                            <p className="text-sm font-black text-primary text-center select-all">thesentnamgyu@gmail.com</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ContactModal;
