import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/colors';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
