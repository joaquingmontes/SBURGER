import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { AdminProduct } from '../../constants/adminProducts';
import { resolveProductImageUri } from '../../constants/productImages';
import { Colors } from '../../constants/colors';

interface AdminProductCardProps {
  product: AdminProduct;
  onEdit: (product: AdminProduct) => void;
  onEditPrices: (product: AdminProduct) => void;
  onEditAvailability: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
}

const AdminProductCardComponent: React.FC<AdminProductCardProps> = ({
  product,
  onEdit,
  onEditPrices,
  onEditAvailability,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image
          source={{ uri: resolveProductImageUri(product.image, 'thumb') }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={0}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => onEdit(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Editar ${product.name}`}
        >
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => onEditPrices(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Precios por sucursal de ${product.name}`}
        >
          <Text style={styles.pricesIcon}>$</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => onEditAvailability(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Disponibilidad por sucursal de ${product.name}`}
        >
          <Text style={styles.availabilityIcon}>📦</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => onDelete(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`Eliminar ${product.name}`}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const AdminProductCard = memo(AdminProductCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  pricesIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
  availabilityIcon: {
    fontSize: 16,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
