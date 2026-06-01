const fs = require('fs');
const path = 'C:/Users/zizib/OneDrive/바탕 화면/홈페이지/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import
content = content.replace(
    /const DailyWordPopup = lazy\(\(\) => import\('\.\.\/components\/DailyWordPopup'\)\);/,
    `const DailyWordPopup = lazy(() => import('../components/DailyWordPopup'));
const NoticePopup = lazy(() => import('../components/NoticePopup'));`
);

// 2. Suspense popup
content = content.replace(
    /\{config\.showDailyWordPopup !== false && <DailyWordPopup word=\{latestDailyWord\} \/>\}/,
    `{config.showDailyWordPopup !== false && <DailyWordPopup word={latestDailyWord} />}
                {config.showNoticePopup !== false && homeNotices.find(n => n.showPopup) && <NoticePopup notice={homeNotices.find(n => n.showPopup)} />}`
);

// 3. UI section
const uiReplacement = `                            <div className="lg:col-span-1 bg-white rounded-[32px] p-5 shadow-2xl shadow-primary/5 border border-gray-50 h-full flex flex-col justify-between">
                                {/* Notice Section */}
                                {homeNotices.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-lg font-black text-amber-600 mb-4 flex items-center gap-2 shrink-0 border-b border-amber-50 pb-2">
                                            <Bell size={18} />
                                            {i18n.language === 'en' ? 'Notice' : '공지사항'}
                                        </h4>
                                        <div className="space-y-2">
                                            {homeNotices.slice(0, 3).map((notice, idx) => (
                                                <Link 
                                                    key={'notice-'+idx} 
                                                    to="/news/notice"
                                                    state={{ openItem: JSON.parse(JSON.stringify(notice)) }}
                                                    className="block p-2.5 rounded-xl border border-amber-100 hover:border-amber-300 hover:bg-amber-50/50 hover:shadow-sm transition-all group"
                                                >
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-100 text-amber-700">
                                                            {i18n.language === 'en' ? 'NOTICE' : '공지'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400">{notice.date?.substring?.(0,10) || ""}</span>
                                                    </div>
                                                    <h5 className="font-bold text-[13px] text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">
                                                        {(i18n.language === 'en' && notice.titleEn) ? notice.titleEn : notice.title}
                                                    </h5>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <h4 className="text-lg font-black text-primary mb-4 flex items-center gap-2 shrink-0">
                                    <span className="text-accent opacity-70">#</span>`;

content = content.replace(
    /<div className="lg:col-span-1 bg-white rounded-\[32px\] p-5 shadow-2xl shadow-primary\/5 border border-gray-50 h-full flex flex-col justify-between">\s*<h4 className="text-lg font-black text-primary mb-4 flex items-center gap-2 shrink-0">\s*<Bell size=\{18\} className="text-accent" \/>/,
    uiReplacement
);

fs.writeFileSync(path, content, 'utf8');
