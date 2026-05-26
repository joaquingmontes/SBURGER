import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CartItem as CartItemType, EXTRA_PRICE } from '../context/CartContext';
import { Colors } from '../constants/colors';

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  // Generar string descriptivo de los extras seleccionados
  const getCustomizationsText = () => {
    const list: string[] = [];
    const { medallon, cheddar, panceta, cebolla } = item.customizations;
    
    if (medallon > 0) list.push(`+ Carne${medallon > 1 ? ` x${medallon}` : ''}`);
    if (cheddar > 0) list.push(`+ Cheddar${cheddar > 1 ? ` x${cheddar}` : ''}`);
    if (panceta > 0) list.push(`+ Panceta${panceta > 1 ? ` x${panceta}` : ''}`);
    if (cebolla > 0) list.push(`+ Cebolla${cebolla > 1 ? ` x${cebolla}` : ''}`);
    
    return list.length > 0 ? list.join(', ') : 'Sin adicionales';
  };

  const isMinusDisabled = item.quantity <= 1;

  return (
    <View style={styles.card}>
      {/* Botón de Eliminación (Tacho de basura) en esquina superior derecha */}
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={onRemove} 
        style={styles.removeButton}
        accessibilityLabel="Eliminar producto"
      >
        <Text style={styles.trashIcon}>🗑️</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Image source={{ uri: item.burger.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{item.burger.name}</Text>
          <Text style={styles.customizations} numberOfLines={1}>{getCustomizationsText()}</Text>
          
          {item.notes.trim().length > 0 && (
            <Text style={styles.notes} numberOfLines={2}>
              💬 "{item.notes}"
            </Text>
          )}

          <Text style={styles.price}>
            ${item.totalPrice.toLocaleString('es-AR')}
          </Text>

          {/* Stepper de cantidad para modificar ítem (RF-05 / HU-04) */}
          <View style={styles.stepper}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onDecrement}
              disabled={isMinusDisabled}
              style={[styles.stepperButton, isMinusDisabled && styles.disabledButton]}
            >
              <Text style={[styles.stepperText, isMinusDisabled && styles.disabledText]}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onIncrement}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  removeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
  trashIcon: {
    fontSize: 14,
    color: '#8E8E93',
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 6,
    backgroundColor: '#E5E5EA',
  },
  content: {
    flex: 1,
    marginLeft: 16,
    paddingRight: 24, // Espacio para que el texto no pise el tacho de basura
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  customizations: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    backgroundColor: '#F2F2F7',
    padding: 6,
    borderRadius: 4,
    marginTop: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    borderColor: Colors.disabled,
    backgroundColor: Colors.disabled,
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.textSecondary,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginHorizontal: 12,
    minWidth: 16,
    textAlign: 'center',
  },
});
