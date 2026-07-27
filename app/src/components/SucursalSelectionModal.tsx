import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
} from 'react-native';
import { Colors } from '../constants/colors';
import { SucursalInfo } from '../constants/sucursales';
import { CustomButton } from './CustomButton';

interface SucursalSelectionModalProps {
  visible: boolean;
  sucursales: SucursalInfo[];
  isLoading: boolean;
  isError: boolean;
  onConfirm: (sucursalId: string) => void;
  onRetry: () => void;
  onLogout?: () => void;
}

export const SucursalSelectionModal: React.FC<SucursalSelectionModalProps> = ({
  visible,
  sucursales,
  isLoading,
  isError,
  onConfirm,
  onRetry,
  onLogout,
}) => {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (pendingId) {
      onConfirm(pendingId);
      setPendingId(null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Elegí tu sucursal</Text>
          <Text style={styles.subtitle}>
            Los precios del catálogo y tu pedido dependen de la sucursal seleccionada.
          </Text>

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>Cargando sucursales...</Text>
            </View>
          ) : isError ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>
                No se pudieron cargar las sucursales.
              </Text>
              <CustomButton title="Reintentar" onPress={onRetry} />
            </View>
          ) : (
            <FlatList
              data={sucursales}
              keyExtractor={item => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = pendingId === item.id;
                return (
                  <TouchableOpacity
                    style={[styles.card, isSelected && styles.cardSelected]}
                    activeOpacity={0.85}
                    onPress={() => setPendingId(item.id)}
                  >
                    <View style={styles.cardHeader}>
                      <Text
                        style={[
                          styles.cardTitle,
                          isSelected && styles.cardTitleSelected,
                        ]}
                      >
                        {item.nombre}
                      </Text>
                      {isSelected ? (
                        <Text style={styles.checkmark}>✓</Text>
                      ) : null}
                    </View>
                    <Text style={styles.cardAddress}>{item.direccion}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <View style={styles.footer}>
            <CustomButton
              title="Continuar"
              onPress={handleConfirm}
              disabled={!pendingId || isLoading || isError}
              variant={pendingId && !isLoading && !isError ? 'primary' : 'disabled'}
            />
            {onLogout ? (
              <TouchableOpacity style={styles.logoutLink} onPress={onLogout}>
                <Text style={styles.logoutLinkText}>Cerrar sesión</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: Colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  list: {
    maxHeight: 320,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 10,
  },
  cardSelected: {
    borderColor: Colors.accent,
    backgroundColor: '#FFF9F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  cardTitleSelected: {
    color: Colors.textPrimary,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.accent,
    marginLeft: 8,
  },
  cardAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  logoutLink: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoutLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
