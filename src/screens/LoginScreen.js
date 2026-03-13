// Login Screen for FarmPal
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from 'react-native';
import GradientBackground from '../components/GradientBackground';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error, clearError } = useAuth();

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            return;
        }
        clearError();
        await login(username.trim(), password);
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/icons/mainlogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>Farm Pal</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <InputField
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (error) clearError();
                            }}
                            placeholder="Username"
                        />

                        <InputField
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (error) clearError();
                            }}
                            placeholder="Password"
                            secureTextEntry
                        />

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <CustomButton
                            title="Log in"
                            onPress={handleLogin}
                            loading={isLoading}
                            disabled={!username.trim() || !password.trim()}
                            style={styles.loginButton}
                        />
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding * 1.5,
        paddingVertical: SIZES.padding * 2,
        minHeight: height,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 400,
        height: 400,
        marginBottom: -60,
    },
    appName: {
        fontSize: SIZES.xxxLarge,
        fontWeight: '700',
        color: COLORS.darkBrown,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
    },
    errorText: {
        color: COLORS.error,
        fontSize: SIZES.medium,
        textAlign: 'center',
        marginBottom: SIZES.margin,
    },
    loginButton: {
        marginTop: 10,
    },
});

export default LoginScreen;
