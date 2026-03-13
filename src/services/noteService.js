// Notes Service for FarmPal - Simplified queries for web compatibility
import { db } from '../config/firebase';
import {
    collection,
    getDocs,
    addDoc,
    writeBatch,
    doc
} from 'firebase/firestore';
import { getCurrentDateComponents } from '../utils/dateUtils';

const COLLECTION_NAME = 'notes';

/**
 * Add a new note
 */
export const addNote = async (title, category, description) => {
    try {
        const { day, month, year, date } = getCurrentDateComponents();
        const notesRef = collection(db, COLLECTION_NAME);

        const docRef = await addDoc(notesRef, {
            title,
            category,
            description,
            day,
            month,
            year,
            date: date.toISOString(),
            createdAt: date.toISOString(),
        });

        return {
            id: docRef.id,
            title,
            category,
            description,
            day,
            month,
            year,
            date: date.toISOString(),
        };
    } catch (error) {
        console.error('Error adding note:', error);
        throw error;
    }
};

/**
 * Get all notes sorted by date (newest first)
 */
export const getAllNotes = async (categoryFilter = null) => {
    try {
        const notesRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(notesRef);

        let notes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Sort by date descending (client-side)
        notes.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

        // Filter by category if specified
        if (categoryFilter && categoryFilter !== 'all') {
            notes = notes.filter(note => note.category === categoryFilter);
        }

        return notes;
    } catch (error) {
        console.error('Error getting all notes:', error);
        return [];
    }
};

/**
 * Get recent notes (for dashboard)
 */
export const getRecentNotes = async (count = 5) => {
    try {
        const notes = await getAllNotes();
        return notes.slice(0, count);
    } catch (error) {
        console.error('Error getting recent notes:', error);
        return [];
    }
};

/**
 * Delete all notes
 */
export const deleteAllNotes = async () => {
    try {
        const notesRef = collection(db, COLLECTION_NAME);
        const querySnapshot = await getDocs(notesRef);

        const batch = writeBatch(db);
        querySnapshot.docs.forEach(docSnapshot => {
            batch.delete(doc(db, COLLECTION_NAME, docSnapshot.id));
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error deleting all notes:', error);
        throw error;
    }
};

export default {
    addNote,
    getAllNotes,
    getRecentNotes,
    deleteAllNotes
};
