import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Mail, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import churchData from '../../data/church_data.json';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import clsx from 'clsx';

import ContactModal from '../ContactModal';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { t, i18n } = useTranslation();
    const { config } = useSiteConfig();
    const location = useLocation();


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setActiveDropdown(null);
    }, [location]);

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleHomeClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <header
            className={clsx(
                "fixed w-full top-0 z-[100] transition-all duration-300",
                isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-3" : "py-5 bg-gradient-to-b from-black/50 to-transparent"
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 md:gap-3 group" onClick={handleHomeClick}>
                    <div className="w-9 h-9 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform overflow-hidden p-1">
                        <img src={config.logo || "/images/church_logo.jpg"} alt="Church Logo" className="w-full h-full object-contain scale-[2.0]" />
                    </div>
                    <div className="flex flex-col">
                        <span className={clsx("font-bold text-[14px] xs:text-[15px] md:text-xl leading-none transition-colors whitespace-nowrap", isScrolled ? "text-primary" : "text-primary")}>
                            {config.name}
                        </span>
                        <span className={clsx("text-[8px] xs:text-[9px] md:text-[13px] font-black uppercase tracking-[0.1em] mt-1 transition-colors whitespace-nowrap", isScrolled ? "text-gray-400" : "text-white")}>
                            {config.englishName || "The Sent Church"}
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {churchData.menu.map((item, index) => (
                        <div key={item.id} className="relative group/menu">
                            <Link
                                to={item.path}
                                onClick={(e) => item.path === '/' && handleHomeClick(e)}
                                className={clsx(
                                    "flex flex-col items-start gap-0.5 text-sm font-medium transition-colors py-1",
                                    isScrolled ? "text-text-main hover:text-primary" : "text-white hover:text-white/80"
                                )}
                            >
                                <span className="leading-tight flex items-center gap-1">
                                    {t(`nav.${item.id}`)}
                                    {item.subItems && (
                                        <ChevronDown size={10} className="group-hover/menu:rotate-180 transition-transform" />
                                    )}
                                </span>
                            </Link>

                            {/* Dropdown */}
                            {item.subItems && (
                                <div className={clsx(
                                    "absolute top-full pt-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 transform translate-y-2 group-hover/menu:translate-y-0",
                                    "left-1/2 -translate-x-1/2"
                                )}>
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[200px]">
                                        {item.subItems.map((sub, idx) => (
                                            <Link
                                                key={idx}
                                                to={sub.path}
                                                className="block px-5 py-3 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                {(i18n.language === 'en' && (sub.id === 'prayer' || sub.path === '/ministry/prayer') && config?.prayerTitleEn && !config.prayerTitleEn.toLowerCase().includes("built on prayer"))
                                                    ? config.prayerTitleEn
                                                    : t(`nav.${sub.id || sub.path.split('/').pop()}`)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Language Switcher & Mobile Menu Button */}
                <div className="flex items-center gap-1 md:gap-4">
                    {/* Language Switcher */}
                    <button
                        onClick={() => i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko')}
                        className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[10px] md:text-xs transition-all border shrink-0",
                            isScrolled
                                ? "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                                : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
                        )}
                        title={i18n.language === 'ko' ? 'Switch to English' : '한국어로 변경'}
                    >
                        <Globe size={14} className={clsx(i18n.language === 'en' ? "text-blue-400" : "text-amber-500")} />
                        <span>{i18n.language === 'ko' ? 'EN' : 'KO'}</span>
                    </button>

                    {/* Contact Button (Desktop) */}
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className={clsx(
                            "hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all",
                            isScrolled
                                ? "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
                        )}
                    >
                        <span>{t('home.first_step')}</span>
                    </button>

                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className={isScrolled ? "text-primary" : "text-white"} />
                        ) : (
                            <Menu className={isScrolled ? "text-primary" : "text-white"} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col py-2">
                        {churchData.menu.map((item) => (
                            <div key={item.id}>
                                <div
                                    className={clsx(
                                        "px-6 py-2 flex justify-between items-center text-sm font-bold border-b border-gray-50",
                                        activeDropdown === item.id ? "text-primary bg-gray-50" : "text-gray-800"
                                    )}
                                >
                                    <Link
                                        to={item.path}
                                        className="flex-1 py-3 flex flex-col"
                                        onClick={(e) => {
                                            setIsOpen(false);
                                            if (item.path === '/') handleHomeClick(e);
                                        }}
                                    >
                                        <span className="text-sm">
                                            {(i18n.language === 'en' && (item.id === 'prayer' || item.path === '/ministry/prayer') && config?.prayerTitleEn)
                                                ? config.prayerTitleEn
                                                : t(`nav.${item.id}`)}
                                        </span>
                                    </Link>

                                    {item.subItems && (
                                        <button
                                            className="px-6 py-4 border-l border-gray-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleDropdown(item.id);
                                            }}
                                            aria-label="Toggle Submenu"
                                        >
                                            <ChevronDown size={18} className={clsx("transition-transform", activeDropdown === item.id && "rotate-180")} />
                                        </button>
                                    )}
                                </div>

                                {
                                    item.subItems && activeDropdown === item.id && (
                                        <div className="bg-gray-50 py-2">
                                            {item.subItems.map((sub, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={sub.path}
                                                    className="block px-10 py-3 text-sm text-gray-500 hover:text-primary"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    • {(i18n.language === 'en' && (sub.id === 'prayer' || sub.path === '/ministry/prayer') && config?.prayerTitleEn && !config.prayerTitleEn.toLowerCase().includes("built on prayer"))
                                                        ? config.prayerTitleEn
                                                        : t(`nav.${sub.id || sub.path.split('/').pop()}`)}
                                                </Link>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>

                    {/* Mobile Contact Button */}
                    <div className="px-6 py-8 border-t border-gray-100 bg-gray-50/50">
                        <button
                            onClick={() => {
                                setIsContactOpen(true);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            <Mail size={18} />
                            <span>{t('home.first_step')}</span>
                        </button>
                    </div>
                </div>
            )
            }
            {/* Contact Modal */}
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </header >
    );
};

export default Header;
