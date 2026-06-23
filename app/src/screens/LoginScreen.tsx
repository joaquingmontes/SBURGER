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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ScreenSafeArea } from '../components/ScreenSafeArea';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginColors = {
  background: '#0D0D0D',
  inputBackground: '#1F1F1F',
  inputBorder: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#666666',
  label: '#777777',
  placeholder: '#555555',
  primaryButton: '#B8860B',
  primaryButtonText: '#1A1208',
  accent: '#FF9800',
  divider: '#333333',
  outlineBorder: '#444444',
  logoTop: '#FFB347',
  logoBottom: '#FF8C00',
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(LoginColors.background);
      }
    }, []),
  );

  const goToHome = () => {
    navigation.replace('Home');
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
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoGradientTop} />
              <View style={styles.logoGradientBottom} />
              <Text style={styles.logoEmoji}>🍔</Text>
            </View>
            <Text style={styles.brandName}>StackBurger</Text>
            <Text style={styles.brandTagline}>Hamburguesería Gourmet</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Iniciar sesión</Text>
            <Text style={styles.formSubtitle}>Bienvenido de vuelta</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={LoginColors.placeholder}
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
                  placeholder="••••••••"
                  placeholderTextColor={LoginColors.placeholder}
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

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={goToHome}
            >
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>¿No tenés cuenta? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerLink}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerCircle} />
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.outlineButton}
              activeOpacity={0.85}
              onPress={goToHome}
            >
              <Text style={styles.outlineButtonText}>Ver menú sin registrarse</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LoginColors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: LoginColors.logoTop,
  },
  logoGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: LoginColors.logoBottom,
  },
  logoEmoji: {
    fontSize: 36,
    zIndex: 1,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: LoginColors.textPrimary,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: LoginColors.textSecondary,
    fontWeight: '400',
  },
  formSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: LoginColors.textPrimary,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: LoginColors.textSecondary,
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: LoginColors.label,
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: LoginColors.inputBackground,
    borderWidth: 1,
    borderColor: LoginColors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: LoginColors.textPrimary,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LoginColors.inputBackground,
    borderWidth: 1,
    borderColor: LoginColors.inputBorder,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: LoginColors.textPrimary,
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
    backgroundColor: LoginColors.primaryButton,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: LoginColors.primaryButtonText,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  registerPrompt: {
    fontSize: 14,
    color: LoginColors.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: LoginColors.accent,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: LoginColors.divider,
  },
  dividerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: LoginColors.divider,
    backgroundColor: LoginColors.background,
    marginHorizontal: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: LoginColors.outlineBorder,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: LoginColors.textPrimary,
  },
});
