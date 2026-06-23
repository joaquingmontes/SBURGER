import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { LogoutConfirmModal } from './LogoutConfirmModal';

interface UserProfileMenuProps {
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
  dropdownTopOffset?: number;
}

const ICON_COLOR = '#000000';
const ICON_BORDER = '#000000';
const LOGOUT_RED = '#D32F2F';
const LOGOUT_BG = '#FFF0F0';
const LOGOUT_BG_ACTIVE = '#FFE4E4';

const ProfileOutlineIcon: React.FC = () => (
  <View style={styles.profileIconInner}>
    <View style={styles.profileHead} />
    <View style={styles.profileShoulders} />
  </View>
);

const LogoutIcon: React.FC = () => (
  <View style={styles.logoutIcon}>
    <View style={styles.logoutBracket} />
    <View style={styles.logoutArrowLine} />
    <View style={styles.logoutArrowHead} />
  </View>
);

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  onLogout,
  userName = 'Usuario',
  userEmail = '',
  dropdownTopOffset = 52,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const openLogoutConfirm = () => {
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    onLogout();
  };

  return (
    <>
      <View style={styles.profileWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setMenuOpen(true)}
          style={styles.profileButton}
          accessibilityLabel="Abrir menú de usuario"
        >
          <ProfileOutlineIcon />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={[styles.backdrop, { paddingTop: insets.top + dropdownTopOffset }]}
          onPress={() => setMenuOpen(false)}
        >
          <Pressable style={styles.dropdown} onPress={() => {}}>
            <View style={styles.dropdownTop}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>

            <Pressable
              style={state => [
                styles.logoutButton,
                (state.pressed ||
                  ('hovered' in state && Boolean(state.hovered))) &&
                  styles.logoutButtonActive,
              ]}
              onPress={openLogoutConfirm}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
            >
              <LogoutIcon />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <LogoutConfirmModal
        visible={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

const styles = StyleSheet.create({
  profileWrapper: {
    position: 'relative',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderWidth: 1.5,
    borderColor: ICON_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconInner: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: ICON_COLOR,
    marginBottom: 1,
  },
  profileShoulders: {
    width: 14,
    height: 7,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: ICON_COLOR,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  dropdown: {
    width: 250,
    alignSelf: 'flex-end',
    backgroundColor: Colors.background,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownTop: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: Colors.background,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: LOGOUT_BG,
  },
  logoutButtonActive: {
    backgroundColor: LOGOUT_BG_ACTIVE,
  },
  logoutIcon: {
    width: 20,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBracket: {
    width: 9,
    height: 14,
    borderWidth: 1.5,
    borderColor: LOGOUT_RED,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  logoutArrowLine: {
    width: 7,
    height: 1.5,
    backgroundColor: LOGOUT_RED,
  },
  logoutArrowHead: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: LOGOUT_RED,
    marginLeft: -1,
  },
  logoutText: {
    fontSize: 14,
    color: LOGOUT_RED,
    fontWeight: '700',
  },
});
