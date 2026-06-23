import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from './AppNavigator';
import { resetToLogin, resetToUserHome } from './navigationUtils';

type AppNavigation = StackNavigationProp<RootStackParamList>;

export const useRequireAdmin = (navigation: AppNavigation): void => {
  const { user, isAdmin } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        resetToLogin(navigation);
        return;
      }

      if (!isAdmin) {
        resetToUserHome(navigation, user);
      }
    }, [isAdmin, navigation, user]),
  );
};

export const useRequireClient = (navigation: AppNavigation): void => {
  const { user, isAdmin } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (isAdmin) {
        resetToUserHome(navigation, user);
      }
    }, [isAdmin, navigation, user]),
  );
};
