import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { EXTRA_PRICE } from '../context/CartContext';

interface ExtraOptionProps {
  title: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxLimit?: number;
}

export const ExtraOption: React.FC<ExtraOptionProps> = ({
  title,
  count,
  onIncrement,
  onDecrement,
  maxLimit = 5,
}) => {
  const isMinusDisabled = count <= 0;
  const isPlusDisabled = count >= maxLimit;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>+${EXTRA_PRICE.toLocaleString('es-AR')}</Text>
      </View>

      <View style={styles.stepper}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onDecrement}
          disabled={isMinusDisabled}
          style={[styles.stepperButton, styles.minusButton, isMinusDisabled && styles.disabledButton]}
        >
          <Text style={[styles.stepperButtonText, styles.minusText, isMinusDisabled && styles.disabledText]}>−</Text>
        </TouchableOpacity>

        <Text style={styles.stepperValue}>{count}</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onIncrement}
          disabled={isPlusDisabled}
          style={[styles.stepperButton, styles.plusButton, isPlusDisabled && styles.disabledPlusButton]}
        >
          <Text style={[styles.stepperButtonText, styles.plusText]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginVertical: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  price: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  minusButton: {
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  plusButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  disabledButton: {
    borderColor: '#E5E5EA',
    backgroundColor: '#FAFAFA',
  },
  disabledPlusButton: {
    borderColor: Colors.disabled,
    backgroundColor: Colors.disabled,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  minusText: {
    color: Colors.textPrimary,
  },
  plusText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.disabled,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    minWidth: 12,
    textAlign: 'center',
  },
});
