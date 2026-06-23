import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';

interface LoginRequiredModalProps {
  visible: boolean;
  onLogin: () => void;
  onCancel: () => void;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  visible,
  onLogin,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.iconBox}>
            <View style={styles.loginIcon}>
              <View style={styles.loginBracket} />
              <View style={styles.loginArrowLine} />
              <View style={styles.loginArrowHead} />
            </View>
          </View>

          <Text style={styles.title}>Iniciá sesión para continuar</Text>
          <Text style={styles.message}>
            Para agregar productos al carrito y realizar pedidos necesitás una
            cuenta.
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={onLogin}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>✕ Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 20,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  loginIcon: {
    width: 22,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginBracket: {
    width: 9,
    height: 14,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderLeftWidth: 0,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    marginLeft: 6,
  },
  loginArrowLine: {
    width: 7,
    height: 1.5,
    backgroundColor: Colors.accent,
  },
  loginArrowHead: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.accent,
    marginRight: -1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  loginButton: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accentText,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
