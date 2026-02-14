import { motion } from 'framer-motion';
import React from 'react';
import MinistryNav from '../components/MinistryNav';
import { useTranslation } from 'react-i18next';
import { Home, ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../hooks/useSiteConfig';

const ComingSoon = ({ type = 'mission' }) => {
    const { t } = useTranslation();
    const { config: siteConfig } = useSiteConfig();

    const banner = siteConfig?.[`${type}Banner`];
    const title = siteConfig?.[`${type}Title`] || "페이지 준비중입니다";
    const subtitle = siteConfig?.[`${type}Subtitle`] || "";

    const overlayOpacity = siteConfig?.[`${type}OverlayOpacity`] || 40;
    const height = 'h-[50vh] min-h-[400px] md:h-[60vh]';

    return (
        <div className="flex flex-col w-full min-h-[80vh] bg-slate-50">
            {/* Dynamic Hero Section - Unified Design */}
            <div className={`relative w-full ${height} flex items-center justify-center overflow-hidden`}>
                {/* Background (Color if no banner, Image if banner exists) */}
                {banner ? (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                            style={{ backgroundImage: `url(${banner})` }}
                        />
                        <div
                            className="absolute inset-0 bg-black/30"
                            style={{ opacity: overlayOpacity / 100 }}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-white" />
                )}

                {/* Content - Matches User Image Design */}
                <div className="relative z-10 container mx-auto px-6 text-center space-y-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm",
                            banner ? "text-white" : "text-slate-800"
                        )}
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center pt-2"
                    >
                        <Link
                            to="/"
                            className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-lg transition-all shadow-2xl hover:bg-primary hover:shadow-primary/30 active:scale-95"
                        >
                            <Home size={22} className="group-hover:-translate-y-1 transition-transform" />
                            <span>메인으로 돌아가기</span>
                        </Link>
                    </motion.div>

                    {subtitle && banner && (
                        <p className="max-w-2xl mx-auto text-white/90 font-medium text-lg md:text-xl drop-shadow-md">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Ministry Nav - Hidden for a cleaner look if desired, or kept for navigation */}
            {['mission', 'prayer', 'team', 'tee'].includes(type) && (
                <div className="container mx-auto px-4 mt-20 mb-12">
                    <div className="w-12 h-1 bg-slate-200 mx-auto mb-12 rounded-full" />
                    <MinistryNav
                        active={type === 'mission' ? 'mission_evangelism' : (type === 'team' ? 'team_ministry' : type)}
                        category={['tee'].includes(type) ? 'education' : 'ministry'}
                    />
                </div>
            )}
        </div>
    );
};

export default ComingSoon;
