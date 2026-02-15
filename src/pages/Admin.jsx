import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Upload, FileText, Check, X, Play, LayoutDashboard, Plus, Trash2, ExternalLink, Image as ImageIcon, Settings, Users, BookOpen, Quote, Calendar, MapPin, Clock, Video, Shield, AlertTriangle, Type, ArrowUp, ArrowDown, Heart } from 'lucide-react';
import sermonsInitialData from '../data/sermons.json';
import bulletinsInitialData from '../data/bulletins.json';
import noticesInitialData from '../data/notices.json';

import churchData from '../data/church_data.json';
import { dbService } from '../services/dbService';
import { isVideo, getYoutubeId } from '../utils/mediaUtils';
import clsx from 'clsx';

const BannerManager = ({ label, value, fieldName, onChange, bannerFiles, setBannerFiles, aspectRatio = "aspect-video" }) => {
    const currentFile = bannerFiles[fieldName];
    const setFile = (file) => setBannerFiles(prev => ({ ...prev, [fieldName]: file }));

    // For preview, if we have a newly selected file, use that. Otherwise use the saved value.
    const previewUrl = React.useMemo(() => {
        return currentFile ? URL.createObjectURL(currentFile) : (value || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop');
    }, [currentFile, value]);

    // Check if it's a Drive link and specifically if it's already formatted for image/video
    const isDriveThumbnail = typeof previewUrl === 'string' && previewUrl.includes('drive.google.com/thumbnail');
    const isDriveVideo = typeof previewUrl === 'string' && (previewUrl.includes('export=media') || previewUrl.includes('export=download'));

    // We need to know if it's a video to decide whether to format it as a Drive image thumbnail
    // Prioritize checking the actual File object if available
    const potentialIsVideo = currentFile ? isVideo(currentFile) : isVideo(previewUrl);

    // Format Drive links based on their type to ensure they preview correctly
    // If it's a Drive link and we haven't already determined it's a video, default to image formatting
    const mediaUrl = (typeof previewUrl === 'string' && previewUrl.includes('drive.google.com'))
        ? (potentialIsVideo || isDriveVideo)
            ? dbService.formatDriveVideo(previewUrl)
            : dbService.formatDriveImage(previewUrl)
        : previewUrl;

    const isMediaVideo = currentFile ? isVideo(currentFile) : isVideo(mediaUrl);

    return (
        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-2">
                <label className="text-base font-black text-slate-800">{label}</label>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tight">
                    <LayoutDashboard size={10} />
                    Mixed Mode
                </div>
            </div>

            <div className="space-y-5">
                <div className="space-y-4">
                    {/* File Upload Option */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">파일 직접 업로드 (Direct Upload)</label>
                        <div className="relative group/file">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className={clsx(
                                "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all",
                                currentFile ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50 group-hover:border-primary/30"
                            )}>
                                {currentFile ? (
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <Check size={16} />
                                        <span className="text-[10px] font-black truncate max-w-[200px]">{currentFile.name}</span>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-1 hover:bg-emerald-100 rounded-full">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-center font-sans">
                                        <Upload size={20} className="text-gray-400" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">이미지 또는 비디오 파일 선택</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative flex items-center gap-4 py-1">
                        <div className="h-px bg-gray-100 flex-grow"></div>
                        <span className="text-[9px] font-black text-gray-300 uppercase letter-spacing-widest">OR USE LINK</span>
                        <div className="h-px bg-gray-100 flex-grow"></div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">외부 링크 (Image/Video URL)</label>
                        <div className="relative group/input">
                            <input
                                type="url"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none font-sans text-sm transition-all"
                                placeholder="이미지 또는 비디오 주소를 입력하세요"
                                value={value || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val && val.includes('drive.google.com') && !val.includes('thumbnail') && !val.includes('uc?id=')) {
                                        // Auto-format for preview based on standard field types if possible
                                        // For now, we'll let the user decide or use the manual buttons for safety
                                        // but we can at least ensure it's not a garbage link.
                                        onChange(val);
                                    } else {
                                        onChange(val);
                                    }
                                }}
                            />
                            {value && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <button
                                        type="button"
                                        onClick={() => window.open(value, '_blank')}
                                        className="p-2 text-gray-300 hover:text-primary transition-colors"
                                        title="원본 확인"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        {typeof value === 'string' && value.includes('drive.google.com') && !value.includes('thumbnail') && !value.includes('uc?id=') && (
                            <p className="text-[10px] text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-100 mt-2">
                                ⚠️ 구글 드라이브 링크가 변환되지 않았습니다. 아래 [이미지로 변환] 또는 [비디오로 변환] 버튼을 눌러주세요.
                            </p>
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1 px-1">
                                <div className="flex items-center gap-2 text-slate-800 font-black text-[10px] uppercase tracking-tighter">
                                    <BookOpen size={12} className="text-primary" />
                                    구글 드라이브 링크 변환기
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold leading-tight flex items-start gap-1">
                                    <span className="text-primary">💡</span>
                                    <span>비디오 로딩을 가장 빠르게 하려면 <b>10MB 이하의 MP4 파일</b>을 직접 업로드하세요. 유튜브 배경은 불러오는 시간이 길어질 수 있습니다. 드라이브 링크는 반드시 아래 <b>[비디오로 변환]</b> 버튼을 눌러주세요.</span>
                                </p>
                            </div>
                            <input
                                id={`drive-input-${fieldName}`}
                                type="text"
                                placeholder="드라이브 공유 링크를 붙여넣으세요"
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-[11px] outline-none focus:border-primary/40 transition-colors"
                                onChange={(e) => {
                                    // Remove auto-conversion to prevent it from stealing the link before user can choose Type
                                    // (Image vs Video). Just let them paste and click the buttons.
                                }}
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const inputElement = document.getElementById(`drive-input-${fieldName}`);
                                        const input = inputElement?.value;
                                        if (input && typeof input === 'string' && input.includes('drive.google.com')) {
                                            const formatted = dbService.formatDriveImage(input);
                                            onChange(formatted);
                                            if (inputElement) inputElement.value = '';
                                            alert('✅ 드라이브 [이미지] 주소로 변환되었습니다!');
                                        } else {
                                            alert('구글 드라이브 링크를 먼저 입력해주세요.');
                                        }
                                    }}
                                    className="flex-grow py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[9px] font-black transition-all"
                                >
                                    🖼️ 이미지로 변환
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const inputElement = document.getElementById(`drive-input-${fieldName}`);
                                        const input = inputElement?.value;
                                        if (input && typeof input === 'string' && input.includes('drive.google.com')) {
                                            const formatted = dbService.formatDriveVideo(input);
                                            onChange(formatted);
                                            if (inputElement) inputElement.value = '';
                                            alert('✅ 드라이브 [비디오] 주소로 변환되었습니다!');
                                        } else {
                                            alert('구글 드라이브 링크를 먼저 입력해주세요.');
                                        }
                                    }}
                                    className="flex-grow py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[9px] font-black transition-all"
                                >
                                    🎬 비디오로 변환
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Thumbnail */}
                <div className={`${aspectRatio} rounded-2xl overflow-hidden bg-slate-100 border border-gray-100 mt-2 relative shadow-inner`}>
                    <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-1 bg-black/40 backdrop-blur-md text-[9px] font-black text-white rounded-md uppercase tracking-widest">Live Preview</span>
                    </div>
                    {isMediaVideo ? (
                        getYoutubeId(mediaUrl) ? (
                            <iframe
                                key={mediaUrl}
                                className={`w-full h-[150%] ${aspectRatio} pointer-events-none`}
                                src={`https://www.youtube.com/embed/${getYoutubeId(mediaUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYoutubeId(mediaUrl)}&controls=0&showinfo=0&rel=0&iv_load_policy=3`}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                            ></iframe>
                        ) : (
                            <video
                                key={mediaUrl}
                                src={mediaUrl}
                                className="w-full h-full object-cover"
                                muted
                                autoPlay
                                loop
                                playsInline
                            />
                        )
                    ) : (
                        <img
                            src={mediaUrl}
                            alt="Preview"
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Vercel deployment check comment
    const [headerBanner, setHeaderBanner] = useState("/images/about_banner.jpg");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('site');
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [file, setFile] = useState(null);
    const [file2, setFile2] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [staffFile, setStaffFile] = useState(null);
    const staffFileInputRef = useRef(null);

    // States for data
    const [sermons, setSermons] = useState([]);
    const [bulletins, setBulletins] = useState([]);
    const [notices, setNotices] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [siteConfig, setSiteConfig] = useState({});
    const [staffList, setStaffList] = useState([]);
    const [columns, setColumns] = useState([]);
    const [dailyWords, setDailyWords] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [bannerFiles, setBannerFiles] = useState({});

    // Form States
    const [formData, setFormData] = useState({
        title: '', date: '', preacher: '', youtubeId: '',
        fileUrl: '', fileUrl2: '', category: '공지', content: '', important: false,
        type: 'image',

        // Home
        heroImage: '', heroTitle: '', heroSubtitle: '',
        heroTitleFont: 'font-sans', heroSubtitleFont: 'font-sans',
        heroTitleColor: '#ffffff', heroSubtitleColor: '#f8fafc',
        heroTitleItalic: false, heroSubtitleItalic: false,
        heroTitleSize: 64, heroSubtitleSize: 24,
        heroHeight: 'full', heroOverlayOpacity: 50,
        heroBannerFit: 'cover',

        // About
        aboutBanner: '', aboutTitle: '', aboutSubtitle: '',
        aboutTitleFont: 'font-sans', aboutSubtitleFont: 'font-sans',
        aboutTitleColor: '#ffffff', aboutSubtitleColor: '#f8fafc',
        aboutTitleItalic: false, aboutSubtitleItalic: false,
        aboutTitleSize: 40, aboutSubtitleSize: 18,
        aboutHeight: 'medium', aboutOverlayOpacity: 40,
        aboutBannerFit: 'cover',

        // News
        newsBanner: '', newsTitle: '', newsSubtitle: '',
        newsTitleFont: 'font-sans', newsSubtitleFont: 'font-sans',
        newsTitleColor: '#ffffff', newsSubtitleColor: '#f8fafc',
        newsTitleItalic: false, newsSubtitleItalic: false,
        newsTitleSize: 40, newsSubtitleSize: 18,
        newsHeight: 'medium', newsOverlayOpacity: 40,
        newsBannerFit: 'cover',

        // Ministry
        ministryBanner: '', ministryTitle: '', ministrySubtitle: '',
        ministryTitleFont: 'font-sans', ministrySubtitleFont: 'font-sans',
        ministryTitleColor: '#ffffff', ministrySubtitleColor: '#f8fafc',
        ministryTitleItalic: false, ministrySubtitleItalic: false,
        ministryTitleSize: 40, ministrySubtitleSize: 18,
        ministryHeight: 'medium', ministryOverlayOpacity: 40,
        ministryBannerFit: 'cover',

        // Resources
        resourcesBanner: '', resourcesTitle: '', resourcesSubtitle: '',
        resourcesTitleFont: 'font-sans', resourcesSubtitleFont: 'font-sans',
        resourcesTitleColor: '#ffffff', resourcesSubtitleColor: '#f8fafc',
        resourcesTitleItalic: false, resourcesSubtitleItalic: false,
        resourcesTitleSize: 40, resourcesSubtitleSize: 18,
        resourcesHeight: 'medium', resourcesOverlayOpacity: 40,
        resourcesBannerFit: 'cover',

        // Mission
        missionBanner: '', missionTitle: '', missionSubtitle: '',
        missionTitleFont: 'font-sans', missionSubtitleFont: 'font-sans',
        missionTitleColor: '#ffffff', missionSubtitleColor: '#f8fafc',
        missionTitleItalic: false, missionSubtitleItalic: false,
        missionTitleWeight: 'font-bold', missionSubtitleWeight: 'font-medium',
        missionTitleSize: 40, missionSubtitleSize: 18,
        missionHeight: 'medium', missionOverlayOpacity: 40,
        missionBannerFit: 'cover',

        // Prayer
        prayerBanner: '', prayerTitle: '', prayerSubtitle: '',
        prayerTitleFont: 'font-sans', prayerSubtitleFont: 'font-sans',
        prayerTitleColor: '#ffffff', prayerSubtitleColor: '#f8fafc',
        prayerTitleItalic: false, prayerSubtitleItalic: false,
        prayerTitleWeight: 'font-bold', prayerSubtitleWeight: 'font-medium',
        prayerTitleSize: 40, prayerSubtitleSize: 18,
        prayerHeight: 'medium', prayerOverlayOpacity: 40,
        prayerBannerFit: 'cover',

        // TEE
        teeBanner: '', teeTitle: '', teeSubtitle: '',
        teeTitleFont: 'font-sans', teeSubtitleFont: 'font-sans',
        teeTitleColor: '#ffffff', teeSubtitleColor: '#f8fafc',
        teeTitleItalic: false, teeSubtitleItalic: false,
        teeTitleWeight: 'font-bold', teeSubtitleWeight: 'font-medium',
        teeTitleSize: 40, teeSubtitleSize: 18,
        teeHeight: 'medium', teeOverlayOpacity: 40,
        teeBannerFit: 'cover',

        // Team Ministry
        teamBanner: '', teamTitle: '', teamSubtitle: '',
        teamTitleFont: 'font-sans', teamSubtitleFont: 'font-sans',
        teamTitleColor: '#ffffff', teamSubtitleColor: '#f8fafc',
        teamTitleItalic: false, teamSubtitleItalic: false,
        teamTitleWeight: 'font-bold', teamSubtitleWeight: 'font-medium',
        teamTitleSize: 40, teamSubtitleSize: 18,
        teamHeight: 'medium', teamOverlayOpacity: 40,
        teamBannerFit: 'cover',

        // Individual Ministry Items
        ministryItems: [],
        teamMinistryItems: [],

        // Prayer Management
        prayerIntroImage: '',
        prayerCommonTopics: '',
        prayerPastorTopics: '',
        prayerChurchTopics: '',
        prayerWorldTopics: '',
        prayerChurchTopics2026: '', // New field for 2026 topics
        prayerCoreValues: '',
        prayerGoals: '',
        prayerHours: '',

        author: '', fileType: 'pdf',
        note: '', eventType: 'default',
        startDate: '', endDate: ''
    });

    const [pastorFile, setPastorFile] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const fbSermons = await dbService.getSermons();
            const fbBulletins = await dbService.getBulletins();
            const fbNotices = await dbService.getNotices();
            const fbGallery = await dbService.getGallery();
            const fbColumns = await dbService.getColumns();
            const fbDailyWords = await dbService.getDailyWords();
            const fbCalendar = await dbService.getCalendarEvents();
            // Sort calendar specifically if needed, though dbService does it
            const sortedCalendar = (fbCalendar || []).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            const fbConfig = await dbService.getSiteConfig();

            // 만약 여기까지 에러 없이 도달했다면 파이어베이스 연결은 성공한 것입니다.
            setIsFirebaseConfigured(true);

            setSermons(fbSermons);
            setBulletins(fbBulletins);
            setNotices(fbNotices);
            setGallery(fbGallery);
            setColumns(fbColumns || []);

            // Sort daily words: Order (desc) -> Date (desc)
            const sortedDailyWords = (fbDailyWords || []).sort((a, b) => {
                const orderA = a.order ?? -1;
                const orderB = b.order ?? -1;
                if (orderA !== -1 && orderB !== -1) return orderB - orderA;
                if (orderA !== -1) return -1;
                if (orderB !== -1) return 1;
                return new Date(b.date) - new Date(a.date); // DESCENDING (Fri -> Mon)
            });
            setDailyWords(sortedDailyWords);
            setCalendarEvents(sortedCalendar);
            if (fbConfig) {
                setSiteConfig(fbConfig);
                setFormData(prev => ({
                    ...prev,
                    heroImage: fbConfig.heroImage || '',
                    heroTitle: fbConfig.heroTitle || '',
                    heroSubtitle: fbConfig.heroSubtitle || '',
                    heroTitleFont: fbConfig.heroTitleFont || fbConfig.titleFont || 'font-sans',
                    heroSubtitleFont: fbConfig.heroSubtitleFont || fbConfig.subtitleFont || 'font-sans',
                    heroTitleColor: fbConfig.heroTitleColor || fbConfig.titleColor || '#ffffff',
                    heroSubtitleColor: fbConfig.heroSubtitleColor || fbConfig.subtitleColor || '#f8fafc',
                    heroTitleItalic: fbConfig.heroTitleItalic || false,
                    heroSubtitleItalic: fbConfig.heroSubtitleItalic || false,
                    heroTitleWeight: fbConfig.heroTitleWeight || 'font-bold',
                    heroSubtitleWeight: fbConfig.heroSubtitleWeight || 'font-medium',
                    heroTitleSize: fbConfig.heroTitleSize || 64,
                    heroSubtitleSize: fbConfig.heroSubtitleSize || 24,
                    heroHeight: fbConfig.heroHeight || 'full',
                    heroOverlayOpacity: fbConfig.heroOverlayOpacity || fbConfig.overlayOpacity || 50,
                    heroBannerFit: fbConfig.heroBannerFit || 'cover',

                    aboutBanner: fbConfig.aboutBanner || '',
                    aboutTitle: fbConfig.aboutTitle || '',
                    aboutSubtitle: fbConfig.aboutSubtitle || '',
                    aboutTitleFont: fbConfig.aboutTitleFont || 'font-sans',
                    aboutSubtitleFont: fbConfig.aboutSubtitleFont || 'font-sans',
                    aboutTitleColor: fbConfig.aboutTitleColor || '#ffffff',
                    aboutSubtitleColor: fbConfig.aboutSubtitleColor || '#f8fafc',
                    aboutTitleItalic: fbConfig.aboutTitleItalic || false,
                    aboutSubtitleItalic: fbConfig.aboutSubtitleItalic || false,
                    aboutTitleWeight: fbConfig.aboutTitleWeight || 'font-bold',
                    aboutSubtitleWeight: fbConfig.aboutSubtitleWeight || 'font-medium',
                    aboutTitleSize: fbConfig.aboutTitleSize || 40,
                    aboutSubtitleSize: fbConfig.aboutSubtitleSize || 18,
                    aboutHeight: fbConfig.aboutHeight || 'medium',
                    aboutOverlayOpacity: fbConfig.aboutOverlayOpacity || 40,
                    aboutBannerFit: fbConfig.aboutBannerFit || 'cover',

                    newsBanner: fbConfig.newsBanner || fbConfig.worshipBanner || '',
                    newsTitle: fbConfig.newsTitle || fbConfig.worshipTitle || '',
                    newsSubtitle: fbConfig.newsSubtitle || fbConfig.worshipSubtitle || '',
                    newsTitleFont: fbConfig.newsTitleFont || fbConfig.worshipTitleFont || 'font-sans',
                    newsSubtitleFont: fbConfig.newsSubtitleFont || fbConfig.worshipSubtitleFont || 'font-sans',
                    newsTitleColor: fbConfig.newsTitleColor || fbConfig.worshipTitleColor || '#ffffff',
                    newsSubtitleColor: fbConfig.newsSubtitleColor || fbConfig.worshipSubtitleColor || '#f8fafc',
                    newsTitleItalic: fbConfig.newsTitleItalic !== undefined ? fbConfig.newsTitleItalic : (fbConfig.worshipTitleItalic || false),
                    newsSubtitleItalic: fbConfig.newsSubtitleItalic !== undefined ? fbConfig.newsSubtitleItalic : (fbConfig.worshipSubtitleItalic || false),
                    newsTitleWeight: fbConfig.newsTitleWeight || 'font-bold',
                    newsSubtitleWeight: fbConfig.newsSubtitleWeight || 'font-medium',
                    newsTitleSize: fbConfig.newsTitleSize || fbConfig.worshipTitleSize || 40,
                    newsSubtitleSize: fbConfig.newsSubtitleSize || fbConfig.worshipSubtitleSize || 18,
                    newsHeight: fbConfig.newsHeight || fbConfig.worshipHeight || 'medium',
                    newsOverlayOpacity: fbConfig.newsOverlayOpacity !== undefined ? fbConfig.newsOverlayOpacity : (fbConfig.worshipOverlayOpacity || 40),
                    newsBannerFit: fbConfig.newsBannerFit || 'cover',

                    ministryBanner: fbConfig.ministryBanner || '',
                    ministryTitle: fbConfig.ministryTitle || '',
                    ministrySubtitle: fbConfig.ministrySubtitle || '',
                    ministryTitleFont: fbConfig.ministryTitleFont || 'font-sans',
                    ministrySubtitleFont: fbConfig.ministrySubtitleFont || 'font-sans',
                    ministryTitleColor: fbConfig.ministryTitleColor || '#ffffff',
                    ministrySubtitleColor: fbConfig.ministrySubtitleColor || '#f8fafc',
                    ministryTitleItalic: fbConfig.ministryTitleItalic || false,
                    ministrySubtitleItalic: fbConfig.ministrySubtitleItalic || false,
                    ministryTitleWeight: fbConfig.ministryTitleWeight || 'font-bold',
                    ministrySubtitleWeight: fbConfig.ministrySubtitleWeight || 'font-medium',
                    ministryTitleSize: fbConfig.ministryTitleSize || 40,
                    ministrySubtitleSize: fbConfig.ministrySubtitleSize || 18,
                    ministryHeight: fbConfig.ministryHeight || 'medium',
                    ministryOverlayOpacity: fbConfig.ministryOverlayOpacity || 40,
                    ministryBannerFit: fbConfig.ministryBannerFit || 'cover',

                    resourcesBanner: fbConfig.resourcesBanner || '',
                    resourcesTitle: fbConfig.resourcesTitle || '',
                    resourcesSubtitle: fbConfig.resourcesSubtitle || '',
                    resourcesTitleFont: fbConfig.resourcesTitleFont || 'font-sans',
                    resourcesSubtitleFont: fbConfig.resourcesSubtitleFont || 'font-sans',
                    resourcesTitleColor: fbConfig.resourcesTitleColor || '#ffffff',
                    resourcesSubtitleColor: fbConfig.resourcesSubtitleColor || '#f8fafc',
                    resourcesTitleItalic: fbConfig.resourcesTitleItalic || false,
                    resourcesSubtitleItalic: fbConfig.resourcesSubtitleItalic || false,
                    resourcesTitleWeight: fbConfig.resourcesTitleWeight || 'font-bold',
                    resourcesSubtitleWeight: fbConfig.resourcesSubtitleWeight || 'font-medium',
                    resourcesTitleSize: fbConfig.resourcesTitleSize || 40,
                    resourcesSubtitleSize: fbConfig.resourcesSubtitleSize || 18,
                    resourcesHeight: fbConfig.resourcesHeight || 'medium',
                    resourcesOverlayOpacity: fbConfig.resourcesOverlayOpacity || 40,
                    resourcesBannerFit: fbConfig.resourcesBannerFit || 'cover',

                    missionBanner: fbConfig.missionBanner || '',
                    missionTitle: fbConfig.missionTitle || '',
                    missionSubtitle: fbConfig.missionSubtitle || '',
                    missionTitleFont: fbConfig.missionTitleFont || 'font-sans',
                    missionSubtitleFont: fbConfig.missionSubtitleFont || 'font-sans',
                    missionTitleColor: fbConfig.missionTitleColor || '#ffffff',
                    missionSubtitleColor: fbConfig.missionSubtitleColor || '#f8fafc',
                    missionTitleItalic: fbConfig.missionTitleItalic || false,
                    missionSubtitleItalic: fbConfig.missionSubtitleItalic || false,
                    missionTitleWeight: fbConfig.missionTitleWeight || 'font-bold',
                    missionSubtitleWeight: fbConfig.missionSubtitleWeight || 'font-medium',
                    missionTitleSize: fbConfig.missionTitleSize || 40,
                    missionSubtitleSize: fbConfig.missionSubtitleSize || 18,
                    missionHeight: fbConfig.missionHeight || 'medium',
                    missionOverlayOpacity: fbConfig.missionOverlayOpacity || 40,
                    missionBannerFit: fbConfig.missionBannerFit || 'cover',

                    prayerBanner: fbConfig.prayerBanner || '',
                    prayerTitle: fbConfig.prayerTitle || '',
                    prayerSubtitle: fbConfig.prayerSubtitle || '',
                    prayerTitleFont: fbConfig.prayerTitleFont || 'font-sans',
                    prayerSubtitleFont: fbConfig.prayerSubtitleFont || 'font-sans',
                    prayerTitleColor: fbConfig.prayerTitleColor || '#ffffff',
                    prayerSubtitleColor: fbConfig.prayerSubtitleColor || '#f8fafc',
                    prayerTitleItalic: fbConfig.prayerTitleItalic || false,
                    prayerSubtitleItalic: fbConfig.prayerSubtitleItalic || false,
                    prayerTitleWeight: fbConfig.prayerTitleWeight || 'font-bold',
                    prayerSubtitleWeight: fbConfig.prayerSubtitleWeight || 'font-medium',
                    prayerTitleSize: fbConfig.prayerTitleSize || 40,
                    prayerSubtitleSize: fbConfig.prayerSubtitleSize || 18,
                    prayerHeight: fbConfig.prayerHeight || 'medium',
                    prayerOverlayOpacity: fbConfig.prayerOverlayOpacity || 40,
                    prayerBannerFit: fbConfig.prayerBannerFit || 'cover',

                    teeBanner: fbConfig.teeBanner || '',
                    teeTitle: fbConfig.teeTitle || '',
                    teeSubtitle: fbConfig.teeSubtitle || '',
                    teeTitleFont: fbConfig.teeTitleFont || 'font-sans',
                    teeSubtitleFont: fbConfig.teeSubtitleFont || 'font-sans',
                    teeTitleColor: fbConfig.teeTitleColor || '#ffffff',
                    teeSubtitleColor: fbConfig.teeSubtitleColor || '#f8fafc',
                    teeTitleItalic: fbConfig.teeTitleItalic || false,
                    teeSubtitleItalic: fbConfig.teeSubtitleItalic || false,
                    teeTitleWeight: fbConfig.teeTitleWeight || 'font-bold',
                    teeSubtitleWeight: fbConfig.teeSubtitleWeight || 'font-medium',
                    teeTitleSize: fbConfig.teeTitleSize || 40,
                    teeSubtitleSize: fbConfig.teeSubtitleSize || 18,
                    teeHeight: fbConfig.teeHeight || 'medium',
                    teeOverlayOpacity: fbConfig.teeOverlayOpacity || 40,
                    teeBannerFit: fbConfig.teeBannerFit || 'cover',

                    teamBanner: fbConfig.teamBanner || '',
                    teamTitle: fbConfig.teamTitle || '',
                    teamSubtitle: fbConfig.teamSubtitle || '',
                    teamTitleFont: fbConfig.teamTitleFont || 'font-sans',
                    teamSubtitleFont: fbConfig.teamSubtitleFont || 'font-sans',
                    teamTitleColor: fbConfig.teamTitleColor || '#ffffff',
                    teamSubtitleColor: fbConfig.teamSubtitleColor || '#f8fafc',
                    teamTitleItalic: fbConfig.teamTitleItalic || false,
                    teamSubtitleItalic: fbConfig.teamSubtitleItalic || false,
                    teamTitleWeight: fbConfig.teamTitleWeight || 'font-bold',
                    teamSubtitleWeight: fbConfig.teamSubtitleWeight || 'font-medium',
                    teamTitleSize: fbConfig.teamTitleSize || 40,
                    teamSubtitleSize: fbConfig.teamSubtitleSize || 18,
                    teamHeight: fbConfig.teamHeight || 'medium',
                    teamOverlayOpacity: fbConfig.teamOverlayOpacity || 40,
                    teamBannerFit: fbConfig.teamBannerFit || 'cover',

                    ministryItems: fbConfig.ministryItems || churchData.ministries.map(m => ({
                        ...m,
                        detail: m.id === 'tsc' ?
                            "[교육 목표]\n하나님을 알고, 하나님을 사랑하며, 하나님을 닮아가는 어린이\n\n[주요 활동]\n- 통합 예배: 부모님과 함께 드리는 예배를 통해 경외감을 배웁니다.\n- 분반 공부: 연령별 맞춤 성경 공부로 말씀의 기초를 다집니다.\n- 절기 행사: 부활절, 추수감사절, 성탄절 등 기독교 문화를 체험합니다.\n\nTSC는 우리 아이들이 세상의 빛과 소금으로 자라나도록 기도와 사랑으로 양육합니다." :
                            "[교육 비전]\n복음으로 무장하여 세상을 변화시키는 차세대 리더\n\n[주요 활동]\n- 열린 예배: 청소년들의 눈높이에 맞춘 찬양과 말씀 선포\n- 소그룹 나눔: 고민을 나누고 서로 중보하며 믿음의 우정을 쌓습니다.\n- 비전 트립: 수련회와 탐방을 통해 더 넓은 세상을 경험하고 비전을 찾습니다.\n\nTSY는 혼자가 아닌 '함께'의 가치를 배우며 믿음의 여정을 걸어가는 공동체입니다."
                    })),
                    teamMinistryItems: fbConfig.teamMinistryItems || churchData.team_ministries || [],

                    // Prayer Items
                    prayerIntroImage: fbConfig.prayerIntroImage || '',
                    prayerCommonTopics: fbConfig.prayerCommonTopics || '',
                    prayerPastorTopics: fbConfig.prayerPastorTopics || '',
                    prayerChurchTopics: fbConfig.prayerChurchTopics || '',
                    prayerChurchTopics2026: fbConfig.prayerChurchTopics2026 || '',
                    prayerCoreValues: fbConfig.prayerCoreValues || '',
                    prayerGoals: fbConfig.prayerGoals || '',
                    prayerHours: fbConfig.prayerHours || '',
                }));
                setColumns(fbColumns || []);
                if (fbConfig.staff) {
                    setStaffList(fbConfig.staff);
                } else {
                    // Fallback to initial data with IDs
                    const initialStaff = (churchData.intro.staff || []).map((s, i) => ({ ...s, id: `init_${i}` }));
                    setStaffList(initialStaff);
                }
            } else {
                const initialStaff = (churchData.intro.staff || []).map((s, i) => ({ ...s, id: `init_${i}` }));
                setStaffList(initialStaff);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
            alert(`데이터 로딩 중 오류가 발생했습니다: ${error.message}`);
            setIsFirebaseConfigured(false);
            setSermons(sermonsInitialData);
            setBulletins(bulletinsInitialData);
            setNotices(noticesInitialData);
            setGallery([]);
            setColumns([]);
            setDailyWords([]);
            setCalendarEvents([]);
        }
        setIsLoading(false);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'sent1234') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    const extractYoutubeId = (url) => {
        if (!url || typeof url !== 'string') return url;
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        return match ? match[1] : url;
    };


    const handleMoveDailyWord = async (index, direction) => {
        if (isLoading) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= dailyWords.length) return;

        setIsLoading(true);
        try {
            const newItems = [...dailyWords];
            // Swap items in the array
            [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

            // Assign order values to all items based on their new visual position
            // Higher order = appears first (descending sort)
            const updates = newItems.map((item, idx) => ({
                id: item.id,
                order: newItems.length - idx
            }));

            // Optimistic update
            newItems.forEach((item, idx) => {
                item.order = newItems.length - idx;
            });
            setDailyWords(newItems);

            // Save to DB
            await dbService.updateDailyWordsOrder(updates);

        } catch (error) {
            console.error("Error reordering:", error);
            alert("순서 변경 중 오류가 발생했습니다.");
            loadData(); // Revert on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleStaffSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);

        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 300000)
        );

        try {
            let finalPhotoUrl = formData.staffPhotoUrl || '';

            if (editingId && !staffFile && !formData.staffPhotoUrl) {
                const existingStaff = staffList.find(s => s.id === editingId);
                finalPhotoUrl = existingStaff?.image || '';
            }

            if (staffFile) {
                const uploadedUrl = await dbService.uploadFile(staffFile, 'staff_photos');
                // Only update if upload returned a valid string
                if (uploadedUrl && typeof uploadedUrl === 'string' && uploadedUrl.length > 10) {
                    finalPhotoUrl = uploadedUrl;
                } else {
                    console.error("Upload failed or returned invalid URL");
                    // Keep existing if upload fails? Or alert?
                    // For now, if we had an existing one, keep it.
                    if (editingId) {
                        const existingStaff = staffList.find(s => s.id === editingId);
                        if (existingStaff?.image) finalPhotoUrl = existingStaff.image;
                    }
                }
            } else if (formData.staffPhotoUrl) {
                finalPhotoUrl = dbService.formatDriveImage(formData.staffPhotoUrl);
            }

            let newStaffList;
            if (editingId) {
                newStaffList = staffList.map(s => s.id === editingId ? {
                    ...s,
                    name: formData.staffName,
                    englishName: formData.staffEnglishName,
                    role: formData.staffRole,
                    email: formData.staffEmail,
                    image: finalPhotoUrl
                } : s);
            } else {
                const newStaffMember = {
                    id: Date.now(),
                    name: formData.staffName,
                    englishName: formData.staffEnglishName,
                    role: formData.staffRole,
                    email: formData.staffEmail,
                    image: finalPhotoUrl
                };
                newStaffList = [...staffList, newStaffMember];
            }

            // alert(`[디버깅 리포트]...`); // Alert removed for production

            await Promise.race([dbService.updateSiteConfig({ ...siteConfig, staff: newStaffList }), timeout]);
            setStaffList(newStaffList);
            setSiteConfig(prev => ({ ...prev, staff: newStaffList }));

            setShowAddForm(false);
            setEditingId(null);
            setStaffFile(null);
            setFormData({
                ...formData,
                staffName: '', staffRole: '', staffEmail: '', staffPhotoUrl: '', staffEnglishName: ''
            });
            alert('성공적으로 저장되었습니다!');
        } catch (err) {
            console.error(err);
            alert('저장 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleMoveItem = async (index, direction, list, setList, collectionName) => {
        if (isLoading) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= list.length) return;

        const newList = [...list];
        // Swap items
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];

        // Re-assign orderIndex based on the NEW visual order
        // We want the items at the top to have LOWER orderIndex (ascending sort)
        // or HIGHER orderIndex (descending sort)?
        // Our fetch query sorts by orderIndex ASC. So top item = 0, next = 1...
        const updatedList = newList.map((item, idx) => ({
            ...item,
            orderIndex: idx
        }));

        // Optimistic UI update
        setList(updatedList);

        try {
            // Save to Firestore
            // We only really need to update the two swapped items, but updating all ensures consistency if gaps exist
            await dbService.updateOrder(collectionName, updatedList);
        } catch (error) {
            console.error("Proposed order update failed, reverting", error);
            // Revert on failure (reload data)
            loadData();
            alert("순서 변경 저장에 실패했습니다.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Timeout promise (300 seconds for uploads)
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), 300000)
        );

        try {
            let savedItem;

            if (activeTab === 'sermons') {
                const vidId = extractYoutubeId(formData.youtubeId);
                const sermonData = {
                    title: formData.title,
                    preacher: formData.preacher,
                    date: formData.date,
                    youtubeId: vidId,
                    thumbnail: `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
                    link: formData.link || ''
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateSermon(editingId, sermonData), timeout]);
                    setSermons(sermons.map(s => s.id === editingId ? savedItem : s));
                } else {
                    savedItem = await Promise.race([dbService.addSermon(sermonData), timeout]);
                    setSermons([savedItem, ...sermons]);
                }
            } else if (activeTab === 'bulletins') {
                let finalFileUrl = formData.fileUrl;
                let finalFileUrl2 = formData.fileUrl2;

                if (file) {
                    finalFileUrl = await Promise.race([dbService.uploadFile(file, 'bulletins'), timeout]);
                } else if (finalFileUrl) {
                    finalFileUrl = dbService.formatDriveLink(finalFileUrl);
                }

                if (file2) {
                    finalFileUrl2 = await Promise.race([dbService.uploadFile(file2, 'bulletins'), timeout]);
                } else if (finalFileUrl2) {
                    finalFileUrl2 = dbService.formatDriveLink(finalFileUrl2);
                }

                const isVideo = (url) => {
                    if (!url) return false;
                    return url.match(/\.(mp4|webm|ogg|mov)$|^data:video\//i) || url.includes('video');
                };

                const bulletinData = {
                    title: formData.title,
                    date: formData.date,
                    fileUrl: finalFileUrl,
                    fileUrl2: finalFileUrl2
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateBulletin(editingId, bulletinData), timeout]);
                    setBulletins(bulletins.map(b => b.id === editingId ? savedItem : b));
                } else {
                    savedItem = await Promise.race([dbService.addBulletin(bulletinData), timeout]);
                    setBulletins([savedItem, ...bulletins]);
                }
            } else if (activeTab === 'notices') {
                const noticeData = {
                    title: formData.title,
                    date: formData.date,
                    category: formData.category,
                    content: formData.content,
                    important: formData.important,
                    link: formData.link || ''
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateNotice(editingId, noticeData), timeout]);
                    setNotices(notices.map(n => n.id === editingId ? savedItem : n));
                } else {
                    savedItem = await Promise.race([dbService.addNotice(noticeData), timeout]);
                    setNotices([savedItem, ...notices]);
                }
            } else if (activeTab === 'gallery') {
                let finalUrl = formData.fileUrl;
                let detectedType = formData.type;

                if (file) {
                    finalUrl = await Promise.race([dbService.uploadFile(file, 'gallery'), timeout]);
                    // Auto-detect type from file
                    if (file.type.startsWith('video/')) detectedType = 'video';
                    else if (file.type.startsWith('audio/')) detectedType = 'audio';
                    else detectedType = 'image';
                } else if (finalUrl) {
                    // Standardize external link
                    if (finalUrl.includes('drive.google.com')) {
                        finalUrl = dbService.formatDriveImage(finalUrl);
                    }
                    // Auto-detection from URL
                    if (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be') || finalUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
                        detectedType = 'video';
                    }
                }

                let finalThumbnailUrl = formData.thumbnailUrl || '';
                if (thumbnailFile) {
                    finalThumbnailUrl = await Promise.race([dbService.uploadFile(thumbnailFile, 'gallery_thumbnails'), timeout]);
                } else if (finalThumbnailUrl) {
                    finalThumbnailUrl = dbService.formatDriveImage(finalThumbnailUrl);
                }

                // Final fallback for missing thumbnail for videos
                if (!finalThumbnailUrl && detectedType === 'video' && finalUrl.includes('youtube.com')) {
                    const vidId = extractYoutubeId(finalUrl);
                    finalThumbnailUrl = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
                }

                const newItem = {
                    title: formData.title,
                    date: formData.date,
                    url: finalUrl,
                    thumbnailUrl: finalThumbnailUrl,
                    type: detectedType
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateGalleryItem(editingId, newItem), timeout]);
                    setGallery(gallery.map(g => g.id === editingId ? savedItem : g));
                } else {
                    savedItem = await Promise.race([dbService.addGalleryItem(newItem), timeout]);
                    setGallery([savedItem, ...gallery]);
                }
            } else if (activeTab === 'columns') {
                let finalFileUrl = formData.fileUrl;
                if (file) {
                    finalFileUrl = await Promise.race([dbService.uploadFile(file, 'columns'), timeout]);
                } else if (finalFileUrl) {
                    // For columns, if it's an image, use image formatting, else use link formatting
                    if (formData.fileType === 'image' && finalFileUrl.includes('drive.google.com')) {
                        finalFileUrl = dbService.formatDriveImage(finalFileUrl);
                    } else if (formData.fileType === 'pdf' && finalFileUrl.includes('drive.google.com')) {
                        finalFileUrl = dbService.formatDriveLink(finalFileUrl);
                    }
                }

                const columnData = {
                    title: formData.title,
                    date: formData.date,
                    author: formData.author || '이남규 목사',
                    fileUrl: finalFileUrl,
                    fileType: formData.fileType || 'pdf',
                    link: formData.fileUrl // Keep original link for reference
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateColumn(editingId, columnData), timeout]);
                    setColumns(columns.map(c => c.id === editingId ? savedItem : c));
                } else {
                    savedItem = await Promise.race([dbService.addColumn(columnData), timeout]);
                    setColumns([savedItem, ...columns]);
                }
            } else if (activeTab === 'calendar') {
                const eventData = {
                    title: formData.title,
                    startDate: formData.startDate || formData.date,
                    endDate: formData.endDate || formData.startDate || formData.date,
                    note: formData.note || '',
                    type: formData.eventType || 'default'
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateCalendarEvent(editingId, eventData), timeout]);
                    setCalendarEvents(calendarEvents.map(c => c.id === editingId ? { ...eventData, id: editingId } : c).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
                } else {
                    const newId = await Promise.race([dbService.addCalendarEvent(eventData), timeout]);
                    savedItem = { id: newId, ...eventData };
                    setCalendarEvents([...calendarEvents, savedItem].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
                }
            } else if (activeTab === 'dailyWord') {
                let finalImageUrl = formData.fileUrl;
                if (file) {
                    finalImageUrl = await Promise.race([dbService.uploadFile(file, 'daily_words'), timeout]);
                } else if (finalImageUrl) {
                    finalImageUrl = dbService.formatDriveImage(finalImageUrl);
                }

                const dailyWordData = {
                    content: formData.content,
                    verse: formData.verse || formData.title, // Use title field for verse if verse not specified, or vice versa
                    date: formData.date,
                    image: finalImageUrl
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateDailyWord(editingId, dailyWordData), timeout]);
                    setDailyWords(dailyWords.map(dw => dw.id === editingId ? savedItem : dw));
                } else {
                    savedItem = await Promise.race([dbService.addDailyWord(dailyWordData), timeout]);
                    setDailyWords([savedItem, ...dailyWords]);
                }
            } else if (activeTab === 'site' || activeTab === 'intro' || activeTab === 'prayer') {
                let currentConfig = { ...siteConfig };

                // Processing function that handles both files and URLs
                const processField = async (fieldName) => {
                    const localFile = bannerFiles[fieldName];
                    if (localFile) {
                        try {
                            const uploadedUrl = await Promise.race([dbService.uploadFile(localFile, 'banners'), timeout]);
                            currentConfig[fieldName] = uploadedUrl;
                        } catch (err) {
                            console.error(`Error uploading banner ${fieldName}:`, err);
                        }
                    } else {
                        const val = formData[fieldName];
                        if (typeof val === 'string' && val.includes('drive.google.com')) {
                            // If it's already tagged as a video link or the field allows video, format it correctly
                            if (isVideo(val)) {
                                currentConfig[fieldName] = dbService.formatDriveVideo(val);
                            } else {
                                currentConfig[fieldName] = dbService.formatDriveImage(val);
                            }
                        } else {
                            currentConfig[fieldName] = val === undefined ? '' : val;
                        }
                    }
                };

                // Process all banner fields - REMOVED others, only heroImage remains
                // Process ONLY media fields that might need upload or drive formatting
                const mediaFields = [
                    'heroImage', 'aboutBanner', 'newsBanner', 'ministryBanner', 'resourcesBanner',
                    'missionBanner', 'prayerBanner', 'teeBanner', 'teamBanner', 'prayerIntroImage'
                ];
                for (const field of mediaFields) {
                    await processField(field);
                }

                // Directly copy all other setting fields
                const otherFields = [
                    'heroTitle', 'heroSubtitle', 'heroTitleFont', 'heroSubtitleFont', 'heroTitleColor', 'heroSubtitleColor', 'heroTitleItalic', 'heroSubtitleItalic', 'heroTitleSize', 'heroSubtitleSize', 'heroHeight', 'heroOverlayOpacity',
                    'aboutTitle', 'aboutSubtitle', 'aboutTitleFont', 'aboutSubtitleFont', 'aboutTitleColor', 'aboutSubtitleColor', 'aboutTitleItalic', 'aboutSubtitleItalic', 'aboutTitleSize', 'aboutSubtitleSize', 'aboutHeight', 'aboutOverlayOpacity',
                    'newsTitle', 'newsSubtitle', 'newsTitleFont', 'newsSubtitleFont', 'newsTitleColor', 'newsSubtitleColor', 'newsTitleItalic', 'newsSubtitleItalic', 'newsTitleSize', 'newsSubtitleSize', 'newsHeight', 'newsOverlayOpacity',
                    'ministryTitle', 'ministrySubtitle', 'ministryTitleFont', 'ministrySubtitleFont', 'ministryTitleColor', 'ministrySubtitleColor', 'ministryTitleItalic', 'ministrySubtitleItalic', 'ministryTitleSize', 'ministrySubtitleSize', 'ministryHeight', 'ministryOverlayOpacity',
                    'resourcesTitle', 'resourcesSubtitle', 'resourcesTitleFont', 'resourcesSubtitleFont', 'resourcesTitleColor', 'resourcesSubtitleColor', 'resourcesTitleItalic', 'resourcesSubtitleItalic', 'resourcesTitleSize', 'resourcesSubtitleSize', 'resourcesHeight', 'resourcesOverlayOpacity',
                    'ministryItems',
                    'teamMinistryItems',
                    'missionTitle', 'missionSubtitle', 'missionTitleFont', 'missionSubtitleFont', 'missionTitleColor', 'missionSubtitleColor', 'missionTitleItalic', 'missionSubtitleItalic', 'missionTitleWeight', 'missionSubtitleWeight', 'missionTitleSize', 'missionSubtitleSize', 'missionHeight', 'missionOverlayOpacity', 'missionBannerFit',
                    'prayerCommonTopics', 'prayerPastorTopics', 'prayerChurchTopics', 'prayerChurchTopics2026', 'prayerCoreValues', 'prayerGoals', 'prayerHours',
                    'teeTitle', 'teeSubtitle', 'teeTitleFont', 'teeSubtitleFont', 'teeTitleColor', 'teeSubtitleColor', 'teeTitleItalic', 'teeSubtitleItalic', 'teeTitleWeight', 'teeSubtitleWeight', 'teeTitleSize', 'teeSubtitleSize', 'teeHeight', 'teeOverlayOpacity', 'teeBannerFit',
                    'teamTitle', 'teamSubtitle', 'teamTitleFont', 'teamSubtitleFont', 'teamTitleColor', 'teamSubtitleColor', 'teamTitleItalic', 'teamSubtitleItalic', 'teamTitleWeight', 'teamSubtitleWeight', 'teamTitleSize', 'teamSubtitleSize', 'teamHeight', 'teamOverlayOpacity', 'teamBannerFit',
                    'heroBannerFit', 'aboutBannerFit', 'newsBannerFit', 'ministryBannerFit', 'resourcesBannerFit'
                ];
                for (const field of otherFields) {
                    currentConfig[field] = formData[field];
                }

                // Removed redundant redundant assignments - all fields are now in mediaFields or otherFields

                await Promise.race([dbService.updateSiteConfig(currentConfig), timeout]);
                setSiteConfig({ ...currentConfig });
                setBannerFiles({}); // Clear selected files after successful save
                setPastorFile(null); // Clear pastor file after successful save
                alert('모든 배너 및 사이트 설정이 저장되었습니다!');
                setShowAddForm(false);
                setIsLoading(false);
                return;
            } else if (activeTab === 'worship' || activeTab === 'location') {
                await Promise.race([dbService.updateSiteConfig(siteConfig), timeout]);
                alert('✅ 정보가 성공적으로 저장되었습니다!');
                setIsLoading(false);
                return;
            }
            setShowAddForm(false);
            setEditingId(null);
            setFile(null);
            setFile2(null);
            setThumbnailFile(null);
            setStaffFile(null);

            // Perform resets based on active tab
            if (activeTab === 'site') {
                // Done inside the if (activeTab === 'site') block
            } else {
                setFormData({
                    ...formData,
                    title: '', date: '', preacher: '', youtubeId: '', fileUrl: '', fileUrl2: '', category: '공지', content: '', important: false, type: 'image',
                    staffName: '', staffRole: '', staffEmail: '', staffPhotoUrl: '', thumbnailUrl: '',
                    note: '', eventType: 'default',
                    startDate: '', endDate: '', staffEnglishName: ''
                });
            }
            alert('성공적으로 저장되었습니다!');
        } catch (e) {
            console.error(e);
            if (e.message === 'TIMEOUT') {
                alert('연결 시간이 초과되었습니다. 파일 크기가 너무 크거나 파이어베이스 설정을 확인해 주세요.');
            } else if (e.code === 'permission-denied') {
                alert('권한이 거부되었습니다. Firestore 및 Storage 규칙을 확인해 주세요.');
            } else {
                alert('등록 중 오류가 발생했습니다: ' + (e.message || '알 수 없는 오류'));
            }
        }
        setIsLoading(false);
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            if (type === 'sermon') {
                await dbService.deleteSermon(id);
                setSermons(sermons.filter(s => s.id !== id));
            } else if (type === 'bulletin') {
                await dbService.deleteBulletin(id);
                setBulletins(bulletins.filter(b => b.id !== id));
            } else if (type === 'notice') {
                await dbService.deleteNotice(id);
                setNotices(notices.filter(n => n.id !== id));
            } else if (type === 'gallery') {
                await dbService.deleteGalleryItem(id);
                setGallery(gallery.filter(g => g.id !== id));
            } else if (type === 'column') {
                await dbService.deleteColumn(id);
                setColumns(columns.filter(c => c.id !== id));
            } else if (type === 'staff') {
                const newStaffList = staffList.filter(s => s.id !== id);
                await dbService.updateSiteConfig({ ...siteConfig, staff: newStaffList });
                setStaffList(newStaffList);
                setSiteConfig(prev => ({ ...prev, staff: newStaffList }));
            } else if (type === 'calendar') {
                await dbService.deleteCalendarEvent(id);
                setCalendarEvents(calendarEvents.filter(c => c.id !== id));
            }
            alert('삭제되었습니다.');
        } catch (e) {
            alert('파이어베이스 연결 오류로 삭제할 수 없습니다. (JSON 데이터는 직접 파일을 수정해야 합니다)');
        }
    };

    const handleEdit = (item, type) => {
        setEditingId(item.id);
        if (type === 'staff') {
            setFormData({
                ...formData,
                staffName: item.name,
                staffEnglishName: item.englishName || '',
                staffRole: item.role,
                staffEmail: item.email || '',
                // If the image is a processed Drive thumbnail, don't put it in the input (it looks broken as text)
                staffPhotoUrl: (item.image && !item.image.includes('drive.google.com/thumbnail') && !item.image.includes('drive.google.com/uc')) ? item.image : ''
            });
            setStaffFile(null);
        } else if (type === 'bulletin') {
            setFormData({
                ...formData,
                title: item.title,
                date: item.date,
                fileUrl: item.fileUrl || '',
                fileUrl2: item.fileUrl2 || ''
            });
            setFile(null);
            setFile2(null);
        } else if (type === 'gallery') {
            setFormData({
                ...formData,
                title: item.title,
                date: item.date,
                fileUrl: item.url || '',
                thumbnailUrl: item.thumbnailUrl || '',
                type: item.type || 'image'
            });
            setFile(null);
            setThumbnailFile(null);
        } else if (type === 'sermon') {
            setFormData({
                ...formData,
                title: item.title,
                date: item.date,
                preacher: item.preacher || '',
                youtubeId: item.youtubeId || '',
                link: item.link || ''
            });
        } else if (type === 'column') {
            setFormData({
                ...formData,
                title: item.title,
                date: item.date,
                author: item.author || '',
                fileUrl: item.fileUrl || '',
                fileType: item.fileType || 'pdf'
            });
            setFile(null);
        } else if (type === 'notice') {
            setFormData({
                ...formData,
                title: item.title,
                date: item.date,
                category: item.category || '공지',
                content: item.content || '',
                important: item.important || false,
                link: item.link || ''
            });
        } else if (type === 'calendar') {
            setFormData({
                ...formData,
                title: item.title,
                startDate: item.startDate || item.date || '',
                endDate: item.endDate || item.startDate || item.date || '',
                note: item.note || '',
                eventType: item.type || 'default'
            });
        }
        setShowAddForm(true);
    };

    const handleReset = async (type) => {
        const typeMap = {
            sermons: { label: '설교 영상', data: sermonsInitialData, func: dbService.resetSermons },
            bulletins: { label: '주보 파일', data: bulletinsInitialData, func: dbService.resetBulletins },
            notices: { label: '소식/공지', data: noticesInitialData, func: dbService.resetNotices }
        };

        const config = typeMap[type];
        if (!config) return;

        if (!window.confirm(`⚠️ 경고: 모든 ${config.label} 데이터가 삭제되고 초기 상태로 복구됩니다. 계속하시겠습니까?`)) {
            return;
        }

        setIsLoading(true);
        try {
            await config.func(config.data);
            await loadData(); // Refresh UI
            alert(`${config.label} 데이터가 성공적으로 초기화되었습니다.`);
        } catch (e) {
            console.error(e);
            alert('초기화 중 오류가 발생했습니다.');
        }
        setIsLoading(false);
    };

    const renderBannerSettings = (pageKey, label, imageField) => {
        const isHome = pageKey === 'hero';
        return (
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Side: Media Manager */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <BannerManager
                            label={label}
                            value={formData[imageField]}
                            fieldName={imageField}
                            bannerFiles={bannerFiles}
                            setBannerFiles={setBannerFiles}
                            onChange={(val) => setFormData(prev => ({ ...prev, [imageField]: val }))}
                        />
                        {pageKey === 'prayer' && (
                            <div className="max-w-2xl">
                                <BannerManager
                                    label="기도 페이지 소개 이미지"
                                    value={formData.prayerIntroImage}
                                    fieldName="prayerIntroImage"
                                    bannerFiles={bannerFiles}
                                    setBannerFiles={setBannerFiles}
                                    onChange={(val) => setFormData(prev => ({ ...prev, prayerIntroImage: val }))}
                                    aspectRatio="aspect-[4/3]"
                                />
                            </div>
                        )}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 flex justify-between mb-4">
                                <span>배경 어둡기 (Overlay Opacity)</span>
                                <span className="text-primary font-black">{formData[`${pageKey}OverlayOpacity`]}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="90"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                value={formData[`${pageKey}OverlayOpacity`]}
                                onChange={(e) => setFormData({ ...formData, [`${pageKey}OverlayOpacity`]: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 block">배경 높이 (Banner Height)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['short', 'medium', 'large', 'full'].map((h) => (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, [`${pageKey}Height`]: h })}
                                        className={clsx(
                                            "py-2 rounded-xl text-xs font-black transition-all border-2",
                                            formData[`${pageKey}Height`] === h
                                                ? "bg-primary text-white border-primary shadow-lg"
                                                : "bg-white text-gray-400 border-gray-100 hover:border-primary/30"
                                        )}
                                    >
                                        {h.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 block">배경 표시 방법 (Display Mode)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'cover', label: '꽉 채우기 (Cover)' },
                                    { id: 'contain', label: '전체 보기 (Full)' }
                                ].map((fit) => (
                                    <button
                                        key={fit.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, [`${pageKey}BannerFit`]: fit.id })}
                                        className={clsx(
                                            "py-2 rounded-xl text-xs font-black transition-all border-2",
                                            formData[`${pageKey}BannerFit`] === fit.id
                                                ? "bg-primary text-white border-primary shadow-lg"
                                                : "bg-white text-gray-400 border-gray-100 hover:border-primary/30"
                                        )}
                                    >
                                        {fit.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 px-1 mt-1 font-medium italic">
                                * '전체 보기' 선택 시 이미지가 잘리지 않고 전체가 보입니다.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Text & Font Settings */}
                    <div className="w-full md:w-1/2 space-y-6 md:border-l border-gray-100 md:pl-8">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <Type size={18} className="text-primary" />
                            텍스트 및 스타일 설정 ({label.split(' ')[0]} Text)
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-1 block">타이틀 (Title)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold text-lg"
                                    value={formData[`${pageKey}Title`]}
                                    onChange={(e) => setFormData({ ...formData, [`${pageKey}Title`]: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-1 block">서브 타이틀 (Subtitle)</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-medium h-20 resize-none"
                                    value={formData[`${pageKey}Subtitle`]}
                                    onChange={(e) => setFormData({ ...formData, [`${pageKey}Subtitle`]: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-1 block">Title Font</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm appearance-none cursor-pointer"
                                        value={formData[`${pageKey}TitleFont`]}
                                        onChange={(e) => setFormData({ ...formData, [`${pageKey}TitleFont`]: e.target.value })}
                                    >
                                        <option value="font-sans">Basic Sans (고딕체)</option>
                                        <option value="font-nanum-serif">Serif (명조체)</option>
                                        <option value="font-nanum-pen">Script (흘림채)</option>
                                        <option value="font-nanum-brush">Brush (붓글씨)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-1 block">Subtitle Font</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm appearance-none cursor-pointer"
                                        value={formData[`${pageKey}SubtitleFont`]}
                                        onChange={(e) => setFormData({ ...formData, [`${pageKey}SubtitleFont`]: e.target.value })}
                                    >
                                        <option value="font-sans">Basic Sans (고딕체)</option>
                                        <option value="font-nanum-serif">Serif (명조체)</option>
                                        <option value="font-nanum-pen">Script (흘림채)</option>
                                        <option value="font-nanum-brush">Brush (붓글씨)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`${pageKey}TitleItalic`}
                                            className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer"
                                            checked={formData[`${pageKey}TitleItalic`]}
                                            onChange={(e) => setFormData({ ...formData, [`${pageKey}TitleItalic`]: e.target.checked })}
                                        />
                                        <label htmlFor={`${pageKey}TitleItalic`} className="text-xs font-bold text-gray-500 cursor-pointer">Title Italic</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`${pageKey}TitleBold`}
                                            className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer"
                                            checked={formData[`${pageKey}TitleWeight`] === 'font-bold' || formData[`${pageKey}TitleWeight`] === 'font-black'}
                                            onChange={(e) => setFormData({ ...formData, [`${pageKey}TitleWeight`]: e.target.checked ? 'font-bold' : 'font-medium' })}
                                        />
                                        <label htmlFor={`${pageKey}TitleBold`} className="text-xs font-bold text-gray-500 cursor-pointer">Title Bold</label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`${pageKey}SubtitleItalic`}
                                            className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer"
                                            checked={formData[`${pageKey}SubtitleItalic`]}
                                            onChange={(e) => setFormData({ ...formData, [`${pageKey}SubtitleItalic`]: e.target.checked })}
                                        />
                                        <label htmlFor={`${pageKey}SubtitleItalic`} className="text-xs font-bold text-gray-500 cursor-pointer">Subtitle Italic</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`${pageKey}SubtitleBold`}
                                            className="w-4 h-4 rounded border-gray-300 text-primary cursor-pointer"
                                            checked={formData[`${pageKey}SubtitleWeight`] === 'font-bold'}
                                            onChange={(e) => setFormData({ ...formData, [`${pageKey}SubtitleWeight`]: e.target.checked ? 'font-bold' : 'font-medium' })}
                                        />
                                        <label htmlFor={`${pageKey}SubtitleBold`} className="text-xs font-bold text-gray-500 cursor-pointer">Subtitle Bold</label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 flex justify-between mb-2">
                                        <span>Title Size</span>
                                        <span className="text-primary font-black">{formData[`${pageKey}TitleSize`]}px</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="120"
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        value={formData[`${pageKey}TitleSize`]}
                                        onChange={(e) => setFormData({ ...formData, [`${pageKey}TitleSize`]: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 flex justify-between mb-2">
                                        <span>Subtitle Size</span>
                                        <span className="text-primary font-black">{formData[`${pageKey}SubtitleSize`]}px</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="60"
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        value={formData[`${pageKey}SubtitleSize`]}
                                        onChange={(e) => setFormData({ ...formData, [`${pageKey}SubtitleSize`]: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-1 block">Title Color</label>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <input
                                            type="color"
                                            className="w-8 h-8 rounded-full cursor-pointer border-none bg-transparent p-0"
                                            value={formData[`${pageKey}TitleColor`]}
                                            onChange={(e) => setFormData({ ...formData, [`${pageKey}TitleColor`]: e.target.value })}
                                        />
                                        <span className="text-xs font-mono text-gray-500 uppercase">{formData[`${pageKey}TitleColor`]}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-1 block">Subtitle Color</label>
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <input
                                            type="color"
                                            className="w-8 h-8 rounded-full cursor-pointer border-none bg-transparent p-0"
                                            value={formData[`${pageKey}SubtitleColor`]}
                                            onChange={(e) => setFormData({ ...formData, [`${pageKey}SubtitleColor`]: e.target.value })}
                                        />
                                        <span className="text-xs font-mono text-gray-500 uppercase">{formData[`${pageKey}SubtitleColor`]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ResetButton = ({ type, label }) => (
        <button
            onClick={() => handleReset(type)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all border border-red-100"
        >
            <AlertTriangle size={14} />
            {label} 초기화
        </button>
    );

    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <Shield size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">CMS 관리자 로그인</h1>
                        <p className="text-gray-400 mt-2 text-sm italic">"The Church of the Sent"</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">ID</label>
                            <input
                                type="text"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                required
                            />
                            {error && <p className="text-red-500 text-sm mt-3 font-medium text-center">{error}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-6"
                        >
                            시작하기
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-primary-dark text-white p-6 md:p-8 flex flex-col shadow-2xl z-20">
                <div className="flex items-center gap-3 mb-8 md:mb-12 px-2">
                    <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">S</div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight leading-none">Church CMS</span>
                        <span className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-bold font-sans">Administration</span>
                    </div>
                </div>

                <nav className="flex-grow space-y-3">
                    <SidebarItem
                        icon={<Settings size={20} />}
                        label="사이트 설정"
                        active={activeTab === 'site'}
                        onClick={() => { setActiveTab('site'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<BookOpen size={20} />}
                        label="교회소개/목사님"
                        active={activeTab === 'intro'}
                        onClick={() => { setActiveTab('intro'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Play size={20} />}
                        label="설교 영상 관리"
                        active={activeTab === 'sermons'}
                        onClick={() => { setActiveTab('sermons'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<FileText size={20} />}
                        label="신학 칼럼 관리"
                        active={activeTab === 'columns'}
                        onClick={() => { setActiveTab('columns'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Quote size={20} />}
                        label="오늘의 말씀 관리"
                        active={activeTab === 'dailyWord'}
                        onClick={() => { setActiveTab('dailyWord'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<FileText size={20} />}
                        label="주보 파일 관리"
                        active={activeTab === 'bulletins'}
                        onClick={() => { setActiveTab('bulletins'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label="섬기는 분들 관리"
                        active={activeTab === 'staff'}
                        onClick={() => { setActiveTab('staff'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Heart size={20} />}
                        label="중보기도 관리"
                        active={activeTab === 'prayer'}
                        onClick={() => { setActiveTab('prayer'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Calendar size={20} />}
                        label="교회일정 관리"
                        active={activeTab === 'calendar'}
                        onClick={() => { setActiveTab('calendar'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Clock size={20} />}
                        label="예배 정보 관리"
                        active={activeTab === 'worship'}
                        onClick={() => { setActiveTab('worship'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<MapPin size={20} />}
                        label="오시는 길 & 정보"
                        active={activeTab === 'location'}
                        onClick={() => { setActiveTab('location'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<ImageIcon size={20} />}
                        label="갤러리 관리"
                        active={activeTab === 'gallery'}
                        onClick={() => { setActiveTab('gallery'); setShowAddForm(false); }}
                    />

                </nav>

                <div className="mt-auto pt-10 border-t border-white/10">
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-3 text-white/50 hover:text-white transition-all text-sm px-4 py-3 rounded-xl hover:bg-white/5 w-full font-medium"
                    >
                        로그아웃 <X size={16} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-primary">
                            {activeTab === 'sermons' && '🎥 설교 영상 관리'}
                            {activeTab === 'bulletins' && '📄 주보 파일 관리'}
                            {activeTab === 'dailyWord' && '📜 오늘의 말씀 관리'}
                            {activeTab === 'gallery' && '🖼️ 갤러리 관리'}
                            {activeTab === 'columns' && '✍️ 신학 칼럼 관리'}
                            {activeTab === 'site' && '⚙️ 사이트 설정'}
                            {activeTab === 'intro' && '📖 교회소개 관리'}
                            {activeTab === 'staff' && '👥 섬기는 분들 관리'}
                            {activeTab === 'calendar' && '📅 교회일정 관리'}
                            {activeTab === 'location' && '📍 오시는길 관리'}
                        </h1>
                        <p className="flex items-center gap-2 text-sm mt-2 font-medium">
                            {isFirebaseConfigured ? (
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Live Connection Active
                                </span>
                            ) : (
                                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-100">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                                    Offline (JSON Preview)
                                </span>
                            )}
                        </p>
                    </div>
                    {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>}
                    {!showAddForm && activeTab !== 'site' && activeTab !== 'intro' && activeTab !== 'general' && activeTab !== 'worship' && (
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setFormData({
                                    ...formData,
                                    ministryItems: [], // This seems to be the target for dynamic list items
                                    teamMinistryItems: [],
                                    // ...
                                    title: '', date: '', preacher: '', youtubeId: '', fileUrl: '', fileUrl2: '', category: '공지', content: '', important: false, type: 'image',
                                    staffName: '', staffRole: '', staffEmail: '', staffPhotoUrl: '', thumbnailUrl: '',
                                    note: '', eventType: 'default',
                                    startDate: '', endDate: '', staffEnglishName: ''
                                });
                                setStaffFile(null);
                                setFile(null);
                                setFile2(null);
                                setShowAddForm(true);
                            }}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95"
                        >
                            <Plus size={20} /> 새 항목 등록하기
                        </button>
                    )}
                </header>

                {/* Form Section */}
                {showAddForm && activeTab !== 'site' && activeTab !== 'staff' && activeTab !== 'general' && activeTab !== 'worship' && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-10 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                                <Plus size={22} className="text-accent" />
                                {activeTab === 'sermons' ? '새 설교 정보 입력' :
                                    activeTab === 'bulletins' ? '새 주보 정보 입력' :
                                        activeTab === 'gallery' ? '새 갤러리 항목 등록' :
                                            activeTab === 'columns' ? '새 신학 칼럼 등록' :
                                                activeTab === 'staff' ? '새 섬기는 분 등록' :
                                                    activeTab === 'calendar' ? '새 일정 등록' :
                                                        activeTab === 'dailyWord' ? '새 오늘의 말씀 등록' : '정보 수정'}
                            </h2>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-500 ml-1">제목 (Title)</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 select-none outline-none"
                                    placeholder="예: 2026년 1월 25일 주보"
                                    required={activeTab !== 'staff'}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 ml-1 font-medium italic">
                                    {activeTab === 'dailyWord' ? '* 성경 구절 출처 (예: 마태복음 5:13)' : ''}
                                </p>
                            </div>

                            {activeTab === 'calendar' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">시작일 (Start Date)</label>
                                        <input
                                            type="date"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans font-bold"
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">종료일 (End Date)</label>
                                        <input
                                            type="date"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans font-bold"
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            {activeTab !== 'calendar' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">발행일 (Service Date)</label>
                                    <input
                                        type="date"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans font-bold"
                                        required={activeTab !== 'calendar' && activeTab !== 'staff'}
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <p className="text-[10px] text-gray-400 ml-1 font-medium">* 실제 홈페이지에 표시될 날짜입니다. 미리 올리실 경우 해당 주일 날짜를 선택해 주세요.</p>
                                </div>
                            )}

                            {activeTab === 'sermons' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">설교자</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            placeholder="이남규 목사"
                                            value={formData.preacher}
                                            onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">Youtube 영상 링크</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            required
                                            value={formData.youtubeId}
                                            onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">참고 자료/파일 링크 (URL - 선택사항)</label>
                                        <input
                                            type="url"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            placeholder="https://drive.google.com/..."
                                            value={formData.link || ''}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'bulletins' && (
                                <div className="space-y-6 md:col-span-2">
                                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                        <div className="text-blue-500 shrink-0">
                                            <ExternalLink size={24} />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-bold text-blue-900 mb-1">💡 구글 드라이브 주보 등록 팁</p>
                                            <p className="text-blue-800/70 leading-relaxed">
                                                구글 드라이브에 파일을 올리고 <strong>'링크가 있는 모든 사용자'</strong>가 볼 수 있게 공유 설정을 하신 뒤, 아래 링크 칸에 붙여넣어 주세요!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">주보 1면 / 파일 링크 (URL)</label>
                                            <input
                                                type="url"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                                placeholder="https://drive.google.com/..."
                                                value={formData.fileUrl}
                                                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">주보 2면 / 파일 링크 (선택사항)</label>
                                            <input
                                                type="url"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                                placeholder="https://drive.google.com/..."
                                                value={formData.fileUrl2}
                                                onChange={(e) => setFormData({ ...formData, fileUrl2: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="relative flex items-center gap-4 py-2">
                                        <div className="flex-grow border-t border-gray-100"></div>
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">혹은 파일 직접 업로드</span>
                                        <div className="flex-grow border-t border-gray-100"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            <div className={clsx(
                                                "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all text-center",
                                                file ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50 group-hover:border-primary/30"
                                            )}>
                                                {file ? (
                                                    <div className="flex items-center gap-2">
                                                        <Check size={16} className="text-emerald-600" />
                                                        <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[120px]">{file.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-400">1면 파일 선택</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setFile2(e.target.files[0])}
                                            />
                                            <div className={clsx(
                                                "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all text-center",
                                                file2 ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50 group-hover:border-primary/30"
                                            )}>
                                                {file2 ? (
                                                    <div className="flex items-center gap-2">
                                                        <Check size={16} className="text-emerald-600" />
                                                        <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[120px]">{file2.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-400">2면 파일 선택</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {activeTab === 'gallery' && (
                                <div className="space-y-6 md:col-span-2">
                                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                                        <div className="text-blue-500 shrink-0">
                                            <ImageIcon size={24} />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-bold text-blue-900 mb-1">💡 갤러리 활용 팁</p>
                                            <p className="text-blue-800/70 leading-relaxed text-xs">
                                                • <strong>사진</strong>: '사진 파일 선택' 버튼으로 직접 올리거나 이미지 주소를 넣으세요.<br />
                                                • <strong>영상</strong>: 유튜브 주소를 '이미지 또는 영상 링크' 칸에 붙여넣으세요.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">이미지 또는 영상 링크 (URL)</label>
                                            <input
                                                type="url"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                                placeholder="https://..."
                                                value={formData.fileUrl}
                                                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">콘텐츠 종류</label>
                                            <select
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="image">사진 (Image)</option>
                                                <option value="video">영상 (Video)</option>
                                                <option value="audio">음악 (Music)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">미리보기(썸네일) 사진 링크 (URL)</label>
                                                <input
                                                    type="url"
                                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                                    placeholder="https://drive.google.com/..."
                                                    value={formData.thumbnailUrl || ''}
                                                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2 opacity-80">
                                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                                    {formData.type === 'audio' ? '음악 파일 직접 업로드' : '메인 파일 직접 업로드 (사진인 경우)'}
                                                </label>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept={formData.type === 'audio' ? 'audio/*' : (formData.type === 'video' ? 'video/*' : 'image/*')}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        onChange={(e) => setFile(e.target.files[0])}
                                                    />
                                                    <div className={clsx(
                                                        "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all",
                                                        file ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50 group-hover:border-primary/30"
                                                    )}>
                                                        {file ? (
                                                            <div className="flex flex-col items-center">
                                                                <Check size={16} className="text-emerald-600 mb-1" />
                                                                <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[150px]">{file.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1 text-center">
                                                                <Upload size={20} className="text-gray-400" />
                                                                <span className="text-[10px] font-bold text-gray-400">
                                                                    {formData.type === 'audio' ? '음악 파일 선택' : (formData.type === 'video' ? '영상 파일 선택' : '사진 파일 선택')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-accent uppercase ml-1">미리보기(썸네일) 사진 업로드 (추천)</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                                                />
                                                <div className={clsx(
                                                    "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all bg-accent/5",
                                                    thumbnailFile ? "border-emerald-200 bg-emerald-50" : "border-accent/20 group-hover:border-accent/40"
                                                )}>
                                                    {thumbnailFile ? (
                                                        <div className="flex flex-col items-center">
                                                            <Check size={16} className="text-emerald-600 mb-1" />
                                                            <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[150px]">{thumbnailFile.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1 text-center">
                                                            <ImageIcon size={20} className="text-accent/60" />
                                                            <span className="text-[10px] font-bold text-accent/60">고화질 미리보기 사진 선택</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'columns' && (
                                <div className="space-y-6 md:col-span-2">
                                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex gap-4">
                                        <div className="text-emerald-500 shrink-0">
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-bold text-emerald-900 mb-1">💡 신학 칼럼 등록 안내</p>
                                            <p className="text-emerald-800/70 leading-relaxed text-xs">
                                                칼럼의 종류(문서, 사진, 영상)를 선택하고 링크를 입력하거나 파일을 직접 업로드해 주세요. <br />
                                                <strong>영상</strong>인 경우 유튜브 링크를, <strong>사진</strong>이나 <strong>문서</strong>는 구글 드라이브 링크를 추천합니다.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">칼럼 종류 (Content Type)</label>
                                            <select
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
                                                value={formData.fileType}
                                                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                                            >
                                                <option value="pdf">문서 (PDF/Doc)</option>
                                                <option value="image">사진 (Image)</option>
                                                <option value="video">영상 (Video/YouTube)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">작성자 (Author)</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                                placeholder="이남규 목사"
                                                value={formData.author}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">파일 또는 영상 주소 (URL)</label>
                                        <input
                                            type="url"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                            placeholder={formData.fileType === 'video' ? "https://www.youtube.com/watch?v=..." : "https://drive.google.com/..."}
                                            value={formData.fileUrl}
                                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                        />
                                    </div>

                                    {formData.fileType !== 'video' && (
                                        <div className="space-y-2 opacity-80">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">또는 파일 직접 업로드</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept={formData.fileType === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                />
                                                <div className={clsx(
                                                    "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all",
                                                    file ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50 group-hover:border-primary/30"
                                                )}>
                                                    {file ? (
                                                        <div className="flex items-center gap-2">
                                                            <Check size={16} className="text-emerald-600" />
                                                            <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[200px]">{file.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Upload size={20} className="text-gray-400" />
                                                            <span className="text-[10px] font-bold text-gray-400">파일 선택</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'dailyWord' && (
                                <div className="space-y-6 md:col-span-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">오늘의 말씀 내용 (Content)</label>
                                        <textarea
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none h-32 resize-none"
                                            placeholder="오늘의 성경 구절이나 묵상 내용을 입력하세요."
                                            required
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-500 ml-1">배경 이미지 링크 (URL)</label>
                                            <input
                                                type="url"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                                placeholder="https://..."
                                                value={formData.fileUrl}
                                                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 opacity-80">
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">이미지 직접 업로드</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                />
                                                <div className={clsx(
                                                    "w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all",
                                                    file ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50 group-hover:border-primary/30"
                                                )}>
                                                    {file ? (
                                                        <div className="flex items-center gap-2">
                                                            <Check size={16} className="text-emerald-600" />
                                                            <span className="text-[10px] font-bold text-emerald-700 truncate max-w-[200px]">{file.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Upload size={20} className="text-gray-400" />
                                                            <span className="text-[10px] font-bold text-gray-400">사진 선택</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-2 pt-4 flex gap-4">
                                <button type="submit" className="flex-grow bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all">
                                    확인하고 등록하기
                                </button>
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                )
                }

                {/* Staff Form */}
                {
                    showAddForm && activeTab === 'staff' && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-10 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-700">
                                    <Plus size={22} className="text-accent" /> {editingId ? '섬기는 분 정보 수정' : '새 섬기는 분 등록'}
                                </h2>
                                <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">이름 (Name)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                        value={formData.staffName}
                                        onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">영문 이름 (English Name)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                        placeholder="예: LEE NAMGYU"
                                        value={formData.staffEnglishName}
                                        onChange={(e) => setFormData({ ...formData, staffEnglishName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">직분/역할 (Role)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                        placeholder="예: 담임목사, 교육전도사"
                                        value={formData.staffRole}
                                        onChange={(e) => setFormData({ ...formData, staffRole: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">이메일 (Email)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                        value={formData.staffEmail}
                                        onChange={(e) => setFormData({ ...formData, staffEmail: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">사진 주소 (URL - 구글링크 등)</label>
                                        <input
                                            type="text"
                                            id="drive-input-staffPhotoUrl"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                            placeholder="https://drive.google.com/..."
                                            value={formData.staffPhotoUrl || ''}
                                            onChange={(e) => setFormData({ ...formData, staffPhotoUrl: e.target.value })}
                                        />
                                        <p className="text-[10px] text-blue-500 font-bold mt-1 ml-2">* 파일 업로드가 안 될 경우, 여기에 구글 드라이브 링크를 넣으세요.</p>
                                    </div>
                                    <div className="flex gap-2 px-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const inputElement = document.getElementById('drive-input-staffPhotoUrl');
                                                const input = inputElement?.value;
                                                if (input && input.includes('drive.google.com')) {
                                                    const formatted = dbService.formatDriveImage(input);
                                                    setFormData({ ...formData, staffPhotoUrl: formatted });
                                                    alert('✅ 드라이브 이미지가 변환되었습니다!');
                                                } else {
                                                    alert('구글 드라이브 링크를 먼저 입력해주세요.');
                                                }
                                            }}
                                            className="flex-grow py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5"
                                        >
                                            🖼️ 이미지로 변환
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">본인 사진 직접 업로드 (프로필)</label>
                                    <div className="space-y-4">
                                        <p className="font-bold text-sm text-gray-700">관리자 사진 업로드</p>

                                        {/* Standard Native Input for maximum reliability */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-emerald-50 file:text-emerald-700
                                                hover:file:bg-emerald-100
                                            "
                                            onChange={(e) => {
                                                // File selected
                                                if (e.target.files && e.target.files[0]) {
                                                    setStaffFile(e.target.files[0]);
                                                }
                                            }}
                                        />

                                        {staffFile && (
                                            <button
                                                type="button"
                                                onClick={() => setStaffFile(null)}
                                                className="text-xs text-red-500 underline font-bold"
                                            >
                                                [선택 취소] (링크로 올리려면 취소를 눌러주세요)
                                            </button>
                                        )}

                                        {/* Preview Area */}
                                        <div className="flex justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            {staffFile ? (
                                                <div className="text-center">
                                                    <img
                                                        src={URL.createObjectURL(staffFile)}
                                                        alt="New File"
                                                        className="w-32 h-32 rounded-full object-cover mx-auto mb-2 border-4 border-emerald-200"
                                                    />
                                                    <p className="text-xs text-emerald-600 font-bold">새로운 사진 선택됨</p>
                                                </div>
                                            ) : formData.staffPhotoUrl ? (
                                                <div className="text-center">
                                                    <img
                                                        src={formData.staffPhotoUrl}
                                                        alt="Current"
                                                        className="w-32 h-32 rounded-full object-cover mx-auto mb-2 border-4 border-gray-200"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                    <p className="text-xs text-gray-500">현재 등록된 사진</p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">사진이 선택되지 않았습니다.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={(e) => handleStaffSubmit(e)}
                                        disabled={isLoading}
                                        className="flex-grow bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isLoading ? '저장 중...' : (editingId ? '수정 완료' : '등록하기')}
                                    </button>
                                    <button type="button" onClick={() => { setShowAddForm(false); setEditingId(null); }} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Prayer Management Section */}
                {
                    activeTab === 'prayer' && (
                        <section className="space-y-12 animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-primary">중보기도 관리</h2>
                                    <p className="text-gray-500 mt-2 font-medium">중보기도 페이지의 상단 이미지와 기도 제목을 관리합니다.</p>
                                </div>
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                                >
                                    {isLoading ? <span className="animate-pulse">저장 중...</span> : <><Check size={20} /> 설정 저장하기</>}
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Intro Photo Banner Section */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary"><ImageIcon size={20} /></div>
                                        소개 사진 배너 (Intro Photo Banner)
                                    </h3>
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="max-w-2xl">
                                            <BannerManager
                                                label="소개 섹션 하단 이미지 배너"
                                                value={formData.prayerIntroImage}
                                                fieldName="prayerIntroImage"
                                                bannerFiles={bannerFiles}
                                                setBannerFiles={setBannerFiles}
                                                onChange={(val) => setFormData(prev => ({ ...prev, prayerIntroImage: val }))}
                                                aspectRatio="aspect-video"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-4 ml-1">
                                            * 중보기도 소개 문구 바로 아래에 표시되는 가로형 배너 이미지입니다.
                                        </p>
                                    </div>
                                </div>

                                {/* Prayer Topics Section */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <div className="p-2 bg-accent/10 rounded-xl text-accent"><Heart size={20} /></div>
                                        보내심을 받은 생명의소리 교회 기도 제목
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">2026년 교회 기도제목 (2026 Church Prayer Topics)</label>
                                            <textarea
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent/10 outline-none font-medium h-48 resize-none leading-relaxed"
                                                placeholder="예: 1. 2026년 표어...&#13;&#10;2. 비전..."
                                                value={formData.prayerChurchTopics2026}
                                                onChange={(e) => setFormData({ ...formData, prayerChurchTopics2026: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">사역의 핵심 가치 (Core Values)</label>
                                            <textarea
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent/10 outline-none font-medium h-32 resize-none leading-relaxed"
                                                placeholder="예: 하나님과의 친밀함, 정결한 삶..."
                                                value={formData.prayerCoreValues}
                                                onChange={(e) => setFormData({ ...formData, prayerCoreValues: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">중보기도부 목표 (Goals)</label>
                                            <textarea
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent/10 outline-none font-medium h-32 resize-none leading-relaxed"
                                                placeholder="예: 기도의 용사를 양성하고..."
                                                value={formData.prayerGoals}
                                                onChange={(e) => setFormData({ ...formData, prayerGoals: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">운영시간 (Operating Hours)</label>
                                            <textarea
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent/10 outline-none font-medium h-32 resize-none leading-relaxed"
                                                placeholder="예: 매주 수요일 오후 7시..."
                                                value={formData.prayerHours}
                                                onChange={(e) => setFormData({ ...formData, prayerHours: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">이번주 우리교회 기도내용 (Weekly Church Prayer)</label>
                                            <textarea
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent/10 outline-none font-medium h-96 resize-none leading-relaxed"
                                                placeholder="예: 1. 나라와 민족을 위해...&#13;&#10;2. 교회의 부흥을 위해..."
                                                value={formData.prayerCommonTopics}
                                                onChange={(e) => setFormData({ ...formData, prayerCommonTopics: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-400 ml-1">
                                                * 여러 줄로 입력하면 자동으로 목록으로 변환되어 표시됩니다.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }

                {/* Worship Management Section */}
                {
                    activeTab === 'worship' && (
                        <section className="space-y-12 animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-primary">예배 정보 관리</h2>
                                    <p className="text-gray-500 mt-2 font-medium">홈페이지의 '예배안내' 페이지에 표시되는 정보를 관리합니다.</p>
                                </div>
                                <button
                                    onClick={handleFormSubmit}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                                >
                                    {isLoading ? <span className="animate-pulse">저장 중...</span> : <><Check size={20} /> 설정 저장하기</>}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-8">
                                {/* Sunday Services */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary"><Clock size={20} /></div>
                                        주일예배 (Sunday Services)
                                    </h3>
                                    <div className="space-y-6">
                                        {(siteConfig.services || churchData.services).map((service, index) => (
                                            <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('이 예배 정보를 삭제하시겠습니까?')) {
                                                            const newServices = (siteConfig.services || churchData.services).filter((_, i) => i !== index);
                                                            setSiteConfig({ ...siteConfig, services: newServices });
                                                        }
                                                    }}
                                                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                    title="예배 삭제"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-gray-600 ml-1">예배 명칭</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-medium"
                                                            value={service.name}
                                                            onChange={(e) => {
                                                                const newServices = [...(siteConfig.services || churchData.services)];
                                                                newServices[index] = { ...service, name: e.target.value };
                                                                setSiteConfig({ ...siteConfig, services: newServices });
                                                            }}
                                                            placeholder="예: 1부 주일예배"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-gray-600 ml-1">예배 시간</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-medium"
                                                            value={service.time}
                                                            onChange={(e) => {
                                                                const newServices = [...(siteConfig.services || churchData.services)];
                                                                newServices[index] = { ...service, time: e.target.value };
                                                                setSiteConfig({ ...siteConfig, services: newServices });
                                                            }}
                                                            placeholder="예: 11:00 AM"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-600 ml-1">설명 / 비고 (Description)</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none font-medium text-sm"
                                                        value={service.description || ''}
                                                        onChange={(e) => {
                                                            const newServices = [...(siteConfig.services || churchData.services)];
                                                            newServices[index] = { ...service, description: e.target.value };
                                                            setSiteConfig({ ...siteConfig, services: newServices });
                                                        }}
                                                        placeholder="예: 본당 / 한국어 예배"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newServices = [
                                                    ...(siteConfig.services || churchData.services),
                                                    { name: "새 예배", time: "11:00 AM", description: "" }
                                                ];
                                                setSiteConfig({ ...siteConfig, services: newServices });
                                            }}
                                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} />
                                            새로운 주일 예배 추가하기
                                        </button>
                                    </div>
                                </div>

                                {/* Dawn Prayer / Special Services */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <div className="p-2 bg-accent/10 rounded-xl text-accent"><Video size={20} /></div>
                                        새벽 기도회 / 온라인 모임 (Dawn & Special)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">새벽기도 일정</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/10 outline-none font-medium"
                                                value={siteConfig.specialServices?.dawn?.schedule || ''}
                                                placeholder="예: 매달 첫째 둘째주 6:00 AM"
                                                onChange={(e) => setSiteConfig({
                                                    ...siteConfig,
                                                    specialServices: {
                                                        ...siteConfig.specialServices,
                                                        dawn: { ...(siteConfig.specialServices?.dawn || {}), schedule: e.target.value }
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600 ml-1">Zoom 링크 / ID</label>
                                            <input
                                                type="text"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/10 outline-none font-medium"
                                                value={siteConfig.specialServices?.dawn?.link || ''}
                                                placeholder="예: 777 011 0112"
                                                onChange={(e) => setSiteConfig({
                                                    ...siteConfig,
                                                    specialServices: {
                                                        ...siteConfig.specialServices,
                                                        dawn: { ...(siteConfig.specialServices?.dawn || {}), link: e.target.value }
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Other Meetings */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-xl text-green-600"><Users size={20} /></div>
                                        기타 모임 (Other Meetings)
                                    </h3>
                                    <div className="space-y-4">
                                        {(siteConfig.otherMeetings || churchData.other_meetings).map((meeting, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                                                    <input
                                                        type="text"
                                                        placeholder="모임 명칭"
                                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium"
                                                        value={meeting.name}
                                                        onChange={(e) => {
                                                            const newMeetings = [...(siteConfig.otherMeetings || churchData.other_meetings)];
                                                            newMeetings[index] = { ...meeting, name: e.target.value };
                                                            setSiteConfig({ ...siteConfig, otherMeetings: newMeetings });
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="시간"
                                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium"
                                                        value={meeting.time}
                                                        onChange={(e) => {
                                                            const newMeetings = [...(siteConfig.otherMeetings || churchData.other_meetings)];
                                                            newMeetings[index] = { ...meeting, time: e.target.value };
                                                            setSiteConfig({ ...siteConfig, otherMeetings: newMeetings });
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="장소"
                                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-medium"
                                                        value={meeting.location}
                                                        onChange={(e) => {
                                                            const newMeetings = [...(siteConfig.otherMeetings || churchData.other_meetings)];
                                                            newMeetings[index] = { ...meeting, location: e.target.value };
                                                            setSiteConfig({ ...siteConfig, otherMeetings: newMeetings });
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm('이 모임 정보를 삭제하시겠습니까?')) {
                                                            const newMeetings = (siteConfig.otherMeetings || churchData.other_meetings)
                                                                .filter((_, i) => i !== index);
                                                            setSiteConfig({ ...siteConfig, otherMeetings: newMeetings });
                                                        }
                                                    }}
                                                    className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                                    title="모임 삭제"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newMeetings = [
                                                    ...(siteConfig.otherMeetings || churchData.other_meetings),
                                                    { name: "", time: "", location: "" } // New empty meeting
                                                ];
                                                setSiteConfig({ ...siteConfig, otherMeetings: newMeetings });
                                            }}
                                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} />
                                            새로운 기타 모임 추가하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }
                {/* Location Section */}
                {
                    activeTab === 'location' && (
                        <div className="animate-fade-in-up space-y-6 max-w-4xl">
                            {/* Site Identity Section (Logo/Name) */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <Settings size={20} className="text-primary" /> 기본 사이트 정보 (교회 이름 & 로고)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">교회 이름 (Korean Name)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            value={siteConfig.general?.name || churchData.general.name}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                general: { ...(siteConfig.general || {}), name: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">영문 이름 (English Name)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            value={siteConfig.general?.englishName || churchData.general.englishName}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                general: { ...(siteConfig.general || {}), englishName: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-500 ml-1">교회 로고 (Logo URL)</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-2 shrink-0">
                                            <img src={siteConfig.general?.logo || churchData.general.logo} alt="Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <input
                                            type="text"
                                            className="flex-grow p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans text-xs"
                                            value={siteConfig.general?.logo || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                general: { ...(siteConfig.general || {}), logo: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location & Map Section */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <MapPin size={20} className="text-primary" /> 오시는 길 및 연락처 설정
                                </h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 ml-1">교회 주소 (Address)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/10 outline-none font-medium"
                                            placeholder="예: 9025 Glover Road, Fort Langley"
                                            value={siteConfig.location?.address || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                location: { ...siteConfig.location, address: e.target.value }
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-gray-600 ml-1">대표 연락처 (Phone)</label>
                                            <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full animate-pulse">
                                                번호 두 개면 / 로 구분해 주세요
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/10 outline-none font-medium"
                                            placeholder="예: (604) 123-4567 / (604) 987-6543"
                                            value={siteConfig.location?.phone || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                location: { ...siteConfig.location, phone: e.target.value }
                                            })}
                                        />
                                        <p className="text-[10px] text-gray-400 ml-2">여러 개인 경우 쉼표(,)로 구분해 주세요.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleFormSubmit}
                                        id="save-location-btn"
                                        className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2"
                                    >
                                        <Check size={18} />
                                        {isLoading ? '저장 중...' : '정보 저장하기'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {/* Site Settings Section */}
                {
                    activeTab === 'site' && (
                        <div className="animate-fade-in-up space-y-10 pb-20">
                            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 shrink-0">
                                    <ExternalLink size={32} />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h2 className="font-black text-blue-900 text-xl mb-1 flex items-center justify-center md:justify-start gap-2">🔗 무료 고화질 배경 관리 (Direct Link Mode)</h2>
                                    <p className="text-blue-800/70 leading-relaxed text-sm font-medium">
                                        구글 드라이브나 유튜브 링크를 사용하여 추가 비용 없이 홈페이지를 멋지게 꾸밀 수 있습니다. <br />
                                        모든 배경은 링크를 넣고 아래 **'전체 설정 저장하기'**를 눌러야 최종 반영됩니다.
                                    </p>
                                </div>
                                <div className="shrink-0 flex gap-2">
                                    <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200 uppercase">Always Free</div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {renderBannerSettings('hero', '🏠 메인 홈 히어로 (Home Hero)', 'heroImage')}
                                {renderBannerSettings('news', '📢 교회소식 (News)', 'newsBanner')}
                                {renderBannerSettings('resources', '⛪ 설교와 말씀 (Sermons)', 'resourcesBanner')}
                                {renderBannerSettings('ministry', '🎓 교육 (Education)', 'ministryBanner')}
                                {renderBannerSettings('tee', '📖 TEE 교육 (TEE)', 'teeBanner')}
                                {renderBannerSettings('mission', '🌏 선교사역 (Mission)', 'missionBanner')}
                                {renderBannerSettings('team', '👥 팀사역 (Team Ministry)', 'teamBanner')}
                                {renderBannerSettings('prayer', '🙏 중보기도 (Intercessory Prayer)', 'prayerBanner')}

                                {/* Individual Ministry Management */}
                                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
                                    <h3 className="text-xl font-black text-primary flex items-center gap-3">
                                        <Users size={24} className="text-accent" />
                                        사역 리스트 관리 (Ministry List)
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">
                                        홈페이지의 [사역내용] 메뉴에 표시될 사역들을 관리합니다. (예: 주일학교, 선교사역 등)
                                    </p>

                                    <div className="space-y-8">
                                        {formData.ministryItems.map((item, idx) => (
                                            <div key={item.id || idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-6 relative group">
                                                <div className="absolute top-6 right-6 z-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (window.confirm(`'${item.name}' 사역을 정말 삭제하시겠습니까?`)) {
                                                                const newItems = formData.ministryItems.filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, ministryItems: newItems });
                                                            }
                                                        }}
                                                        className="p-2 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shadow-sm"
                                                        title="삭제"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">사역 이름 (Name)</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold text-gray-700"
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const newItems = [...formData.ministryItems];
                                                                newItems[idx] = { ...newItems[idx], name: e.target.value };
                                                                setFormData({ ...formData, ministryItems: newItems });
                                                            }}
                                                            placeholder="예: The Sent Children"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">아이디 (ID - 영문 소문자)</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-medium font-sans"
                                                            value={item.id}
                                                            onChange={(e) => {
                                                                const newItems = [...formData.ministryItems];
                                                                newItems[idx] = { ...newItems[idx], id: e.target.value };
                                                                setFormData({ ...formData, ministryItems: newItems });
                                                            }}
                                                            placeholder="예: tsc"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">대상 (Target Audience)</label>
                                                        <input
                                                            type="text"
                                                            className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                                                            value={item.target || ''}
                                                            onChange={(e) => {
                                                                const newItems = [...formData.ministryItems];
                                                                newItems[idx] = { ...newItems[idx], target: e.target.value };
                                                                setFormData({ ...formData, ministryItems: newItems });
                                                            }}
                                                            placeholder="예: 영유아 및 초등부"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">요약 설명 (Short Description)</label>
                                                    <textarea
                                                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none text-sm min-h-[80px]"
                                                        value={item.description}
                                                        onChange={(e) => {
                                                            const newItems = [...formData.ministryItems];
                                                            newItems[idx] = { ...newItems[idx], description: e.target.value };
                                                            setFormData({ ...formData, ministryItems: newItems });
                                                        }}
                                                        placeholder="리스트에 표시될 간단한 설명입니다."
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">상세 내용 (Detail Content)</label>
                                                    <textarea
                                                        className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none text-sm min-h-[150px]"
                                                        placeholder="줄바꿈으로 구분해 주세요. 상세 페이지에 표시됩니다."
                                                        value={item.detail || ''}
                                                        onChange={(e) => {
                                                            const newItems = [...formData.ministryItems];
                                                            newItems[idx] = { ...newItems[idx], detail: e.target.value };
                                                            setFormData({ ...formData, ministryItems: newItems });
                                                            setFormData({ ...formData, ministryItems: newItems });
                                                        }}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">대표 이미지 (Image URL)</label>
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            type="text"
                                                            id={`ministry-img-${idx}`}
                                                            className="flex-grow p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none text-xs font-sans"
                                                            value={item.image}
                                                            onChange={(e) => {
                                                                const newItems = [...formData.ministryItems];
                                                                newItems[idx] = { ...newItems[idx], image: e.target.value };
                                                                setFormData({ ...formData, ministryItems: newItems });
                                                            }}
                                                            placeholder="이미지 주소 또는 구글 드라이브 링크"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const input = item.image;
                                                                    if (input && input.includes('drive.google.com')) {
                                                                        const formatted = dbService.formatDriveImage(input);
                                                                        const newItems = [...formData.ministryItems];
                                                                        newItems[idx] = { ...newItems[idx], image: formatted };
                                                                        setFormData({ ...formData, ministryItems: newItems });
                                                                        alert('✅ 드라이브 이미지가 변환되었습니다!');
                                                                    } else {
                                                                        alert('구글 드라이브 링크를 입력해주세요.');
                                                                    }
                                                                }}
                                                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5"
                                                            >
                                                                🖼️ 변환
                                                            </button>
                                                            <div className="relative overflow-hidden">
                                                                <button
                                                                    type="button"
                                                                    className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-xl text-[10px] font-black transition-all flex items-center gap-1.5"
                                                                >
                                                                    <Upload size={14} /> 업로드
                                                                </button>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            if (window.confirm(`${file.name} 파일을 업로드하시겠습니까?`)) {
                                                                                try {
                                                                                    const downloadUrl = await dbService.uploadFile(file, `ministry/${item.id || 'temp'}_${Date.now()}`);
                                                                                    const newItems = [...formData.ministryItems];
                                                                                    newItems[idx] = { ...newItems[idx], image: downloadUrl };
                                                                                    setFormData({ ...formData, ministryItems: newItems });
                                                                                    alert('✅ 업로드가 완료되었습니다!');
                                                                                } catch (err) {
                                                                                    console.error("Upload failed", err);
                                                                                    alert('업로드 실패: ' + err.message);
                                                                                }
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {item.image && (
                                                            <div className="mt-2 w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 relative group">
                                                                <img
                                                                    src={item.image}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                    referrerPolicy="no-referrer"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                                        e.target.parentElement.innerText = '이미지를 불러올 수 없음';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    ministryItems: [
                                                        ...formData.ministryItems,
                                                        {
                                                            id: "new_ministry",
                                                            name: "새 사역",
                                                            target: "",
                                                            description: "",
                                                            detail: "",
                                                            image: ""
                                                        }
                                                    ]
                                                });
                                            }}
                                            className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={24} />
                                            새 사역 추가하기
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Reset to Defaults Section */}
                            <div className="bg-red-50/30 rounded-[2rem] p-8 border border-red-100/50 mt-12 mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-red-600">데이터 초기화 (Danger Zone)</h3>
                                        <p className="text-red-400 text-sm font-medium">실행 시 현재 라이브 데이터가 삭제되고 코드 내의 초기 데이터로 대체됩니다.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ResetButton type="sermons" label="설교 영상" />
                                    <ResetButton type="bulletins" label="주보 파일" />

                                </div>
                            </div>

                            <div className="flex justify-center md:justify-end sticky bottom-8 z-30">
                                <button
                                    type="button"
                                    onClick={handleFormSubmit}
                                    disabled={isLoading}
                                    className="px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 disabled:opacity-50 flex items-center gap-4 hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                            저장 중...
                                        </>
                                    ) : (
                                        <>
                                            전체 설정 저장하기
                                            <Check size={28} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                }


                {
                    activeTab === 'intro' && (
                        <div className="space-y-6 md:col-span-2">
                            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 flex gap-4">
                                <div className="text-amber-500 shrink-0">
                                    <BookOpen size={24} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-amber-900 mb-1">💡 교회소개 / 목사님 페이지 관리</p>
                                    <p className="text-amber-800/70 leading-relaxed text-xs">
                                        이곳에서 교회소개 페이지의 상단 배너와 제목, 그리고 담임목사님 소개를 수정할 수 있습니다.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6 border-b border-gray-100 pb-8 mb-8">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <LayoutDashboard size={20} className="text-primary" /> 페이지 상단 설정
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">상단 배너 이미지</label>
                                        <BannerManager
                                            label="교회소개 배너"
                                            value={siteConfig.aboutBanner}
                                            fieldName="aboutBanner"
                                            onChange={(val) => setSiteConfig({ ...siteConfig, aboutBanner: val })}
                                            bannerFiles={bannerFiles}
                                            setBannerFiles={setBannerFiles}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">페이지 제목 (비워두면 숨김)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            placeholder="기본값: 교회 소개"
                                            value={siteConfig.aboutTitle ?? ''}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, aboutTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 ml-1">부제목 / 성구 (비워두면 숨김)</label>
                                        <input
                                            type="text"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                            placeholder="기본값: 사도행전 16장 31절..."
                                            value={siteConfig.aboutSubtitle ?? ''}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, aboutSubtitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">목사님 성함</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                        value={siteConfig.pastor?.name || ''}
                                        onChange={(e) => setSiteConfig({
                                            ...siteConfig,
                                            pastor: { ...siteConfig.pastor, name: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">직분/역할 (예: 담임목사)</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none"
                                        value={siteConfig.pastor?.role || ''}
                                        onChange={(e) => setSiteConfig({
                                            ...siteConfig,
                                            pastor: { ...siteConfig.pastor, role: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">인사말 내용</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none h-48"
                                        value={siteConfig.pastor?.greeting || ''}
                                        onChange={(e) => setSiteConfig({
                                            ...siteConfig,
                                            pastor: { ...siteConfig.pastor, greeting: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">약력 (Biography) - 줄바꿈으로 구분</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none h-32"
                                        placeholder="서울신학대학교 졸업&#13;&#10;기둥교회 부목사"
                                        value={Array.isArray(siteConfig.pastor?.history)
                                            ? siteConfig.pastor.history.join('\n')
                                            : (siteConfig.pastor?.history || '')}
                                        onChange={(e) => setSiteConfig({
                                            ...siteConfig,
                                            pastor: {
                                                ...siteConfig.pastor,
                                                history: e.target.value.split('\n').filter(line => line.trim() !== '')
                                            }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-500 ml-1">목사님 사진 링크 (Drive URL)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            id="drive-input-pastor-image"
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-sans"
                                            placeholder="https://drive.google.com/..."
                                            defaultValue={siteConfig.pastor?.image || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                pastor: { ...siteConfig.pastor, image: e.target.value }
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const inputElement = document.getElementById('drive-input-pastor-image');
                                                const input = inputElement?.value;
                                                if (input && input.includes('drive.google.com')) {
                                                    const formatted = dbService.formatDriveImage(input);
                                                    setSiteConfig({
                                                        ...siteConfig,
                                                        pastor: { ...siteConfig.pastor, image: formatted }
                                                    });
                                                    inputElement.value = formatted;
                                                    alert('✅ 이미지로 변환되었습니다!');
                                                }
                                            }}
                                            className="px-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors shrink-0 text-sm"
                                        >
                                            이미지 변환
                                        </button>
                                    </div>
                                    {siteConfig.pastor?.image && (
                                        <div className="mt-4 w-48 h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-lg mx-auto md:mx-0">
                                            <img src={siteConfig.pastor.image} alt="Pastor Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={async () => {
                                        const btn = document.getElementById('save-pastor-btn');
                                        btn.innerText = '저장 중...';
                                        try {
                                            const currentConfig = { ...siteConfig };
                                            currentConfig['ministryItems'] = formData.ministryItems;
                                            currentConfig['teamMinistryItems'] = formData.teamMinistryItems;

                                            await dbService.updateSiteConfig(currentConfig);
                                            alert('✅ 저장되었습니다.');
                                        } catch (e) {
                                            alert('저장 실패: ' + e.message);
                                        }
                                        btn.innerText = '설정 저장하기';
                                    }}
                                    id="save-pastor-btn"
                                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all"
                                >
                                    설정 저장하기
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Dashboard Card */}
                {
                    (activeTab === 'sermons' || activeTab === 'bulletins' || activeTab === 'gallery' || activeTab === 'columns') && (
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                                <h2 className="font-black text-primary text-xl flex items-center gap-3">
                                    <LayoutDashboard size={22} className="text-accent" />
                                    {activeTab.toUpperCase()} DATABASE
                                    <span className="text-sm font-bold text-gray-300 ml-2">
                                        {activeTab === 'sermons' ? sermons.length :
                                            activeTab === 'bulletins' ? bulletins.length :
                                                gallery.length} Items
                                    </span>
                                </h2>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left bg-gray-50/50 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-black">
                                            <th className="px-8 py-6 border-b border-gray-50 whitespace-nowrap">Date</th>
                                            <th className="px-8 py-6 border-b border-gray-50">Title & Information</th>
                                            <th className="px-8 py-6 border-b border-gray-50 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activeTab === 'sermons' && sermons.map((item, idx) => (
                                            <AdminTableRow
                                                key={item.id || idx}
                                                date={item.date}
                                                title={item.title}
                                                subText={item.preacher}
                                                onEdit={() => handleEdit(item, 'sermon')}
                                                onDelete={() => handleDelete('sermon', item.id)}
                                                link={item.link || (item.youtubeId ? `https://youtube.com/watch?v=${item.youtubeId}` : null)}
                                                onMoveUp={() => handleMoveItem(idx, -1, sermons, setSermons, 'sermons')}
                                                onMoveDown={() => handleMoveItem(idx, 1, sermons, setSermons, 'sermons')}
                                                isFirst={idx === 0}
                                                isLast={idx === sermons.length - 1}
                                            />
                                        ))}
                                        {activeTab === 'bulletins' && bulletins.map((item, idx) => (
                                            <AdminTableRow
                                                key={item.id || idx}
                                                date={item.date}
                                                title={item.title}
                                                subText="PDF Bulletin"
                                                onEdit={() => handleEdit(item, 'bulletin')}
                                                onDelete={() => handleDelete('bulletin', item.id)}
                                                link={item.fileUrl}
                                                onMoveUp={() => handleMoveItem(idx, -1, bulletins, setBulletins, 'bulletins')}
                                                onMoveDown={() => handleMoveItem(idx, 1, bulletins, setBulletins, 'bulletins')}
                                                isFirst={idx === 0}
                                                isLast={idx === bulletins.length - 1}
                                            />
                                        ))}

                                        {activeTab === 'gallery' && gallery.map((item, idx) => (
                                            <AdminTableRow
                                                key={item.id || idx}
                                                date={item.date}
                                                title={item.title}
                                                subText={item.type === 'video' ? 'Video' : item.type === 'audio' ? 'Audio' : 'Image'}
                                                onEdit={() => handleEdit(item, 'gallery')}
                                                onDelete={() => handleDelete('gallery', item.id)}
                                                link={item.url}
                                            />
                                        ))}
                                        {activeTab === 'columns' && columns.map((item, idx) => (
                                            <AdminTableRow
                                                key={item.id || idx}
                                                date={item.date}
                                                title={item.title}
                                                subText={item.author || '이남규 목사'}
                                                onEdit={() => handleEdit(item, 'column')}
                                                onDelete={() => handleDelete('column', item.id)}
                                                link={item.fileUrl}
                                                onMoveUp={() => handleMoveItem(idx, -1, columns, setColumns, 'columns')}
                                                onMoveDown={() => handleMoveItem(idx, 1, columns, setColumns, 'columns')}
                                                isFirst={idx === 0}
                                                isLast={idx === columns.length - 1}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {activeTab === 'sermons' && sermons.map((item, idx) => (
                                    <AdminMobileCard
                                        key={item.id || idx}
                                        date={item.date}
                                        title={item.title}
                                        subText={item.preacher}
                                        onEdit={() => handleEdit(item, 'sermon')}
                                        onDelete={() => handleDelete('sermon', item.id)}
                                        link={item.link || (item.youtubeId ? `https://youtube.com/watch?v=${item.youtubeId}` : null)}
                                        onMoveUp={() => handleMoveItem(idx, -1, sermons, setSermons, 'sermons')}
                                        onMoveDown={() => handleMoveItem(idx, 1, sermons, setSermons, 'sermons')}
                                        isFirst={idx === 0}
                                        isLast={idx === sermons.length - 1}
                                    />
                                ))}
                                {activeTab === 'bulletins' && bulletins.map((item, idx) => (
                                    <AdminMobileCard
                                        key={item.id || idx}
                                        date={item.date}
                                        title={item.title}
                                        subText="PDF Bulletin"
                                        onEdit={() => handleEdit(item, 'bulletin')}
                                        onDelete={() => handleDelete('bulletin', item.id)}
                                        link={item.fileUrl}
                                        onMoveUp={() => handleMoveItem(idx, -1, bulletins, setBulletins, 'bulletins')}
                                        onMoveDown={() => handleMoveItem(idx, 1, bulletins, setBulletins, 'bulletins')}
                                        isFirst={idx === 0}
                                        isLast={idx === bulletins.length - 1}
                                    />
                                ))}
                                {activeTab === 'gallery' && gallery.map((item, idx) => (
                                    <AdminMobileCard
                                        key={item.id || idx}
                                        date={item.date}
                                        title={item.title}
                                        subText={item.type === 'video' ? 'Video' : item.type === 'audio' ? 'Audio' : 'Image'}
                                        onEdit={() => handleEdit(item, 'gallery')}
                                        onDelete={() => handleDelete('gallery', item.id)}
                                        link={item.url}
                                    />
                                ))}
                                {activeTab === 'columns' && columns.map((item, idx) => (
                                    <AdminMobileCard
                                        key={item.id || idx}
                                        date={item.date}
                                        title={item.title}
                                        subText={item.author || '이남규 목사'}
                                        onEdit={() => handleEdit(item, 'column')}
                                        onDelete={() => handleDelete('column', item.id)}
                                        link={item.fileUrl}
                                        onMoveUp={() => handleMoveItem(idx, -1, columns, setColumns, 'columns')}
                                        onMoveDown={() => handleMoveItem(idx, 1, columns, setColumns, 'columns')}
                                        isFirst={idx === 0}
                                        isLast={idx === columns.length - 1}
                                    />
                                ))}
                            </div>

                            {/* Empty State */}
                            {(activeTab === 'sermons' ? sermons :
                                activeTab === 'bulletins' ? bulletins :
                                    activeTab === 'notices' ? notices :
                                        activeTab === 'columns' ? columns :
                                            activeTab === 'dailyWord' ? dailyWords : gallery).length === 0 && activeTab !== 'dailyWord' && (
                                    <div className="p-20 text-center text-gray-400 font-medium">
                                        데이터가 없습니다. 상단 '새 항목 등록하기'를 눌러 추가해 주세요.
                                    </div>
                                )}
                        </div>
                    )
                }

                {/* Daily Word List (Custom Grid View) */}
                {activeTab === 'dailyWord' && !showAddForm && (
                    <div className="animate-fade-in-up">
                        {dailyWords.length > 0 && (
                            <div className="flex justify-between items-center mb-6 px-2">
                                <h2 className="font-black text-primary text-xl flex items-center gap-2">
                                    <BookOpen size={22} className="text-accent" />
                                    DAILY WORD DATABASE
                                    <span className="text-sm font-bold text-gray-300 ml-2">{dailyWords.length} Items</span>
                                </h2>
                                <span className="text-xs text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full animate-pulse">
                                    * 순서 변경 시 즉시 자동 저장됩니다 (모바일 앱 연동)
                                </span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                            {dailyWords.length === 0 ? (
                                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <BookOpen size={40} />
                                    </div>
                                    <p className="text-gray-400 font-bold mb-2">등록된 오늘의 말씀이 없습니다.</p>
                                    <p className="text-gray-300 text-sm">새 항목 등록하기 버튼을 눌러 추가해주세요.</p>
                                </div>
                            ) : (
                                dailyWords.map((word, idx) => (
                                    <div key={word.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-lg flex flex-col relative">
                                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                                            <img
                                                src={word.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=800"}
                                                alt="Preview"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-2 left-2 flex gap-1">
                                                <span className="bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">
                                                    {word.date}
                                                </span>
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoveDailyWord(idx, -1);
                                                    }}
                                                    disabled={idx === 0}
                                                    className="p-1 bg-black/60 backdrop-blur-sm text-white rounded hover:bg-white hover:text-black transition-all border border-white/20 disabled:opacity-30"
                                                    title="Move Up"
                                                >
                                                    <ArrowUp size={12} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMoveDailyWord(idx, 1);
                                                    }}
                                                    disabled={idx === dailyWords.length - 1}
                                                    className="p-1 bg-black/60 backdrop-blur-sm text-white rounded hover:bg-white hover:text-black transition-all border border-white/20 disabled:opacity-30"
                                                    title="Move Down"
                                                >
                                                    <ArrowDown size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-2.5 flex-grow flex flex-col">
                                            <h3 className="font-bold text-primary text-[11px] mb-0.5 truncate">
                                                {word.verse || word.title}
                                            </h3>
                                            <p className="text-gray-400 text-[10px] leading-tight break-keep line-clamp-2 mb-2">
                                                "{word.content}"
                                            </p>
                                            <div className="mt-auto flex gap-1 pt-1.5 border-t border-gray-50">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(word.id);
                                                        setFormData({
                                                            ...formData,
                                                            title: word.verse || word.title || '',
                                                            content: word.content || '',
                                                            date: word.date || '',
                                                            fileUrl: word.image || ''
                                                        });
                                                        setShowAddForm(true);
                                                    }}
                                                    className="flex-grow py-1.5 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('정말 삭제하시겠습니까?')) {
                                                            await dbService.deleteDailyWord(word.id);
                                                            setDailyWords(dailyWords.filter(dw => dw.id !== word.id));
                                                        }
                                                    }}
                                                    className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                {
                    !isFirebaseConfigured && (
                        <div className="mt-10 p-10 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                <Shield size={120} />
                            </div>
                            <div className="p-5 bg-amber-100 rounded-3xl text-amber-600 shadow-sm border border-amber-200">
                                <AlertTriangle size={32} />
                            </div>
                            <div className="relative z-10 font-sans">
                                <h4 className="font-black text-amber-900 text-xl mb-3 flex items-center gap-2">
                                    Firebase Firestore 활성화가 필요합니다
                                </h4>
                                <p className="text-amber-800/80 leading-relaxed max-w-2xl mb-8 font-medium">
                                    현재 <code className="bg-amber-100 px-2 py-0.5 rounded text-amber-900">src/lib/firebase.js</code>에 프로젝트 키는 잘 입력되었습니다.
                                    마지막으로 **Firebase Console** 사이트에서 [Firestore Database]를 활성화(테스트 모드로 시작)해 주셔야 여기서 저장하는 내용이 전 세계에 실시간 반영됩니다.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a href="https://console.firebase.google.com/" target="_blank" className="bg-amber-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all flex items-center gap-2">파이어베이스 콘솔 바로가기 <ExternalLink size={16} /></a>
                                    <button onClick={loadData} className="bg-white text-amber-800 border border-amber-200 px-8 py-3.5 rounded-2xl font-bold hover:bg-amber-100 transition-all">연결 재시도</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Staff List View */}
                {
                    activeTab === 'staff' && !showAddForm && (
                        <div className="animate-fade-in-up">
                            {staffList.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <Users size={40} />
                                    </div>
                                    <p className="text-gray-400 font-bold mb-2">등록된 섬기는 분이 없습니다.</p>
                                    <p className="text-gray-300 text-sm">새 항목 등록하기 버튼을 눌러 추가해주세요.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {staffList.map((staff) => (
                                        <div key={staff.id || staff.name} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(staff, 'staff')}
                                                    className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
                                                    title="수정"
                                                >
                                                    <Settings size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete('staff', staff.id)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
                                                    title="삭제"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <div className="w-48 h-48 bg-gray-100 rounded-full mb-6 overflow-hidden border-8 border-gray-50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                                    {staff.image ? (
                                                        <img
                                                            src={staff.image}
                                                            alt={staff.name}
                                                            referrerPolicy="no-referrer"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-100');
                                                                e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 text-gray-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                                                            <Users size={64} className="opacity-50" />
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">{staff.name}</h3>
                                                {staff.englishName && <p className="text-[10px] font-bold text-gray-400 -mt-1 uppercase tracking-wider">{staff.englishName}</p>}
                                                <p className="text-accent font-medium text-sm mb-3 mt-1">{staff.role}</p>
                                                <p className="text-gray-400 text-xs px-3 py-1 bg-gray-50 rounded-full">{staff.email || '이메일 없음'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }

                {/* Calendar List */}
                {
                    activeTab === 'calendar' && (
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Date</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Event</th>
                                            <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Note</th>
                                            <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {calendarEvents.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-10 text-center text-gray-400 font-medium">
                                                    등록된 일정이 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            calendarEvents.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-all group">
                                                    <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-400 font-mono font-bold">{item.date}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-800">{item.title}</span>
                                                            <span className={clsx(
                                                                "text-[10px] font-bold px-2 py-0.5 rounded w-fit mt-1",
                                                                item.type === 'special' ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-500"
                                                            )}>
                                                                {item.type === 'special' ? '특별 일정' : '일반 일정'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-sm text-gray-500">{item.note}</td>
                                                    <td className="px-8 py-5 whitespace-nowrap text-right space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item, 'calendar')}
                                                            className="text-gray-200 hover:text-primary transition-all p-2 rounded-2xl hover:bg-primary/5 active:scale-90"
                                                        >
                                                            <Settings size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete('calendar', item.id)}
                                                            className="text-gray-200 hover:text-red-500 transition-all p-2 rounded-2xl hover:bg-red-50 active:scale-90"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={clsx(
            "w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm group",
            active
                ? "bg-white text-primary shadow-xl shadow-black/20"
                : "text-white/40 hover:text-white hover:bg-white/5"
        )}
    >
        <span className={clsx("transition-transform duration-300", active && "scale-110")}>{icon}</span>
        {label}
        {active && <div className="ml-auto w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />}
    </button>
);

const AdminTableRow = ({ date, title, subText, tag, onEdit, onDelete, link, showView = true, onMoveUp, onMoveDown, isFirst, isLast }) => (
    <tr className="hover:bg-gray-50/50 transition-all group">
        <td className="px-4 md:px-8 py-5 md:py-7 whitespace-nowrap text-xs md:text-sm text-gray-400 font-mono font-bold">{date || '-'}</td>
        <td className="px-4 md:px-8 py-5 md:py-7">
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 line-clamp-1">{title || '제목 없음'}</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{subText}</span>
                        {tag && <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-500 rounded">필독</span>}
                    </div>
                </div>
                {link && showView && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-primary/5 text-primary rounded-lg hover:bg-primary hover:text-white shrink-0">
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </td>
        <td className="px-4 md:px-8 py-5 md:py-7 whitespace-nowrap text-right space-x-2 flex justify-end items-center">
            {onMoveUp && onMoveDown && (
                <div className="flex flex-col gap-1 mr-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <button
                        onClick={onMoveDown}
                        disabled={isLast}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-primary disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                        <ArrowDown size={14} />
                    </button>
                </div>
            )}
            <button
                onClick={onEdit}
                className="text-gray-200 hover:text-primary transition-all p-2.5 md:p-3 hover:bg-primary/5 rounded-2xl group/btn active:scale-90"
            >
                <Settings size={18} className="md:w-5 md:h-5 text-gray-400 group-hover/btn:text-primary" />
            </button>
            <button
                onClick={onDelete}
                className="text-gray-200 hover:text-red-500 transition-all p-2.5 md:p-3 hover:bg-red-50 rounded-2xl group/btn active:scale-90"
            >
                <Trash2 size={18} className="md:w-5 md:h-5" />
            </button>
        </td>
    </tr>
);

const AdminMobileCard = ({ date, title, subText, tag, onEdit, onDelete, link, onMoveUp, onMoveDown, isFirst, isLast }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative group">
        <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{date || '-'}</span>
            <div className="flex gap-2">
                {onEdit && (
                    <button onClick={onEdit} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-colors">
                        <Settings size={16} />
                    </button>
                )}
                {onDelete && (
                    <button onClick={onDelete} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">{title || '제목 없음'}</h3>
        <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{subText}</span>
            {tag && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">필독</span>}
        </div>

        <div className="flex justify-between items-center border-t border-gray-50 pt-3">
            <div className="flex gap-1">
                {onMoveUp && onMoveDown && (
                    <>
                        <button onClick={onMoveUp} disabled={isFirst} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-20 active:bg-gray-200">
                            <ArrowUp size={16} />
                        </button>
                        <button onClick={onMoveDown} disabled={isLast} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 disabled:opacity-20 active:bg-gray-200">
                            <ArrowDown size={16} />
                        </button>
                    </>
                )}
            </div>
            {link && (
                <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                    보기 <ExternalLink size={12} />
                </a>
            )}
        </div>
    </div>
);

export default Admin;
