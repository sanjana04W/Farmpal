// Note Card Component for FarmPal
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, NOTE_CATEGORIES } from '../constants/theme';
import { formatDate } from '../utils/dateUtils';

const NoteCard = ({ note, style }) => {
    const [expanded, setExpanded] = useState(false);

    // Get category icon
    const getCategoryIcon = () => {
        switch (note.category) {
            case 'employee':
                return require('../../assets/icons/employee.png');
            case 'office':
                return require('../../assets/icons/office.png');
            case 'health':
                return require('../../assets/icons/doctor.png');
            case 'dead_chicks':
                return require('../../assets/icons/dead.png');
            case 'other':
            default:
                return require('../../assets/icons/other.png');
        }
    };

    // Get category label
    const getCategoryLabel = () => {
        return NOTE_CATEGORIES[note.category]?.label || 'Other';
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <Image source={getCategoryIcon()} style={styles.icon} resizeMode="contain" />
                <View style={styles.headerContent}>
                    <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>
                        {note.title}
                    </Text>
                    <Text style={styles.category}>{getCategoryLabel()}</Text>
                </View>
                <Text style={styles.date}>
                    {formatDate(note.day, note.month, note.year)}
                </Text>
            </View>
            {expanded && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>{note.description}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 36,
        height: 36,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    category: {
        fontSize: SIZES.small,
        color: COLORS.textDark,
        opacity: 0.7,
        marginTop: 2,
    },
    date: {
        fontSize: SIZES.small,
        color: COLORS.textDark,
        opacity: 0.7,
    },
    descriptionContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(115, 93, 24, 0.2)',
    },
    description: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        lineHeight: 22,
    },
});

export default NoteCard;
