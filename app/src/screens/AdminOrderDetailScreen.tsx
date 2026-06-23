import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  ADMIN_ORDER_STATUS_LABELS,
  AdminClientOrder,
  AdminOrderStatus,
} from '../constants/mockAdminOrders';
import { Colors } from '../constants/colors';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { CustomButton } from '../components/CustomButton';
import { useRequireAdmin } from '../navigation/useRoleGuard';
import {
  getAdminOrdersQueryKey,
  patchAdminOrderStatusInCache,
  refreshAdminOrdersFromServer,
} from '../utils/orderQueryCache';
import { updateOrderStatusInFirebase } from '../services/orderService';

type AdminOrderDetailRouteProp = RouteProp<RootStackParamList, 'AdminOrderDetail'>;
type AdminOrderDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminOrderDetail'
>;

interface AdminOrderDetailScreenProps {
  route: AdminOrderDetailRouteProp;
  navigation: AdminOrderDetailNavigationProp;
}

const STATUS_COLORS: Record<AdminOrderStatus, string> = {
  preparing: Colors.accent,
  completed: Colors.success,
  cancelled: Colors.error,
};

export const AdminOrderDetailScreen: React.FC<AdminOrderDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { order: initialOrder } = route.params;
  const queryClient = useQueryClient();
  const [order, setOrder] = useState<AdminClientOrder>(initialOrder);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useRequireAdmin(navigation);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: order.codigo,
    });
  }, [navigation, order.codigo]);

  const handleStatusChange = async (status: AdminOrderStatus) => {
    if (updatingStatus) {
      return;
    }

    setUpdatingStatus(true);
    const previousData = patchAdminOrderStatusInCache(
      queryClient,
      order.id,
      status,
    );

    try {
      await updateOrderStatusInFirebase(order.id, status);
      await refreshAdminOrdersFromServer(queryClient);
      setOrder(current => ({ ...current, status }));
    } catch (error) {
      if (previousData) {
        queryClient.setQueryData(getAdminOrdersQueryKey(), previousData);
      }

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el estado del pedido.',
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusColor = STATUS_COLORS[order.status];
  const canChangeStatus = order.status === 'preparing';

  return (
    <ScreenSafeArea style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.orderCode}>{order.codigo}</Text>
              <Text style={styles.metaText}>
                {order.date} · {order.time}
              </Text>
            </View>
            <View style={[styles.statusBadge, { borderColor: statusColor }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {ADMIN_ORDER_STATUS_LABELS[order.status]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>CLIENTE</Text>
          <Text style={styles.sectionValue}>{order.customerName}</Text>
          <Text style={styles.sectionSecondary}>{order.phone}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>ENTREGA</Text>
          <Text style={styles.sectionValue}>{order.deliveryMethod}</Text>
          {order.address ? (
            <Text style={styles.sectionSecondary}>{order.address}</Text>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>PRODUCTOS</Text>

          {order.items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.itemBlock, index > 0 && styles.itemBlockDivider]}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.lineTotal.toLocaleString('es-AR')}
                </Text>
              </View>

              <Text style={styles.itemUnitPrice}>
                ${item.unitPrice.toLocaleString('es-AR')} c/u
              </Text>

              {item.extras.length > 0 && (
                <View style={styles.itemDetailBox}>
                  <Text style={styles.itemDetailLabel}>Personalización</Text>
                  {item.extras.map(extra => (
                    <Text key={`${item.id}-${extra}`} style={styles.itemDetailLine}>
                      · {extra}
                    </Text>
                  ))}
                </View>
              )}

              {item.notes ? (
                <View style={styles.itemDetailBox}>
                  <Text style={styles.itemDetailLabel}>Nota</Text>
                  <Text style={styles.itemNote}>{item.notes}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>RESUMEN</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.subtotal.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>
              ${order.shippingCost.toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>
              ${order.total.toLocaleString('es-AR')}
            </Text>
          </View>
        </View>

        {canChangeStatus && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>CAMBIAR ESTADO</Text>
            {updatingStatus ? (
              <ActivityIndicator size="small" color={Colors.accent} />
            ) : (
              <View style={styles.actionButtons}>
                <CustomButton
                  title="Finalizado"
                  onPress={() => handleStatusChange('completed')}
                  style={styles.finishButton}
                  textStyle={styles.finishButtonText}
                />
                <CustomButton
                  title="Cancelado"
                  onPress={() => handleStatusChange('cancelled')}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  headerCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  orderCode: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSecondary: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  itemBlock: {
    paddingVertical: 12,
  },
  itemBlockDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  itemDetailBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
  },
  itemDetailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  itemDetailLine: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  itemNote: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.accent,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  finishButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  finishButtonText: {
    color: Colors.success,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
  },
});
