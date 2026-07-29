import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { ModalidadEntrega } from '@dataconnect/generated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCart } from '../context/CartContext';
import { useSucursal } from '../context/SucursalContext';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/colors';
import { CustomButton } from '../components/CustomButton';
import { useBusinessHours } from '../hooks/useBusinessHours';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import {
  createOrderInFirebase,
  generateOrderCode,
} from '../services/orderService';
import { invalidateUserOrdersQueries } from '../utils/queryInvalidation';
import { resetToLogin, resetToUserHome } from '../navigation/navigationUtils';
type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

type DeliveryMethod = 'delivery' | 'takeaway';

const DELIVERY_FEE = 1000;

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedSucursal, effectiveSucursalId } = useSucursal();
  const { subtotal, items, clearCart } = useCart();
  const { isOpen, businessHoursText } = useBusinessHours();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [telefonoErr, setTelefonoErr] = useState(false);
  const [direccionErr, setDireccionErr] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderCode, setConfirmedOrderCode] = useState('');
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
  const orderTotal = subtotal + shippingCost;
  const customerName = user?.nombreCompleto.trim() || 'Cliente';
  const pickupAddress = selectedSucursal
    ? `${selectedSucursal.nombre} · ${selectedSucursal.direccion}`
    : 'Retiro en local';

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.background);
      }
    }, []),
  );

  const validateForm = (): boolean => {
    let isValid = true;

    const cleanPhone = telefono.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      setTelefonoErr(true);
      isValid = false;
    } else {
      setTelefonoErr(false);
    }

    if (deliveryMethod === 'delivery') {
      if (direccion.trim().length < 5) {
        setDireccionErr(true);
        isValid = false;
      } else {
        setDireccionErr(false);
      }
    } else {
      setDireccionErr(false);
    }

    return isValid;
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'Tenés que iniciar sesión para confirmar el pedido.');
      resetToLogin(navigation);
      return;
    }

    if (!isOpen) {
      Alert.alert(
        'Cocina Cerrada',
        `Lo sentimos, solo aceptamos pedidos en el horario de ${businessHoursText}. Tu pedido sigue guardado en el carrito.`,
      );
      return;
    }

    if (!validateForm()) {
      Alert.alert(
        'Datos Incompletos',
        'Por favor, completá correctamente los campos obligatorios marcados en rojo.',
      );
      return;
    }

    setProcessing(true);
    try {
      const codigo = generateOrderCode();
      await createOrderInFirebase({
        usuarioId: user.id,
        sucursalId: effectiveSucursalId,
        codigo,
        subtotal,
        costoEnvio: shippingCost,
        total: orderTotal,
        modalidadEntrega:
          deliveryMethod === 'delivery'
            ? ModalidadEntrega.DELIVERY
            : ModalidadEntrega.TAKEAWAY,
        nombreContacto: customerName,
        telefonoContacto: telefono.trim(),
        direccion: deliveryMethod === 'delivery' ? direccion.trim() : null,
        items,
      });

      await invalidateUserOrdersQueries(queryClient);
      setConfirmedOrderCode(codigo);
      setOrderConfirmed(true);
    } catch {
      Alert.alert(
        'Error',
        'No se pudo confirmar el pedido. Verificá tu conexión e intentá de nuevo.',
      );
    } finally {
      setProcessing(false);
    }
  };
  const handleSuccessClose = () => {
    clearCart();
    resetToUserHome(navigation, user);
  };

  const isFormFilled =
    telefono.trim() !== '' &&
    (deliveryMethod === 'takeaway' || direccion.trim() !== '');

  const deliveryMethodLabel =
    deliveryMethod === 'delivery' ? 'Delivery' : 'Retiro en local';

  if (orderConfirmed) {
    return (
      <ScreenSafeArea style={styles.successSafeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>¡Pedido Confirmado!</Text>
          <Text style={styles.successSubtitle}>
            Tu pedido ya fue enviado al sector de producción de cocina.
          </Text>

          <View style={styles.ticketCard}>
            <Text style={styles.ticketHeader}>DETALLE DE LA COMANDA</Text>
            <View style={styles.ticketDivider} />
            <Text style={styles.ticketText}>
              <Text style={styles.ticketBold}>ID Pedido:</Text> #{confirmedOrderCode}            </Text>
            <Text style={styles.ticketText}>
              <Text style={styles.ticketBold}>Cliente:</Text> {customerName}
            </Text>
            <Text style={styles.ticketText}>
              <Text style={styles.ticketBold}>Teléfono:</Text> {telefono}
            </Text>
            <Text style={styles.ticketText}>
              <Text style={styles.ticketBold}>Sucursal:</Text>{' '}
              {selectedSucursal?.nombre ?? 'StackBurger'}
            </Text>
            <Text style={styles.ticketText}>
              <Text style={styles.ticketBold}>Modalidad:</Text> {deliveryMethodLabel}
            </Text>
            {deliveryMethod === 'delivery' ? (
              <Text style={styles.ticketText}>
                <Text style={styles.ticketBold}>Dirección:</Text> {direccion}
              </Text>
            ) : (
              <Text style={styles.ticketText}>
                <Text style={styles.ticketBold}>Retiro:</Text> {pickupAddress}
              </Text>
            )}
            <View style={styles.ticketDivider} />
            <Text style={styles.ticketTotal}>
              Total Pagado: ${orderTotal.toLocaleString('es-AR')}
            </Text>
          </View>

          <CustomButton
            title="Volver al Menú"
            onPress={handleSuccessClose}
            variant="primary"
            style={styles.backMenuButton}
          />
        </View>
      </ScreenSafeArea>
    );
  }

  if (!isOpen) {
    return (
      <ScreenSafeArea style={styles.safeArea}>
        <View style={styles.closedContainer}>
          <Text style={styles.closedIcon}>🕒</Text>
          <Text style={styles.closedTitle}>Cocina Cerrada</Text>
          <Text style={styles.closedSubtitle}>
            Actualmente nos encontramos fuera de horario comercial. Aceptamos pedidos
            de lunes a domingo de{' '}
            <Text style={styles.closedHighlight}>{businessHoursText}</Text>.
          </Text>
          <Text style={styles.closedNote}>
            Tus productos siguen guardados en el carrito para que los confirmes en cuanto
            abramos. ¡Muchas gracias!
          </Text>
          <CustomButton
            title="Volver al Carrito"
            onPress={() => navigation.goBack()}
            style={styles.retryButton}
          />
        </View>
      </ScreenSafeArea>
    );
  }

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver"
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar pedido</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionLabel}>¿CÓMO QUERÉS RECIBIRLO?</Text>
          <View style={styles.methodRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.methodCard,
                deliveryMethod === 'delivery' && styles.methodCardSelected,
              ]}
              onPress={() => setDeliveryMethod('delivery')}
            >
              <Text
                style={[
                  styles.methodIcon,
                  deliveryMethod === 'delivery' && styles.methodIconSelected,
                ]}
              >
                📍
              </Text>
              <Text
                style={[
                  styles.methodTitle,
                  deliveryMethod === 'delivery' && styles.methodTitleSelected,
                ]}
              >
                Delivery
              </Text>
              <Text
                style={[
                  styles.methodSubtitle,
                  deliveryMethod === 'delivery'
                    ? styles.methodSubtitleAccent
                    : styles.methodSubtitleMuted,
                ]}
              >
                +$1.000 de envío
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.methodCard,
                deliveryMethod === 'takeaway' && styles.methodCardSelected,
              ]}
              onPress={() => setDeliveryMethod('takeaway')}
            >
              <Text
                style={[
                  styles.methodIcon,
                  deliveryMethod === 'takeaway'
                    ? styles.methodIconSelected
                    : styles.methodIconMuted,
                ]}
              >
                🛍
              </Text>
              <Text
                style={[
                  styles.methodTitle,
                  deliveryMethod === 'takeaway' && styles.methodTitleSelected,
                ]}
              >
                Takeaway
              </Text>
              <Text
                style={[
                  styles.methodSubtitle,
                  deliveryMethod === 'takeaway'
                    ? styles.methodSubtitleFree
                    : styles.methodSubtitleMuted,
                ]}
              >
                Envío gratis
              </Text>
            </TouchableOpacity>
          </View>

          {deliveryMethod === 'takeaway' && (
            <View style={styles.pickupCard}>
              <Text style={styles.pickupTitle}>📍 Retirá en el local</Text>
              <Text style={styles.pickupAddress}>{pickupAddress}</Text>
            </View>
          )}

          <View style={styles.branchSummaryCard}>
            <Text style={styles.branchSummaryLabel}>SUCURSAL DEL PEDIDO</Text>
            <Text style={styles.branchSummaryName}>
              {selectedSucursal?.nombre ?? 'Centro La Plata'}
            </Text>
            {selectedSucursal?.direccion ? (
              <Text style={styles.branchSummaryAddress}>
                {selectedSucursal.direccion}
              </Text>
            ) : null}
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
            TUS DATOS
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyFieldText}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Teléfono de contacto <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, telefonoErr && styles.inputError]}
              placeholder="11 1234-5678"
              placeholderTextColor={Colors.placeholder}
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={text => {
                setTelefono(text);
                if (text.replace(/\D/g, '').length >= 8) setTelefonoErr(false);
              }}
            />
            {telefonoErr && (
              <Text style={styles.errorHelper}>
                Ingresá un teléfono de contacto válido (mín. 8 números).
              </Text>
            )}
          </View>

          {deliveryMethod === 'delivery' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Dirección de entrega <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, direccionErr && styles.inputError]}
                placeholder="Calle, número, piso, depto..."
                placeholderTextColor={Colors.placeholder}
                multiline
                numberOfLines={2}
                value={direccion}
                onChangeText={text => {
                  setDireccion(text);
                  if (text.trim().length >= 5) setDireccionErr(false);
                }}
              />
              {direccionErr && (
                <Text style={styles.errorHelper}>
                  Ingresá una dirección de entrega válida (mín. 5 caracteres).
                </Text>
              )}
            </View>
          )}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>RESUMEN</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Text>
              <Text style={styles.summaryValue}>
                ${subtotal.toLocaleString('es-AR')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Envío</Text>
              {shippingCost > 0 ? (
                <Text style={styles.summaryValue}>
                  ${shippingCost.toLocaleString('es-AR')}
                </Text>
              ) : (
                <Text style={styles.summaryFree}>Gratis</Text>
              )}
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>
                ${orderTotal.toLocaleString('es-AR')}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!isFormFilled || processing) && styles.confirmButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!isFormFilled || processing}
            onPress={handleConfirmOrder}
          >
            <Text style={styles.confirmButtonText}>
              {processing
                ? 'Procesando...'
                : `Confirmar pedido · $${orderTotal.toLocaleString('es-AR')}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenSafeArea>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: -2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionLabelSpaced: {
    marginTop: 8,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  methodCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: '#FFF9F0',
  },
  methodIcon: {
    fontSize: 22,
    marginBottom: 8,
    opacity: 0.45,
  },
  methodIconSelected: {
    opacity: 1,
  },
  methodIconMuted: {
    opacity: 0.45,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  methodTitleSelected: {
    color: Colors.textPrimary,
  },
  methodSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  methodSubtitleAccent: {
    color: Colors.accent,
  },
  methodSubtitleFree: {
    color: Colors.success,
  },
  methodSubtitleMuted: {
    color: Colors.textMuted,
  },
  pickupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 8,
  },
  pickupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  pickupAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  branchSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 8,
  },
  branchSummaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  branchSummaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  branchSummaryAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  readOnlyField: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readOnlyFieldText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 72,
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
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  summaryFree: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.success,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 6,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  confirmButton: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accentText,
  },
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
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  retryButton: {
    width: 180,
  },
  successSafeArea: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
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
