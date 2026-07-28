import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListPedidosAdmin,
  useListSucursales,
} from '@dataconnect/generated/react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AdminSucursalFilter } from '../constants/mockAdminOrders';
import { Colors } from '../constants/colors';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminTabs } from '../components/admin/AdminTabs';
import { StatsSummaryCards } from '../components/admin/stats/StatsSummaryCards';
import { HourlyActivityChart } from '../components/admin/stats/HourlyActivityChart';
import { MonthlyBreakdown } from '../components/admin/stats/MonthlyBreakdown';
import { BranchRankingPanel } from '../components/admin/stats/BranchRankingPanel';
import { dataConnect } from '../config/firebase';
import { useRequireAdmin } from '../navigation/useRoleGuard';
import { refreshAdminOrdersFromServer } from '../utils/orderQueryCache';
import {
  computeBranchRankings,
  computeHourlyBuckets,
  computeMonthlyStats,
  computeOrderSummary,
  filterStatsOrders,
  formatMonthLabel,
  getAvailableMonthKeys,
  mapPedidoToStatsOrder,
} from '../utils/adminStatistics';

type AdminStatisticsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminStatistics'
>;

interface AdminStatisticsScreenProps {
  navigation: AdminStatisticsScreenNavigationProp;
}

type MonthFilter = 'all' | string;

export const AdminStatisticsScreen: React.FC<AdminStatisticsScreenProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();
  const [sucursalFilter, setSucursalFilter] = useState<AdminSucursalFilter>('all');
  const [monthFilter, setMonthFilter] = useState<MonthFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useRequireAdmin(navigation);

  const {
    data,
    isPending,
    isFetching,
    isError,
  } = useListPedidosAdmin(dataConnect);

  const { data: sucursalesData } = useListSucursales(dataConnect);

  const statsOrders = useMemo(
    () => (data?.pedidos ?? []).map(mapPedidoToStatsOrder),
    [data?.pedidos],
  );

  const sucursales = useMemo(
    () => sucursalesData?.sucursals ?? [],
    [sucursalesData?.sucursals],
  );

  const availableMonths = useMemo(
    () => getAvailableMonthKeys(statsOrders),
    [statsOrders],
  );

  const filteredOrders = useMemo(
    () =>
      filterStatsOrders(statsOrders, {
        sucursalId: sucursalFilter,
        monthKey: monthFilter,
      }),
    [statsOrders, sucursalFilter, monthFilter],
  );

  const summary = useMemo(
    () => computeOrderSummary(filteredOrders),
    [filteredOrders],
  );

  const monthlyStats = useMemo(() => {
    const baseOrders = filterStatsOrders(statsOrders, {
      sucursalId: sucursalFilter,
      monthKey: 'all',
    });
    return computeMonthlyStats(baseOrders);
  }, [statsOrders, sucursalFilter]);

  const hourlyBuckets = useMemo(
    () => computeHourlyBuckets(filteredOrders),
    [filteredOrders],
  );

  const branchRankings = useMemo(() => {
    const rankingOrders = filterStatsOrders(statsOrders, {
      sucursalId: 'all',
      monthKey: monthFilter,
    });

    return computeBranchRankings(
      rankingOrders,
      sucursales.map(sucursal => ({
        id: sucursal.id,
        nombre: sucursal.nombre,
      })),
    );
  }, [statsOrders, sucursales, monthFilter]);

  const selectedSucursalName = useMemo(() => {
    if (sucursalFilter === 'all') {
      return 'Todas las sucursales';
    }

    return sucursales.find(sucursal => sucursal.id === sucursalFilter)?.nombre ?? 'Sucursal';
  }, [sucursalFilter, sucursales]);

  const selectedMonthLabel = useMemo(() => {
    if (monthFilter === 'all') {
      return 'Histórico completo';
    }

    return formatMonthLabel(monthFilter);
  }, [monthFilter]);

  const refreshStatistics = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshAdminOrdersFromServer(queryClient);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }

      void refreshStatistics();
    }, [refreshStatistics]),
  );

  const renderFilterPills = (
    label: string,
    items: Array<{ id: string; label: string }>,
    selectedId: string,
    onSelect: (id: string) => void,
  ) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {items.map(item => {
          const isSelected = selectedId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.filterPill, isSelected && styles.filterPillSelected]}
              onPress={() => onSelect(item.id)}
            >
              <Text
                style={[
                  styles.filterLabel,
                  isSelected && styles.filterLabelSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  if (isPending && statsOrders.length === 0) {
    return (
      <ScreenSafeArea style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </ScreenSafeArea>
    );
  }

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <AdminHeader navigation={navigation} />
      <AdminTabs activeTab="statistics" navigation={navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || isFetching}
            onRefresh={refreshStatistics}
            tintColor={Colors.accent}
          />
        }
      >
        {isError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              No se pudieron cargar las estadísticas. Deslizá hacia abajo para reintentar.
            </Text>
          </View>
        ) : null}

        {renderFilterPills(
          'SUCURSAL',
          [
            { id: 'all', label: 'Todas' },
            ...sucursales.map(sucursal => ({
              id: sucursal.id,
              label: sucursal.nombre,
            })),
          ],
          sucursalFilter,
          id => setSucursalFilter(id),
        )}

        {renderFilterPills(
          'MES',
          [
            { id: 'all', label: 'Todos' },
            ...availableMonths.map(monthKey => ({
              id: monthKey,
              label: formatMonthLabel(monthKey),
            })),
          ],
          monthFilter,
          id => setMonthFilter(id),
        )}

        <View style={styles.contextBanner}>
          <Text style={styles.contextTitle}>{selectedSucursalName}</Text>
          <Text style={styles.contextSubtitle}>{selectedMonthLabel}</Text>
        </View>

        <Text style={styles.sectionTitle}>Resumen</Text>
        <StatsSummaryCards summary={summary} />

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Pedidos por mes
        </Text>
        <MonthlyBreakdown months={monthlyStats} />

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Horarios más activos
        </Text>
        <HourlyActivityChart buckets={hourlyBuckets} />

        {sucursalFilter === 'all' ? (
          <>
            <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
              Ranking entre sucursales
            </Text>
            <BranchRankingPanel rankings={branchRankings} />
          </>
        ) : (
          <View style={styles.singleBranchHint}>
            <Text style={styles.singleBranchHintText}>
              Seleccioná "Todas" en sucursales para ver el ranking comparativo entre las 5 sucursales.
            </Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
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
  contextBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 18,
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contextSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionTitleSpaced: {
    marginTop: 24,
  },
  errorBanner: {
    backgroundColor: '#FFF1F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD1CF',
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '600',
  },
  singleBranchHint: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  singleBranchHintText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
