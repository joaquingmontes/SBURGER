import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BURGER_MENU, Burger } from '../constants/mockData';
import { Colors } from '../constants/colors';
import { BurgerCard } from '../components/BurgerCard';
import { useCart } from '../context/CartContext';
import { CustomButton } from '../components/CustomButton';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { items } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuItems, setMenuItems] = useState<Burger[]>([]);

  // Calcular cantidad total de productos en el carrito para el badge
  const totalCartQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Simular la carga del catálogo con estados (Rendimiento < 2s - RNF)
  const loadMenu = (simulateError = false) => {
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      if (simulateError) {
        setLoading(false);
        setError(true);
      } else {
        setMenuItems(BURGER_MENU);
        setLoading(false);
      }
    }, 1200); // 1.2 segundos (cumple con RNF < 2s)
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Renderizar la pantalla de carga (Estado: Carga)
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <View style={styles.header}>
          <Text style={styles.logoText}>🍔 StackBurger</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando delicias...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar la pantalla de error de conexión (Estado: Error de Conexión)
  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error de Conexión</Text>
          <Text style={styles.errorSubtitle}>No se pudo cargar el menú gastronómico.</Text>
          <CustomButton
            title="Reintentar"
            onPress={() => loadMenu(false)}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Renderizar catálogo normal
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabecera superior según wireframe */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🍔</Text>
            <View>
              <Text style={styles.logoText}>StackBurger</Text>
              <Text style={styles.logoSubtext}>Hamburguesería</Text>
            </View>
          </View>
          
          {/* Ícono de carrito con badge */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Cart')}
            style={styles.cartButton}
            accessibilityLabel="Ver carrito"
          >
            <Text style={styles.cartIconText}>🛒</Text>
            {totalCartQuantity > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCartQuantity}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.headerTitles}>
          <Text style={styles.menuTitle}>Menú Principal</Text>
          <Text style={styles.menuSubtitle}>Seleccioná tu hamburguesa favorita para personalizar</Text>
        </View>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BurgerCard
            burger={item}
            onPress={() => navigation.navigate('Detail', { burger: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Soporta tirar para refrescar y simular recarga
        onRefresh={() => loadMenu(false)}
        refreshing={false}
      />

      {/* Botón flotante secreto para simular un fallo de red para la corrección docente */}
      <TouchableOpacity
        style={styles.floatingDebugButton}
        onPress={() => loadMenu(true)}
      >
        <Text style={styles.debugText}>⚠️ Simular Error</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  logoSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  cartIconText: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  headerTitles: {
    marginTop: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 12,
    paddingBottom: 80, // Espacio extra para el botón flotante secreto
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  errorContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
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
  floatingDebugButton: {
    position: 'absolute',
    bottom: 20,
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
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
