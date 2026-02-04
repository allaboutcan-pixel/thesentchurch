// Mock Data
let dailyWord = {
    text: "예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라",
    reference: "요한복음 14:6"
};

let bulletins = [
    { id: 1, title: "1월 4주 주일예배 주보", date: "2026-01-26", link: "#" },
    { id: 2, title: "1월 3주 주일예배 주보", date: "2026-01-19", link: "#" },
    { id: 3, title: "1월 2주 주일예배 주보", date: "2026-01-12", link: "#" },
];

let sermons = [
    { id: 1, title: "주가 일하시네", preacher: "이남규 목사", date: "2026-01-26", videoId: "example1" },
];

export const dataService = {
    // Daily Word
    getDailyWord: async () => {
        return Promise.resolve(dailyWord);
    },
    updateDailyWord: async (newWord) => {
        dailyWord = newWord;
        return Promise.resolve(dailyWord);
    },

    // Bulletins
    getBulletins: async () => {
        return Promise.resolve(bulletins);
    },
    addBulletin: async (bulletin) => {
        const newBulletin = { ...bulletin, id: Date.now() };
        bulletins = [newBulletin, ...bulletins];
        return Promise.resolve(newBulletin);
    },
    deleteBulletin: async (id) => {
        bulletins = bulletins.filter(b => b.id !== id);
        return Promise.resolve(true);
    },

    // Sermons
    getSermons: async () => {
        return Promise.resolve(sermons);
    },
};
