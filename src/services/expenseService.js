// Expenses Service for FarmPal - Simplified queries
import { db } from '../config/firebase';
import {
    collection,
    getDocs,
    addDoc,
    writeBatch,
    doc
} from 'firebase/firestore';
import { getCurrentDateComponents } from '../utils/dateUtils';

const COLLECTION_NAME = 'expenses';

/**
 * Add expense record - each expense is separate (no aggregation)
 */
export const addExpenseRecord = async (amount, note) => {
    try {
        const { day, month, year, date } = getCurrentDateComponents();
        const expensesRef = collection(db, COLLECTION_NAME);

        const docRef = await addDoc(expensesRef, {
            amount,
            note,
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
            note,
        };
    } catch (error) {
        console.error('Error adding expense record:', error);
        throw error;
    }
};

/**
 * Get expense records for a specific month
 */
export const getExpensesByMonth = async (month, year) => {
    try {
        const expensesRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(expensesRef);

        const records = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(record => record.month === month && record.year === year)
            .sort((a, b) => b.day - a.day);

        return records;
    } catch (error) {
        console.error('Error getting expenses by month:', error);
        return [];
    }
};

/**
 * Get all expense records
 */
export const getAllExpenses = async () => {
    try {
        const expensesRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(expensesRef);

        return querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.day);
                const dateB = new Date(b.year, b.month - 1, b.day);
                return dateB - dateA;
            });
    } catch (error) {
        console.error('Error getting all expenses:', error);
        return [];
    }
};

/**
 * Delete all expense records
 */
export const deleteAllExpenses = async () => {
    try {
        const expensesRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(expensesRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach(docSnapshot => {
            batch.delete(doc(db, COLLECTION_NAME, docSnapshot.id));
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error deleting all expenses:', error);
        throw error;
    }
};

export default {
    addExpenseRecord,
    getExpensesByMonth,
    getAllExpenses,
    deleteAllExpenses
};
