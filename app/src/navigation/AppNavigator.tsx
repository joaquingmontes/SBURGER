import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { AdminProductsScreen } from '../screens/AdminProductsScreen';
import { AdminOrdersScreen } from '../screens/AdminOrdersScreen';
import { AdminOrderDetailScreen } from '../screens/AdminOrderDetailScreen';
import { Colors } from '../constants/colors';
import { Burger } from '../constants/mockData';
import { AdminClientOrder } from '../constants/mockAdminOrders';

// Tipado de rutas para navegación segura
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: { guestMode?: boolean } | undefined;
  Orders: undefined;
  AdminProducts: undefined;
  AdminOrders: undefined;
  AdminOrderDetail: { order: AdminClientOrder };
  Detail: { burger: Burger; guestMode?: boolean };
  Cart: { simulateError?: boolean }; // Soporta simulación de estado de error por rúbrica
  Checkout: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStatusBarHeight: insets.top,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0, // Remueve sombra en Android
          shadowOpacity: 0, // Remueve sombra en iOS
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
        },
        headerBackTitleVisible: false,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // La Home tiene su cabecera personalizada con logo
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminProducts"
        component={AdminProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminOrders"
        component={AdminOrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AdminOrderDetail"
        component={AdminOrderDetailScreen}
        options={{
          title: 'Detalle del pedido',
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Mi Pedido',
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
