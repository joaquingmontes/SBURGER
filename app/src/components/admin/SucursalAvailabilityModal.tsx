import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
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
import { EstadoProductoSucursal } from '@dataconnect/generated';
import { AdminProduct } from '../../constants/adminProducts';
import { AdminColors } from '../../constants/adminTheme';
import { dataConnect } from '../../config/firebase';

interface SucursalAvailabilityModalProps {
  visible: boolean;
  product?: AdminProduct;
  onClose: () => void;
}

interface AvailabilityRow {
  id?: string;
  sucursalId: string;
  sucursalNombre: string;
  estado: EstadoProductoSucursal;
}

const ESTADO_OPTIONS: Array<{
  value: EstadoProductoSucursal;
  label: string;
}> = [
  { value: EstadoProductoSucursal.ACTIVO, label: 'Activo' },
  { value: EstadoProductoSucursal.SIN_STOCK, label: 'Sin stock' },
  { value: EstadoProductoSucursal.INEXISTENTE, label: 'Inexistente' },
];

export const SucursalAvailabilityModal: React.FC<SucursalAvailabilityModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
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

    const records = data?.productoSucursals ?? [];
    if (records.length > 0) {
      setRows(
        records.map(item => ({
          id: item.id,
          sucursalId: item.sucursal.id,
          sucursalNombre: item.sucursal.nombre,
          estado: item.estado ?? EstadoProductoSucursal.ACTIVO,
        })),
      );
      return;
    }

    const sucursales = sucursalesData?.sucursals ?? [];
    setRows(
      sucursales.map(sucursal => ({
        sucursalId: sucursal.id,
        sucursalNombre: sucursal.nombre,
        estado: EstadoProductoSucursal.ACTIVO,
      })),
    );
  }, [visible, productId, data?.productoSucursals, sucursalesData?.sucursals]);

  const updateRowEstado = useCallback(
    (sucursalId: string, estado: EstadoProductoSucursal) => {
      setRows(current =>
        current.map(row =>
          row.sucursalId === sucursalId ? { ...row, estado } : row,
        ),
      );
    },
    [],
  );

  const handleSave = async () => {
    if (!productId || !product) {
      return;
    }

    setSaving(true);

    try {
      for (const row of rows) {
        if (row.id) {
          await updateProductoSucursal.mutateAsync({
            id: row.id,
            estado: row.estado,
          });
        } else {
          await createProductoSucursal.mutateAsync({
            productoId: productId,
            sucursalId: row.sucursalId,
            precio: product.price,
            estado: row.estado,
          });
        }
      }

      await refetch();
      onClose();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la disponibilidad por sucursal.');
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
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.headerText}>
              <Text style={styles.sheetTitle}>Disponibilidad por sucursal</Text>
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
              contentContainerStyle={styles.formContent}
            >
              {rows.map(row => (
                <View key={row.sucursalId} style={styles.row}>
                  <Text style={styles.rowTitle}>{row.sucursalNombre}</Text>
                  <View style={styles.estadoButtons}>
                    {ESTADO_OPTIONS.map(option => {
                      const isSelected = row.estado === option.value;

                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.estadoButton,
                            isSelected && styles.estadoButtonSelected,
                          ]}
                          activeOpacity={0.85}
                          onPress={() => updateRowEstado(row.sucursalId, option.value)}
                        >
                          <Text
                            style={[
                              styles.estadoButtonText,
                              isSelected && styles.estadoButtonTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
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
      </View>
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
    marginBottom: 18,
    gap: 10,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AdminColors.textPrimary,
  },
  estadoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estadoButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
  },
  estadoButtonSelected: {
    backgroundColor: AdminColors.accent,
    borderColor: AdminColors.accent,
  },
  estadoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: AdminColors.textPrimary,
  },
  estadoButtonTextSelected: {
    color: AdminColors.accentText,
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
