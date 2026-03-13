// CSV Export utility for FarmPal - Web compatible
import { Platform } from 'react-native';

/**
 * Convert array of objects to CSV string
 */
const arrayToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    data.forEach(item => {
        const values = headers.map(header => {
            const value = item[header] !== undefined ? item[header] : '';
            // Escape commas and quotes in values
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
};

/**
 * Download CSV on web platform
 */
const downloadCSVWeb = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export data to CSV file
 */
export const exportAllDataToCSV = async (allData) => {
    try {
        const timestamp = new Date().toISOString().split('T')[0];
        let fullCSV = '';

        // Export eggs data
        if (allData.eggs && allData.eggs.length > 0) {
            fullCSV += '=== EGG PRODUCTION ===\n';
            fullCSV += arrayToCSV(allData.eggs, ['day', 'month', 'year', 'count']);
            fullCSV += '\n\n';
        }

        // Export feed data
        if (allData.feed && allData.feed.length > 0) {
            fullCSV += '=== FEED CONSUMPTION ===\n';
            fullCSV += arrayToCSV(allData.feed, ['day', 'month', 'year', 'amount']);
            fullCSV += '\n\n';
        }

        // Export expenses data
        if (allData.expenses && allData.expenses.length > 0) {
            fullCSV += '=== EXPENSES ===\n';
            fullCSV += arrayToCSV(allData.expenses, ['day', 'month', 'year', 'amount', 'note']);
            fullCSV += '\n\n';
        }

        // Export notes data
        if (allData.notes && allData.notes.length > 0) {
            fullCSV += '=== NOTES ===\n';
            fullCSV += arrayToCSV(allData.notes, ['day', 'month', 'year', 'title', 'category', 'description']);
            fullCSV += '\n\n';
        }

        // Export users data
        if (allData.users && allData.users.length > 0) {
            fullCSV += '=== USERS ===\n';
            fullCSV += arrayToCSV(allData.users, ['name', 'username', 'role']);
            fullCSV += '\n\n';
        }

        if (!fullCSV) {
            throw new Error('No data to export');
        }

        const filename = `farmpal_export_${timestamp}.csv`;

        if (Platform.OS === 'web') {
            // Web platform - use browser download
            downloadCSVWeb(fullCSV, filename);
        } else {
            // Native platforms - use expo-file-system and expo-sharing
            const FileSystem = require('expo-file-system');
            const Sharing = require('expo-sharing');

            const fileUri = FileSystem.documentDirectory + filename;
            await FileSystem.writeAsStringAsync(fileUri, fullCSV, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export FarmPal Data',
                });
            }
        }

        return true;
    } catch (error) {
        console.error('Error exporting CSV:', error);
        throw error;
    }
};

export default { exportAllDataToCSV };
