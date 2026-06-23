import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  createUsuario,
  getUsuarioByEmail,
  RolUsuario,
} from '@dataconnect/generated';
import { QueryFetchPolicy } from 'firebase/data-connect';
import { dataConnect } from '../config/firebase';

const SERVER_ONLY = { fetchPolicy: QueryFetchPolicy.SERVER_ONLY };

const EMAIL_ALREADY_REGISTERED = 'Ese email ya está registrado.';
const REGISTER_GENERIC_ERROR =
  'No se pudo crear la cuenta. Verificá tu conexión e intentá de nuevo.';

const isDuplicateEmailError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes('unique') ||
    message.includes('already exists') ||
    message.includes('duplicate') ||
    message.includes('ya existe')
  );
};

const toRegisterError = (error: unknown): Error => {
  if (error instanceof Error) {
    if (isDuplicateEmailError(error)) {
      return new Error(EMAIL_ALREADY_REGISTERED);
    }

    const message = error.message.toLowerCase();
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed to fetch') ||
      message.includes('offline') ||
      message.includes('timeout')
    ) {
      return new Error(REGISTER_GENERIC_ERROR);
    }

    return error;
  }

  return new Error(REGISTER_GENERIC_ERROR);
};

export interface AuthUser {
  id: string;
  nombreCompleto: string;
  email: string;
  rol: RolUsuario;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (
    nombreCompleto: string,
    email: string,
    password: string,
  ) => Promise<AuthUser>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await getUsuarioByEmail(dataConnect, {
      email: normalizedEmail,
    });
    const foundUser = response.data.usuarios[0];

    if (!foundUser || foundUser.passwordHash !== password) {
      throw new Error('Email o contraseña incorrectos.');
    }

    const authenticatedUser: AuthUser = {
      id: foundUser.id,
      nombreCompleto: foundUser.nombreCompleto,
      email: foundUser.email,
      rol: foundUser.rol,
    };

    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback(
    async (nombreCompleto: string, email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      try {
        const existing = await getUsuarioByEmail(
          dataConnect,
          { email: normalizedEmail },
          SERVER_ONLY,
        );

        if (existing.data.usuarios.length > 0) {
          throw new Error(EMAIL_ALREADY_REGISTERED);
        }

        const created = await createUsuario(dataConnect, {
          nombreCompleto: nombreCompleto.trim(),
          email: normalizedEmail,
          passwordHash: password,
          rol: RolUsuario.CLIENTE,
        });

        const authenticatedUser: AuthUser = {
          id: created.data.usuario_insert.id,
          nombreCompleto: nombreCompleto.trim(),
          email: normalizedEmail,
          rol: RolUsuario.CLIENTE,
        };

        setUser(authenticatedUser);
        return authenticatedUser;
      } catch (error) {
        throw toRegisterError(error);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isAdmin: user?.rol === RolUsuario.ADMIN,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
