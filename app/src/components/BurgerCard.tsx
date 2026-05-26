import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Burger } from '../constants/mockData';
import { Colors } from '../constants/colors';
import { CustomButton } from './CustomButton';

interface BurgerCardProps {
  burger: Burger;
  onPress: () => void;
}

export const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <Image
          source={{ uri: burger.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoSection}>
          <Text style={styles.name} numberOfLines={1}>{burger.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{burger.description}</Text>
          <Text style={styles.price}>${burger.price.toLocaleString('es-AR')}</Text>
        </View>
      </View>
      
      <CustomButton
        title="Personalizar"
        onPress={onPress}
        style={styles.button}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  infoSection: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  button: {
    borderRadius: 0,
    minHeight: 44, // Altura más compacta para encajar como pie de tarjeta
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowOpacity: 0, // Desactiva sombra interna
    elevation: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
