const fs = require('fs');
const path = 'C:/Users/zizib/OneDrive/바탕 화면/홈페이지/src/pages/Admin.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. handleMoveNotice and toggle config
content = content.replace(
    /const handleMoveDailyWord = async \(index, direction\) => \{/,
    `const handleToggleNoticePopup = async (show) => {
        const newConfig = { ...siteConfig, showNoticePopup: show };
        setSiteConfig(newConfig);
        await dbService.updateSiteConfig(newConfig);
    };

    const handleMoveNotice = async (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= notices.length) return;
        try {
            const newItems = [...notices];
            const temp = newItems[index];
            newItems[index] = newItems[newIndex];
            newItems[newIndex] = temp;
            
            const updatedItems = newItems.map((item, i) => ({ ...item, order: newItems.length - i }));
            setNotices(updatedItems);
            await dbService.updateNoticesOrder(updatedItems);
        } catch (e) {
            console.error('Error moving notice:', e);
            alert('순서 변경 중 오류가 발생했습니다.');
        }
    };

    const handleMoveDailyWord = async (index, direction) => {`
);

// 2. save block
content = content.replace(
    /\} else if \(activeTab === 'site' \|\| activeTab === 'intro'/,
    `} else if (activeTab === 'notice') {
                let finalImageUrl = formData.fileUrl;
                if (file) {
                    finalImageUrl = await dbService.uploadFile(file, 'notices');
                } else if (finalImageUrl) {
                    finalImageUrl = dbService.formatDriveImage(finalImageUrl);
                }

                const noticeData = {
                    title: formData.title,
                    titleEn: formData.titleEn || '',
                    content: formData.content,
                    contentEn: formData.contentEn || '',
                    date: formData.date,
                    image: finalImageUrl,
                    showPopup: formData.showPopup || false
                };

                if (editingId) {
                    savedItem = await Promise.race([dbService.updateNotice(editingId, noticeData), createTimeout()]);
                    setNotices(notices.map(n => n.id === editingId ? savedItem : n));
                } else {
                    savedItem = await Promise.race([dbService.addNotice(noticeData), createTimeout()]);
                    setNotices([savedItem, ...notices].sort((a, b) => new Date(b.date) - new Date(a.date)));
                }
            } else if (activeTab === 'site' || activeTab === 'intro'`
);

// 3. menu tab
content = content.replace(
    /onClick=\{\(\) => \{ setActiveTab\('dailyWord'\); setShowAddForm\(false\); \}\}\n\s+\/>/,
    `onClick={() => { setActiveTab('dailyWord'); setShowAddForm(false); }}
                    />
                    <SidebarItem
                        icon={<Bell size={20} />}
                        label="공지사항 관리"
                        active={activeTab === 'notice'}
                        onClick={() => { setActiveTab('notice'); setShowAddForm(false); }}
                    />`
);

// 4. active tab label
content = content.replace(
    /\{activeTab === 'dailyWord' && '📜 오늘의 말씀 관리'\}/,
    `{activeTab === 'dailyWord' && '📜 오늘의 말씀 관리'}
                            {activeTab === 'notice' && '📢 공지사항 관리'}`
);

// 5. form add title
content = content.replace(
    /activeTab === 'dailyWord' \? '새 오늘의 말씀 등록' : '정보 수정'\}/,
    `activeTab === 'dailyWord' ? '새 오늘의 말씀 등록' :
                                                        activeTab === 'notice' ? '새 공지사항 등록' : '정보 수정'}`
);

// 6. form fields display logic
content = content.replace(
    /\{activeTab === 'dailyWord' && \(/,
    `{(activeTab === 'dailyWord' || activeTab === 'notice') && (`
);
content = content.replace(
    /\{activeTab === 'dailyWord' \? '\* Biblical Verse in English \\(e.g., Matthew 5:13\\)' : ''\}/,
    `{activeTab === 'dailyWord' ? '* Biblical Verse in English (e.g., Matthew 5:13)' : activeTab === 'notice' ? 'English Title' : ''}`
);
// Replace label 내용 (Korean Content) text area to be used for notice content as well
content = content.replace(
    /\{activeTab === 'dailyWord' \? '\* 성경 구절 \\(예: 마태복음 5장 13절\\)' : activeTab === 'sermons' \? '유튜브 Video ID' : ''\}/g,
    `{activeTab === 'dailyWord' ? '* 성경 구절 (예: 마태복음 5장 13절)' : activeTab === 'sermons' ? '유튜브 Video ID' : activeTab === 'notice' ? 'English Title' : ''}`
);

// Add showPopup toggle to form
content = content.replace(
    /onChange=\{\(e\) => setFile\(e\.target\.files\[0\]\)\}\n\s+\/>\n\s+<\/div>\n\s+<\/div>\n\s+<\/div>/,
    `onChange={(e) => setFile(e.target.files[0])}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {activeTab === 'notice' && (
                                        <div className="space-y-2 mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-bold text-amber-900">이 공지사항을 팝업으로 띄우기</label>
                                                <p className="text-xs text-amber-700/80">체크하면 이 항목이 홈페이지 팝업창에 나타납니다. (전체 팝업 설정도 켜져 있어야 합니다)</p>
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                checked={formData.showPopup} 
                                                onChange={(e) => setFormData({...formData, showPopup: e.target.checked})}
                                                className="w-6 h-6 rounded text-primary focus:ring-primary/20 accent-primary"
                                            />
                                        </div>
                                    )}`
);

// 7. empty state
content = content.replace(
    /activeTab === 'dailyWord' \? dailyWords : gallery\)\.length === 0 && activeTab !== 'dailyWord' && \(/,
    `activeTab === 'dailyWord' ? dailyWords : activeTab === 'notice' ? notices : gallery).length === 0 && activeTab !== 'dailyWord' && activeTab !== 'notice' && (`
);

fs.writeFileSync(path, content, 'utf8');
