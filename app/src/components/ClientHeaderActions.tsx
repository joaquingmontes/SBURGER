import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/colors';
import { UserProfileMenu } from './UserProfileMenu';

interface ClientHeaderActionsProps {
  showCart?: boolean;
  cartQuantity?: number;
  onCartPress?: () => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

const ICON_COLOR = '#000000';

const CartOutlineIcon: React.FC = () => (
  <View style={styles.cartIcon}>
    <View style={styles.cartHandle} />
    <View style={styles.cartBody} />
    <View style={styles.cartWheelLeft} />
    <View style={styles.cartWheelRight} />
  </View>
);

export const ClientHeaderActions: React.FC<ClientHeaderActionsProps> = ({
  showCart = false,
  cartQuantity = 0,
  onCartPress,
  onLogout,
  userName = 'Usuario',
  userEmail = '',
}) => {
  return (
    <View style={styles.container}>
      {showCart && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onCartPress}
          style={styles.cartButton}
          accessibilityLabel="Ver carrito"
        >
          <CartOutlineIcon />
          {cartQuantity > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <UserProfileMenu
        onLogout={onLogout}
        userName={userName}
        userEmail={userEmail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    width: 24,
    height: 20,
    position: 'relative',
  },
  cartHandle: {
    position: 'absolute',
    top: 2,
    left: 0,
    width: 8,
    height: 1.5,
    backgroundColor: ICON_COLOR,
    transform: [{ rotate: '-25deg' }],
  },
  cartBody: {
    position: 'absolute',
    top: 4,
    left: 5,
    width: 16,
    height: 11,
    borderWidth: 1.5,
    borderColor: ICON_COLOR,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 2,
  },
  cartWheelLeft: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: ICON_COLOR,
  },
  cartWheelRight: {
    position: 'absolute',
    bottom: 0,
    right: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: ICON_COLOR,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  badgeText: {
    color: Colors.accentText,
    fontSize: 10,
    fontWeight: '800',
  },
});
