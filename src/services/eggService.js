// Egg Production Service for FarmPal - Simplified queries
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

const COLLECTION_NAME = 'eggProduction';

/**
 * Add egg production record - adds to existing day's count if exists
 */
export const addEggRecord = async (count) => {
    try {
        const { day, month, year, date } = getCurrentDateComponents();
        const eggsRef = collection(db, COLLECTION_NAME);

        // Get all records and find today's
        const querySnapshot = await getDocs(eggsRef);
        const todayRecord = querySnapshot.docs.find(d => {
            const data = d.data();
            return data.day === day && data.month === month && data.year === year;
        });

        if (todayRecord) {
            // Update existing record
            const existingData = todayRecord.data();
            const newCount = existingData.count + count;

            await updateDoc(doc(db, COLLECTION_NAME, todayRecord.id), {
                count: newCount,
                updatedAt: date.toISOString(),
            });

            return {
                id: todayRecord.id,
                day,
                month,
                year,
                count: newCount,
            };
        } else {
            // Create new record
            const docRef = await addDoc(eggsRef, {
                count,
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
                count,
            };
        }
    } catch (error) {
        console.error('Error adding egg record:', error);
        throw error;
    }
};

/**
 * Get egg production records for a specific month
 */
export const getEggsByMonth = async (month, year) => {
    try {
        const eggsRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(eggsRef);

        const records = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(record => record.month === month && record.year === year)
            .sort((a, b) => a.day - b.day);

        return records;
    } catch (error) {
        console.error('Error getting eggs by month:', error);
        return [];
    }
};

/**
 * Get all egg production records
 */
export const getAllEggs = async () => {
    try {
        const eggsRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(eggsRef);

        return querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.day);
                const dateB = new Date(b.year, b.month - 1, b.day);
                return dateB - dateA;
            });
    } catch (error) {
        console.error('Error getting all eggs:', error);
        return [];
    }
};

/**
 * Delete all egg production records
 */
export const deleteAllEggs = async () => {
    try {
        const eggsRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(eggsRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach(docSnapshot => {
            batch.delete(doc(db, COLLECTION_NAME, docSnapshot.id));
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error deleting all eggs:', error);
        throw error;
    }
};

export default { addEggRecord, getEggsByMonth, getAllEggs, deleteAllEggs };
