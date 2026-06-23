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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { useListPedidosAdmin } from '@dataconnect/generated/react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AdminOrderStatus } from '../constants/mockAdminOrders';
import { Colors } from '../constants/colors';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminTabs } from '../components/admin/AdminTabs';
import { AdminOrderCard } from '../components/admin/AdminOrderCard';
import { dataConnect } from '../config/firebase';
import { mapPedidoToAdminOrder } from '../utils/firebaseMappers';
import { useRefetchOnFocus } from '../hooks/useRefetchOnFocus';
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

  useRequireAdmin(navigation);

  const {
    data,
    isPending,
    isFetching,
    isError,
  } = useListPedidosAdmin(dataConnect);

  const refreshOrders = useCallback(async () => {
    await refreshAdminOrdersFromServer(queryClient);
  }, [queryClient]);

  const orders = useMemo(
    () => (data?.pedidos ?? []).map(mapPedidoToAdminOrder),
    [data?.pedidos],
  );

  useRefetchOnFocus(refreshOrders);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const handleStatusChange = async (
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
  };

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
          data={orders}
          keyExtractor={item => item.id}
          extraData={orders}
          renderItem={({ item }) => (
            <AdminOrderCard
              order={item}
              isUpdating={updatingOrderId === item.id}
              onPress={selectedOrder =>
                navigation.navigate('AdminOrderDetail', { order: selectedOrder })
              }
              onStatusChange={handleStatusChange}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refreshOrders}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
});
