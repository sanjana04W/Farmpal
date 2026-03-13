// Input Field Component for FarmPal
import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    style,
    inputStyle,
    error,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multiline,
                    error && styles.inputError,
                    inputStyle,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SIZES.margin,
    },
    label: {
        fontSize: SIZES.medium,
        color: COLORS.textDark,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: SIZES.inputHeight,
        backgroundColor: COLORS.inputBackground,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        fontSize: SIZES.medium,
        color: COLORS.inputText,
    },
    multiline: {
        height: 100,
        paddingTop: 12,
        paddingBottom: 12,
    },
    inputError: {
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    errorText: {
        fontSize: SIZES.small,
        color: COLORS.error,
        marginTop: 4,
    },
});

export default InputField;
