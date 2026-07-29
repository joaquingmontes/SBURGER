import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  PRODUCT_CATEGORIES,
  ProductCategory,
} from '../../constants/adminProducts';
import { AdminColors } from '../../constants/adminTheme';

interface CategoryPickerProps {
  value: ProductCategory;
  onChange: (category: ProductCategory) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (category: ProductCategory) => {
    onChange(category);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CATEGORÍA</Text>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.selector, open && styles.selectorOpen]}
        onPress={() => setOpen(prev => !prev)}
      >
        <Text style={styles.selectorText}>{value}</Text>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.optionsList}>
          {PRODUCT_CATEGORIES.map(category => {
            const isSelected = category === value;
            return (
              <Pressable
                key={category}
                style={[
                  styles.optionItem,
                  isSelected && styles.optionItemSelected,
                ]}
                onPress={() => handleSelect(category)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: AdminColors.label,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorOpen: {
    borderColor: AdminColors.accent,
  },
  selectorText: {
    fontSize: 16,
    color: AdminColors.textPrimary,
  },
  chevron: {
    fontSize: 12,
    color: AdminColors.textSecondary,
  },
  chevronOpen: {
    color: AdminColors.accent,
  },
  optionsList: {
    marginTop: 4,
    backgroundColor: AdminColors.surface,
    borderWidth: 1,
    borderColor: AdminColors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionItemSelected: {
    backgroundColor: AdminColors.categorySelected,
  },
  optionText: {
    fontSize: 15,
    color: AdminColors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});
