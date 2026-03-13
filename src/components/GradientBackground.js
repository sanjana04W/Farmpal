// Gradient Background Component for FarmPal
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

const GradientBackground = ({ children, style }) => {
    return (
        <LinearGradient
            colors={[COLORS.gradientTop, COLORS.gradientBottom]}
            style={[styles.gradient, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});

export default GradientBackground;
