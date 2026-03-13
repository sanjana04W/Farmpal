// Authentication Service for FarmPal - with local database fallback
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
 * Get all users from local storage
 */
const getLocalUsers = async () => {
    return await initializeLocalUsers();
};

/**
 * Try Firestore login first, fall back to local
 */
const tryFirestoreLogin = async (username, password) => {
    try {
        const { db } = require('../config/firebase');
        const { collection, query, where, getDocs } = require('firebase/firestore');

        // Add a timeout for Firestore queries
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);

        if (querySnapshot.empty) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password !== password) {
            return null;
        }

        return {
            id: userDoc.id,
            name: userData.name,
            username: userData.username,
            role: userData.role,
        };
    } catch (error) {
        console.warn('Firestore login failed, using local database:', error.message);
        return 'FIRESTORE_FAILED';
    }
};

/**
 * Login user with username and password
 * Tries Firestore first, falls back to local AsyncStorage database
 * @param {string} username 
 * @param {string} password 
 * @returns {Object|null} User data or null if invalid credentials
 */
export const loginUser = async (username, password) => {
    try {
        // Try Firestore first
        const firestoreResult = await tryFirestoreLogin(username, password);

        if (firestoreResult !== 'FIRESTORE_FAILED') {
            // Firestore worked (returned user data or null for invalid credentials)
            return firestoreResult;
        }

        // Fallback to local database
        console.log('Using local database for authentication');
        const users = await getLocalUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            return null;
        }

        if (user.password !== password) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
        };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

/**
 * Logout user (clear any server-side state if needed)
 */
export const logoutUser = async () => {
    return true;
};

export default { loginUser, logoutUser };
