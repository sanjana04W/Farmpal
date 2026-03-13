// User Management Service for FarmPal - with local database fallback
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_STORAGE_KEY = 'farmpal_local_users';

// Default users (seeded from Firestore data)
const DEFAULT_USERS = [
    {
        id: 'local_1',
        name: 'Udana',
        username: 'admin',
        password: 'password123',
        role: 'owner',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'local_2',
        name: 'kavidu',
        username: 'kav',
        password: '1234',
        role: 'operator',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'local_3',
        name: 'sanjana',
        username: 'snj',
        password: '1234',
        role: 'manager',
        createdAt: new Date().toISOString(),
    },
];

/**
 * Initialize local users database if it doesn't exist
 */
const initializeLocalUsers = async () => {
    try {
        const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
        if (!stored) {
            await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
            return DEFAULT_USERS;
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error initializing local users:', error);
        return DEFAULT_USERS;
    }
};

/**
 * Save users to local storage
 */
const saveLocalUsers = async (users) => {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Try Firestore operation, returns null on failure
 */
const tryFirestoreGetAllUsers = async () => {
    try {
        const { db } = require('../config/firebase');
        const { collection, getDocs } = require('firebase/firestore');

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );

        const usersRef = collection(db, 'users');
        const querySnapshot = await Promise.race([getDocs(usersRef), timeoutPromise]);

        return querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (error) {
        console.warn('Firestore getAllUsers failed, using local database:', error.message);
        return null;
    }
};

/**
 * Get all users - tries Firestore first, falls back to local
 */
export const getAllUsers = async () => {
    try {
        // Try Firestore first
        const firestoreUsers = await tryFirestoreGetAllUsers();
        if (firestoreUsers !== null) {
            return firestoreUsers;
        }

        // Fallback to local database
        console.log('Using local database for user listing');
        const users = await initializeLocalUsers();
        return users.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (error) {
        console.error('Error getting all users:', error);
        return [];
    }
};

/**
 * Add a new user - tries Firestore first, falls back to local
 */
export const addUser = async (name, username, password, role) => {
    try {
        // Try Firestore first
        try {
            const { db } = require('../config/firebase');
            const { collection, addDoc } = require('firebase/firestore');

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firestore timeout')), 5000)
            );

            const usersRef = collection(db, 'users');
            const docRef = await Promise.race([
                addDoc(usersRef, {
                    name,
                    username,
                    password,
                    role,
                    createdAt: new Date().toISOString(),
                }),
                timeoutPromise
            ]);

            return {
                id: docRef.id,
                name,
                username,
                password,
                role,
            };
        } catch (firestoreError) {
            console.warn('Firestore addUser failed, using local database:', firestoreError.message);
        }

        // Fallback to local database
        console.log('Using local database to add user');
        const users = await initializeLocalUsers();
        const newUser = {
            id: 'local_' + Date.now(),
            name,
            username,
            password,
            role,
            createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        await saveLocalUsers(users);
        return newUser;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

/**
 * Delete a user by ID - tries Firestore first, falls back to local
 */
export const deleteUser = async (userId) => {
    try {
        // Try Firestore first
        try {
            const { db } = require('../config/firebase');
            const { doc, deleteDoc } = require('firebase/firestore');

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firestore timeout')), 5000)
            );

            const userDocRef = doc(db, 'users', userId);
            await Promise.race([deleteDoc(userDocRef), timeoutPromise]);
            return true;
        } catch (firestoreError) {
            console.warn('Firestore deleteUser failed, using local database:', firestoreError.message);
        }

        // Fallback to local database
        console.log('Using local database to delete user');
        const users = await initializeLocalUsers();
        const filteredUsers = users.filter(u => u.id !== userId);
        await saveLocalUsers(filteredUsers);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export default {
    getAllUsers,
    addUser,
    deleteUser
};
