import { useLocation } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import churchData from '../../data/church_data.json';
import { Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const { config } = useSiteConfig();
    const location = useLocation();
    const isLocationPage = location.pathname === '/location';
    const isHomePage = location.pathname === '/';
    const isAboutPage = location.pathname.startsWith('/about');
    return (
        <footer className="bg-primary-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                {(!isLocationPage && !isAboutPage) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        {/* Map Section */}
                        <div className="rounded-xl overflow-hidden shadow-lg h-64 lg:h-80 relative bg-gray-200">
                            {config.mapEmbed && config.mapEmbed.startsWith('<iframe') ? (
                                <div dangerouslySetInnerHTML={{ __html: config.mapEmbed }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
                            ) : (
                                <iframe
                                    title="Church Location"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(config.address || "9025 Glover Rd, Fort Langley")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="grayscale hover:grayscale-0 transition-all duration-500"
                                ></iframe>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl overflow-hidden p-1.5 flex-shrink-0">
                                    <img src={config.logo || "/images/church_logo.jpg"} alt="Church Logo" className="w-full h-full object-contain scale-[1.8]" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{config.name}</h2>
                                    <p className="text-white/60 text-xs md:text-sm font-medium tracking-wider mt-1">{config.englishName}</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-gray-300">
                                <div className="flex items-start gap-4">
                                    <span className="font-bold text-white min-w-[80px]">{t('location.footer_address')}</span>
                                    <p>{config.address}</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="font-bold text-white min-w-[80px]">{t('location.footer_phone')}</span>
                                    <div className="space-y-1">
                                        {typeof config.phone === 'string' ? (
                                            (() => {
                                                const phones = config.phone.split(/[,\/]/);
                                                return phones.map((p, i) => (
                                                    <p key={i} className="text-sm md:text-base leading-tight">{p.trim()}</p>
                                                ));
                                            })()
                                        ) : (
                                            <p>{config.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="font-bold text-white min-w-[80px]">{t('location.footer_email')}</span>
                                    <a href="mailto:thesentnamgyu@gmail.com" className="text-gray-300 hover:text-white transition-all duration-300">
                                        thesentnamgyu@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <a
                                    href={config.social?.youtube || churchData.general.social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    <span className="sr-only">Youtube</span>
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                </a>
                                <a
                                    href={config.social?.facebook || churchData.general.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                                </a>
                                <a
                                    href={config.social?.instagram || churchData.general.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors"
                                >
                                    <span className="sr-only">Instagram</span>
                                    <Instagram size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {config.englishName || churchData.general.englishName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
