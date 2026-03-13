// Month Selector Component for FarmPal
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { getLastMonths } from '../utils/dateUtils';

const MonthSelector = ({
    selectedMonth,
    selectedYear,
    onSelect,
    monthsToShow = 6,
    style,
}) => {
    const months = getLastMonths(monthsToShow);

    const isSelected = (month, year) => {
        return month === selectedMonth && year === selectedYear;
    };

    return (
        <View style={[styles.container, style]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {months.map((item, index) => (
                    <TouchableOpacity
                        key={`${item.month}-${item.year}`}
                        style={[
                            styles.monthButton,
                            isSelected(item.month, item.year) && styles.selectedButton,
                        ]}
                        onPress={() => onSelect(item.month, item.year)}
                    >
                        <Text
                            style={[
                                styles.monthText,
                                isSelected(item.month, item.year) && styles.selectedText,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    scrollContent: {
        paddingHorizontal: 5,
    },
    monthButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.cardBackground,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: COLORS.darkYellow,
    },
    selectedButton: {
        backgroundColor: COLORS.darkBrown,
        borderColor: COLORS.darkBrown,
    },
    monthText: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        fontWeight: '500',
    },
    selectedText: {
        color: COLORS.textWhite,
    },
});

export default MonthSelector;
