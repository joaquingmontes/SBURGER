import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  Platform,
  ActivityIndicator,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListPedidosAdmin,
  useListSucursales,
} from '@dataconnect/generated/react';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  AdminOrderStatus,
  AdminClientOrder,
  ADMIN_ORDER_STATUS_FILTERS,
  AdminOrderStatusFilter,
  AdminSucursalFilter,
} from '../constants/mockAdminOrders';
import { Colors } from '../constants/colors';
import { FLAT_LIST_PERF_PROPS } from '../constants/listPerformance';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminTabs } from '../components/admin/AdminTabs';
import { AdminOrderCard } from '../components/admin/AdminOrderCard';
import { dataConnect } from '../config/firebase';
import { mapPedidoToAdminOrder } from '../utils/firebaseMappers';
import {
  patchAdminOrderStatusInCache,
  refreshAdminOrdersFromServer,
  getAdminOrdersQueryKey,
} from '../utils/orderQueryCache';
import { updateOrderStatusInFirebase } from '../services/orderService';
import { useRequireAdmin } from '../navigation/useRoleGuard';

type AdminOrdersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminOrders'
>;

interface AdminOrdersScreenProps {
  navigation: AdminOrdersScreenNavigationProp;
}

export const AdminOrdersScreen: React.FC<AdminOrdersScreenProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatusFilter>('all');
  const [sucursalFilter, setSucursalFilter] = useState<AdminSucursalFilter>('all');

  useRequireAdmin(navigation);

  const {
    data,
    isPending,
    isFetching,
    isError,
  } = useListPedidosAdmin(dataConnect);

  const { data: sucursalesData } = useListSucursales(dataConnect);

  const refreshOrders = useCallback(async () => {
    await refreshAdminOrdersFromServer(queryClient);
  }, [queryClient]);

  const orders = useMemo(
    () => (data?.pedidos ?? []).map(mapPedidoToAdminOrder),
    [data?.pedidos],
  );

  const sucursales = useMemo(
    () => sucursalesData?.sucursals ?? [],
    [sucursalesData?.sucursals],
  );

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      const matchesSucursal =
        sucursalFilter === 'all' || order.sucursalId === sucursalFilter;
      return matchesStatus && matchesSucursal;
    });
  }, [orders, statusFilter, sucursalFilter]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const handleStatusChange = useCallback(async (
    orderId: string,
    status: AdminOrderStatus,
  ) => {
    if (updatingOrderId) {
      return;
    }

    setUpdatingOrderId(orderId);
    const previousData = patchAdminOrderStatusInCache(
      queryClient,
      orderId,
      status,
    );

    try {
      await updateOrderStatusInFirebase(orderId, status);
      await refreshAdminOrdersFromServer(queryClient);
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
      setUpdatingOrderId(null);
    }
  }, [queryClient, updatingOrderId]);

  const handleOrderPress = useCallback(
    (selectedOrder: AdminClientOrder) => {
      navigation.navigate('AdminOrderDetail', { order: selectedOrder });
    },
    [navigation],
  );

  const renderOrderItem = useCallback(
    ({ item }: { item: (typeof filteredOrders)[number] }) => (
      <AdminOrderCard
        order={item}
        isUpdating={updatingOrderId === item.id}
        onPress={handleOrderPress}
        onStatusChange={handleStatusChange}
      />
    ),
    [handleOrderPress, handleStatusChange, updatingOrderId],
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <Text style={styles.filterGroupLabel}>SUCURSAL</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScroll}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.filterPill,
            sucursalFilter === 'all' && styles.filterPillSelected,
          ]}
          onPress={() => setSucursalFilter('all')}
        >
          <Text
            style={[
              styles.filterLabel,
              sucursalFilter === 'all' && styles.filterLabelSelected,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
        {sucursales.map(sucursal => {
          const isSelected = sucursalFilter === sucursal.id;
          return (
            <TouchableOpacity
              key={sucursal.id}
              activeOpacity={0.8}
              style={[styles.filterPill, isSelected && styles.filterPillSelected]}
              onPress={() => setSucursalFilter(sucursal.id)}
            >
              <Text
                style={[
                  styles.filterLabel,
                  isSelected && styles.filterLabelSelected,
                ]}
              >
                {sucursal.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={[styles.filterGroupLabel, styles.filterGroupLabelSpaced]}>
        ESTADO
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScroll}
      >
        {ADMIN_ORDER_STATUS_FILTERS.map(filter => {
          const isSelected = statusFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={0.8}
              style={[styles.filterPill, isSelected && styles.filterPillSelected]}
              onPress={() => setStatusFilter(filter.id)}
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
    </View>
  );

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <AdminHeader navigation={navigation} />
      <AdminTabs activeTab="orders" navigation={navigation} />

      {isPending && orders.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : isError && orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>No se pudieron cargar los pedidos.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          extraData={updatingOrderId}
          renderItem={renderOrderItem}
          {...FLAT_LIST_PERF_PROPS}
          ListHeaderComponent={renderFilters}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refreshOrders}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay pedidos con los filtros seleccionados.
              </Text>
            </View>
          }
        />
      )}
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
  filtersContainer: {
    paddingBottom: 8,
  },
  filterGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  filterGroupLabelSpaced: {
    marginTop: 4,
  },
  filtersScroll: {
    maxHeight: 44,
    marginBottom: 12,
  },
  filtersContent: {
    gap: 8,
    paddingRight: 4,
  },
  filterPill: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterPillSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  filterLabelSelected: {
    color: Colors.accentText,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyContainer: {
    paddingTop: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
});
