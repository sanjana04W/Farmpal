// Settings Screen for FarmPal
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES } from '../constants/theme';
import { getAllEggs, deleteAllEggs } from '../services/eggService';
import { getAllFeed, deleteAllFeed } from '../services/feedService';
import { getAllExpenses, deleteAllExpenses } from '../services/expenseService';
import { getAllNotes, deleteAllNotes } from '../services/noteService';
import { getAllUsers } from '../services/userService';
import { exportAllDataToCSV } from '../utils/csvExport';
import { generateDummyData } from '../services/dummyDataService';

const SettingsScreen = ({ navigation }) => {
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loadingDummy, setLoadingDummy] = useState(false);

    const showAlert = (title, message) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}\n\n${message}`);
        } else {
            Alert.alert(title, message);
        }
    };

    const handleExportData = async () => {
        try {
            setExporting(true);

            // Gather all data
            const [eggs, feed, expenses, notes, users] = await Promise.all([
                getAllEggs(),
                getAllFeed(),
                getAllExpenses(),
                getAllNotes(),
                getAllUsers(),
            ]);

            await exportAllDataToCSV({
                eggs,
                feed,
                expenses,
                notes,
                users,
            });

            showAlert('Success', 'Data exported successfully');
        } catch (error) {
            console.error('Error exporting data:', error);
            showAlert('Error', 'Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const handleLoadDummyData = async () => {
        try {
            setLoadingDummy(true);
            const result = await generateDummyData();
            showAlert('Success', `Dummy data loaded!\n\nAdded:\n• ${result.eggs} egg records\n• ${result.feed} feed records\n• ${result.expenses} expense records\n• ${result.notes} notes`);
        } catch (error) {
            console.error('Error loading dummy data:', error);
            showAlert('Error', 'Failed to load dummy data. Please try again.');
        } finally {
            setLoadingDummy(false);
        }
    };

    const handleResetAndLoadDummy = async () => {
        const message = 'This will delete all existing data and load fresh dummy data. Continue?';

        const confirmReset = Platform.OS === 'web'
            ? window.confirm(message)
            : await new Promise((resolve) => {
                Alert.alert(
                    'Reset & Load Dummy Data',
                    message,
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                        { text: 'Reset & Load', style: 'destructive', onPress: () => resolve(true) },
                    ]
                );
            });

        if (confirmReset) {
            try {
                setLoadingDummy(true);

                // Delete all data first
                await Promise.all([
                    deleteAllEggs(),
                    deleteAllFeed(),
                    deleteAllExpenses(),
                    deleteAllNotes(),
                ]);

                // Load dummy data
                const result = await generateDummyData();
                showAlert('Success', `Data reset and dummy data loaded!\n\nAdded:\n• ${result.eggs} egg records\n• ${result.feed} feed records\n• ${result.expenses} expense records\n• ${result.notes} notes`);
            } catch (error) {
                console.error('Error resetting and loading dummy data:', error);
                showAlert('Error', 'Failed to reset and load dummy data.');
            } finally {
                setLoadingDummy(false);
            }
        }
    };

    const handleDeleteAllData = async () => {
        const message = 'Are you sure you want to delete ALL data? This action cannot be undone.\n\nThis will delete:\n• All egg production records\n• All feed consumption records\n• All expenses\n• All notes\n\nUser accounts will NOT be deleted.';

        // Use window.confirm for web, Alert.alert for native
        const confirmDelete = Platform.OS === 'web'
            ? window.confirm(message)
            : await new Promise((resolve) => {
                Alert.alert(
                    'Delete All Data',
                    message,
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                        { text: 'Delete All', style: 'destructive', onPress: () => resolve(true) },
                    ]
                );
            });

        if (confirmDelete) {
            try {
                setDeleting(true);

                await Promise.all([
                    deleteAllEggs(),
                    deleteAllFeed(),
                    deleteAllExpenses(),
                    deleteAllNotes(),
                ]);

                showAlert('Success', 'All data has been deleted');
            } catch (error) {
                console.error('Error deleting data:', error);
                showAlert('Error', 'Failed to delete data. Please try again.');
            } finally {
                setDeleting(false);
            }
        }
    };

    return (
        <GradientBackground>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backIcon}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {/* Settings Options */}
                <View style={styles.settingsSection}>
                    {/* Load Dummy Data */}
                    <View style={styles.settingCard}>
                        <Text style={styles.settingTitle}>Load Dummy Data</Text>
                        <Text style={styles.settingDescription}>
                            Add sample data for testing: egg production, feed consumption,
                            expenses, and notes for the current month.
                        </Text>
                        <CustomButton
                            title={loadingDummy ? 'Loading...' : 'Add Dummy Data'}
                            onPress={handleLoadDummyData}
                            loading={loadingDummy}
                            disabled={loadingDummy || deleting || exporting}
                            variant="secondary"
                            style={styles.settingButton}
                        />
                    </View>

                    {/* Reset and Load Dummy Data */}
                    <View style={styles.settingCard}>
                        <Text style={styles.settingTitle}>Reset & Load Dummy Data</Text>
                        <Text style={styles.settingDescription}>
                            Clear all existing data and load fresh dummy data.
                            Useful for testing with a clean dataset.
                        </Text>
                        <CustomButton
                            title={loadingDummy ? 'Resetting...' : 'Reset & Load Dummy Data'}
                            onPress={handleResetAndLoadDummy}
                            loading={loadingDummy}
                            disabled={loadingDummy || deleting || exporting}
                            style={styles.settingButton}
                        />
                    </View>

                    {/* Export Data */}
                    <View style={styles.settingCard}>
                        <Text style={styles.settingTitle}>Export Data</Text>
                        <Text style={styles.settingDescription}>
                            Export all farm data (eggs, feed, expenses, notes) as a CSV file.
                            You can save or share this file for backup purposes.
                        </Text>
                        <CustomButton
                            title={exporting ? 'Exporting...' : 'Export All Data as CSV'}
                            onPress={handleExportData}
                            loading={exporting}
                            disabled={exporting || deleting || loadingDummy}
                            variant="secondary"
                            style={styles.settingButton}
                        />
                    </View>

                    {/* Delete Data */}
                    <View style={styles.settingCard}>
                        <Text style={styles.settingTitle}>Delete All Data</Text>
                        <Text style={styles.settingDescription}>
                            Permanently delete all farm records including egg production,
                            feed consumption, expenses, and notes. User accounts will be preserved.
                        </Text>
                        <Text style={styles.warningText}>
                            ⚠️ This action cannot be undone!
                        </Text>
                        <CustomButton
                            title={deleting ? 'Deleting...' : 'Delete All Data'}
                            onPress={handleDeleteAllData}
                            loading={deleting}
                            disabled={exporting || deleting || loadingDummy}
                            variant="danger"
                            style={styles.settingButton}
                        />
                    </View>
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>FarmPal</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                    <Text style={styles.appDescription}>
                        Egg Farm Management System
                    </Text>
                </View>
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 50,
        paddingHorizontal: SIZES.padding,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    backIcon: {
        fontSize: 28,
        color: COLORS.textDark,
        fontWeight: '600',
    },
    title: {
        fontSize: SIZES.xxLarge,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    settingsSection: {
        marginBottom: 30,
    },
    settingCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: 15,
    },
    settingTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 10,
    },
    settingDescription: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.8,
        lineHeight: 22,
        marginBottom: 15,
    },
    warningText: {
        fontSize: SIZES.medium,
        color: '#d32f2f',
        fontWeight: '500',
        marginBottom: 15,
    },
    settingButton: {
        marginTop: 5,
    },
    appInfo: {
        alignItems: 'center',
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: 'rgba(115, 93, 24, 0.2)',
    },
    appName: {
        fontSize: SIZES.xLarge,
        fontWeight: '700',
        color: COLORS.darkBrown,
    },
    appVersion: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.7,
        marginTop: 5,
    },
    appDescription: {
        fontSize: SIZES.small,
        color: COLORS.textDark,
        opacity: 0.6,
        marginTop: 5,
    },
});

export default SettingsScreen;
