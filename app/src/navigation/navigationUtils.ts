import { CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RolUsuario } from '@dataconnect/generated';
import { AuthUser } from '../context/AuthContext';
import { RootStackParamList } from './AppNavigator';

type AppNavigation = StackNavigationProp<RootStackParamList>;

export const resetToLogin = (navigation: AppNavigation): void => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    }),
  );
};

export const resetToGuestHome = (navigation: AppNavigation): void => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home', params: { guestMode: true } }],
    }),
  );
};

export const resetToUserHome = (
  navigation: AppNavigation,
  user: AuthUser | null,
  options?: { guestMode?: boolean },
): void => {
  if (user?.rol === RolUsuario.ADMIN) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AdminProducts' }],
      }),
    );
    return;
  }

  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          params: { guestMode: options?.guestMode ?? false },
        },
      ],
    }),
  );
};

export const resetAfterAuth = (
  navigation: AppNavigation,
  user: AuthUser,
): void => {
  resetToUserHome(navigation, user);
};
