import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  MOCK_ORDERS,
  ORDER_FILTERS,
  ORDER_STATUS_LABELS,
  Order,
  OrderFilter,
  OrderStatus,
} from '../constants/mockOrders';
import { BottomNav } from '../components/BottomNav';
import { ScreenSafeArea } from '../components/ScreenSafeArea';

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>;

interface OrdersScreenProps {
  navigation: OrdersScreenNavigationProp;
}

const ScreenColors = {
  background: '#0C0C0C',
  surface: '#1A1A1A',
  surfaceDark: '#141414',
  border: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#666666',
  accent: '#F39C12',
  accentText: '#1A1208',
  success: '#34C759',
  error: '#FF5252',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  preparing: ScreenColors.accent,
  completed: ScreenColors.success,
  cancelled: ScreenColors.error,
};

interface OrderCardProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, expanded, onToggle }) => {
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
          </View>
        </View>
      )}
    </View>
  );
};

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({
    'SB-37827': true,
  });

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(ScreenColors.background);
      }
    }, []),
  );

  const filteredOrders =
    selectedFilter === 'all'
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter(order => order.status === selectedFilter);

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis pedidos</Text>
        <Text style={styles.subtitle}>Historial y estado de tus pedidos</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScroll}
      >
        {ORDER_FILTERS.map(filter => {
          const isSelected = selectedFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={0.8}
              style={[styles.filterPill, isSelected && styles.filterPillSelected]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterLabel,
                  isSelected && styles.filterLabelSelected,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        style={styles.list}
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            expanded={!!expandedOrders[item.id]}
            onToggle={() => toggleOrder(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <BottomNav
        activeTab="orders"
        onCatalogPress={() => navigation.navigate('Home')}
        onOrdersPress={() => {}}
      />
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ScreenColors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: ScreenColors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: ScreenColors.textSecondary,
  },
  filtersScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterPill: {
    backgroundColor: ScreenColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: ScreenColors.border,
    marginRight: 10,
  },
  filterPillSelected: {
    backgroundColor: ScreenColors.accent,
    borderColor: ScreenColors.accent,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ScreenColors.textSecondary,
  },
  filterLabelSelected: {
    color: ScreenColors.accentText,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  orderCard: {
    backgroundColor: ScreenColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ScreenColors.border,
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
    color: ScreenColors.textPrimary,
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
    color: ScreenColors.accent,
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
    color: ScreenColors.textSecondary,
    flex: 1,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 10,
    color: ScreenColors.textMuted,
    marginRight: 4,
  },
  toggleText: {
    fontSize: 12,
    color: ScreenColors.textMuted,
    fontWeight: '500',
  },
  orderSummary: {
    fontSize: 13,
    color: ScreenColors.textSecondary,
    flex: 1,
  },
  expandedContent: {
    marginTop: 14,
  },
  divider: {
    height: 1,
    backgroundColor: ScreenColors.border,
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
    color: ScreenColors.textPrimary,
    paddingRight: 12,
  },
  itemPrice: {
    fontSize: 14,
    color: ScreenColors.textSecondary,
  },
  itemModifier: {
    fontSize: 12,
    color: ScreenColors.textMuted,
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
    color: ScreenColors.textSecondary,
  },
  totalPaidValue: {
    fontSize: 16,
    fontWeight: '700',
    color: ScreenColors.textPrimary,
  },
  deliveryBox: {
    backgroundColor: ScreenColors.surfaceDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ScreenColors.border,
    padding: 14,
  },
  deliveryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ScreenColors.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  deliveryName: {
    fontSize: 14,
    fontWeight: '600',
    color: ScreenColors.textPrimary,
    marginBottom: 4,
  },
  deliveryDetail: {
    fontSize: 13,
    color: ScreenColors.textSecondary,
    marginBottom: 2,
  },
});
