// Data Chart Component for FarmPal - Improved graphical display
import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS, SIZES } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

const DataChart = ({
    data = [],
    labels = [],
    title,
    height = 220,
    width = screenWidth - 40,
    yAxisSuffix = '',
    style,
    mini = false,
}) => {
    // Ensure we have valid data
    const validData = data.length > 0 ? data.map(d => (isNaN(d) || d === null ? 0 : d)) : [0, 0, 0, 0, 0];
    const validLabels = labels.length > 0 ? labels : validData.map((_, i) => `${i + 1}`);

    // For mini charts, show fewer labels
    const displayLabels = mini
        ? validLabels.map((l, i) => i % 3 === 0 ? l : '')
        : validLabels;

    const chartData = {
        labels: displayLabels,
        datasets: [
            {
                data: validData,
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: COLORS.cardBackground,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: COLORS.cardBackground,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(139, 90, 43, ${opacity})`,
        labelColor: (opacity = 1) => COLORS.textDark,
        style: {
            borderRadius: SIZES.radius,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            strokeWidth: mini ? 0 : 1,
            stroke: 'rgba(115, 93, 24, 0.15)',
        },
        barPercentage: mini ? 0.5 : 0.6,
        fillShadowGradient: COLORS.darkBrown,
        fillShadowGradientOpacity: 1,
        propsForLabels: {
            fontSize: mini ? 9 : 11,
        },
    };

    // Check if all data is zero
    const hasData = validData.some(d => d > 0);

    // For mini charts, always show the chart even if empty (with placeholder text overlay)
    const chartHeight = height;

    if (!hasData) {
        return (
            <View style={[styles.container, styles.emptyContainer, { width, height: chartHeight }, style]}>
                <Text style={styles.emptyText}>No data yet</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.chartWrapper}>
                <BarChart
                    data={chartData}
                    width={width}
                    height={chartHeight}
                    yAxisSuffix={yAxisSuffix}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    fromZero
                    showValuesOnTopOfBars={!mini}
                    withInnerLines={!mini}
                    withHorizontalLabels={!mini}
                    showBarTops={true}
                    flatColor={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 10,
    },
    chartWrapper: {
        overflow: 'hidden',
        borderRadius: SIZES.radius,
    },
    chart: {
        marginLeft: -16,
        borderRadius: SIZES.radius,
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

export default DataChart;
