import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, Globe, Heart } from 'lucide-react';
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

const MinistryNav = ({ active }) => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center mb-12 animate-fade-in-up delay-100 relative z-20">
            <div className="inline-flex rounded-xl shadow-sm bg-gray-100 p-1" role="group">
                <NavItem
                    to="/ministry"
                    active={active === 'nextgen'}
                    icon={<Users size={18} />}
                    label={t('nav.nextgen', '다음세대')}
                />
                <NavItem
                    to="/ministry/mission"
                    active={active === 'mission'}
                    icon={<Globe size={18} />}
                    label={t('nav.mission', '선교사역')}
                />
                <NavItem
                    to="/ministry/prayer"
                    active={active === 'prayer'}
                    icon={<Heart size={18} />}
                    label={t('nav.prayer', '중보기도')}
                />
            </div>
        </div>
    );
};

export default MinistryNav;
