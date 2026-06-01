const fs = require('fs');
const path = 'C:/Users/zizib/OneDrive/바탕 화면/홈페이지/src/pages/Admin.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find the Daily Word List (Custom Grid View) and duplicate it for Notice List
const dailyWordListRegex = /\{\/\* Daily Word List \(Custom Grid View\) \*\/\}[\s\S]*?(?=\{\/\* Staff List View \*\/\})/;
const match = content.match(dailyWordListRegex);

if (match) {
    let noticeListCode = match[0].replace(/dailyWord/g, 'notice')
                                 .replace(/Daily Word/g, 'Notice')
                                 .replace(/오늘의 말씀/g, '공지사항')
                                 .replace(/dailyWords/g, 'notices')
                                 .replace(/word/g, 'noticeItem')
                                 .replace(/handleMoveDailyWord/g, 'handleMoveNotice')
                                 .replace(/handleToggleNoticePopupPopup/g, 'handleToggleNoticePopup')
                                 .replace(/showNoticePopupPopup/g, 'showNoticePopup')
                                 .replace(/DAILY WORD DATABASE/g, 'NOTICE DATABASE');
    
    // Fix specific replaces that might be wrong due to generic replacement
    noticeListCode = noticeListCode.replace(/showNoticePopup/g, 'showNoticePopup')
                                   .replace(/handleToggleNoticePopup/g, 'handleToggleNoticePopup')
                                   .replace(/handleToggleDailyWordPopup/g, 'handleToggleNoticePopup')
                                   .replace(/showDailyWordPopup/g, 'showNoticePopup')
                                   .replace(/setDailyWords/g, 'setNotices')
                                   .replace(/dbService.deleteDailyWord/g, 'dbService.deleteNotice')
                                   .replace(/noticeItem.verse \|\| noticeItem.title/g, 'noticeItem.title')
                                   .replace(/title: noticeItem.verse \|\| noticeItem.title \|\| ''/g, "title: noticeItem.title || ''");

    content = content.replace(match[0], match[0] + "\n\n" + noticeListCode);
    fs.writeFileSync(path, content, 'utf8');
} else {
    console.log("Could not find Daily Word List to duplicate.");
}
