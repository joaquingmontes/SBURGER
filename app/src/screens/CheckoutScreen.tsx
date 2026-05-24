import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCart } from '../context/CartContext';
import { Colors } from '../constants/colors';
import { CustomButton } from '../components/CustomButton';
import { useBusinessHours } from '../hooks/useBusinessHours';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { total, items, clearCart } = useCart();
  const { isOpen, businessHoursText } = useBusinessHours();

  // Estados del Formulario (RF-04)
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // Estados de errores de validación (RN-04 / HU-01)
  const [nombreErr, setNombreErr] = useState(false);
  const [telefonoErr, setTelefonoErr] = useState(false);
  const [direccionErr, setDireccionErr] = useState(false);

  // Estados de éxito y procesamiento
  const [processing, setProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState('');

  // Validador rápido de formato
  const validateForm = (): boolean => {
    let isValid = true;

    if (nombre.trim().length < 3) {
      setNombreErr(true);
      isValid = false;
    } else {
      setNombreErr(false);
    }

    // Teléfono: al menos 8 dígitos numéricos
    const cleanPhone = telefono.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setTelefonoErr(true);
      isValid = false;
    } else {
      setTelefonoErr(false);
    }

    if (direccion.trim().length < 5) {
      setDireccionErr(true);
      isValid = false;
    } else {
      setDireccionErr(false);
    }

    return isValid;
  };

  const handleConfirmOrder = () => {
    // RN-05: Validar disponibilidad horaria de la cocina
    if (!isOpen) {
      Alert.alert(
        'Cocina Cerrada',
        `Lo sentimos, solo aceptamos pedidos en el horario de ${businessHoursText}. Tu pedido sigue guardado en el carrito.`
      );
      return;
    }

    // RN-04: Validar campos obligatorios
    if (!validateForm()) {
      Alert.alert('Datos Incompletos', 'Por favor, completá correctamente los campos obligatorios marcados en rojo.');
      return;
    }

    // Simular el registro del pedido en el servidor (RF-04)
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSimulatedOrderId(`SB-${Math.floor(Math.random() * 90000) + 10000}`);
      setOrderConfirmed(true);
    }, 1800); // Carga simulada menor a 2 segundos (RNF-Rendimiento)
  };

  const handleSuccessClose = () => {
    // Limpia el carrito y vuelve a la pantalla inicial (RF-04)
    clearCart();
    navigation.popToTop();
  };

  // Habilitar visualmente el botón (Wireframe) solo si hay texto en todos los campos obligatorios
  const isFormFilled = nombre.trim() !== '' && telefono.trim() !== '' && direccion.trim() !== '';

  // 1. Pantalla de Éxito (Estado: Éxito)
  if (orderConfirmed) {
    return (
      <SafeAreaView style={styles.successSafeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>¡Pedido Confirmado!</Text>
          <Text style={styles.successSubtitle}>Tu pedido ya fue enviado al sector de producción de cocina.</Text>

          <View style={styles.ticketCard}>
            <Text style={styles.ticketHeader}>DETALLE DE LA COMANDA</Text>
            <View style={styles.ticketDivider} />
            <Text style={styles.ticketText}><Text style={styles.ticketBold}>ID Pedido:</Text> #{simulatedOrderId}</Text>
            <Text style={styles.ticketText}><Text style={styles.ticketBold}>Cliente:</Text> {nombre}</Text>
            <Text style={styles.ticketText}><Text style={styles.ticketBold}>Teléfono:</Text> {telefono}</Text>
            <Text style={styles.ticketText}><Text style={styles.ticketBold}>Dirección:</Text> {direccion}</Text>
            <View style={styles.ticketDivider} />
            <Text style={styles.ticketTotal}>Total Pagado: ${total.toLocaleString('es-AR')}</Text>
          </View>

          <CustomButton
            title="Volver al Menú"
            onPress={handleSuccessClose}
            variant="primary"
            style={styles.backMenuButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // 2. Pantalla de Horario Comercial Cerrado (RN-05)
  if (!isOpen) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.closedContainer}>
          <Text style={styles.closedIcon}>🕒</Text>
          <Text style={styles.closedTitle}>Cocina Cerrada</Text>
          <Text style={styles.closedSubtitle}>
            Actualmente nos encontramos fuera de horario comercial. Aceptamos pedidos de lunes a domingo de{' '}
            <Text style={styles.closedHighlight}>{businessHoursText}</Text>.
          </Text>
          <Text style={styles.closedNote}>
            Tus productos siguen guardados en el carrito para que los confirmes en cuanto abramos. ¡Muchas gracias!
          </Text>
          <CustomButton
            title="Volver al Carrito"
            onPress={() => navigation.goBack()}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // 3. Formulario Normal
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.formInstructions}>
              Por favor completa tus datos para coordinar el envío de tu pedido a domicilio.
            </Text>

            {/* Campo NOMBRE Y APELLIDO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOMBRE Y APELLIDO *</Text>
              <TextInput
                style={[styles.input, nombreErr && styles.inputError]}
                placeholder="Nombre completo"
                placeholderTextColor={Colors.textSecondary}
                value={nombre}
                onChangeText={(text) => {
                  setNombre(text);
                  if (text.trim().length >= 3) setNombreErr(false);
                }}
                autoCapitalize="words"
              />
              {nombreErr && (
                <Text style={styles.errorHelper}>Ingresá tu nombre y apellido (mín. 3 letras).</Text>
              )}
            </View>

            {/* Campo TELÉFONO DE CONTACTO */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TELÉFONO DE CONTACTO *</Text>
              <TextInput
                style={[styles.input, telefonoErr && styles.inputError]}
                placeholder="11 1234-5678"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="phone-pad"
                value={telefono}
                onChangeText={(text) => {
                  setTelefono(text);
                  if (text.replace(/\D/g, '').length >= 8) setTelefonoErr(false);
                }}
              />
              {telefonoErr && (
                <Text style={styles.errorHelper}>Ingresá un teléfono de contacto válido (mín. 8 números).</Text>
              )}
            </View>

            {/* Campo DIRECCIÓN DE ENTREGA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DIRECCIÓN DE ENTREGA *</Text>
              <TextInput
                style={[styles.input, styles.textArea, direccionErr && styles.inputError]}
                placeholder="Calle, número, departamento, aclaraciones..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={2}
                value={direccion}
                onChangeText={(text) => {
                  setDireccion(text);
                  if (text.trim().length >= 5) setDireccionErr(false);
                }}
              />
              {direccionErr && (
                <Text style={styles.errorHelper}>Ingresá una dirección de entrega válida (mín. 5 caracteres).</Text>
              )}
            </View>

            {/* Tarjeta de Resumen Rápido (Wireframe Checkout) */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>RESUMEN DE COMPRA</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total a Pagar:</Text>
                <Text style={styles.summaryValue}>${total.toLocaleString('es-AR')}</Text>
              </View>
              <Text style={styles.summaryDetails}>
                {items.reduce((acc, item) => acc + item.quantity, 0)} productos · envío incluido
              </Text>
            </View>
          </View>
          <View style={styles.spacer} />
        </ScrollView>

        {/* Footer con el botón dinámico (Wireframe) */}
        <View style={styles.footer}>
          <CustomButton
            title="Confirmar Pedido"
            onPress={handleConfirmOrder}
            loading={processing}
            disabled={!isFormFilled}
            variant={isFormFilled ? 'accent' : 'disabled'} // Coral/Rojo si está completo, Gris si está incompleto
            style={styles.confirmButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formInstructions: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF9F9',
  },
  errorHelper: {
    fontSize: 11,
    color: Colors.error,
    fontWeight: '600',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  summaryDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  spacer: {
    height: 120, // Espacio al pie para el scroll
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  confirmButton: {
    width: '100%',
  },
  
  // Estilos de la pantalla de cocina cerrada (RN-05)
  closedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  closedIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  closedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  closedSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  closedHighlight: {
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  closedNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  retryButton: {
    width: 180,
  },

  // Estilos de la pantalla de éxito (HU-01)
  successSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 20,
    marginBottom: 32,
  },
  ticketHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
  },
  ticketDivider: {
    height: 1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  ticketText: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  ticketBold: {
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  ticketTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 6,
  },
  backMenuButton: {
    width: 200,
  },
});
