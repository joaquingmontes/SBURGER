import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { Colors } from '../constants/colors';
import { hasMinimumLength, isValidEmail } from '../utils/formValidation';
import { useAuth, AuthUser } from '../context/AuthContext';
import { resetAfterAuth } from '../navigation/navigationUtils';
import { AppDialogModal, AppDialogVariant } from '../components/AppDialogModal';
type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

interface RegisterDialogState {
  visible: boolean;
  title: string;
  message: string;
  variant: AppDialogVariant;
  primaryLabel: string;
  onPrimary: () => void;
}

const INITIAL_DIALOG: RegisterDialogState = {
  visible: false,
  title: '',
  message: '',
  variant: 'error',
  primaryLabel: 'Entendido',
  onPrimary: () => {},
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<RegisterDialogState>(INITIAL_DIALOG);

  const showDialog = (config: Omit<RegisterDialogState, 'visible'>) => {
    setDialog({
      ...config,
      visible: true,
    });
  };

  const closeDialog = () => {
    setDialog(current => ({ ...current, visible: false }));
  };

  const showErrorDialog = (message: string, title = 'Error') => {
    showDialog({
      title,
      message,
      variant: 'error',
      primaryLabel: 'Entendido',
      onPrimary: closeDialog,
    });
  };

  const showSuccessDialog = (user: AuthUser) => {
    showDialog({
      title: 'Cuenta creada',
      message: 'Tu cuenta fue creada correctamente.',
      variant: 'success',
      primaryLabel: 'Continuar',
      onPrimary: () => {
        closeDialog();
        resetAfterAuth(navigation, user);
      },
    });
  };
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const goToLogin = () => {
    navigation.goBack();
  };

  const handleRegister = async () => {
    if (!hasMinimumLength(fullName, 3)) {
      showErrorDialog('Ingresá tu nombre completo (mínimo 3 caracteres).');
      return;
    }

    if (!email.trim()) {
      showErrorDialog('Ingresá un email.');
      return;
    }

    if (!isValidEmail(email)) {
      showErrorDialog('Ingresá un email válido.');
      return;
    }

    if (password.length < 6) {
      showErrorDialog('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      showErrorDialog('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const user = await register(fullName, email, password);
      showSuccessDialog(user);
    } catch (error) {
      showErrorDialog(
        error instanceof Error
          ? error.message
          : 'No se pudo crear la cuenta. Verificá tu conexión e intentá de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScreenSafeArea style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={goToLogin}
            accessibilityLabel="Volver al login"
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.brandRow}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGradientTop} />
              <View style={styles.logoGradientBottom} />
              <Text style={styles.logoEmoji}>🍔</Text>
            </View>
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandName}>StackBurger</Text>
              <Text style={styles.brandSubtext}>Crear cuenta nueva</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Crear cuenta</Text>
            <Text style={styles.formSubtitle}>Completá tus datos para registrarte</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOMBRE COMPLETO</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan García"
                placeholderTextColor={Colors.placeholder}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(prev => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={styles.eyeIcon}>
                    <View style={styles.eyeOuter} />
                    <View style={styles.eyePupil} />
                    {showPassword && <View style={styles.eyeSlash} />}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONFIRMAR CONTRASEÑA</Text>
              <TextInput
                style={styles.input}
                placeholder="Repetí tu contraseña"
                placeholderTextColor={Colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.accentText} />
              ) : (
                <Text style={styles.primaryButtonText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>¿Ya tenés cuenta? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={goToLogin}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AppDialogModal
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        primaryLabel={dialog.primaryLabel}
        onPrimary={dialog.onPrimary}
      />
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: -2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
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
    fontSize: 26,
    zIndex: 1,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  brandSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  formSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.label,
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  eyeIcon: {
    width: 22,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOuter: {
    position: 'absolute',
    width: 22,
    height: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#666666',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666666',
  },
  eyeSlash: {
    position: 'absolute',
    width: 24,
    height: 1.5,
    backgroundColor: '#666666',
    transform: [{ rotate: '-35deg' }],
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accentText,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});
