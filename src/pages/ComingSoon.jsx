import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../hooks/useSiteConfig';

const ComingSoon = ({ type = 'mission' }) => {
    const { t } = useTranslation();
    const { config: siteConfig } = useSiteConfig();

    const banner = siteConfig?.[`${type}Banner`];
    const title = siteConfig?.[`${type}Title`] || t('coming_soon.title', '페이지 준비중');
    const subtitle = siteConfig?.[`${type}Subtitle`] || t('coming_soon.desc', '현재 페이지는 준비 중입니다.\n더 좋은 모습으로 찾아뵙겠습니다.');

    // Style settings from config or defaults
    const titleFont = siteConfig?.[`${type}TitleFont`] || 'font-sans';
    const subtitleFont = siteConfig?.[`${type}SubtitleFont`] || 'font-sans';
    const titleColor = siteConfig?.[`${type}TitleColor`] || '#ffffff';
    const subtitleColor = siteConfig?.[`${type}SubtitleColor`] || '#f8fafc';
    const overlayOpacity = siteConfig?.[`${type}OverlayOpacity`] || 40;
    const height = siteConfig?.[`${type}Height`] || 'medium';

    // Height classes map
    const heightClasses = {
        short: 'h-[30vh] min-h-[300px]',
        medium: 'h-[50vh] min-h-[400px]',
        large: 'h-[65vh] min-h-[500px]',
        full: 'h-[85vh] min-h-[600px]'
    };

    if (banner) {
        return (
            <div className="flex flex-col w-full">
                {/* Dynamic Hero Section */}
                <div className={`relative w-full ${heightClasses[height]} flex items-center justify-center overflow-hidden`}>
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
                        style={{ backgroundImage: `url(${banner})` }}
                    />

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black transition-opacity duration-700"
                        style={{ opacity: overlayOpacity / 100 }}
                    />

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <h1
                            className={`text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg ${titleFont} ${siteConfig?.[`${type}TitleWeight`] || 'font-bold'}`}
                            style={{
                                color: titleColor,
                                fontStyle: siteConfig?.[`${type}TitleItalic`] ? 'italic' : 'normal'
                            }}
                        >
                            {title}
                        </h1>

                        {subtitle && (
                            <p
                                className={`text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed drop-shadow-md whitespace-pre-line ${subtitleFont} ${siteConfig?.[`${type}SubtitleWeight`] || 'font-medium'}`}
                                style={{
                                    color: subtitleColor,
                                    fontStyle: siteConfig?.[`${type}SubtitleItalic`] ? 'italic' : 'normal'
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Default Content Area (Only if specifically "Coming Soon" is still implied by lack of other content, 
                    OR we just show a simple "Coming Soon" body below if it's not fully ready? 
                    The user asked for Banner and Content management. 
                    If they provided a banner, they might NOT want the "Coming Soon" icon and text below it. 
                    But currently we don't have a "Body Content" field, only Title/Subtitle. 
                    So let's leave the rest blank/simple for now, or maybe just a simple footer/link back area.) 
                */}
                <div className="bg-white py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full"></div>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            {siteConfig?.[`${type}Subtitle`] ? '' : '현재 페이지 내용을 준비하고 있습니다.'}
                        </p>

                        <div className="flex justify-center">
                            <Link
                                to="/"
                                className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/30"
                            >
                                <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                                <span>메인으로 돌아가기</span>
                                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">

                {/* Icon Circle */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-gray-200/50 mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <Settings className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <span className="inline-block px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                        Coming Soon
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 font-sans">
                        {title}
                    </h1>

                    <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed whitespace-pre-line font-medium">
                        {subtitle}
                    </p>
                </div>

                {/* Action */}
                <div className="pt-8 flex justify-center">
                    <Link
                        to="/"
                        className="group relative px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:text-primary transition-all shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 border border-gray-100 overflow-hidden"
                    >
                        <div className="absolute inset-0 w-1 bg-primary transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                        <div className="flex items-center gap-2 relative z-10">
                            <Home size={20} />
                            <span>홈으로 돌아가기</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
