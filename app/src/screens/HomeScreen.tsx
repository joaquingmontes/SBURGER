import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { useFocusEffect, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useListProductosActivos } from '@dataconnect/generated/react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Burger } from '../constants/mockData';
import { BurgerCard } from '../components/BurgerCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CustomButton } from '../components/CustomButton';
import { BottomNav } from '../components/BottomNav';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { ClientHeaderActions } from '../components/ClientHeaderActions';
import { Colors } from '../constants/colors';
import { dataConnect } from '../config/firebase';
import { mapProductoToBurger } from '../utils/firebaseMappers';
import { useRefetchOnFocus } from '../hooks/useRefetchOnFocus';
import { resetToLogin, resetToUserHome } from '../navigation/navigationUtils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas', emoji: '🍔' },
  { id: 'fries', label: 'Papas', emoji: '🍟' },
  { id: 'drinks', label: 'Bebidas', emoji: '🥤' },
  { id: 'desserts', label: 'Postres', emoji: '🍰' },
] as const;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const guestMode = route.params?.guestMode ?? false;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('burgers');

  const {
    data,
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useListProductosActivos(dataConnect);

  useRefetchOnFocus(refetch);

  const totalCartQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const goToLogin = () => {
    logout();
    resetToLogin(navigation);
  };

  const menuItems = useMemo(() => {
    const products = data?.productos ?? [];
    const mapped = products.map(mapProductoToBurger);
    const query = searchQuery.trim().toLowerCase();

    return mapped.filter(item => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [data?.productos, searchQuery, selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const firstName = user?.nombreCompleto.split(' ')[0] ?? 'Usuario';

  if (isPending) {
    return (
      <ScreenSafeArea style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Cargando delicias...</Text>
      </ScreenSafeArea>
    );
  }

  if (isError) {
    return (
      <ScreenSafeArea style={[styles.safeArea, styles.center]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error de Conexión</Text>
          <Text style={styles.errorSubtitle}>
            No se pudo cargar el menú desde Firebase.
          </Text>
          <CustomButton
            title="Reintentar"
            onPress={() => refetch()}
            style={styles.retryButton}
          />
        </View>
      </ScreenSafeArea>
    );
  }

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <View style={styles.logoGradientTop} />
            <View style={styles.logoGradientBottom} />
            <Text style={styles.logoEmoji}>🍔</Text>
          </View>
          <View>
            <Text style={styles.brandName}>StackBurger</Text>
            <Text style={styles.greeting}>
              {guestMode ? 'Modo invitado' : `Hola, ${firstName}`}
            </Text>
          </View>
        </View>

        {guestMode ? (
          <TouchableOpacity
            style={styles.loginHeaderButton}
            activeOpacity={0.85}
            onPress={goToLogin}
          >
            <Text style={styles.loginHeaderButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        ) : (
          <ClientHeaderActions
            showCart
            cartQuantity={totalCartQuantity}
            onCartPress={() => navigation.navigate('Cart', {})}
            onLogout={goToLogin}
            userName={user?.nombreCompleto.split(' ')[0] ?? 'Usuario'}
            userEmail={user?.email ?? ''}
          />
        )}
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en el menú..."
          placeholderTextColor={Colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {guestMode && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerText}>
            Estás viendo el menú como invitado
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={goToLogin}>
            <Text style={styles.guestBannerLink}>Ingresar ›</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.8}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryEmoji,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {category.emoji}
              </Text>
              <Text
                style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        style={styles.list}
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BurgerCard
            burger={item}
            onPress={() =>
              navigation.navigate('Detail', {
                burger: item,
                guestMode,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={() => refetch()}
        refreshing={isRefetching}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay productos en esta categoría.</Text>
          </View>
        }
      />

      <BottomNav
        activeTab="catalog"
        onCatalogPress={() => {}}
        onOrdersPress={() =>
          guestMode ? goToLogin() : navigation.navigate('Orders')
        }
      />
    </ScreenSafeArea>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: Colors.logoTop,
  },
  logoGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: Colors.logoBottom,
  },
  logoEmoji: {
    fontSize: 22,
    zIndex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  greeting: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  loginHeaderButton: {
    backgroundColor: Colors.accent,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginHeaderButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accentText,
  },
  guestBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFF8EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  guestBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '500',
    marginRight: 8,
  },
  guestBannerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  categoriesScroll: {
    maxHeight: 44,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10,
  },
  categoryPillSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  categoryTextSelected: {
    color: Colors.accentText,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 90,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
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
});
