import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { AdminColors } from '../../constants/adminTheme';
import { isNonEmptyString } from '../../utils/formValidation';

export interface CreateSucursalPayload {
  nombre: string;
  direccion: string;
}

interface CreateSucursalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSucursalPayload) => Promise<void>;
}

export const CreateSucursalModal: React.FC<CreateSucursalModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ nombre: false, direccion: false });

  useEffect(() => {
    if (!visible) {
      return;
    }

    setNombre('');
    setDireccion('');
    setErrors({ nombre: false, direccion: false });
  }, [visible]);

  const handleSubmit = async () => {
    const trimmedNombre = nombre.trim();
    const trimmedDireccion = direccion.trim();
    const nextErrors = {
      nombre: !isNonEmptyString(trimmedNombre),
      direccion: !isNonEmptyString(trimmedDireccion),
    };

    setErrors(nextErrors);

    if (nextErrors.nombre || nextErrors.direccion) {
      Alert.alert('Datos incompletos', 'Ingresá el nombre y la dirección de la sucursal.');
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        nombre: trimmedNombre,
        direccion: trimmedDireccion,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Crear sucursal</Text>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.formContent}
          >
            <Text style={styles.helperText}>
              Al crear la sucursal, todos los productos se cargarán con su precio base y estado Activo.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOMBRE</Text>
              <TextInput
                style={[styles.input, errors.nombre && styles.inputError]}
                placeholder="Ej: StackBurger Palermo"
                placeholderTextColor={AdminColors.placeholder}
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DIRECCIÓN</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.direccion && styles.inputError]}
                placeholder="Ej: Av. Santa Fe 3200, CABA"
                placeholderTextColor={AdminColors.placeholder}
                value={direccion}
                onChangeText={setDireccion}
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Creando...' : 'Crear sucursal'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: AdminColors.modalOverlay,
  },
  sheet: {
    maxHeight: '85%',
    backgroundColor: AdminColors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: AdminColors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AdminColors.border,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AdminColors.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: AdminColors.textSecondary,
    fontWeight: '600',
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 20,
    color: AdminColors.textSecondary,
    marginBottom: 18,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AdminColors.label,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: AdminColors.textPrimary,
  },
  inputError: {
    borderColor: AdminColors.error,
  },
  textArea: {
    minHeight: 88,
    paddingTop: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AdminColors.textPrimary,
  },
  submitButton: {
    flex: 1,
    backgroundColor: AdminColors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AdminColors.accentText,
  },
});
