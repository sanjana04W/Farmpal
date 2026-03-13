// Sidebar Navigation Component for FarmPal
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    Image
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const Sidebar = ({ visible, onClose, navigation }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'egg', label: 'Egg Production', screen: 'EggProduction', roles: ['owner', 'manager', 'operator'] },
        { id: 'feed', label: 'Food consumption', screen: 'FeedConsumption', roles: ['owner', 'manager', 'operator'] },
        { id: 'expense', label: 'Expenses', screen: 'Expenses', roles: ['owner', 'manager'] },
        { id: 'notes', label: 'Notes', screen: 'Notes', roles: ['owner', 'manager', 'operator'] },
        { id: 'access', label: 'Access control', screen: 'AccessControl', roles: ['owner'] },
        { id: 'settings', label: 'Settings', screen: 'Settings', roles: ['owner'] },
    ];

    const handleNavigate = (screen) => {
        onClose();
        navigation.navigate(screen);
    };

    const handleLogout = async () => {
        onClose();
        await logout();
    };

    // Filter menu items based on user role
    const filteredMenuItems = menuItems.filter(item => {
        return item.roles.includes(user?.role);
    });

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.closeArea} onPress={onClose} />
                <View style={styles.sidebar}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Menu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuContainer}>
                        {filteredMenuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handleNavigate(item.screen)}
                            >
                                <Text style={styles.menuText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    closeArea: {
        flex: 1,
    },
    sidebar: {
        width: width * 0.75,
        backgroundColor: COLORS.gradientBottom,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: SIZES.xxLarge,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    closeButton: {
        padding: 10,
    },
    closeText: {
        fontSize: SIZES.xLarge,
        color: COLORS.textDark,
    },
    menuContainer: {
        flex: 1,
    },
    menuItem: {
        backgroundColor: COLORS.lightYellow,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: SIZES.radius,
        marginBottom: 12,
    },
    menuText: {
        fontSize: SIZES.large,
        color: COLORS.textDark,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: COLORS.inputBackground,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: SIZES.radius,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: SIZES.large,
        color: COLORS.textWhite,
        fontWeight: '500',
    },
});

export default Sidebar;
