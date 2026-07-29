import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/colors';

export type AdminTabId = 'products' | 'orders' | 'statistics';

type AdminNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminProducts' | 'AdminOrders' | 'AdminStatistics'
>;

interface AdminTabConfig {
  id: AdminTabId;
  icon: string;
  label: string;
  route: 'AdminProducts' | 'AdminOrders' | 'AdminStatistics';
}

interface AdminTabsProps {
  activeTab: AdminTabId;
  navigation: AdminNavigationProp;
}

const ADMIN_TABS: AdminTabConfig[] = [
  { id: 'products', icon: '🛍', label: 'Productos', route: 'AdminProducts' },
  { id: 'orders', icon: '📦', label: 'Pedidos de clientes', route: 'AdminOrders' },
  { id: 'statistics', icon: '📊', label: 'Estadísticas', route: 'AdminStatistics' },
];

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, navigation }) => {
  return (
    <View style={styles.tabsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {ADMIN_TABS.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(tab.route);
                }
              }}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 12,
  },
  tab: {
    minWidth: 128,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 6,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.tabInactive,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: Colors.accent,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 3,
    backgroundColor: Colors.accent,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
