// Simple Bar Chart Component for Dashboard - No external library, pure React Native
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const SimpleBarChart = ({ data = [], labels = [], height = 100, width = 300, style }) => {
    // Ensure we have valid data
    const validData = data.length > 0 ? data.map(d => (isNaN(d) || d === null ? 0 : d)) : [0, 0, 0, 0, 0];
    const validLabels = labels.length > 0 ? labels : validData.map((_, i) => `${i + 1}`);

    // Get max value for scaling
    const maxValue = Math.max(...validData, 1); // Ensure at least 1 to avoid division by 0

    // Calculate bar width
    const barCount = validData.length;
    const barWidth = Math.max(8, (width - 20) / barCount - 4);
    const barHeight = height - 30; // Leave space for labels

    // Check if any data
    const hasData = validData.some(d => d > 0);

    if (!hasData) {
        return (
            <View style={[styles.container, { width, height }, styles.emptyContainer, style]}>
                <Text style={styles.emptyText}>No data yet</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { width, height }, style]}>
            <View style={styles.barsContainer}>
                {validData.map((value, index) => {
                    const barHeightPercent = (value / maxValue) * barHeight;
                    return (
                        <View key={index} style={styles.barWrapper}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: Math.max(barHeightPercent, 2),
                                        width: barWidth,
                                        backgroundColor: value > 0 ? COLORS.darkBrown : 'rgba(139, 90, 43, 0.3)',
                                    }
                                ]}
                            />
                            <Text style={styles.label} numberOfLines={1}>
                                {index % 3 === 0 ? validLabels[index] : ''}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        flex: 1,
        paddingBottom: 20,
    },
    barWrapper: {
        alignItems: 'center',
        marginHorizontal: 2,
    },
    bar: {
        borderRadius: 3,
        minHeight: 2,
    },
    label: {
        fontSize: 9,
        color: COLORS.textDark,
        marginTop: 4,
        opacity: 0.7,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 220, 100, 0.3)',
        borderRadius: SIZES.radius,
    },
    emptyText: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.6,
    },
});

export default SimpleBarChart;
