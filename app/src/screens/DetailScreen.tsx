import React, { useState } from 'react';
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
import { Colors } from '../constants/colors';
import { CustomButton } from '../components/CustomButton';
import { ExtraOption } from '../components/ExtraOption';
import { useCart, Customizations, calculateItemPrice } from '../context/CartContext';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

interface DetailScreenProps {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { burger } = route.params;
  const { addToCart } = useCart();

  // Estados locales para las personalizaciones (RF-02 / RN-02)
  const [customizations, setCustomizations] = useState<Customizations>({
    medallon: 0,
    cheddar: 0,
    panceta: 0,
    cebolla: 0,
  });

  // Estado local para notas especiales (RF-02 / RN-03 / HU-05)
  const [notes, setNotes] = useState('');

  // Cantidad general de esta hamburguesa que se va a agregar
  const [quantity, setQuantity] = useState(1);

  // Estado para feedback de éxito flotante
  const [showFeedback, setShowFeedback] = useState(false);

  // Manejo de incrementos de extras (límite estricto de 5 - RN-02)
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

  // Calcular precio unitario y total del ítem en tiempo real (RF-06)
  const unitPrice = calculateItemPrice(burger.price, customizations);
  const totalPrice = unitPrice * quantity;

  // Manejo de guardado en el carrito (RF-03, RN-03)
  const handleAddToCart = () => {
    if (notes.length > 150) {
      Alert.alert('Error', 'Las aclaraciones no pueden superar los 150 caracteres.');
      return;
    }

    addToCart(burger, quantity, customizations, notes);
    
    // Feedback visual premium flotante (HU-04) sin romper flujo, y luego vuelve atrás
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      navigation.goBack();
    }, 1200);
  };

  const isNotesLengthExceeded = notes.length > 150;
  const isNotesApproachingLimit = notes.length >= 130;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner de imagen de producto (Hero Image) según wireframe SBURG002 */}
        <Image source={{ uri: burger.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <Text style={styles.name}>{burger.name}</Text>
          <Text style={styles.ingredientsTitle}>Ingredientes Base:</Text>
          <Text style={styles.ingredients}>{burger.ingredients}</Text>
          
          <Text style={styles.basePriceText}>
            Precio Base: <Text style={styles.basePrice}>${burger.price.toLocaleString('es-AR')}</Text>
          </Text>

          <View style={styles.divider} />

          {/* Sección EXTRAS (+$800) */}
          <Text style={styles.sectionTitle}>EXTRAS (+$800 c/u)</Text>
          <Text style={styles.sectionSubtitle}>Máximo 5 unidades de cada extra por hamburguesa</Text>

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

          {/* Campo de Notas Especiales con validación de 150 caracteres (RN-03 / HU-05) */}
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>Aclaraciones especiales de cocina</Text>
            <Text 
              style={[
                styles.charCounter, 
                isNotesLengthExceeded && styles.errorText,
                isNotesApproachingLimit && !isNotesLengthExceeded && styles.warningText
              ]}
            >
              {notes.length}/150
            </Text>
          </View>
          
          <TextInput
            style={[
              styles.textInput, 
              isNotesLengthExceeded && styles.textInputError,
              isNotesApproachingLimit && !isNotesLengthExceeded && styles.textInputWarning
            ]}
            placeholder="Ej: sin cebolla, salsa stack aparte, etc."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
            value={notes}
            maxLength={160} // Dejamos un poco más para que la validación visual actúe en 150
            onChangeText={(text) => setNotes(text)}
          />
          {isNotesLengthExceeded && (
            <Text style={styles.validationError}>Máximo 150 caracteres permitidos.</Text>
          )}

          {/* Selector de cantidad general de hamburguesas */}
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
          
          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Botón inferior fijo de Agregar al carrito con precio dinámico (SBURG002) */}
      <View style={styles.footer}>
        <CustomButton
          title="Agregar al carrito"
          onPress={handleAddToCart}
          disabled={isNotesLengthExceeded}
          variant={isNotesLengthExceeded ? 'disabled' : 'primary'}
          rightElement={
            <Text style={styles.footerPrice}>
              ${totalPrice.toLocaleString('es-AR')}
            </Text>
          }
          style={styles.addToCartButton}
        />
      </View>

      {/* Banner flotante de feedback visual exitoso (HU-04) */}
      {showFeedback && (
        <View style={styles.feedbackToast}>
          <Text style={styles.feedbackToastText}>✅ ¡Agregado con éxito!</Text>
        </View>
      )}
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
    height: 100, // Espacio al pie para permitir scroll total sobre el teclado y footer
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addToCartButton: {
    justifyContent: 'space-between', // Para empujar precio a la derecha
  },
  footerPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
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
