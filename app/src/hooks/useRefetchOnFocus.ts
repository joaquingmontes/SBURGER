import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export const useRefetchOnFocus = (
  refetch: () => unknown,
  enabled = true,
): void => {
  useFocusEffect(
    useCallback(() => {
      if (enabled) {
        refetch();
      }
    }, [enabled, refetch]),
  );
};
