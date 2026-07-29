import { Platform } from 'react-native';

export const FLAT_LIST_PERF_PROPS = {
  initialNumToRender: 8,
  maxToRenderPerBatch: 8,
  windowSize: 5,
  updateCellsBatchingPeriod: 50,
  removeClippedSubviews: Platform.OS === 'android',
} as const;
