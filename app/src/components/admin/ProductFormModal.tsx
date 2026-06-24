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
} from 'react-native';
import { AdminProduct, ProductCategory } from '../../constants/adminProducts';
import { AdminColors } from '../../constants/adminTheme';
import { CategoryPicker } from './CategoryPicker';

export type ProductFormMode = 'create' | 'edit';

interface ProductFormModalProps {
  visible: boolean;
  mode: ProductFormMode;
  product?: AdminProduct;
  onClose: () => void;
  onSubmit: (product: AdminProduct) => void | Promise<void>;
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'Hamburguesas' as ProductCategory,
  image: '',
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  mode,
  product,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Hamburguesas');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (mode === 'edit' && product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(String(product.price));
      setCategory(product.category);
      setImage(product.image);
    } else {
      setName(emptyForm.name);
      setDescription(emptyForm.description);
      setPrice(emptyForm.price);
      setCategory(emptyForm.category);
      setImage(emptyForm.image);
    }
  }, [visible, mode, product]);

  const handleSubmit = async () => {
    const parsedPrice = Number(price.replace(/\D/g, ''));
    if (!name.trim() || !description.trim() || !parsedPrice) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        id: product?.id,
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        category,
        image: image.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === 'edit' ? 'Editar producto' : 'Agregar producto';
  const submitLabel = mode === 'edit' ? 'Guardar' : 'Agregar';

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
            <Text style={styles.sheetTitle}>{title}</Text>
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
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOMBRE</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Stack Doble Smash"
                placeholderTextColor={AdminColors.placeholder}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIPCIÓN</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describí el producto..."
                placeholderTextColor={AdminColors.placeholder}
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PRECIO BASE ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 4500"
                placeholderTextColor={AdminColors.placeholder}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <CategoryPicker value={category} onChange={setCategory} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>URL DE IMAGEN</Text>
              <TextInput
                style={styles.input}
                placeholder="https://images.unsplash.com/..."
                placeholderTextColor={AdminColors.placeholder}
                value={image}
                onChangeText={setImage}
                autoCapitalize="none"
                autoCorrect={false}
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
                {submitting ? 'Guardando...' : submitLabel}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AdminColors.modalOverlay,
  },
  sheet: {
    maxHeight: '92%',
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
  textArea: {
    minHeight: 100,
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
