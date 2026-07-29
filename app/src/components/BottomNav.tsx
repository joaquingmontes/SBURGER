import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/colors';

export type BottomNavTab = 'catalog' | 'orders';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onCatalogPress: () => void;
  onOrdersPress: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onCatalogPress,
  onOrdersPress,
}) => {
  const isCatalogActive = activeTab === 'catalog';
  const isOrdersActive = activeTab === 'orders';

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={isCatalogActive ? 1 : 0.7}
        onPress={onCatalogPress}
      >
        <Text style={[styles.tabIcon, isCatalogActive && styles.tabIconActive]}>
          🍴
        </Text>
        <Text style={[styles.tabLabel, isCatalogActive && styles.tabLabelActive]}>
          Catálogo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        activeOpacity={isOrdersActive ? 1 : 0.7}
        onPress={onOrdersPress}
      >
        <Text style={[styles.tabIcon, isOrdersActive && styles.tabIconActive]}>
          🛒
        </Text>
        <Text style={[styles.tabLabel, isOrdersActive && styles.tabLabelActive]}>
          Mis pedidos
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 6 : 10,
    paddingHorizontal: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.tabInactive,
  },
  tabLabelActive: {
    color: Colors.accent,
  },
});
