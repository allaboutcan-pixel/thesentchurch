import React, { useEffect } from 'react';
import MinistryNav from '../components/MinistryNav';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Globe2, BookOpen, Heart, Users, CheckCircle2 } from 'lucide-react';
import { useSiteConfigValue } from '../context/SiteConfigContext';
import { isVideo, getYoutubeId, getDriveId } from '../utils/mediaUtils';
import { dbService } from '../services/dbService';

// ----------------------------------------------------
// TRANSLATION DEFAULT DATA
// ----------------------------------------------------
const defaultContentData = {
    hero: {
        title: { ko: "모든 민족이 하나님의 말씀을 자신의 언어로 듣는 그날까지", en: "Until the day when all nations hear God's word in their own language" },
        subtitle: { ko: "우리 교회는 세계 곳곳에서 복음을 전하고, 성경을 번역하며, 다음 세대를 세우는 선교사역에 함께하고 있습니다.", en: "Our church is participating in mission works that spread the gospel, translate the Bible, and build the next generation all over the world." },
        org: { ko: "Wycliffe", en: "Wycliffe" }
    },
    sec2: {
        title: { ko: "모든 사람이 자신의 언어로 하나님을 만나도록", en: "So Everyone Can Meet God in Their Own Language" },
        content: {
            ko: "1942년, 위클리프 성경번역선교회는 한 질문에서 시작되었습니다.\n\n\"당신의 하나님이 전능하시다면 왜 우리말로 말씀하지 않으시나요?\"\n\n과테말라에서 선교하던 카메룬 타운센드는 이 질문을 통해 하나님의 말씀은 모든 사람이 자신의 '마음의 언어(Heart Language)' 로 들어야 한다는 비전을 품게 되었습니다.\n\n그 이후 위클리프 성경번역선교회는 세계 수천 개 언어의 성경 번역을 위해 헌신해 왔으며, 지금도 수많은 번역가와 선교사들이 복음을 전하고 있습니다.\n\n복음은 번역되는 것이 아니라, 사람들의 마음에 전해지는 것입니다.",
            en: "In 1942, Wycliffe Bible Translators began with one question:\n\n\"If your God is all-powerful, why doesn't He speak in our language?\"\n\nCameron Townsend, who was serving as a missionary in Guatemala, came to realize through this question that everyone must hear God's word in their own 'heart language.' Since then, Wycliffe has dedicated itself to translating the Bible into thousands of languages, and today many translators and missionaries continue to spread the Gospel. The Gospel is not just translated; it is delivered to people's hearts."
        },
        image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=1200"
    },
    sec3: {
        title: { ko: "인구 600명의 작은 종족, 하나님의 큰 계획", en: "A Small Tribe of 600 People, God's Big Plan" },
        content: {
            ko: "카니누와(Kaninuwa)는 파푸아뉴기니 굿이너프섬 북부에 살아가는 약 600명의 소수민족입니다.\n\n1960년대 처음 복음을 접했지만 아직도 자신들의 언어로 된 성경이 없어 여러 언어를 섞어 예배를 드리고 있습니다.\n\n성경이 자신의 언어로 없기 때문에 하나님의 말씀을 깊이 이해하기 어려운 현실 가운데 있습니다.\n\n우리 교회는 카니누와 성경 번역 사역을 통해 그들이 자신의 언어로 하나님의 말씀을 읽고, 복음을 더욱 분명하게 이해하도록 함께 동역하고 있습니다.",
            en: "Kaninuwa is a small ethnic group of about 600 people living in the northern part of Goodenough Island, Papua New Guinea. Although they first heard the Gospel in the 1960s, they still do not have a Bible in their own language, so they worship using a mixture of languages. Without the Bible in their own language, it is difficult to deeply understand God's word. Our church is working together with them through the Kaninuwa Bible translation ministry so that they can read God's word in their own language and understand the Gospel more clearly."
        },
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=1200",
        activities: [
            { ko: "카니누와어 성경 번역", en: "Kaninuwa Bible Translation" },
            { ko: "번역 검수 및 수정", en: "Translation Checking & Editing" },
            { ko: "현지 교회 협력", en: "Local Church Cooperation" },
            { ko: "성경 교육 지원", en: "Bible Education Support" }
        ]
    },
    sec4: {
        title: { ko: "함께 만들어 가는 하나님의 말씀", en: "The Word of God Created Together" },
        content: {
            ko: "성경 번역은 한 사람의 작업이 아닙니다.\n\n원어 연구와 번역, 검수, 신학적 검토, 현지 언어 확인, 반복되는 수정 과정을 거쳐 한 절 한 절이 완성됩니다.\n\n현지 번역가와 언어학자, 교회 지도자 그리고 전 세계의 기도와 후원이 함께할 때 하나님의 말씀이 새로운 언어로 태어납니다.\n\n우리 교회도 이 귀한 사역에 함께 동참하며 카니누와어 성경 번역을 지속적으로 후원하고 있습니다.",
            en: "Bible translation is not a one-person job. Each verse is completed through original language study, translation, checking, theological review, local language confirmation, and repeated revision processes. When local translators, linguists, church leaders, and prayers and support from around the world come together, God's word is born in a new language. Our church is also participating in this precious ministry and continuously sponsoring the Kaninuwa Bible translation."
        },
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200"
    },
    sec5: {
        title: { ko: "복음은 사람을 살리고 공동체를 세웁니다.", en: "The Gospel Saves People and Builds Communities" },
        content: {
            ko: "성경 번역은 단순히 책을 만드는 일이 아닙니다.\n\n현지 어린이들을 위한 교육과 사랑의 나눔, 교회를 세우는 사역, 그리고 번역자들의 삶을 함께 돌보는 일까지 복음은 사람들의 삶 속에서 이어지고 있습니다.\n\n카니누와 아이들에게는 배움의 기회가 되고,\n가정에는 소망이 되며,\n지역교회에는 믿음의 기초가 됩니다.\n\n우리는 앞으로도 하나님의 사랑이 카니누와 공동체에 더욱 깊이 전해지도록 함께 기도하며 동역하겠습니다.",
            en: "Bible translation is not simply making a book. From education and sharing of love for local children to building churches and caring for the lives of translators together, the Gospel continues in people's lives. It becomes an opportunity for learning for Kaninuwa children, hope for families, and a foundation of faith for local churches. We will continue to pray and partner together so that God's love is delivered more deeply to the Kaninuwa community."
        },
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"
    }
};

const Mission = () => {
    const { i18n } = useTranslation();
    const { config, loading } = useSiteConfigValue();
    const isEn = i18n.language === 'en' || i18n.language.startsWith('en-');
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }
    
    const getText = (obj) => isEn && obj.en ? obj.en : obj.ko;

    // Header properties inherited from configuration
    const headerBanner = config?.missionBanner || "https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&q=80&w=2000";
    const height = config?.missionHeight || "medium";
    const overlayOpacity = config?.missionOverlayOpacity !== undefined ? Number(config.missionOverlayOpacity) : 50;
    const bannerFit = config?.missionBannerFit || 'cover';

    const titleFont = config?.missionTitleFont || "font-sans";
    const subtitleFont = config?.missionSubtitleFont || "font-sans";
    const titleColor = config?.missionTitleColor || "#ffffff";
    const subtitleColor = config?.missionSubtitleColor || "#ffffff";
    const titleItalic = config?.missionTitleItalic !== undefined ? config.missionTitleItalic : false;
    const subtitleItalic = config?.missionSubtitleItalic !== undefined ? config.missionSubtitleItalic : false;
    const titleWeight = config?.missionTitleWeight || "font-bold";
    const subtitleWeight = config?.missionSubtitleWeight || "font-medium";
    const titleSize = config?.missionTitleSize || 48;
    const subtitleSize = config?.missionSubtitleSize || 24;
    const ensureWorkingImage = (url, fallback) => {
        if (!url) return fallback;
        if (typeof url === 'string' && url.includes('images.unsplash.com') && !url.includes('?')) {
            return `${url}?auto=format&fit=crop&q=80&w=1200`;
        }
        return url;
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return "";
        const youtubeId = getYoutubeId(url);
        if (youtubeId) {
            return `https://www.youtube.com/embed/${youtubeId}`;
        }
        const driveId = getDriveId(url);
        if (driveId) {
            return `https://drive.google.com/file/d/${driveId}/preview`;
        }
        return url;
    };

    // Dynamic config mapping with default fallbacks
    const content = {
        hero: {
            title: {
                ko: config?.missionTitle || defaultContentData.hero.title.ko,
                en: config?.missionTitleEn || defaultContentData.hero.title.en
            },
            subtitle: {
                ko: config?.missionSubtitle || defaultContentData.hero.subtitle.ko,
                en: config?.missionSubtitleEn || defaultContentData.hero.subtitle.en
            },
            org: {
                ko: "선교와 전도",
                en: "Mission & Evangelism"
            }
        },
        sec2: {
            title: {
                ko: config?.missionSec2Title || defaultContentData.sec2.title.ko,
                en: config?.missionSec2TitleEn || defaultContentData.sec2.title.en
            },
            content: {
                ko: config?.missionSec2Content || defaultContentData.sec2.content.ko,
                en: config?.missionSec2ContentEn || defaultContentData.sec2.content.en
            },
            image: ensureWorkingImage(config?.missionSec2Image, defaultContentData.sec2.image)
        },
        sec3: {
            title: {
                ko: config?.missionSec3Title || defaultContentData.sec3.title.ko,
                en: config?.missionSec3TitleEn || defaultContentData.sec3.title.en
            },
            content: {
                ko: config?.missionSec3Content || defaultContentData.sec3.content.ko,
                en: config?.missionSec3ContentEn || defaultContentData.sec3.content.en
            },
            image: ensureWorkingImage(config?.missionSec3Image, defaultContentData.sec3.image),
            activities: [
                {
                    ko: config?.missionSec3Activity1 || defaultContentData.sec3.activities[0].ko,
                    en: config?.missionSec3Activity1En || defaultContentData.sec3.activities[0].en
                },
                {
                    ko: config?.missionSec3Activity2 || defaultContentData.sec3.activities[1].ko,
                    en: config?.missionSec3Activity2En || defaultContentData.sec3.activities[1].en
                },
                {
                    ko: config?.missionSec3Activity3 || defaultContentData.sec3.activities[2].ko,
                    en: config?.missionSec3Activity3En || defaultContentData.sec3.activities[2].en
                },
                {
                    ko: config?.missionSec3Activity4 || defaultContentData.sec3.activities[3].ko,
                    en: config?.missionSec3Activity4En || defaultContentData.sec3.activities[3].en
                }
            ]
        },
        sec4: {
            title: {
                ko: config?.missionSec4Title || defaultContentData.sec4.title.ko,
                en: config?.missionSec4TitleEn || defaultContentData.sec4.title.en
            },
            content: {
                ko: config?.missionSec4Content || defaultContentData.sec4.content.ko,
                en: config?.missionSec4ContentEn || defaultContentData.sec4.content.en
            },
            image: ensureWorkingImage(config?.missionSec4Image, defaultContentData.sec4.image)
        },
        sec5: {
            title: {
                ko: config?.missionSec5Title || defaultContentData.sec5.title.ko,
                en: config?.missionSec5TitleEn || defaultContentData.sec5.title.en
            },
            content: {
                ko: config?.missionSec5Content || defaultContentData.sec5.content.ko,
                en: config?.missionSec5ContentEn || defaultContentData.sec5.content.en
            },
            image: ensureWorkingImage(config?.missionSec5Image, defaultContentData.sec5.image)
        },
        video: {
            url: config?.missionVideoUrl || "https://drive.google.com/file/d/1ARNc6I9ccAIsRKUA3CWjbkOvIAcLG27b/view?usp=sharing",
            title: {
                ko: config?.missionVideoTitle || "선교지에서 온 소식",
                en: config?.missionVideoTitleEn || "News from the Mission Field"
            },
            desc: {
                ko: config?.missionVideoDesc || "지난 크리스마스에 파푸아뉴기니 카니누와 선교지에서 선교사님이 직접 전해오신 생생한 선교지 소식입니다.",
                en: config?.missionVideoDescEn || "A video message sent by our missionary from the Kaninuwa mission field in Papua New Guinea during Christmas."
            }
        },
        prayer: {
            title: { ko: "기도해 주세요.", en: "Please Pray with Us" },
            items: [
                {
                    ko: config?.missionPrayer1 || "파푸아뉴기니 비자 발급이 순조롭게 진행되어 8월에는 세 명의 번역자들과 직접 만나 사역할 수 있도록,",
                    en: config?.missionPrayer1En || "That the Papua New Guinea visa issuance proceeds smoothly so that we can directly meet and minister with the three translators in August,"
                },
                {
                    ko: config?.missionPrayer2 || "카니누와 종족 마을에서 6월 28일부터 7월 3일까지 청소년과 청년을 위한 지방회 연합 부흥회가 있습니다. 이곳에서 선포되는 말씀을 통해 회개의 역사가 있도록, 참가한 자들의 삶에 변화가 있도록,",
                    en: config?.missionPrayer2En || "There is a joint district revival for youth and young adults in the Kaninuwa tribe village from June 28 to July 3. That through the proclaimed Word there will be a history of repentance, and changes in the lives of the attendees,"
                },
                {
                    ko: config?.missionPrayer3 || "마을에서 요한복음, 요한1,2,3서와 계시록의 최종통독을 하는데 은혜 가운데 진행되도록,",
                    en: config?.missionPrayer3En || "That the final reading of the Gospel of John, 1,2,3 John, and Revelation in the village proceeds smoothly in grace,"
                },
                {
                    ko: config?.missionPrayer4 || "번역자인 잭 형제가 알로타우로 나와 병원에서 진찰받으려고 하는데 복통의 원인을 정확히 알고 치료받을 수 있도록,",
                    en: config?.missionPrayer4En || "That brother Jack, a translator, who is coming to Alotau to be examined at the hospital, will find the exact cause of his stomach pain and receive proper treatment,"
                }
            ]
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <SEO 
                title={getText(content.hero.title)}
                description={getText(content.hero.subtitle)}
                path="/ministry/mission"
            />

            {/* Header Banner */}
            <div className={clsx(
                "relative flex items-center justify-center overflow-hidden",
                height === 'full' ? "h-screen" :
                    height === 'large' ? "h-[60vh] md:h-[85vh]" :
                        height === 'medium' ? "h-[50vh] md:h-[75vh]" :
                            "h-[40vh] md:h-[50vh]"
            )}>
                <div className="absolute inset-0 z-0">
                    {isVideo(headerBanner) ? (
                        getYoutubeId(headerBanner) ? (
                            <div className="absolute inset-0 w-full h-full">
                                <iframe
                                    className={clsx(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 opacity-80",
                                        bannerFit === 'contain' ? "w-full h-full object-contain" : "w-[115%] h-[115%] min-w-full min-h-full object-cover"
                                    )}
                                    src={`https://www.youtube.com/embed/${getYoutubeId(headerBanner)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(headerBanner)}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    title="Background Video"
                                ></iframe>
                            </div>
                        ) : (
                            <video
                                key={headerBanner}
                                src={headerBanner.includes('drive.google.com') ? dbService.formatDriveVideo(headerBanner) : headerBanner}
                                className={clsx(
                                    "w-full h-full transform scale-105 transition-all duration-700",
                                    bannerFit === 'contain' ? "object-contain" : "object-cover"
                                )}
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        )
                    ) : (
                        <img
                            src={headerBanner}
                            alt="Mission Banner"
                            className={clsx(
                                "w-full h-full transform scale-105 transition-all duration-700",
                                bannerFit === 'contain' ? "object-contain" : "object-cover"
                            )}
                        />
                    )}
                    <div className="absolute inset-0 bg-[#0c1a2c]/60 mix-blend-multiply pointer-events-none" />
                    <div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }} />
                </div>
                
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx(
                            "mb-4 drop-shadow-sm",
                            titleWeight || "font-bold",
                            titleFont,
                            titleItalic && "italic"
                        )}
                        style={{
                            color: titleColor,
                            fontSize: titleSize ? `${titleSize}px` : undefined
                        }}
                    >
                        {getText(content.hero.title)}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "5rem" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1.5 bg-accent mx-auto mb-8 rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={clsx(
                            "drop-shadow-md max-w-2xl mx-auto",
                            subtitleWeight,
                            subtitleFont,
                            subtitleItalic && "italic"
                        )}
                        style={{
                            color: subtitleColor,
                            fontSize: subtitleSize ? `${subtitleSize}px` : undefined
                        }}
                    >
                        {getText(content.hero.subtitle)}
                    </motion.p>
                </div>
            </div>

            {/* Navigation */}
            <div className="container mx-auto px-4 mt-12 relative z-20">
                <MinistryNav active="mission_evangelism" category="ministry" />
            </div>

            {/* Main Content Sections */}
            <div className="container mx-auto px-4 py-20 md:py-28 max-w-7xl space-y-32 md:space-y-44">

                {/* Section 2: 하나님의 말씀은 모든 민족에게 */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div 
                        className="space-y-6 order-1 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-black text-sm">01</span>
                            <span className="text-primary font-bold text-sm tracking-wider uppercase">Mission History</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-snug break-keep">
                            {getText(content.sec2.title)}
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <p className="text-slate-600 leading-[2] whitespace-pre-line break-keep text-base font-medium">
                            {getText(content.sec2.content)}
                        </p>
                    </motion.div>

                    <motion.div 
                        className="order-2 lg:order-2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                            <img 
                                src={content.sec2.image} 
                                alt={getText(content.sec2.title)} 
                                className="w-full h-auto hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Section 3: 카니누와를 향한 하나님의 사랑 */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div 
                        className="order-2 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                            <img 
                                src={content.sec3.image} 
                                alt={getText(content.sec3.title)} 
                                className="w-full h-auto hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                    </motion.div>

                    <motion.div 
                        className="space-y-6 order-1 lg:order-2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-black text-sm">02</span>
                            <span className="text-primary font-bold text-sm tracking-wider uppercase">Kaninuwa Project</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-snug break-keep">
                            {getText(content.sec3.title)}
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <p className="text-slate-600 leading-[2] whitespace-pre-line break-keep text-base font-medium">
                            {getText(content.sec3.content)}
                        </p>

                        {/* Activities Checklist */}
                        <div className="pt-6 border-t border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BookOpen size={18} className="text-primary" />
                                {isEn ? "Current Ministry" : "현재 사역"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.sec3.activities.map((activity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                        <span className="text-slate-700 font-bold text-sm">{getText(activity)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Section 4: 성경번역은 한 사람의 헌신으로 완성되지 않습니다. */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div 
                        className="space-y-6 order-1 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-black text-sm">03</span>
                            <span className="text-primary font-bold text-sm tracking-wider uppercase">Partnership</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-snug break-keep">
                            {getText(content.sec4.title)}
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <p className="text-slate-600 leading-[2] whitespace-pre-line break-keep text-base font-medium">
                            {getText(content.sec4.content)}
                        </p>
                    </motion.div>

                    <motion.div 
                        className="order-2 lg:order-2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                            <img 
                                src={content.sec4.image} 
                                alt={getText(content.sec4.title)} 
                                className="w-full h-auto hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                    </motion.div>
                </section>

                {/* Section 5: 말씀을 넘어 삶으로 */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div 
                        className="order-2 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                            <img 
                                src={content.sec5.image} 
                                alt={getText(content.sec5.title)} 
                                className="w-full h-auto hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                    </motion.div>

                    <motion.div 
                        className="space-y-6 order-1 lg:order-2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-black text-sm">04</span>
                            <span className="text-primary font-bold text-sm tracking-wider uppercase">Transformation</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-snug break-keep">
                            {getText(content.sec5.title)}
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full" />
                        <p className="text-slate-600 leading-[2] whitespace-pre-line break-keep text-base font-medium">
                            {getText(content.sec5.content)}
                        </p>
                    </motion.div>
                </section>

                {/* Missionary Video Message Section */}
                <motion.section 
                    className="bg-slate-50 rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-sm max-w-5xl mx-auto space-y-8 md:space-y-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <span className="text-primary font-bold text-sm tracking-wider uppercase">Video Message</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-snug break-keep">
                            {getText(content.video.title)}
                        </h2>
                        <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
                        <p className="text-slate-600 leading-[1.8] break-keep text-base font-medium whitespace-pre-line">
                            {getText(content.video.desc)}
                        </p>
                    </div>

                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl bg-black border border-slate-100">
                        {getVideoEmbedUrl(content.video.url) ? (
                            <iframe
                                src={getVideoEmbedUrl(content.video.url)}
                                className="w-full h-full border-0"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                                title={getText(content.video.title)}
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                Video is not available
                            </div>
                        )}
                    </div>
                </motion.section>

            </div>

            {/* Prayer Requests Section (Full Width Dark Background) */}
            <section className="bg-slate-900 text-white py-20 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-accent/10 blur-3xl rounded-full -translate-x-1/3 translate-y-1/4 pointer-events-none" />
                
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                            <Heart size={36} className="text-accent" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">{getText(content.prayer.title)}</h2>
                        <div className="w-16 h-1.5 bg-accent mx-auto rounded-full" />
                    </div>

                    <div className="space-y-6">
                        {content.prayer.items.map((pray, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors duration-300 flex items-start gap-5">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                                    <span className="text-accent font-black text-sm">{idx + 1}</span>
                                </div>
                                <p className="text-lg md:text-xl text-white/90 leading-loose font-medium break-keep">
                                    {getText(pray)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <a 
                            href="mailto:thesentnamgyu@gmail.com"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/80 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-accent/20 text-base md:text-lg group"
                        >
                            <span>{isEn ? "Sponsor Foreign Missionary Inquiry" : "해외선교사 후원 문의"}</span>
                            <span className="group-hover:translate-x-1 transition-transform">✉️</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Mission;
