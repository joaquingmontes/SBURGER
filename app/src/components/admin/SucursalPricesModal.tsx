import React, { useCallback, useEffect, useState } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useCreateProductoSucursal,
  useListProductoSucursalByProducto,
  useListSucursales,
  useUpdateProductoSucursal,
} from '@dataconnect/generated/react';
import { AdminProduct } from '../../constants/adminProducts';
import { AdminColors } from '../../constants/adminTheme';
import { dataConnect } from '../../config/firebase';
import { parsePositiveInteger } from '../../utils/formValidation';

interface SucursalPricesModalProps {
  visible: boolean;
  product?: AdminProduct;
  onClose: () => void;
}

interface PriceRow {
  id?: string;
  sucursalId: string;
  sucursalNombre: string;
  precio: string;
}

export const SucursalPricesModal: React.FC<SucursalPricesModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [saving, setSaving] = useState(false);

  const productId = product?.id;
  const { data, isPending, refetch } = useListProductoSucursalByProducto(
    dataConnect,
    { productoId: productId ?? '' },
    { enabled: visible && !!productId },
  );
  const { data: sucursalesData } = useListSucursales(dataConnect, {
    enabled: visible,
  });
  const createProductoSucursal = useCreateProductoSucursal(dataConnect);
  const updateProductoSucursal = useUpdateProductoSucursal(dataConnect);

  useEffect(() => {
    if (!visible || !productId) {
      return;
    }

    const precios = data?.productoSucursals ?? [];
    if (precios.length > 0) {
      setRows(
        precios.map(item => ({
          id: item.id,
          sucursalId: item.sucursal.id,
          sucursalNombre: item.sucursal.nombre,
          precio: String(item.precio),
        })),
      );
      return;
    }

    const sucursales = sucursalesData?.sucursals ?? [];
    setRows(
      sucursales.map(sucursal => ({
        sucursalId: sucursal.id,
        sucursalNombre: sucursal.nombre,
        precio: String(product?.price ?? ''),
      })),
    );
  }, [visible, productId, product?.price, data?.productoSucursals, sucursalesData?.sucursals]);

  const updateRowPrice = useCallback((sucursalId: string, precio: string) => {
    setRows(current =>
      current.map(row =>
        row.sucursalId === sucursalId ? { ...row, precio } : row,
      ),
    );
  }, []);

  const handleSave = async () => {
    if (!productId || !product) {
      return;
    }

    setSaving(true);

    try {
      for (const row of rows) {
        const parsedPrice = parsePositiveInteger(row.precio);
        if (parsedPrice === null) {
          Alert.alert('Error', `Ingresá un precio numérico válido mayor a 0 para ${row.sucursalNombre}.`);
          return;
        }

        if (row.id) {
          await updateProductoSucursal.mutateAsync({
            id: row.id,
            precio: parsedPrice,
          });
        } else {
          await createProductoSucursal.mutateAsync({
            productoId: productId,
            sucursalId: row.sucursalId,
            precio: parsedPrice,
          });
        }
      }

      await refetch();
      onClose();
    } catch {
      Alert.alert('Error', 'No se pudieron guardar los precios por sucursal.');
    } finally {
      setSaving(false);
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
            <View style={styles.headerText}>
              <Text style={styles.sheetTitle}>Precios por sucursal</Text>
              <Text style={styles.sheetSubtitle}>{product?.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {isPending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={AdminColors.accent} />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.formContent}
            >
              {rows.map(row => (
                <View key={row.sucursalId} style={styles.row}>
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowTitle}>{row.sucursalNombre}</Text>
                  </View>
                  <TextInput
                    style={styles.priceInput}
                    value={row.precio}
                    onChangeText={value => updateRowPrice(row.sucursalId, value)}
                    keyboardType="numeric"
                    placeholder="Precio"
                    placeholderTextColor={AdminColors.placeholder}
                  />
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={onClose}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, saving && styles.submitButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={saving || isPending}
            >
              <Text style={styles.submitButtonText}>
                {saving ? 'Guardando...' : 'Guardar'}
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
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AdminColors.textPrimary,
  },
  sheetSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: AdminColors.textSecondary,
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
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AdminColors.textPrimary,
  },
  priceInput: {
    width: 120,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: AdminColors.textPrimary,
    textAlign: 'right',
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
