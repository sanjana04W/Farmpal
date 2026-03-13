// Access Control Screen for FarmPal
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
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import GradientBackground from '../components/GradientBackground';
import UserCard from '../components/UserCard';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES } from '../constants/theme';
import { getAllUsers, addUser, deleteUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const AccessControlScreen = ({ navigation }) => {
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [users, setUsers] = useState([]);

    // Form inputs
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('operator');

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const handleAddUser = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Name', 'Please enter the user\'s name');
            return;
        }

        if (!username.trim()) {
            Alert.alert('Missing Username', 'Please enter a username');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Missing Password', 'Please enter a password');
            return;
        }

        // Check for duplicate username
        const existingUser = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
        if (existingUser) {
            Alert.alert('Username Exists', 'This username is already taken');
            return;
        }

        try {
            setSubmitting(true);
            await addUser(name.trim(), username.trim(), password.trim(), role);
            setName('');
            setUsername('');
            setPassword('');
            setRole('operator');
            await loadData();
            Alert.alert('Success', 'User added successfully');
        } catch (error) {
            console.error('Error adding user:', error);
            Alert.alert('Error', 'Failed to add user. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const userToDelete = users.find(u => u.id === userId);

        if (userToDelete?.id === currentUser?.id) {
            if (Platform.OS === 'web') {
                window.alert('You cannot delete your own account');
            } else {
                Alert.alert('Cannot Delete', 'You cannot delete your own account');
            }
            return;
        }

        // Use window.confirm for web, Alert.alert for native
        const confirmDelete = Platform.OS === 'web'
            ? window.confirm(`Are you sure you want to delete ${userToDelete?.name}?`)
            : await new Promise((resolve) => {
                Alert.alert(
                    'Confirm Delete',
                    `Are you sure you want to delete ${userToDelete?.name}?`,
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                        { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
                    ]
                );
            });

        if (confirmDelete) {
            try {
                await deleteUser(userId);
                await loadData();
                if (Platform.OS === 'web') {
                    window.alert('User deleted successfully');
                } else {
                    Alert.alert('Success', 'User deleted successfully');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                if (Platform.OS === 'web') {
                    window.alert('Failed to delete user');
                } else {
                    Alert.alert('Error', 'Failed to delete user');
                }
            }
        }
    };

    const roleOptions = [
        { value: 'operator', label: 'Operator' },
        { value: 'manager', label: 'Manager' },
        { value: 'owner', label: 'Owner' },
    ];

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
                        <Text style={styles.title}>Access Control</Text>
                    </View>

                    {/* Add User Form */}
                    <View style={styles.formSection}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                        />

                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="User name"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                        />

                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={role}
                                onValueChange={setRole}
                                style={styles.picker}
                                dropdownIconColor={COLORS.textWhite}
                            >
                                {roleOptions.map(option => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        color={Platform.OS === 'ios' ? COLORS.textDark : undefined}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <CustomButton
                            title="Add User"
                            onPress={handleAddUser}
                            loading={submitting}
                            disabled={!name.trim() || !username.trim() || !password.trim()}
                        />
                    </View>

                    {/* Users List */}
                    <View style={styles.usersSection}>
                        <Text style={styles.sectionTitle}>Users</Text>

                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.darkBrown} />
                            </View>
                        ) : users.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No users found</Text>
                            </View>
                        ) : (
                            users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onDelete={handleDeleteUser}
                                    currentUserId={currentUser?.id}
                                />
                            ))
                        )}
                    </View>
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
    formSection: {
        marginBottom: 25,
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
    pickerContainer: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: SIZES.radius,
        marginBottom: 10,
        overflow: 'hidden',
    },
    picker: {
        height: SIZES.inputHeight,
        color: COLORS.inputText,
    },
    usersSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: SIZES.xLarge,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 15,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.6,
    },
});

export default AccessControlScreen;
