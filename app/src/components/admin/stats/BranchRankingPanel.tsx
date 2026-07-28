import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { BranchRankingEntry, formatCurrency } from '../../../utils/adminStatistics';

interface BranchRankingPanelProps {
  rankings: BranchRankingEntry[];
}

const MEDAL_BY_RANK: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => (
  <View style={styles.rankBadge}>
    <Text style={styles.rankBadgeText}>
      {MEDAL_BY_RANK[rank] ?? `#${rank}`}
    </Text>
  </View>
);

export const BranchRankingPanel: React.FC<BranchRankingPanelProps> = ({
  rankings,
}) => {
  if (rankings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay sucursales para comparar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rankings.map(entry => (
        <View key={entry.sucursalId} style={styles.card}>
          <View style={styles.cardHeader}>
            <RankBadge rank={entry.rankByOrders} />
            <View style={styles.headerText}>
              <Text style={styles.branchName}>{entry.sucursalName}</Text>
              <Text style={styles.branchSubtitle}>
                {entry.totalOrders} pedidos · {formatCurrency(entry.revenue)} recaudado
              </Text>
            </View>
          </View>

          <View style={styles.rankGrid}>
            <View style={styles.rankItem}>
              <Text style={styles.rankItemLabel}>Pedidos</Text>
              <Text style={styles.rankItemValue}>#{entry.rankByOrders}</Text>
            </View>
            <View style={styles.rankItem}>
              <Text style={styles.rankItemLabel}>Recaudación</Text>
              <Text style={styles.rankItemValue}>#{entry.rankByRevenue}</Text>
            </View>
            <View style={styles.rankItem}>
              <Text style={styles.rankItemLabel}>Finalización</Text>
              <Text style={styles.rankItemValue}>#{entry.rankByCompletion}</Text>
            </View>
          </View>

          <View style={styles.footerMetrics}>
            <Text style={styles.footerMetric}>
              Ticket prom.: {formatCurrency(entry.averageTicket)}
            </Text>
            <Text style={styles.footerMetric}>
              Tasa finalización: {entry.completionRate}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
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
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadgeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerText: {
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  branchSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  rankGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  rankItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  rankItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  rankItemValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  footerMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  footerMetric: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
