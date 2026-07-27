import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MenuCategory } from '../constants/mockData';
import { resolveProductImageUri } from '../constants/productImages';
import { Colors } from '../constants/colors';
import { CustomButton } from '../components/CustomButton';
import { ExtraOption } from '../components/ExtraOption';
import { LoginRequiredModal } from '../components/LoginRequiredModal';
import { useCart, Customizations, calculateItemPrice } from '../context/CartContext';
import { useSucursal } from '../context/SucursalContext';
import { resetToLogin } from '../navigation/navigationUtils';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

interface DetailScreenProps {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

const EMPTY_CUSTOMIZATIONS: Customizations = {
  medallon: 0,
  cheddar: 0,
  panceta: 0,
  cebolla: 0,
};

const isSimpleProductCategory = (category: MenuCategory): boolean =>
  category === 'fries' || category === 'drinks' || category === 'desserts';

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { burger, guestMode = false } = route.params;
  const { addToCart } = useCart();
  const { selectedSucursal } = useSucursal();
  const isSimpleProduct = isSimpleProductCategory(burger.category);

  const [customizations, setCustomizations] = useState<Customizations>(EMPTY_CUSTOMIZATIONS);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: burger.name,
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 17,
      },
    });
  }, [burger.name, navigation]);

  const handleIncrement = (key: keyof Customizations) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: Math.min(5, prev[key] + 1),
    }));
  };

  const handleDecrement = (key: keyof Customizations) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] - 1),
    }));
  };

  const unitPrice = isSimpleProduct
    ? burger.price
    : calculateItemPrice(burger.price, customizations);
  const totalPrice = unitPrice * (isSimpleProduct ? 1 : quantity);

  const handleAddToCart = () => {
    if (guestMode) {
      setLoginModalVisible(true);
      return;
    }

    if (notes.length > 150) {
      Alert.alert('Error', 'Las aclaraciones no pueden superar los 150 caracteres.');
      return;
    }

    const itemQuantity = isSimpleProduct ? 1 : quantity;
    const itemCustomizations = isSimpleProduct ? EMPTY_CUSTOMIZATIONS : customizations;

    addToCart(burger, itemQuantity, itemCustomizations, notes);

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      navigation.goBack();
    }, 1200);
  };

  const isNotesLengthExceeded = notes.length > 150;
  const isNotesApproachingLimit = notes.length >= 130;

  const notesInput = (
    <>
      <View style={isSimpleProduct ? styles.simpleNotesHeader : styles.notesHeader}>
        <Text style={isSimpleProduct ? styles.simpleNotesLabel : styles.sectionTitle}>
          {isSimpleProduct ? 'ACLARACIONES (opcional)' : 'Aclaraciones especiales de cocina'}
        </Text>
        {!isSimpleProduct && (
          <Text
            style={[
              styles.charCounter,
              isNotesLengthExceeded && styles.errorText,
              isNotesApproachingLimit && !isNotesLengthExceeded && styles.warningText,
            ]}
          >
            {notes.length}/150
          </Text>
        )}
      </View>

      <TextInput
        style={[
          isSimpleProduct ? styles.simpleTextInput : styles.textInput,
          isNotesLengthExceeded && styles.textInputError,
          isNotesApproachingLimit && !isNotesLengthExceeded && styles.textInputWarning,
        ]}
        placeholder={
          isSimpleProduct
            ? 'Sin cebolla, sin salsa, cocción a punto...'
            : 'Ej: sin cebolla, salsa stack aparte, etc.'
        }
        placeholderTextColor={Colors.textSecondary}
        multiline
        numberOfLines={3}
        value={notes}
        maxLength={160}
        onChangeText={setNotes}
      />
      {isNotesLengthExceeded && (
        <Text style={styles.validationError}>Máximo 150 caracteres permitidos.</Text>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          key={burger.image || burger.id}
          source={{ uri: resolveProductImageUri(burger.image) }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={0}
        />

        <View style={styles.content}>
          <Text style={styles.name}>{burger.name}</Text>
          {selectedSucursal ? (
            <Text style={styles.branchHint}>
              Precio en {selectedSucursal.nombre}
            </Text>
          ) : null}

          {isSimpleProduct ? (
            <>
              <Text style={styles.description}>{burger.description}</Text>

              <View style={styles.priceBox}>
                <Text style={styles.priceBoxLabel}>Precio</Text>
                <Text style={styles.priceBoxValue}>
                  ${burger.price.toLocaleString('es-AR')}
                </Text>
              </View>

              {notesInput}
            </>
          ) : (
            <>
              <Text style={styles.ingredientsTitle}>Ingredientes Base:</Text>
              <Text style={styles.ingredients}>{burger.ingredients}</Text>

              <Text style={styles.basePriceText}>
                Precio base:{' '}
                <Text style={styles.basePrice}>
                  ${burger.price.toLocaleString('es-AR')}
                </Text>
              </Text>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>EXTRAS (+$800 c/u)</Text>
              <Text style={styles.sectionSubtitle}>
                Máximo 5 unidades de cada extra por hamburguesa
              </Text>

              <ExtraOption
                title="Medallón de Carne adicional"
                count={customizations.medallon}
                onIncrement={() => handleIncrement('medallon')}
                onDecrement={() => handleDecrement('medallon')}
              />
              <ExtraOption
                title="Queso Cheddar extra"
                count={customizations.cheddar}
                onIncrement={() => handleIncrement('cheddar')}
                onDecrement={() => handleDecrement('cheddar')}
              />
              <ExtraOption
                title="Panceta Crocante extra"
                count={customizations.panceta}
                onIncrement={() => handleIncrement('panceta')}
                onDecrement={() => handleDecrement('panceta')}
              />
              <ExtraOption
                title="Cebolla Caramelizada extra"
                count={customizations.cebolla}
                onIncrement={() => handleIncrement('cebolla')}
                onDecrement={() => handleDecrement('cebolla')}
              />

              <View style={styles.divider} />

              {notesInput}

              <View style={styles.quantitySection}>
                <Text style={styles.quantityTitle}>Cantidad de hamburguesas</Text>
                <View style={styles.stepperContainer}>
                  <CustomButton
                    title="−"
                    onPress={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    style={styles.qtyBtn}
                    textStyle={styles.qtyBtnText}
                  />
                  <Text style={styles.qtyValue}>{quantity}</Text>
                  <CustomButton
                    title="+"
                    onPress={() => setQuantity(q => q + 1)}
                    style={styles.qtyBtn}
                    textStyle={styles.qtyBtnText}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Agregar al carrito"
          onPress={handleAddToCart}
          disabled={isNotesLengthExceeded}
          variant={isNotesLengthExceeded ? 'disabled' : isSimpleProduct ? 'accent' : 'primary'}
          rightElement={
            <Text
              style={[
                styles.footerPrice,
                isSimpleProduct && styles.footerPriceAccent,
              ]}
            >
              ${totalPrice.toLocaleString('es-AR')}
            </Text>
          }
          style={styles.addToCartButton}
        />
      </View>

      {showFeedback && (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackToastText}>✅ ¡Agregado con éxito!</Text>
        </View>
      )}

      <LoginRequiredModal
        visible={loginModalVisible}
        onLogin={() => {
          setLoginModalVisible(false);
          resetToLogin(navigation);
        }}
        onCancel={() => setLoginModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#E5E5EA',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  branchHint: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: -4,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    backgroundColor: Colors.background,
  },
  priceBoxLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  ingredients: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  basePriceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  basePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  simpleNotesHeader: {
    marginBottom: 10,
  },
  simpleNotesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.4,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#FAF9F9',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  simpleTextInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    textAlignVertical: 'top',
    minHeight: 96,
  },
  textInputWarning: {
    borderColor: Colors.warning,
  },
  textInputError: {
    borderColor: Colors.error,
  },
  warningText: {
    color: Colors.warning,
  },
  errorText: {
    color: Colors.error,
  },
  validationError: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
    marginTop: 4,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  quantityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    minHeight: 38,
    minWidth: 38,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    minWidth: 16,
    textAlign: 'center',
  },
  spacer: {
    height: 100,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addToCartButton: {
    justifyContent: 'space-between',
  },
  footerPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  footerPriceAccent: {
    color: Colors.accentText,
  },
  feedbackToast: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 100,
  },
  feedbackToastText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
