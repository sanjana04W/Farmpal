// Custom Button Component for FarmPal
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CustomButton = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
    variant = 'primary' // 'primary', 'secondary', 'danger'
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'danger':
                return styles.dangerButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryText;
            case 'danger':
                return styles.dangerText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.textWhite} size="small" />
            ) : (
                <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: SIZES.buttonHeight,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
    },
    primaryButton: {
        backgroundColor: COLORS.darkBrown,
    },
    secondaryButton: {
        backgroundColor: COLORS.lightYellow,
        borderWidth: 1,
        borderColor: COLORS.darkYellow,
    },
    dangerButton: {
        backgroundColor: '#d32f2f',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: SIZES.large,
        fontWeight: '600',
    },
    primaryText: {
        color: COLORS.textWhite,
    },
    secondaryText: {
        color: COLORS.textDark,
    },
    dangerText: {
        color: COLORS.textWhite,
    },
});

export default CustomButton;
