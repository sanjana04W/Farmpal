// User Card Component for FarmPal
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const UserCard = ({ user, onDelete, currentUserId, style }) => {
    const [expanded, setExpanded] = useState(false);

    const isCurrentUser = user.id === currentUserId;

    const getRoleLabel = () => {
        switch (user.role) {
            case 'owner':
                return 'Owner';
            case 'manager':
                return 'Manager';
            case 'operator':
                return 'Operator';
            default:
                return user.role;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <Image
                    source={require('../../assets/icons/user.png')}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <View style={styles.headerContent}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.role}>{getRoleLabel()}</Text>
                </View>
                {isCurrentUser && (
                    <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>You</Text>
                    </View>
                )}
            </View>

            {expanded && (
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Username:</Text>
                        <Text style={styles.detailValue}>{user.username}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Password:</Text>
                        <Text style={styles.detailValue}>{user.password}</Text>
                    </View>

                    {!isCurrentUser && (
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDelete(user.id)}
                        >
                            <Image
                                source={require('../../assets/icons/delete.png')}
                                style={styles.deleteIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.deleteText}>Delete User</Text>
                        </TouchableOpacity>
                    )}
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
    name: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    role: {
        fontSize: SIZES.small,
        color: COLORS.textDark,
        opacity: 0.7,
        marginTop: 2,
    },
    currentBadge: {
        backgroundColor: COLORS.darkBrown,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    currentBadgeText: {
        fontSize: SIZES.small,
        color: COLORS.textWhite,
        fontWeight: '500',
    },
    detailsContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(115, 93, 24, 0.2)',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        opacity: 0.7,
        width: 90,
    },
    detailValue: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        fontWeight: '500',
        flex: 1,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d32f2f',
        padding: 12,
        borderRadius: SIZES.radius,
        marginTop: 12,
    },
    deleteIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
        tintColor: COLORS.textWhite,
    },
    deleteText: {
        fontSize: SIZES.medium,
        color: COLORS.textWhite,
        fontWeight: '600',
    },
});

export default UserCard;
