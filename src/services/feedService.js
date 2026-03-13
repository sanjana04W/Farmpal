// Feed Consumption Service for FarmPal - Simplified queries
import { db } from '../config/firebase';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    writeBatch
} from 'firebase/firestore';
import { getCurrentDateComponents } from '../utils/dateUtils';

const COLLECTION_NAME = 'feedConsumption';

/**
 * Add feed consumption record - adds to existing day if exists
 */
export const addFeedRecord = async (amount) => {
    try {
        const { day, month, year, date } = getCurrentDateComponents();
        const feedRef = collection(db, COLLECTION_NAME);

        // Get all records and find today's
        const querySnapshot = await getDocs(feedRef);
        const todayRecord = querySnapshot.docs.find(d => {
            const data = d.data();
            return data.day === day && data.month === month && data.year === year;
        });

        if (todayRecord) {
            // Update existing record
            const existingData = todayRecord.data();
            const newAmount = existingData.amount + amount;

            await updateDoc(doc(db, COLLECTION_NAME, todayRecord.id), {
                amount: newAmount,
                updatedAt: date.toISOString(),
            });

            return {
                id: todayRecord.id,
                day,
                month,
                year,
                amount: newAmount,
            };
        } else {
            // Create new record
            const docRef = await addDoc(feedRef, {
                amount,
                day,
                month,
                year,
                date: date.toISOString(),
                createdAt: date.toISOString(),
            });

            return {
                id: docRef.id,
                day,
                month,
                year,
                amount,
            };
        }
    } catch (error) {
        console.error('Error adding feed record:', error);
        throw error;
    }
};

/**
 * Get feed consumption records for a specific month
 */
export const getFeedByMonth = async (month, year) => {
    try {
        const feedRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(feedRef);

        const records = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(record => record.month === month && record.year === year)
            .sort((a, b) => a.day - b.day);

        return records;
    } catch (error) {
        console.error('Error getting feed by month:', error);
        return [];
    }
};

/**
 * Get all feed consumption records
 */
export const getAllFeed = async () => {
    try {
        const feedRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(feedRef);

        return querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.day);
                const dateB = new Date(b.year, b.month - 1, b.day);
                return dateB - dateA;
            });
    } catch (error) {
        console.error('Error getting all feed:', error);
        return [];
    }
};

/**
 * Delete all feed consumption records
 */
export const deleteAllFeed = async () => {
    try {
        const feedRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(feedRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach(docSnapshot => {
            batch.delete(doc(db, COLLECTION_NAME, docSnapshot.id));
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error deleting all feed:', error);
        throw error;
    }
};

export default { addFeedRecord, getFeedByMonth, getAllFeed, deleteAllFeed };
