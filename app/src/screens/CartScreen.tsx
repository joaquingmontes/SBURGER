import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ListRenderItem,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCart, CartItem as CartItemType } from '../context/CartContext';
import { Colors } from '../constants/colors';
import { FLAT_LIST_PERF_PROPS } from '../constants/listPerformance';
import { CartItem } from '../components/CartItem';
import { CustomButton } from '../components/CustomButton';
import { ScreenSafeArea } from '../components/ScreenSafeArea';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;
type CartScreenRouteProp = RouteProp<RootStackParamList, 'Cart'>;

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
  route: CartScreenRouteProp;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation, route }) => {
  const { items, subtotal, shipping, total, updateQuantity, removeFromCart } = useCart();
  const cartActionsRef = useRef({ updateQuantity, removeFromCart });
  cartActionsRef.current = { updateQuantity, removeFromCart };

  const [errorSimulated, setErrorSimulated] = useState(route.params?.simulateError || false);

  const handleCheckout = useCallback(() => {
    if (items.length === 0 || total === 0) {
      Alert.alert('Carrito Vacío', 'No puedes realizar un pedido sin productos en tu carrito.');
      return;
    }
    navigation.navigate('Checkout');
  }, [items.length, total, navigation]);

  const renderCartItem = useCallback<ListRenderItem<CartItemType>>(
    ({ item }) => (
      <CartItem
        item={item}
        onIncrement={() =>
          cartActionsRef.current.updateQuantity(item.id, item.quantity + 1)
        }
        onDecrement={() =>
          cartActionsRef.current.updateQuantity(item.id, item.quantity - 1)
        }
        onRemove={() => cartActionsRef.current.removeFromCart(item.id)}
      />
    ),
    [],
  );

  if (errorSimulated) {
    return (
      <ScreenSafeArea edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error al Cargar</Text>
          <Text style={styles.errorSubtitle}>No se pudo recuperar el carrito.</Text>
          <CustomButton
            title="Reintentar"
            onPress={() => setErrorSimulated(false)}
            style={styles.retryButton}
          />
        </View>
      </ScreenSafeArea>
    );
  }

  const isCartEmpty = items.length === 0;

  return (
    <ScreenSafeArea edges={['left', 'right', 'bottom']} style={styles.safeArea}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderCartItem}
        {...FLAT_LIST_PERF_PROPS}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptySubtitle}>
              Volvé al menú principal y agregá tus hamburguesas preferidas.
            </Text>
            <CustomButton
              title="Ver el Menú"
              onPress={() => navigation.navigate('Home')}
              style={styles.menuLinkButton}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {!isCartEmpty && (
        <View style={styles.resumenContainer}>
          <View style={styles.resumenCard}>
            <Text style={styles.resumenTitle}>RESUMEN</Text>

            <View style={styles.resumenRow}>
              <Text style={styles.resumenLabel}>Subtotal</Text>
              <Text style={styles.resumenValue}>${subtotal.toLocaleString('es-AR')}</Text>
            </View>

            <View style={styles.resumenRow}>
              <Text style={styles.resumenLabel}>Envío</Text>
              <Text style={styles.resumenValue}>${shipping.toLocaleString('es-AR')}</Text>
            </View>

            <View style={styles.divider} />

            <View style={[styles.resumenRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toLocaleString('es-AR')}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <CustomButton
          title={isCartEmpty ? 'Carrito Vacío' : 'Realizar Pedido'}
          onPress={handleCheckout}
          disabled={isCartEmpty}
          variant={isCartEmpty ? 'disabled' : 'primary'}
          style={styles.checkoutButton}
        />
      </View>

      {!isCartEmpty && (
        <TouchableOpacity
          style={styles.floatingDebugButton}
          onPress={() => setErrorSimulated(true)}
        >
          <Text style={styles.debugText}>⚠️ Simular Error</Text>
        </TouchableOpacity>
      )}
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 220,
  },
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  menuLinkButton: {
    width: 140,
    minHeight: 44,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    width: 160,
  },
  resumenContainer: {
    position: 'absolute',
    bottom: 84,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
  },
  resumenCard: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    padding: 16,
  },
  resumenTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 1,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  resumenLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resumenValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalRow: {
    marginTop: 4,
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  checkoutButton: {
    width: '100%',
  },
  floatingDebugButton: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: '#3a3a3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 9999,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
