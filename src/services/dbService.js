import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    setDoc,
    query,
    orderBy,
    limit,
    writeBatch,
    onSnapshot
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";

// Collection Names
const SERMONS = "sermons";
const BULLETINS = "bulletins";
const COLUMNS = "columns";
const DAILY_WORD = "daily_word";
const SITE_CONFIG = "siteConfig";

const DB_COLLECTIONS = {
    GALLERY: 'gallery',
    CALENDAR: 'calendar',
    CONFIG: 'siteConfig' // This is likely intended to replace SITE_CONFIG eventually, but for now, keep both
};

export const dbService = {
    // Format Google Drive link to direct view (preview mode for files)
    // Format Google Drive link to direct view (preview mode for files)
    formatDriveLink: (url) => {
        if (!url) return "";
        if (url.includes('drive.google.com')) {
            // 1. Extract File ID
            const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

            if (fileMatch && fileMatch[1] && !url.includes('/folders/')) {
                return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
            }

            // 2. Folder handling
            const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
            if (folderMatch && folderMatch[1]) {
                return `https://drive.google.com/drive/folders/${folderMatch[1]}`;
            }
        }
        return url;
    },



    // Format Google Drive link to direct download
    formatDriveDownloadLink: (url) => {
        if (!url) return "";
        if (url.includes('drive.google.com')) {
            const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

            if (fileMatch && fileMatch[1]) {
                return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
            }
        }
        return url;
    },

    // Format Google Drive link to direct image (for img src)
    formatDriveImage: (url, size = 'w1280') => {
        if (!url) return "";
        if (typeof url !== 'string') return url;

        if (url.includes('drive.google.com')) {
            const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

            if (fileMatch && fileMatch[1]) {
                // Using high-res thumbnail endpoint is more stable than uc?export=view
                // sz=w2560 ensures high quality for banners
                return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=${size}`;
            }
        }
        return url;
    },

    // Alternative format for Google Drive image (using direct view fallback)
    formatDriveImageAlternative: (url) => {
        if (!url) return "";
        if (typeof url !== 'string') return url;

        if (url.includes('drive.google.com')) {
            const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

            if (fileMatch && fileMatch[1]) {
                // Alternative method: Direct user content view
                return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
            }
        }
        return url;
    },

    // Format Google Drive link to direct video stream (for video src)
    formatDriveVideo: (url) => {
        if (!url) return "";
        if (typeof url !== 'string') return url;

        if (url.includes('drive.google.com')) {
            const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

            if (fileMatch && fileMatch[1]) {
                // Use export=media for streaming
                return `https://drive.google.com/uc?id=${fileMatch[1]}&export=media`;
            }
        }
        return url;
    },

    // Generic File Upload
    uploadFile: async (file, path) => {
        if (!file) return null;
        alert(`[업로드 시작] ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

        try {
            const safeName = `file_${Date.now()}`;
            const extension = file.name.split('.').pop();
            const fullPath = `${path}/${safeName}.${extension}`;

            const storageRef = ref(storage, fullPath);
            const metadata = { contentType: file.type };

            // Use Resumable upload to allow cancellation/monitoring
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            alert(`[연결 시도] 서버 응답 대기 중 (최대 15초)...`);

            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    uploadTask.cancel();
                    reject(new Error("시간 초과: 30초 동안 응답이 없습니다. 인터넷 연결을 확인하거나 파일 크기를 줄여주세요."));
                }, 30000);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // eslint-disable-next-line no-unused-vars
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // Upload progress
                    },
                    (error) => {
                        clearTimeout(timer);
                        reject(error);
                    },
                    async () => {
                        clearTimeout(timer);
                        try {
                            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            alert(`[성공] URL 획득 완료!`);
                            resolve(downloadUrl);
                        } catch (err) {
                            reject(err);
                        }
                    }
                );
            });
        } catch (e) {
            alert(`[오류 발생] ${e.message}`);
            console.error("Storage upload error detail:", e);
            throw e;
        }
    },

    // Generic Fetch
    fetchItems: async (collectionName, limitCount = 50) => {
        // Fetch by date desc to ensure we get the latest items (and all items, regardless of whether they have orderIndex)
        const q = query(collection(db, collectionName), orderBy("date", "desc"), limit(limitCount));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side sort: Items with explicit orderIndex go to top (asc), the rest follow date (desc)
        items.sort((a, b) => {
            const aHasIndex = typeof a.orderIndex === 'number';
            const bHasIndex = typeof b.orderIndex === 'number';

            if (aHasIndex && bHasIndex) return a.orderIndex - b.orderIndex;
            if (aHasIndex) return -1; // a (pinned) comes first
            if (bHasIndex) return 1;  // b (pinned) comes first
            // If neither has index, they are already sorted by date desc from the query
            return 0;
        });

        return items;
    },

    // Batch Update Order
    updateOrder: async (collectionName, items) => {
        try {
            const batch = writeBatch(db);
            items.forEach((item) => {
                const docRef = doc(db, collectionName, item.id);
                batch.update(docRef, { orderIndex: item.orderIndex });
            });
            await batch.commit();
        } catch (e) {
            console.error("Error updating order:", e);
            throw e;
        }
    },

    // Generic Add
    addItem: async (collectionName, data) => {
        try {
            const docRef = await addDoc(collection(db, collectionName), {
                ...data,
                createdAt: new Date()
            });
            return { id: docRef.id, ...data };
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    },

    // Generic Update
    updateItem: async (collectionName, id, data) => {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date()
            });
            return { id, ...data };
        } catch (e) {
            console.error("Error updating document: ", e);
            throw e;
        }
    },

    // Generic Delete
    deleteItem: async (collectionName, id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            return true;
        } catch (e) {
            console.error("Error deleting document: ", e);
            throw e;
        }
    },

    // Specific Fetchers for convenience
    getSermons: () => dbService.fetchItems(SERMONS),
    getBulletins: () => dbService.fetchItems(BULLETINS),
    getGallery: () => dbService.fetchItems(DB_COLLECTIONS.GALLERY),
    getColumns: () => dbService.fetchItems(COLUMNS),

    addSermon: (data) => dbService.addItem(SERMONS, data),
    addBulletin: (data) => dbService.addItem(BULLETINS, data),
    addGalleryItem: (data) => dbService.addItem(DB_COLLECTIONS.GALLERY, data),
    addColumn: (data) => dbService.addItem(COLUMNS, data),

    updateSermon: (id, data) => dbService.updateItem(SERMONS, id, data),
    updateBulletin: (id, data) => dbService.updateItem(BULLETINS, id, data),
    updateGalleryItem: (id, data) => dbService.updateItem(DB_COLLECTIONS.GALLERY, id, data),
    updateColumn: (id, data) => dbService.updateItem(COLUMNS, id, data),

    deleteSermon: (id) => dbService.deleteItem(SERMONS, id),
    deleteBulletin: (id) => dbService.deleteItem(BULLETINS, id),
    deleteGalleryItem: (id) => dbService.deleteItem(DB_COLLECTIONS.GALLERY, id),
    deleteColumn: (id) => dbService.deleteItem(COLUMNS, id),

    // Calendar
    getCalendarEvents: async () => {
        try {
            const q = query(
                collection(db, DB_COLLECTIONS.CALENDAR),
                orderBy('startDate', 'asc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting calendar events:", error);
            return [];
        }
    },

    addCalendarEvent: async (event) => {
        try {
            const docRef = await addDoc(collection(db, DB_COLLECTIONS.CALENDAR), {
                ...event,
                createdAt: new Date().toISOString()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding calendar event:", error);
            throw error;
        }
    },

    updateCalendarEvent: async (id, event) => {
        try {
            const docRef = doc(db, DB_COLLECTIONS.CALENDAR, id);
            await updateDoc(docRef, event);
        } catch (error) {
            console.error("Error updating calendar event:", error);
            throw error;
        }
    },

    deleteCalendarEvent: async (id) => {
        try {
            await deleteDoc(doc(db, DB_COLLECTIONS.CALENDAR, id));
        } catch (error) {
            console.error("Error deleting calendar event:", error);
            throw error;
        }
    },

    // Site Config
    getSiteConfig: async () => {
        try {
            const docRef = doc(db, SITE_CONFIG, "settings");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (e) {
            console.error("Error fetching site config:", e);
            return null;
        }
    },
    updateSiteConfig: async (data) => {
        try {
            const docRef = doc(db, SITE_CONFIG, "settings");
            await setDoc(docRef, {
                ...data,
                updatedAt: new Date()
            }, { merge: true });
            return true;
        } catch (e) {
            console.error("Error updating site config:", e);
            throw e;
        }
    },

    // Daily Word
    getDailyWords: async () => {
        try {
            const q = query(collection(db, DAILY_WORD), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (e) {
            console.error("Error getting daily words: ", e);
            return [];
        }
    },
    addDailyWord: async (data) => {
        try {
            const docRef = await addDoc(collection(db, DAILY_WORD), {
                ...data,
                createdAt: new Date().toISOString()
            });
            return { id: docRef.id, ...data };
        } catch (e) {
            console.error("Error adding daily word: ", e);
            throw e;
        }
    },
    updateDailyWord: async (id, data) => {
        try {
            const docRef = doc(db, DAILY_WORD, id);
            await updateDoc(docRef, data);
            return { id, ...data };
        } catch (e) {
            console.error("Error updating daily word: ", e);
            throw e;
        }
    },
    deleteDailyWord: async (id) => {
        try {
            await deleteDoc(doc(db, DAILY_WORD, id));
            return true;
        } catch (e) {
            console.error("Error deleting daily word: ", e);
            throw e;
        }
    },
    updateDailyWordsOrder: async (items) => {
        try {
            const batch = writeBatch(db);
            items.forEach(item => {
                const docRef = doc(db, DAILY_WORD, item.id);
                batch.update(docRef, { order: item.order });
            });
            await batch.commit();
            return true;
        } catch (e) {
            console.error("Error updating daily words order: ", e);
            throw e;
        }
    },

    // Real-time subscription for Site Config
    subscribeToSiteConfig: (callback) => {
        const docRef = doc(db, SITE_CONFIG, "settings");
        // onSnapshot returns an unsubscribe function
        try {
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    callback(docSnap.data());
                } else {
                    callback(null);
                }
            }, (error) => {
                console.error("Error subscribing to site config:", error);
            });
            return unsubscribe; // Return cleanup function
        } catch (e) {
            console.error("Error setting up subscription:", e);
            // Return dummy cleanup if failed
            return () => { };
        }
    },

    // Reset Flow: Delete all and replace with initial data
    resetCollection: async (collectionName, initialData) => {
        try {
            // Resetting collection
            // 1. Fetch current items to delete
            const snapshot = await getDocs(collection(db, collectionName));

            // 2. Delete all existing docs
            const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, collectionName, d.id)));
            await Promise.all(deletePromises);

            // 3. Add initial data
            const addPromises = initialData.map(item => {
                // Remove existing id if present so Firebase generates a new one
                // eslint-disable-next-line no-unused-vars
                const { id, ...cleanData } = item;
                return addDoc(collection(db, collectionName), {
                    ...cleanData,
                    createdAt: new Date().toISOString()
                });
            });
            await Promise.all(addPromises);

            // Reset complete
            return true;
        } catch (e) {
            console.error(`Error resetting ${collectionName}:`, e);
            throw e;
        }
    },

    resetSermons: (data) => dbService.resetCollection(SERMONS, data),
    resetBulletins: (data) => dbService.resetCollection(BULLETINS, data)
};
