import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'accent' | 'disabled';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  rightElement?: React.ReactNode; // Para mostrar precios del lado derecho (como en la pantalla de detalle)
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  rightElement,
}) => {
  const isButtonDisabled = disabled || loading || variant === 'disabled';

  // Selección de estilos según variante
  const getButtonStyle = () => {
    if (isButtonDisabled) {
      return styles.disabledButton;
    }
    switch (variant) {
      case 'accent':
        return styles.accentButton;
      case 'primary':
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    if (isButtonDisabled) {
      return styles.disabledText;
    }
    return styles.buttonText;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isButtonDisabled}
      style={[styles.button, getButtonStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'disabled' ? Colors.textSecondary : '#FFFFFF'} />
      ) : (
        <>
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
          {rightElement && !loading && rightElement}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // RNF: Garantizar al menos 48dp de área táctil mínima
    minHeight: 52, 
    minWidth: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  accentButton: {
    backgroundColor: Colors.accent,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  baseText: {
    fontFamily: 'System',
    // RNF: Fuente mínima de 14sp
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#8E8E93',
  },
});
