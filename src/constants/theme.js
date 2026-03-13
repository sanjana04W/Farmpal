// FarmPal Theme Constants
export const COLORS = {
    // Gradient colors
    gradientTop: '#ffdc7e',
    gradientBottom: '#e0bba9',

    // Primary colors
    darkBrown: '#c4910f',
    lightYellow: '#ffcf49',
    darkYellow: '#c69f2a',

    // Text colors
    textDark: '#735d18',
    textBlack: '#000000',
    textWhite: '#ffffff',

    // UI colors
    inputBackground: '#4a4a4a',
    inputText: '#ffffff',
    buttonPrimary: '#c4910f',
    buttonText: '#ffffff',
    cardBackground: '#ffcf49',
    cardBackgroundLight: '#ffe082',
    error: '#d32f2f',
    success: '#388e3c',
};

export const FONTS = {
    regular: 'System',
    bold: 'System',
};

export const SIZES = {
    // Font sizes
    xSmall: 10,
    small: 12,
    medium: 14,
    large: 16,
    xLarge: 20,
    xxLarge: 24,
    xxxLarge: 32,

    // Spacing
    padding: 16,
    margin: 16,
    radius: 12,
    radiusLarge: 20,

    // Component sizes
    buttonHeight: 50,
    inputHeight: 50,
    iconSize: 24,
    iconSizeLarge: 40,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
};

export const NOTE_CATEGORIES = {
    employee: { label: 'Employee Related', icon: 'employee.png' },
    office: { label: 'Office Related', icon: 'office.png' },
    health: { label: 'Health Related', icon: 'doctor.png' },
    dead_chicks: { label: 'Report Dead Chicks', icon: 'dead.png' },
    other: { label: 'Other', icon: 'other.png' },
};

export default { COLORS, FONTS, SIZES, SHADOWS, NOTE_CATEGORIES };
