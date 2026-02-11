import { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { MapPin, Phone, Mail, Youtube, Facebook, Instagram } from 'lucide-react';
import churchData from '../data/church_data.json';
import { useTranslation } from 'react-i18next';

const Location = () => {
    const { t } = useTranslation();
    const [config, setConfig] = useState({
        address: churchData.general.address,
        phone: churchData.general.phone.join(', '),
        serviceTime: "2:00 PM",
        ...churchData.general
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const siteConfig = await dbService.getSiteConfig();
                if (siteConfig && siteConfig.location) {
                    setConfig(prev => ({
                        ...prev,
                        address: siteConfig.location.address || prev.address,
                        phone: siteConfig.location.phone || prev.phone,
                        serviceTime: siteConfig.location.serviceTime || "2:00 PM"
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch location config", error);
            }
        };
        fetchConfig();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 font-sans">
            <div className="container mx-auto px-4">
                {/* Simplified Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-4xl font-black text-primary mb-6 relative inline-block">
                        오시는 길 안내
                        <div className="absolute -bottom-2 left-0 w-full h-2 bg-accent/20 rounded-full">
                            <div className="absolute top-0 left-0 w-1/2 h-full bg-accent rounded-full animate-width-expand"></div>
                        </div>
                    </h1>
                    <div className="max-w-2xl mx-auto space-y-2 mt-4">
                        <p className="text-gray-600 font-medium text-lg">
                            생명의소리 교회에 오시는 걸음마다
                        </p>
                        <p className="text-gray-600 font-medium text-lg">
                            하나님의 사랑과 평안이 함께하시길 바랍니다.
                        </p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Map Section - Now Top/Full-Width */}
                    <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2612.981886105786!2d-122.56847868431818!3d49.16987197931885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485d4f3c7500001%3A0x8888888888888888!2s9025%20Glover%20Rd%2C%20Fort%20Langley%2C%20BC%20V1M%202R9%2C%20Canada!5e0!3m2!1sen!2skr!4v1675123456789!5m2!1sen!2skr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Church Location"
                        ></iframe>
                    </div>

                    {/* Info Section - Now Below Map */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8 flex flex-col justify-between">
                            {/* Address */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <div className="p-2 bg-accent/10 rounded-xl">
                                        <MapPin className="text-accent" size={24} />
                                    </div>
                                    {t('location.address_label')}
                                </h3>
                                <div className="pl-2 border-l-2 border-gray-100 ml-3">
                                    <p className="text-lg text-gray-700 font-bold leading-relaxed">{config.address}</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* SNS Links */}
                            <div className="space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Social Media</p>
                                <div className="flex gap-4">
                                    <a href={churchData.general.social.youtube} target="_blank" rel="noopener noreferrer"
                                        className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm">
                                        <Youtube size={24} />
                                    </a>
                                    <a href={churchData.general.social.facebook} target="_blank" rel="noopener noreferrer"
                                        className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm">
                                        <Facebook size={24} />
                                    </a>
                                    <a href={churchData.general.social.instagram} target="_blank" rel="noopener noreferrer"
                                        className="p-3 bg-pink-50 text-pink-600 rounded-2xl hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm">
                                        <Instagram size={24} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                            {/* Contact */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                    <div className="p-2 bg-accent/10 rounded-xl">
                                        <Phone className="text-accent" size={24} />
                                    </div>
                                    {t('location.contact_label')}
                                </h3>
                                <div className="pl-2 border-l-2 border-gray-100 ml-3 space-y-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('location.phone')}</p>
                                    <div className="space-y-2">
                                        {(() => {
                                            const rawPhone = config.phone;
                                            const phones = Array.isArray(rawPhone)
                                                ? rawPhone
                                                : (typeof rawPhone === 'string' ? rawPhone.split(/[,\/]/) : [rawPhone]);

                                            return phones.map((p, i) => (
                                                <span key={i} className="block text-gray-800 font-bold text-lg leading-tight">{p && p.trim()}</span>
                                            ));
                                        })()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('location.email')}</p>
                                        <a href={`mailto:${churchData.general.email}`} className="flex items-center gap-2 text-gray-700 font-medium hover:text-accent transition-colors group">
                                            <Mail size={16} className="text-gray-400 group-hover:text-accent" />
                                            <p>{churchData.general.email}</p>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Location;
