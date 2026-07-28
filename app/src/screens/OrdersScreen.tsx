import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { useListMyPedidos } from '@dataconnect/generated/react';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  ORDER_FILTERS,
  ORDER_STATUS_LABELS,
  Order,
  OrderFilter,
  OrderStatus,
} from '../constants/mockOrders';
import { BottomNav } from '../components/BottomNav';
import { HorizontalFilterBar } from '../components/HorizontalFilterBar';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { ClientHeaderActions } from '../components/ClientHeaderActions';
import { Colors } from '../constants/colors';
import { FLAT_LIST_PERF_PROPS } from '../constants/listPerformance';
import { useAuth } from '../context/AuthContext';
import { dataConnect } from '../config/firebase';
import { mapPedidoToOrder } from '../utils/firebaseMappers';
import { refreshUserOrdersFromServer } from '../utils/orderQueryCache';
import { resetToLogin, resetToUserHome } from '../navigation/navigationUtils';

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>;

interface OrdersScreenProps {
  navigation: OrdersScreenNavigationProp;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  preparing: Colors.accent,
  completed: Colors.success,
  cancelled: Colors.error,
};

interface OrderCardProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

const OrderCard = memo<OrderCardProps>(function OrderCard({
  order,
  expanded,
  onToggle,
}) {
  const statusColor = STATUS_COLORS[order.status];
  const statusLabel = ORDER_STATUS_LABELS[order.status];

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            {order.status === 'preparing' && (
              <Text style={[styles.statusIcon, { color: statusColor }]}>🕐</Text>
            )}
            {order.status === 'completed' && (
              <Text style={[styles.statusIcon, { color: statusColor }]}>✓</Text>
            )}
            {order.status === 'cancelled' && (
              <Text style={[styles.statusIcon, { color: statusColor }]}>✕</Text>
            )}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.orderTotal}>
          ${order.total.toLocaleString('es-AR')}
        </Text>
      </View>

      <View style={styles.orderMetaRow}>
        <Text style={styles.orderDate}>{order.dateTime}</Text>
        {expanded && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleIcon}>▲</Text>
            <Text style={styles.toggleText}>Ocultar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.orderFooterRow}>
        <Text style={styles.orderSummary}>
          {order.productCount} producto{order.productCount !== 1 ? 's' : ''} ·{' '}
          {order.unitCount} unidad{order.unitCount !== 1 ? 'es' : ''}
        </Text>
        {!expanded && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleIcon}>▼</Text>
            <Text style={styles.toggleText}>Ver detalle</Text>
          </TouchableOpacity>
        )}
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />

          {order.items.map((item, index) => (
            <View key={`${order.id}-item-${index}`}>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.price.toLocaleString('es-AR')}
                </Text>
              </View>
              {item.modifiers?.map(modifier => (
                <Text key={modifier} style={styles.itemModifier}>
                  {modifier}
                </Text>
              ))}
            </View>
          ))}

          <View style={styles.totalPaidRow}>
            <Text style={styles.totalPaidLabel}>Total pagado</Text>
            <Text style={styles.totalPaidValue}>
              ${order.total.toLocaleString('es-AR')}
            </Text>
          </View>

          <View style={styles.deliveryBox}>
            <Text style={styles.deliveryLabel}>DATOS DE ENTREGA</Text>
            <Text style={styles.deliveryName}>{order.delivery.name}</Text>
            <Text style={styles.deliveryDetail}>{order.delivery.phone}</Text>
            <Text style={styles.deliveryDetail}>{order.delivery.method}</Text>
            {order.delivery.branchName ? (
              <Text style={styles.deliveryDetail}>
                Sucursal: {order.delivery.branchName}
              </Text>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
});

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const { data, isPending, isError, isFetching } = useListMyPedidos(dataConnect, {
    enabled: !!user?.id,
  });

  const orders = useMemo(
    () => (data?.pedidos ?? []).map(mapPedidoToOrder),
    [data?.pedidos],
  );

  const refreshOrders = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    await refreshUserOrdersFromServer(queryClient);
  }, [queryClient, user?.id]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const filteredOrders = useMemo(
    () =>
      selectedFilter === 'all'
        ? orders
        : orders.filter(order => order.status === selectedFilter),
    [orders, selectedFilter],
  );

  const toggleOrder = useCallback((orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  const renderOrderItem = useCallback<ListRenderItem<Order>>(
    ({ item }) => (
      <OrderCard
        order={item}
        expanded={!!expandedOrders[item.id]}
        onToggle={() => toggleOrder(item.id)}
      />
    ),
    [expandedOrders, toggleOrder],
  );

  const handleLogout = useCallback(() => {
    void logout().then(() => resetToLogin(navigation));
  }, [logout, navigation]);

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Mis pedidos</Text>
            <Text style={styles.subtitle}>Historial y estado de tus pedidos</Text>
          </View>
          <ClientHeaderActions
            onLogout={handleLogout}
            userName={user?.nombreCompleto.split(' ')[0] ?? 'Usuario'}
            userEmail={user?.email ?? ''}
          />
        </View>
      </View>

      <HorizontalFilterBar
        items={ORDER_FILTERS.map(filter => ({
          id: filter.id,
          label: filter.label,
        }))}
        selectedId={selectedFilter}
        onSelect={id => setSelectedFilter(id as OrderFilter)}
        tone="client"
        containerStyle={styles.filtersContainer}
        scrollStyle={styles.filtersScroll}
      />

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudieron cargar tus pedidos.</Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
          extraData={expandedOrders}
          {...FLAT_LIST_PERF_PROPS}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refreshOrders}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Todavía no tenés pedidos.</Text>
            </View>
          }
        />
      )}

      <BottomNav
        activeTab="orders"
        onCatalogPress={() => resetToUserHome(navigation, user)}
        onOrdersPress={() => {}}
      />
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filtersScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
    paddingRight: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
  },
  orderMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 10,
    color: Colors.textMuted,
    marginRight: 4,
  },
  toggleText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  orderSummary: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  expandedContent: {
    marginTop: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingRight: 12,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  itemModifier: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
    marginLeft: 2,
  },
  totalPaidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  totalPaidLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalPaidValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  deliveryBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  deliveryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  deliveryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  deliveryDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
