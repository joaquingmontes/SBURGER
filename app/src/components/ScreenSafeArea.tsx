import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface ScreenSafeAreaProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

export const ScreenSafeArea: React.FC<ScreenSafeAreaProps> = ({
  children,
  style,
  edges = ['top', 'left', 'right'],
}) => (
  <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
    {children}
  </SafeAreaView>
);
