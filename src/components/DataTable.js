// Data Table Component for FarmPal
import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';

const DataTable = ({
    data = [],
    type = 'egg', // 'egg', 'feed', 'expense'
    style,
    maxItems = 10,
}) => {
    // Get icon based on type
    const getIcon = () => {
        switch (type) {
            case 'egg':
                return require('../../assets/icons/egg.png');
            case 'feed':
                return require('../../assets/icons/sack.png');
            case 'expense':
                return require('../../assets/icons/money.png');
            default:
                return require('../../assets/icons/egg.png');
        }
    };

    // Get unit based on type
    const getUnit = () => {
        switch (type) {
            case 'egg':
                return 'Eggs';
            case 'feed':
                return 'Kg';
            case 'expense':
                return 'LKR';
            default:
                return '';
        }
    };

    // Get value field based on type
    const getValue = (item) => {
        switch (type) {
            case 'egg':
                return item.count;
            case 'feed':
                return item.amount;
            case 'expense':
                return item.amount;
            default:
                return 0;
        }
    };

    // Sort data by date (newest first)
    const sortedData = [...data]
        .sort((a, b) => {
            const dateA = new Date(a.year, a.month - 1, a.day);
            const dateB = new Date(b.year, b.month - 1, b.day);
            return dateB - dateA;
        })
        .slice(0, maxItems);

    if (sortedData.length === 0) {
        return (
            <View style={[styles.container, styles.emptyContainer, style]}>
                <Text style={styles.emptyText}>No records yet</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            {sortedData.map((item, index) => (
                <View key={item.id || index} style={styles.row}>
                    <Image source={getIcon()} style={styles.icon} resizeMode="contain" />
                    <View style={styles.content}>
                        <Text style={styles.date}>
                            {formatDate(item.day, item.month, item.year)}
                        </Text>
                        {type === 'expense' && item.note && (
                            <Text style={styles.note} numberOfLines={1}>{item.note}</Text>
                        )}
                    </View>
                    <Text style={styles.value}>
                        {getValue(item).toLocaleString()} {getUnit()}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    emptyText: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(115, 93, 24, 0.1)',
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    date: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        fontWeight: '500',
    },
    note: {
        fontSize: SIZES.small,
        color: COLORS.textDark,
        opacity: 0.7,
        marginTop: 2,
    },
    value: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        fontWeight: '600',
    },
});

export default DataTable;
