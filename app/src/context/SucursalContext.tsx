import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { RolUsuario } from '@dataconnect/generated';
import { useListSucursales } from '@dataconnect/generated/react';
import { dataConnect } from '../config/firebase';
import { DEFAULT_SUCURSAL_ID, SucursalInfo } from '../constants/sucursales';
import { refreshSucursalesFromServer } from '../utils/sucursalQueryCache';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface SucursalContextType {
  sucursales: SucursalInfo[];
  selectedSucursal: SucursalInfo | null;
  selectedSucursalId: string | null;
  effectiveSucursalId: string;
  sucursalConfirmed: boolean;
  needsSucursalSelection: boolean;
  isLoading: boolean;
  isError: boolean;
  confirmSucursal: (sucursalId: string) => void;
  selectSucursal: (sucursalId: string) => void;
  refetchSucursales: () => Promise<void>;
}

const SucursalContext = createContext<SucursalContextType | undefined>(undefined);

export const SucursalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const isCliente = user?.rol === RolUsuario.CLIENTE;

  const [selectedSucursalId, setSelectedSucursalId] = useState<string | null>(
    DEFAULT_SUCURSAL_ID,
  );
  const [sucursalConfirmed, setSucursalConfirmed] = useState(false);

  const {
    data,
    isPending,
    isError,
  } = useListSucursales(dataConnect);

  const refreshSucursales = useCallback(async () => {
    await refreshSucursalesFromServer(queryClient);
  }, [queryClient]);

  useEffect(() => {
    if (isCliente) {
      setSelectedSucursalId(null);
      setSucursalConfirmed(false);
      return;
    }

    if (!user) {
      setSelectedSucursalId(DEFAULT_SUCURSAL_ID);
      setSucursalConfirmed(false);
    }
  }, [user?.id, isCliente, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    void refreshSucursales();
  }, [user?.id, refreshSucursales, user]);

  const sucursales = useMemo<SucursalInfo[]>(
    () =>
      (data?.sucursals ?? []).map(sucursal => ({
        id: sucursal.id,
        nombre: sucursal.nombre,
        direccion: sucursal.direccion,
      })),
    [data?.sucursals],
  );

  const effectiveSucursalId = selectedSucursalId ?? DEFAULT_SUCURSAL_ID;

  const selectedSucursal = useMemo(
    () =>
      sucursales.find(sucursal => sucursal.id === effectiveSucursalId) ??
      sucursales[0] ??
      null,
    [effectiveSucursalId, sucursales],
  );

  const needsSucursalSelection = isCliente && !sucursalConfirmed;

  useEffect(() => {
    if (!needsSucursalSelection) {
      return;
    }

    void refreshSucursales();
  }, [needsSucursalSelection, refreshSucursales]);

  const applySelection = useCallback((sucursalId: string) => {
    setSelectedSucursalId(sucursalId);
  }, []);

  const confirmSucursal = useCallback((sucursalId: string) => {
    setSelectedSucursalId(sucursalId);
    setSucursalConfirmed(true);
  }, []);

  const selectSucursal = useCallback(
    (sucursalId: string) => {
      if (sucursalId === effectiveSucursalId) {
        return;
      }

      if (items.length > 0) {
        Alert.alert(
          'Cambiar sucursal',
          'Al cambiar de sucursal se vacía el carrito porque los precios pueden variar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Continuar',
              style: 'destructive',
              onPress: () => {
                clearCart();
                applySelection(sucursalId);
                if (isCliente) {
                  setSucursalConfirmed(true);
                }
              },
            },
          ],
        );
        return;
      }

      applySelection(sucursalId);
      if (isCliente) {
        setSucursalConfirmed(true);
      }
    },
    [applySelection, clearCart, effectiveSucursalId, isCliente, items.length],
  );

  const value = useMemo(
    () => ({
      sucursales,
      selectedSucursal,
      selectedSucursalId,
      effectiveSucursalId,
      sucursalConfirmed,
      needsSucursalSelection,
      isLoading: isPending,
      isError,
      confirmSucursal,
      selectSucursal,
      refetchSucursales: refreshSucursales,
    }),
    [
      sucursales,
      selectedSucursal,
      selectedSucursalId,
      effectiveSucursalId,
      sucursalConfirmed,
      needsSucursalSelection,
      isPending,
      isError,
      confirmSucursal,
      selectSucursal,
      refreshSucursales,
    ],
  );

  return (
    <SucursalContext.Provider value={value}>
      {children}
    </SucursalContext.Provider>
  );
};

export const useSucursal = (): SucursalContextType => {
  const context = useContext(SucursalContext);
  if (!context) {
    throw new Error('useSucursal debe utilizarse dentro de un SucursalProvider');
  }
  return context;
};
