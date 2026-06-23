import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { resetToLogin } from '../../navigation/navigationUtils';
import { UserProfileMenu } from '../UserProfileMenu';

type AdminNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminProducts' | 'AdminOrders'
>;

interface AdminHeaderProps {
  navigation: AdminNavigationProp;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    void logout().then(() => resetToLogin(navigation));
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <View style={styles.logoGradientTop} />
          <View style={styles.logoGradientBottom} />
          <Text style={styles.logoEmoji}>🍔</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Panel Admin</Text>
          <Text style={styles.headerSubtitle}>Admin StackBurger</Text>
        </View>
      </View>

      <UserProfileMenu
        onLogout={handleLogout}
        userName={user?.nombreCompleto.split(' ')[0] ?? 'Admin'}
        userEmail={user?.email ?? ''}
        dropdownTopOffset={64}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: Colors.logoTop,
  },
  logoGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: Colors.logoBottom,
  },
  logoEmoji: {
    fontSize: 22,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
