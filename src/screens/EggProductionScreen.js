// Egg Production Screen for FarmPal
import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import DataChart from '../components/DataChart';
import DataTable from '../components/DataTable';
import MonthSelector from '../components/MonthSelector';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES } from '../constants/theme';
import { addEggRecord, getEggsByMonth } from '../services/eggService';
import { getCurrentDateComponents, getDaysInMonth, getMonthName } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const EggProductionScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [eggData, setEggData] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Month selection
    const { month: currentMonth, year: currentYear } = getCurrentDateComponents();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getEggsByMonth(selectedMonth, selectedYear);
            setEggData(data);
        } catch (error) {
            console.error('Error loading egg data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [selectedMonth, selectedYear])
    );

    useEffect(() => {
        loadData();
    }, [selectedMonth, selectedYear]);

    const handleAddRecord = async () => {
        const count = parseInt(inputValue, 10);
        if (isNaN(count) || count <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of eggs');
            return;
        }

        try {
            setSubmitting(true);
            await addEggRecord(count);
            setInputValue('');
            // Reload data to show updated record
            await loadData();
            Alert.alert('Success', `Added ${count} eggs`);
        } catch (error) {
            console.error('Error adding egg record:', error);
            Alert.alert('Error', 'Failed to add record. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMonthSelect = (month, year) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    // Prepare chart data
    const prepareChartData = () => {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const chartData = new Array(daysInMonth).fill(0);
        const labels = [];

        for (let i = 0; i < daysInMonth; i++) {
            labels.push(`${i + 1}`);
            const record = eggData.find(r => r.day === i + 1);
            if (record) {
                chartData[i] = record.count;
            }
        }

        // Limit labels for readability
        const maxLabels = 15;
        const step = Math.ceil(daysInMonth / maxLabels);
        const filteredLabels = labels.filter((_, i) => i % step === 0);

        return {
            data: chartData,
            labels: filteredLabels,
            allData: chartData
        };
    };

    const totalEggs = eggData.reduce((sum, record) => sum + record.count, 0);
    const chartData = prepareChartData();

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backIcon}>{'<'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Egg Production</Text>
                    </View>

                    {/* Month Selector */}
                    <MonthSelector
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onSelect={handleMonthSelect}
                    />

                    {/* Chart */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.darkBrown} />
                        </View>
                    ) : (
                        <>
                            <View style={styles.chartContainer}>
                                <DataChart
                                    data={chartData.allData}
                                    labels={chartData.labels}
                                    height={220}
                                    width={width - 40}
                                />
                            </View>

                            {/* Total */}
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total: </Text>
                                <Text style={styles.totalValue}>{totalEggs.toLocaleString()} Eggs</Text>
                            </View>

                            {/* Input Section - Only show for current month */}
                            {selectedMonth === currentMonth && selectedYear === currentYear && (
                                <View style={styles.inputSection}>
                                    <View style={styles.inputRow}>
                                        <TextInput
                                            style={styles.input}
                                            value={inputValue}
                                            onChangeText={setInputValue}
                                            placeholder="Enter egg count"
                                            placeholderTextColor="rgba(255,255,255,0.6)"
                                            keyboardType="numeric"
                                        />
                                        <CustomButton
                                            title="Add"
                                            onPress={handleAddRecord}
                                            loading={submitting}
                                            disabled={!inputValue.trim()}
                                            style={styles.addButton}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Records Table */}
                            <View style={styles.tableSection}>
                                <Text style={styles.sectionTitle}>Records</Text>
                                <DataTable data={eggData} type="egg" />
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        marginBottom: 20,
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
    loadingContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 15,
        backgroundColor: COLORS.lightYellow,
        borderRadius: SIZES.radius,
        padding: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    },
    totalLabel: {
        fontSize: SIZES.xLarge,
        color: COLORS.textDark,
    },
    totalValue: {
        fontSize: SIZES.xLarge,
        fontWeight: '700',
        color: COLORS.darkBrown,
    },
    inputSection: {
        marginVertical: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: SIZES.inputHeight,
        backgroundColor: COLORS.inputBackground,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        fontSize: SIZES.medium,
        color: COLORS.inputText,
        marginRight: 10,
    },
    addButton: {
        width: 80,
    },
    tableSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: SIZES.xLarge,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 15,
    },
});

export default EggProductionScreen;
