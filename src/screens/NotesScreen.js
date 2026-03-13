// Notes Screen for FarmPal
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
import NoteCard from '../components/NoteCard';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES, NOTE_CATEGORIES } from '../constants/theme';
import { addNote, getAllNotes } from '../services/noteService';

const NotesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [notes, setNotes] = useState([]);

    // Form inputs
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('other');
    const [description, setDescription] = useState('');

    // Filter
    const [filterCategory, setFilterCategory] = useState('all');

    const loadData = async () => {
        try {
            setLoading(true);
            const filter = filterCategory === 'all' ? null : filterCategory;
            const data = await getAllNotes(filter);
            setNotes(data);
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [filterCategory])
    );

    useEffect(() => {
        loadData();
    }, [filterCategory]);

    const handleAddNote = async () => {
        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please enter a title for the note');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Missing Description', 'Please enter a description');
            return;
        }

        try {
            setSubmitting(true);
            await addNote(title.trim(), category, description.trim());
            setTitle('');
            setDescription('');
            setCategory('other');
            await loadData();
            Alert.alert('Success', 'Note added successfully');
        } catch (error) {
            console.error('Error adding note:', error);
            Alert.alert('Error', 'Failed to add note. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'employee', label: 'Employee Related' },
        { value: 'office', label: 'Office Related' },
        { value: 'health', label: 'Health Related' },
        { value: 'dead_chicks', label: 'Report Dead Chicks' },
        { value: 'other', label: 'Other' },
    ];

    const inputCategoryOptions = categoryOptions.filter(c => c.value !== 'all');

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
                        <Text style={styles.title}>Notes</Text>
                    </View>

                    {/* Input Form */}
                    <View style={styles.formSection}>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Title"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                        />

                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={category}
                                onValueChange={setCategory}
                                style={styles.picker}
                                dropdownIconColor={COLORS.textWhite}
                            >
                                {inputCategoryOptions.map(option => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        color={Platform.OS === 'ios' ? COLORS.textDark : undefined}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Description"
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <CustomButton
                            title="Add"
                            onPress={handleAddNote}
                            loading={submitting}
                            disabled={!title.trim() || !description.trim()}
                        />
                    </View>

                    {/* Filter */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Filter by category:</Text>
                        <View style={styles.filterPickerContainer}>
                            <Picker
                                selectedValue={filterCategory}
                                onValueChange={setFilterCategory}
                                style={styles.filterPicker}
                                dropdownIconColor={COLORS.textDark}
                            >
                                {categoryOptions.map(option => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        color={Platform.OS === 'ios' ? COLORS.textDark : undefined}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Notes List */}
                    <View style={styles.notesSection}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.darkBrown} />
                            </View>
                        ) : notes.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No notes found</Text>
                            </View>
                        ) : (
                            notes.map((note) => (
                                <NoteCard key={note.id} note={note} />
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
    descriptionInput: {
        height: 100,
        paddingTop: 12,
        paddingBottom: 12,
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
    filterSection: {
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        marginBottom: 8,
        fontWeight: '500',
    },
    filterPickerContainer: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: COLORS.darkYellow,
        overflow: 'hidden',
    },
    filterPicker: {
        height: SIZES.inputHeight,
        color: COLORS.textDark,
    },
    notesSection: {
        marginTop: 10,
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

export default NotesScreen;
