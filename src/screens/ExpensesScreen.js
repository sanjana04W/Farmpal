// Expenses Screen for FarmPal
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
import { addExpenseRecord, getExpensesByMonth } from '../services/expenseService';
import { getCurrentDateComponents, getDaysInMonth } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const ExpensesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expenseData, setExpenseData] = useState([]);
    const [amountInput, setAmountInput] = useState('');
    const [noteInput, setNoteInput] = useState('');

    // Month selection
    const { month: currentMonth, year: currentYear } = getCurrentDateComponents();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getExpensesByMonth(selectedMonth, selectedYear);
            setExpenseData(data);
        } catch (error) {
            console.error('Error loading expense data:', error);
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
        const amount = parseFloat(amountInput);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid amount in LKR');
            return;
        }

        if (!noteInput.trim()) {
            Alert.alert('Missing Note', 'Please add a description for this expense');
            return;
        }

        try {
            setSubmitting(true);
            await addExpenseRecord(amount, noteInput.trim());
            setAmountInput('');
            setNoteInput('');
            await loadData();
            Alert.alert('Success', `Added expense of ${amount.toLocaleString()} LKR`);
        } catch (error) {
            console.error('Error adding expense record:', error);
            Alert.alert('Error', 'Failed to add record. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleMonthSelect = (month, year) => {
        setSelectedMonth(month);
        setSelectedYear(year);
    };

    // Prepare chart data - aggregate expenses by day
    const prepareChartData = () => {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const chartData = new Array(daysInMonth).fill(0);
        const labels = [];

        for (let i = 0; i < daysInMonth; i++) {
            labels.push(`${i + 1}`);
            const dayExpenses = expenseData.filter(e => e.day === i + 1);
            chartData[i] = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
        }

        const maxLabels = 15;
        const step = Math.ceil(daysInMonth / maxLabels);
        const filteredLabels = labels.filter((_, i) => i % step === 0);

        return {
            data: chartData,
            labels: filteredLabels,
            allData: chartData
        };
    };

    const totalExpenses = expenseData.reduce((sum, record) => sum + record.amount, 0);
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
                        <Text style={styles.title}>Expenses</Text>
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
                                <Text style={styles.totalValue}>{totalExpenses.toLocaleString()} LKR</Text>
                            </View>

                            {/* Input Section - Only show for current month */}
                            {selectedMonth === currentMonth && selectedYear === currentYear && (
                                <View style={styles.inputSection}>
                                    <TextInput
                                        style={styles.input}
                                        value={amountInput}
                                        onChangeText={setAmountInput}
                                        placeholder="Enter amount (LKR)"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        keyboardType="decimal-pad"
                                    />
                                    <TextInput
                                        style={[styles.input, styles.noteInput]}
                                        value={noteInput}
                                        onChangeText={setNoteInput}
                                        placeholder="Enter expense description"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        multiline
                                    />
                                    <CustomButton
                                        title="Add"
                                        onPress={handleAddRecord}
                                        loading={submitting}
                                        disabled={!amountInput.trim() || !noteInput.trim()}
                                        style={styles.addButton}
                                    />
                                </View>
                            )}

                            {/* Records Table */}
                            <View style={styles.tableSection}>
                                <Text style={styles.sectionTitle}>Records</Text>
                                <DataTable data={expenseData} type="expense" />
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
    input: {
        height: SIZES.inputHeight,
        backgroundColor: COLORS.inputBackground,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        fontSize: SIZES.medium,
        color: COLORS.inputText,
        marginBottom: 10,
    },
    noteInput: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    addButton: {
        marginTop: 5,
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

export default ExpensesScreen;
