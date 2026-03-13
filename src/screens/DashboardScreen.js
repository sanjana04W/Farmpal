// Dashboard Screen for FarmPal
import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    useWindowDimensions,
    ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import Sidebar from '../components/Sidebar';
import SimpleBarChart from '../components/SimpleBarChart';
import NoteCard from '../components/NoteCard';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getEggsByMonth } from '../services/eggService';
import { getFeedByMonth } from '../services/feedService';
import { getExpensesByMonth } from '../services/expenseService';
import { getRecentNotes } from '../services/noteService';
import { getCurrentDateComponents, getDaysInMonth } from '../utils/dateUtils';

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Responsive container width for single column layout
    const containerWidth = Math.min(width - 32, 600);

    // Data states
    const [eggData, setEggData] = useState([]);
    const [feedData, setFeedData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [notes, setNotes] = useState([]);


    const loadData = async () => {
        try {
            const { month, year } = getCurrentDateComponents();

            // Load each data source independently to prevent one failure from blocking others
            try {
                const eggs = await getEggsByMonth(month, year);
                setEggData(eggs || []);
            } catch (e) {
                console.error('Error loading egg data:', e);
                setEggData([]);
            }

            try {
                const feed = await getFeedByMonth(month, year);
                setFeedData(feed || []);
            } catch (e) {
                console.error('Error loading feed data:', e);
                setFeedData([]);
            }

            try {
                const expenses = await getExpensesByMonth(month, year);
                setExpenseData(expenses || []);
            } catch (e) {
                console.error('Error loading expense data:', e);
                setExpenseData([]);
            }

            try {
                const recentNotes = await getRecentNotes(5);
                setNotes(recentNotes || []);
            } catch (e) {
                console.error('Error loading notes:', e);
                setNotes([]);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // Prepare chart data
    const prepareChartData = (data, valueKey = 'count') => {
        const { month, year } = getCurrentDateComponents();
        const daysInMonth = getDaysInMonth(month, year);
        const chartData = new Array(Math.min(daysInMonth, 15)).fill(0);
        const labels = [];

        for (let i = 0; i < Math.min(daysInMonth, 15); i++) {
            labels.push(`${i + 1}`);
            const record = data.find(r => r.day === i + 1);
            if (record) {
                chartData[i] = record[valueKey] || record.count || record.amount || 0;
            }
        }

        return { data: chartData, labels };
    };

    // Aggregate expenses by day for chart
    const prepareExpenseChartData = () => {
        const { month, year } = getCurrentDateComponents();
        const daysInMonth = getDaysInMonth(month, year);
        const chartData = new Array(Math.min(daysInMonth, 15)).fill(0);
        const labels = [];

        for (let i = 0; i < Math.min(daysInMonth, 15); i++) {
            labels.push(`${i + 1}`);
            const dayExpenses = expenseData.filter(e => e.day === i + 1);
            chartData[i] = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
        }

        return { data: chartData, labels };
    };

    const getRoleDisplay = () => {
        switch (user?.role) {
            case 'owner':
                return 'Admin';
            case 'manager':
                return 'Manager';
            case 'operator':
                return 'Operator';
            default:
                return user?.role || '';
        }
    };

    const eggChartData = prepareChartData(eggData, 'count');
    const feedChartData = prepareChartData(feedData, 'amount');
    const expenseChartData = prepareExpenseChartData();

    if (loading) {
        return (
            <GradientBackground>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.darkBrown} />
                </View>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setSidebarVisible(true)}
                    >
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                    <Text style={styles.greeting}>Hi {user?.name || 'User'},</Text>
                </View>

                {/* Welcome Message */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Welcome to</Text>
                    <Text style={styles.farmName}>Sunrise Farm</Text>
                    <Text style={styles.roleText}>{getRoleDisplay()}</Text>
                </View>

                {/* Dashboard Cards - Single Column Layout */}
                <View style={styles.cardsContainer}>
                    {/* Egg Production Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('EggProduction')}
                    >
                        <Text style={styles.cardTitle}>Egg Production</Text>
                        <SimpleBarChart
                            data={eggChartData.data}
                            labels={eggChartData.labels}
                            height={120}
                            width={containerWidth - 48}
                        />
                    </TouchableOpacity>

                    {/* Feed Consumption Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('FeedConsumption')}
                    >
                        <Text style={styles.cardTitle}>Food consumption</Text>
                        <SimpleBarChart
                            data={feedChartData.data}
                            labels={feedChartData.labels}
                            height={120}
                            width={containerWidth - 48}
                        />
                    </TouchableOpacity>

                    {/* Expenses Card - Hidden for operators */}
                    {user?.role !== 'operator' && (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('Expenses')}
                        >
                            <Text style={styles.cardTitle}>Expenses</Text>
                            <SimpleBarChart
                                data={expenseChartData.data}
                                labels={expenseChartData.labels}
                                height={120}
                                width={containerWidth - 48}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Recent Notes Section */}
                <View style={styles.notesSection}>
                    <View style={styles.notesSectionHeader}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Notes')}>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {notes.length === 0 ? (
                        <View style={styles.emptyNotes}>
                            <Text style={styles.emptyNotesText}>No notes yet</Text>
                        </View>
                    ) : (
                        notes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Sidebar */}
            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                navigation={navigation}
            />
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 50,
        paddingHorizontal: SIZES.padding,
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuButton: {
        padding: 10,
        marginRight: 10,
    },
    menuIcon: {
        fontSize: 28,
        color: COLORS.textDark,
    },
    greeting: {
        fontSize: SIZES.xLarge,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    welcomeText: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
    },
    farmName: {
        fontSize: SIZES.xxLarge,
        fontWeight: '700',
        color: COLORS.textDark,
        marginVertical: 5,
    },
    roleText: {
        fontSize: SIZES.medium,
        color: COLORS.darkBrown,
        fontWeight: '500',
    },
    cardsContainer: {
        flexDirection: 'column',
        gap: 12,
        marginBottom: 25,
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    cardTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 12,
        textAlign: 'center',
    },
    notesSection: {
        marginTop: 10,
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%',
    },
    notesSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: SIZES.xLarge,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    seeAllText: {
        fontSize: SIZES.medium,
        color: COLORS.darkBrown,
        fontWeight: '500',
    },
    emptyNotes: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: 30,
        alignItems: 'center',
    },
    emptyNotesText: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.6,
    },
});

export default DashboardScreen;
