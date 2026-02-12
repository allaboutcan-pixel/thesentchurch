import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import quickSunday from '../assets/images/quick_sunday.jpg';
import quickMorning from '../assets/images/quick_early_morning_v3.jpg';
import quickGallery from '../assets/images/quick_gallery.jpg';
import quickBulletin from '../assets/images/quick_bulletin.jpg';

const QuickLinks = ({ services }) => {
    const { t } = useTranslation();

    const serviceTimes = services && services.length > 0
        ? services.map(s => {
            const time = s.time;
            const name = s.name || '';
            if (name.includes('1부')) return `${time} (1부예배)`;
            if (name.includes('2부')) return `${time} (2부예배)`;
            return time;
        })
        : [t('home.quick_sunday_time')];

    const menuItems = [
        {
            title: t('home.quick_sunday'),
            subTitle: t('home.quick_sunday_sub'),
            desc: serviceTimes,
            image: quickSunday,
            link: "/about#worship"
        },
        {
            title: t('home.quick_morning'),
            subTitle: t('home.quick_morning_sub'),
            desc: [t('home.quick_morning_desc1'), t('home.quick_morning_desc2')],
            image: quickMorning,
            link: "/about#dawn"
        },
        {
            title: t('home.quick_bulletin'),
            subTitle: t('home.quick_bulletin_sub'),
            desc: [t('home.quick_bulletin_desc1'), t('home.quick_bulletin_desc2')],
            image: quickBulletin,
            link: "/news/bulletin"
        },
        {
            title: t('home.quick_gallery'),
            subTitle: t('home.quick_gallery_sub'),
            desc: [t('home.quick_gallery_desc1'), t('home.quick_gallery_desc2')],
            image: quickGallery,
            link: "/news/gallery"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.link}
                    className="group relative overflow-hidden rounded-2xl h-96 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block"
                >
                    <div className="absolute inset-0">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black/0 transition-colors duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10">
                        <p className="text-white text-xs font-bold tracking-widest uppercase mb-1">{item.subTitle}</p>
                        <h3 className="text-xl font-black mb-3 text-white group-hover:text-accent transition-colors">{item.title}</h3>
                        {item.desc && item.desc.length > 0 && (
                            <div className="space-y-1 mt-2 border-t border-white/50 pt-2">
                                {item.desc.map((line, i) => (
                                    <p key={i} className="text-sm font-medium text-white">{line}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default QuickLinks;
