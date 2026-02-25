import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Globe, Heart, BookOpen, UserPlus } from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import clsx from 'clsx';

const NavItem = ({ to, active, icon, label }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap",
            active
                ? "bg-white text-primary shadow-lg"
                : "text-slate-400 hover:text-primary hover:bg-white/50"
        )}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

const MinistryNav = ({ active, category = 'education' }) => {
    const { t, i18n } = useTranslation();
    const { config } = useSiteConfig();

    const educationItems = [
        { id: 'nextgen', to: '/ministry', icon: <Users size={18} /> },
        { id: 'tee', to: '/ministry/tee', icon: <BookOpen size={18} /> },
        { id: 'bible', to: '/ministry/bible', icon: <BookOpen size={18} /> }
    ];

    const ministryItems = [
        { id: 'team_ministry', to: '/ministry/team', icon: <UserPlus size={18} /> },
        { id: 'prayer', to: '/ministry/prayer', icon: <Heart size={18} /> },
        { id: 'mission_evangelism', to: '/ministry/mission', icon: <Globe size={18} /> }
    ];

    const items = category === 'education' ? educationItems : ministryItems;

    return (
        <div className="flex justify-center mb-12 animate-fade-in-up delay-100 relative z-20">
            <div className="inline-flex rounded-xl shadow-sm bg-gray-100 p-1 overflow-x-auto max-w-full" role="group">
                {items.map(item => (
                    <NavItem
                        key={item.id}
                        to={item.to}
                        active={active === item.id}
                        icon={item.icon}
                        label={
                            (i18n.language === 'en' && item.id === 'prayer' && config?.prayerTitleEn && config.prayerTitleEn !== "A church built on prayer")
                                ? config.prayerTitleEn
                                : t(`nav.${item.id}`)
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default MinistryNav;
