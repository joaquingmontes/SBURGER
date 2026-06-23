import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../constants/colors';

export type AppDialogVariant = 'default' | 'success' | 'error';

interface AppDialogModalProps {
  visible: boolean;
  title: string;
  message: string;
  variant?: AppDialogVariant;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const LOGOUT_RED = '#FF3B30';

const getPrimaryButtonStyle = (variant: AppDialogVariant): ViewStyle => {
  switch (variant) {
    case 'success':
      return styles.successButton;
    case 'error':
      return styles.errorButton;
    default:
      return styles.confirmButton;
  }
};

const getPrimaryButtonTextStyle = (variant: AppDialogVariant): TextStyle => {
  if (variant === 'error') {
    return styles.errorButtonText;
  }

  return styles.confirmButtonText;
};

export const AppDialogModal: React.FC<AppDialogModalProps> = ({
  visible,
  title,
  message,
  variant = 'default',
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}) => {
  const hasSecondaryAction = Boolean(secondaryLabel && onSecondary);
  const handleDismiss = hasSecondaryAction ? onSecondary : onPrimary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {hasSecondaryAction ? (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.85}
                onPress={onSecondary}
              >
                <Text style={styles.cancelButtonText}>{secondaryLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, getPrimaryButtonStyle(variant)]}
                activeOpacity={0.85}
                onPress={onPrimary}
              >
                <Text style={getPrimaryButtonTextStyle(variant)}>
                  {primaryLabel}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.singleButton, getPrimaryButtonStyle(variant)]}
              activeOpacity={0.85}
              onPress={onPrimary}
            >
              <Text style={getPrimaryButtonTextStyle(variant)}>
                {primaryLabel}
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  singleButton: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: LOGOUT_RED,
  },
  successButton: {
    backgroundColor: Colors.success,
  },
  errorButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
