import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  AdminClientOrder,
  ADMIN_ORDER_STATUS_LABELS,
  AdminOrderStatus,
} from '../../constants/mockAdminOrders';
import { Colors } from '../../constants/colors';

const STATUS_COLORS: Record<AdminOrderStatus, string> = {
  preparing: Colors.accent,
  completed: Colors.success,
  cancelled: Colors.error,
};

interface AdminOrderCardProps {
  order: AdminClientOrder;
  isUpdating?: boolean;
  onPress?: (order: AdminClientOrder) => void;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
}

export const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  order,
  isUpdating = false,
  onPress,
  onStatusChange,
}) => {
  const canChangeStatus = order.status === 'preparing';
  const statusColor = STATUS_COLORS[order.status];

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress?.(order)}
        disabled={!onPress}
      >
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.orderId}>{order.codigo}</Text>
              <Text style={styles.metaText}>
                {order.customerName} · {order.date} · {order.time}
              </Text>
            </View>
            <View style={[styles.statusBadge, { borderColor: statusColor }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {ADMIN_ORDER_STATUS_LABELS[order.status]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          {order.items.map(item => (
            <Text key={item.id} style={styles.itemLine}>
              {item.quantity}x {item.name}
            </Text>
          ))}
          <Text style={styles.total}>
            ${order.total.toLocaleString('es-AR')}
          </Text>
          {onPress ? (
            <Text style={styles.viewDetailHint}>Tocá para ver detalle completo</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {canChangeStatus && (
        <>
          <View style={styles.divider} />
          <View style={[styles.section, styles.actionsSection]}>
            <Text style={styles.changeLabel}>Cambiar a:</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.finishButton,
                  isUpdating && styles.actionButtonDisabled,
                ]}
                activeOpacity={0.7}
                disabled={isUpdating}
                onPress={() => onStatusChange(order.id, 'completed')}
              >
                <Text style={[styles.actionButtonText, styles.finishButtonText]}>
                  {isUpdating ? 'Guardando...' : 'Finalizado'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.cancelButton,
                  isUpdating && styles.actionButtonDisabled,
                ]}
                activeOpacity={0.7}
                disabled={isUpdating}
                onPress={() => onStatusChange(order.id, 'cancelled')}
              >
                <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                  Cancelado
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  itemLine: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
    marginTop: 10,
  },
  viewDetailHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  changeLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  finishButton: {
    borderColor: Colors.success,
  },
  finishButtonText: {
    color: Colors.success,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
  },
});
