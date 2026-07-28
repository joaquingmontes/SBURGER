import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { HourlyBucket, getPeakHourLabel } from '../../../utils/adminStatistics';

interface HourlyActivityChartProps {
  buckets: HourlyBucket[];
  title?: string;
}

const CHART_HEIGHT = 132;

export const HourlyActivityChart: React.FC<HourlyActivityChartProps> = ({
  buckets,
  title = 'Horarios más activos',
}) => {
  const maxCount = Math.max(...buckets.map(bucket => bucket.count), 1);
  const peakLabel = getPeakHourLabel(buckets);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {peakLabel ? (
          <Text style={styles.peakHint}>Pico: {peakLabel}</Text>
        ) : (
          <Text style={styles.peakHint}>Sin actividad registrada</Text>
        )}
      </View>

      <View style={styles.chartArea}>
        {buckets.map(bucket => {
          const barHeight = Math.max(8, (bucket.count / maxCount) * CHART_HEIGHT);

          return (
            <View key={bucket.label} style={styles.barColumn}>
              <Text style={styles.barCount}>{bucket.count}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: barHeight }]} />
              </View>
              <Text style={styles.barLabel}>{bucket.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  peakHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 6,
    minHeight: CHART_HEIGHT + 44,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    minHeight: 14,
  },
  barTrack: {
    width: '100%',
    maxWidth: 42,
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.accent,
    minHeight: 8,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
