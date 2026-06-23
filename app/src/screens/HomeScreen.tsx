import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BURGER_MENU, Burger } from '../constants/mockData';
import { BurgerCard } from '../components/BurgerCard';
import { useCart } from '../context/CartContext';
import { CustomButton } from '../components/CustomButton';
import { BottomNav } from '../components/BottomNav';
import { ScreenSafeArea } from '../components/ScreenSafeArea';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeColors = {
  background: '#0C0C0C',
  surface: '#1A1A1A',
  surfaceLight: '#242424',
  border: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#666666',
  placeholder: '#555555',
  accent: '#F39C12',
  accentText: '#1A1208',
  logoTop: '#FFB347',
  logoBottom: '#FF8C00',
  tabInactive: '#666666',
};

const CATEGORIES = [
  { id: 'burgers', label: 'Hamburguesas', emoji: '🍔' },
  { id: 'fries', label: 'Papas', emoji: '🍟' },
  { id: 'drinks', label: 'Bebidas', emoji: '🥤' },
  { id: 'desserts', label: 'Postres', emoji: '🍰' },
] as const;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { items } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuItems, setMenuItems] = useState<Burger[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('burgers');

  const totalCartQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

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
    }, 1200);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(HomeColors.background);
      }
    }, []),
  );

  const goToLogin = () => {
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <ScreenSafeArea style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color={HomeColors.accent} />
        <Text style={styles.loadingText}>Cargando delicias...</Text>
      </ScreenSafeArea>
    );
  }

  if (error) {
    return (
      <ScreenSafeArea style={[styles.safeArea, styles.center]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error de Conexión</Text>
          <Text style={styles.errorSubtitle}>
            No se pudo cargar el menú gastronómico.
          </Text>
          <CustomButton
            title="Reintentar"
            onPress={() => loadMenu(false)}
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
            <Text style={styles.greeting}>Hola, Yamil</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Cart')}
            style={styles.iconButton}
            accessibilityLabel="Ver carrito"
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {totalCartQuantity > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalCartQuantity}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={goToLogin}
            style={styles.iconButton}
            accessibilityLabel="Cerrar sesión"
          >
            <View style={styles.logoutIcon}>
              <View style={styles.logoutBracket} />
              <View style={styles.logoutArrowLine} />
              <View style={styles.logoutArrowHead} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en el menú..."
          placeholderTextColor={HomeColors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

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
            onPress={() => navigation.navigate('Detail', { burger: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={() => loadMenu(false)}
        refreshing={false}
      />

      <BottomNav
        activeTab="catalog"
        onCatalogPress={() => {}}
        onOrdersPress={() => navigation.navigate('Orders')}
      />
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HomeColors.background,
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
    backgroundColor: HomeColors.logoTop,
  },
  logoGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: HomeColors.logoBottom,
  },
  logoEmoji: {
    fontSize: 22,
    zIndex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: HomeColors.textPrimary,
    letterSpacing: 0.3,
  },
  greeting: {
    fontSize: 13,
    color: HomeColors.textSecondary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: HomeColors.surface,
    borderWidth: 1,
    borderColor: HomeColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: HomeColors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: HomeColors.background,
  },
  badgeText: {
    color: HomeColors.accentText,
    fontSize: 10,
    fontWeight: '800',
  },
  logoutIcon: {
    width: 22,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBracket: {
    width: 9,
    height: 14,
    borderWidth: 1.5,
    borderColor: HomeColors.textPrimary,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  logoutArrowLine: {
    width: 7,
    height: 1.5,
    backgroundColor: HomeColors.textPrimary,
  },
  logoutArrowHead: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: HomeColors.textPrimary,
    marginLeft: -1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HomeColors.surface,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: HomeColors.border,
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
    color: HomeColors.textPrimary,
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
    backgroundColor: HomeColors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: HomeColors.border,
    marginRight: 10,
  },
  categoryPillSelected: {
    backgroundColor: HomeColors.accent,
    borderColor: HomeColors.accent,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: HomeColors.textPrimary,
  },
  categoryTextSelected: {
    color: HomeColors.accentText,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 90,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: HomeColors.textSecondary,
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
    color: HomeColors.textPrimary,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: HomeColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    width: 160,
  },
});
