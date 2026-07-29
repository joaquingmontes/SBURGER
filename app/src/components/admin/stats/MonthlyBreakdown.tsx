import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { MonthlyStat, formatCurrency } from '../../../utils/adminStatistics';

interface MonthlyBreakdownProps {
  months: MonthlyStat[];
}

export const MonthlyBreakdown: React.FC<MonthlyBreakdownProps> = ({ months }) => {
  if (months.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay pedidos para mostrar por mes.</Text>
      </View>
    );
  }

  const maxOrders = Math.max(...months.map(month => month.totalOrders), 1);

  return (
    <View style={styles.container}>
      {months.map(month => {
        const barWidth = `${Math.max(8, (month.totalOrders / maxOrders) * 100)}%`;

        return (
          <View key={month.key} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={styles.monthLabel}>{month.label}</Text>
              <Text style={styles.monthTotal}>{month.totalOrders} pedidos</Text>
            </View>

            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: barWidth as `${number}%` }]} />
            </View>

            <View style={styles.metricsRow}>
              <Text style={styles.metricText}>
                Recaudado: {formatCurrency(month.revenue)}
              </Text>
              <Text style={styles.metricText}>Finalizados: {month.completed}</Text>
            </View>
            <View style={styles.metricsRow}>
              <Text style={styles.metricText}>En proceso: {month.preparing}</Text>
              <Text style={styles.metricText}>Cancelados: {month.cancelled}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  row: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  monthTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  barBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    marginBottom: 10,
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.accent,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  metricText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
