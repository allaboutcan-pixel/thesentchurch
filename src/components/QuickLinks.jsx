import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import quickSunday from '../assets/images/quick_sunday.jpg';
import quickMorning from '../assets/images/quick_early_morning_v3.jpg';
import quickGallery from '../assets/images/quick_gallery_v2.jpg';
import quickBulletin from '../assets/images/quick_bulletin.jpg';

const QuickLinks = () => {
    const { t } = useTranslation();

    const menuItems = [
        {
            title: t('home.quick_sunday'),
            subTitle: t('home.quick_sunday_sub'),
            image: quickSunday,
            link: "/about#worship"
        },
        {
            title: t('home.quick_morning'),
            subTitle: t('home.quick_morning_sub'),
            image: quickMorning,
            link: "/about#dawn"
        },
        {
            title: t('home.quick_bulletin'),
            subTitle: t('home.quick_bulletin_sub'),
            image: quickBulletin,
            link: "/news/bulletin"
        },
        {
            title: t('home.quick_gallery'),
            subTitle: t('home.quick_gallery_sub'),
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

                    <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                        <p className="text-white/70 text-xs font-bold tracking-[0.2em] uppercase mb-2">{item.subTitle}</p>
                        <h3 className="text-2xl text-white group-hover:text-accent transition-colors leading-tight">
                            <span className="font-black">{item.title.split('|')[0]}</span>
                            {item.title.includes('|') && (
                                <span className="ml-2 text-base font-normal opacity-70">
                                    {item.title.split('|')[1]}
                                </span>
                            )}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default QuickLinks;
