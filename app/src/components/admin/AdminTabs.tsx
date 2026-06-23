import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/colors';

export type AdminTabId = 'products' | 'orders';

type AdminNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminProducts' | 'AdminOrders'
>;

interface AdminTabsProps {
  activeTab: AdminTabId;
  navigation: AdminNavigationProp;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, navigation }) => {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={styles.tab}
        activeOpacity={0.8}
        onPress={() => {
          if (activeTab !== 'products') {
            navigation.navigate('AdminProducts');
          }
        }}
      >
        <Text style={[styles.tabIcon, activeTab === 'products' && styles.tabIconActive]}>
          🛍
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'products' && styles.tabLabelActive]}>
          Productos
        </Text>
        {activeTab === 'products' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        activeOpacity={0.8}
        onPress={() => {
          if (activeTab !== 'orders') {
            navigation.navigate('AdminOrders');
          }
        }}
      >
        <Text style={[styles.tabIcon, activeTab === 'orders' && styles.tabIconActive]}>
          📦
        </Text>
        <Text style={[styles.tabLabel, activeTab === 'orders' && styles.tabLabelActive]}>
          Pedidos de clientes
        </Text>
        {activeTab === 'orders' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
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
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: Colors.accent,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
