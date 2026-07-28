import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { OrderSummary, formatCurrency } from '../../../utils/adminStatistics';

interface StatsSummaryCardsProps {
  summary: OrderSummary;
}

const SUMMARY_ITEMS: Array<{
  key: keyof OrderSummary;
  label: string;
  format?: (value: number) => string;
  accent?: string;
}> = [
  { key: 'totalOrders', label: 'Pedidos recibidos' },
  { key: 'revenue', label: 'Recaudado', format: formatCurrency, accent: Colors.accent },
  { key: 'preparing', label: 'En proceso', accent: Colors.warning },
  { key: 'completed', label: 'Finalizados', accent: Colors.success },
  { key: 'cancelled', label: 'Cancelados', accent: Colors.error },
];

export const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({ summary }) => (
  <View style={styles.grid}>
    {SUMMARY_ITEMS.map(item => {
      const value = summary[item.key];
      const displayValue =
        item.format && typeof value === 'number' ? item.format(value) : String(value);

      return (
        <View key={item.key} style={styles.card}>
          <Text style={styles.cardLabel}>{item.label}</Text>
          <Text style={[styles.cardValue, item.accent ? { color: item.accent } : null]}>
            {displayValue}
          </Text>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
});
