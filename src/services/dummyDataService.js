// Dummy Data Service for FarmPal - Generates sample data for testing
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const generateDummyData = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();

    // Generate egg production data for the last 15 days
    const eggData = [];
    for (let i = 0; i < Math.min(currentDay, 15); i++) {
        const day = currentDay - i;
        if (day > 0) {
            eggData.push({
                count: Math.floor(Math.random() * 150) + 50, // 50-200 eggs
                day,
                month: currentMonth,
                year: currentYear,
                date: new Date(currentYear, currentMonth - 1, day).toISOString(),
                createdAt: new Date().toISOString(),
            });
        }
    }

    // Generate feed consumption data for the last 15 days
    const feedData = [];
    for (let i = 0; i < Math.min(currentDay, 15); i++) {
        const day = currentDay - i;
        if (day > 0) {
            feedData.push({
                amount: Math.floor(Math.random() * 30) + 10, // 10-40 Kg
                day,
                month: currentMonth,
                year: currentYear,
                date: new Date(currentYear, currentMonth - 1, day).toISOString(),
                createdAt: new Date().toISOString(),
            });
        }
    }

    // Generate expense data for the last 15 days
    const expenseData = [];
    const expenseNotes = ['Feed purchase', 'Medicine', 'Equipment', 'Labor', 'Utilities', 'Transport'];
    for (let i = 0; i < Math.min(currentDay, 10); i++) {
        const day = currentDay - i;
        if (day > 0) {
            expenseData.push({
                amount: Math.floor(Math.random() * 5000) + 500, // 500-5500 LKR
                note: expenseNotes[Math.floor(Math.random() * expenseNotes.length)],
                day,
                month: currentMonth,
                year: currentYear,
                date: new Date(currentYear, currentMonth - 1, day).toISOString(),
                createdAt: new Date().toISOString(),
            });
        }
    }

    // Generate notes
    const notesData = [
        { title: 'Vaccine Schedule', category: 'health', description: 'Administer Newcastle vaccine next week. Check inventory for supplies.' },
        { title: 'New Employee', category: 'employee', description: 'John started today as assistant. Training period 2 weeks.' },
        { title: 'Equipment Maintenance', category: 'office', description: 'Feeder machines need cleaning and maintenance this weekend.' },
        { title: 'Mortality Report', category: 'dead_chicks', description: 'Lost 3 chicks due to heat stress. Improved ventilation needed.' },
        { title: 'Feed Quality Check', category: 'other', description: 'New batch of feed arrived. Quality seems good, monitor consumption.' },
    ];

    for (const note of notesData) {
        const day = Math.floor(Math.random() * currentDay) + 1;
        note.day = day;
        note.month = currentMonth;
        note.year = currentYear;
        note.date = new Date(currentYear, currentMonth - 1, day).toISOString();
        note.createdAt = new Date().toISOString();
    }

    // Add data to Firestore
    try {
        // Add eggs
        for (const egg of eggData) {
            await addDoc(collection(db, 'eggProduction'), egg);
        }

        // Add feed
        for (const feed of feedData) {
            await addDoc(collection(db, 'feedConsumption'), feed);
        }

        // Add expenses
        for (const expense of expenseData) {
            await addDoc(collection(db, 'expenses'), expense);
        }

        // Add notes
        for (const note of notesData) {
            await addDoc(collection(db, 'notes'), note);
        }

        return {
            eggs: eggData.length,
            feed: feedData.length,
            expenses: expenseData.length,
            notes: notesData.length,
        };
    } catch (error) {
        console.error('Error adding dummy data:', error);
        throw error;
    }
};

export { generateDummyData };
