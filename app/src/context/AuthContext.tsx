import React, {

  createContext,

  useCallback,

  useContext,

  useEffect,

  useMemo,

  useState,

} from 'react';

import {

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signOut,

  onAuthStateChanged,

  FirebaseError,

} from 'firebase/auth';

import {

  createUsuarioProfile,

  getMe,

  linkMyAccount,

  RolUsuario,

} from '@dataconnect/generated';

import { QueryFetchPolicy } from 'firebase/data-connect';

import { auth, dataConnect } from '../config/firebase';



const SERVER_ONLY = { fetchPolicy: QueryFetchPolicy.SERVER_ONLY };



const EMAIL_ALREADY_REGISTERED = 'Ese email ya está registrado.';

const REGISTER_GENERIC_ERROR =

  'No se pudo crear la cuenta. Verificá tu conexión e intentá de nuevo.';

const PROFILE_NOT_FOUND =

  'Tu cuenta existe en Firebase pero no está vinculada. Ejecutá el script de migración o contactá soporte.';



const isDuplicateEmailError = (error: unknown): boolean => {

  if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {

    return true;

  }



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



const mapFirebaseAuthError = (error: unknown): Error => {

  if (error instanceof FirebaseError) {

    switch (error.code) {

      case 'auth/invalid-credential':

      case 'auth/wrong-password':

      case 'auth/user-not-found':

        return new Error('Email o contraseña incorrecto');

      case 'auth/email-already-in-use':

        return new Error(EMAIL_ALREADY_REGISTERED);

      case 'auth/weak-password':

        return new Error('La contraseña debe tener al menos 6 caracteres.');

      case 'auth/invalid-email':

        return new Error('Ingresá un email válido.');

      case 'auth/network-request-failed':

        return new Error(REGISTER_GENERIC_ERROR);

      default:

        return new Error(error.message || REGISTER_GENERIC_ERROR);

    }

  }



  if (error instanceof Error) {

    return error;

  }



  return new Error(REGISTER_GENERIC_ERROR);

};



const toRegisterError = (error: unknown): Error => {

  if (isDuplicateEmailError(error)) {

    return new Error(EMAIL_ALREADY_REGISTERED);

  }



  return mapFirebaseAuthError(error);

};



export interface AuthUser {

  id: string;

  nombreCompleto: string;

  email: string;

  rol: RolUsuario;

}



interface AuthContextValue {

  user: AuthUser | null;

  initializing: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;

  register: (

    nombreCompleto: string,

    email: string,

    password: string,

  ) => Promise<AuthUser>;

  logout: () => Promise<void>;

  isAdmin: boolean;

}



const AuthContext = createContext<AuthContextValue | undefined>(undefined);



const mapProfileToAuthUser = (profile: {

  id: string;

  nombreCompleto: string;

  email: string;

  rol: RolUsuario;

}): AuthUser => ({

  id: profile.id,

  nombreCompleto: profile.nombreCompleto,

  email: profile.email,

  rol: profile.rol,

});



const fetchProfile = async (): Promise<AuthUser | null> => {

  const response = await getMe(dataConnect, SERVER_ONLY);

  const profile = response.data.usuarios[0];

  return profile ? mapProfileToAuthUser(profile) : null;

};



const resolveProfile = async (): Promise<AuthUser> => {

  let profile = await fetchProfile();



  if (!profile) {

    await linkMyAccount(dataConnect);

    profile = await fetchProfile();

  }



  if (!profile) {

    throw new Error(PROFILE_NOT_FOUND);

  }



  return profile;

};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({

  children,

}) => {

  const [user, setUser] = useState<AuthUser | null>(null);

  const [initializing, setInitializing] = useState(true);



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {

      if (!firebaseUser) {

        setUser(null);

        setInitializing(false);

        return;

      }



      try {

        const profile = await resolveProfile();

        setUser(profile);

      } catch {

        await signOut(auth);

        setUser(null);

      } finally {

        setInitializing(false);

      }

    });



    return unsubscribe;

  }, []);



  const login = useCallback(async (email: string, password: string) => {

    const normalizedEmail = email.trim().toLowerCase();



    try {

      await signInWithEmailAndPassword(auth, normalizedEmail, password);

      const authenticatedUser = await resolveProfile();

      setUser(authenticatedUser);

      return authenticatedUser;

    } catch (error) {

      throw mapFirebaseAuthError(error);

    }

  }, []);



  const register = useCallback(

    async (nombreCompleto: string, email: string, password: string) => {

      const normalizedEmail = email.trim().toLowerCase();



      try {

        await createUserWithEmailAndPassword(auth, normalizedEmail, password);



        await createUsuarioProfile(dataConnect, {

          nombreCompleto: nombreCompleto.trim(),

          email: normalizedEmail,

          rol: RolUsuario.CLIENTE,

        });



        const authenticatedUser = await fetchProfile();

        if (!authenticatedUser) {

          throw new Error(REGISTER_GENERIC_ERROR);

        }



        setUser(authenticatedUser);

        return authenticatedUser;

      } catch (error) {

        if (auth.currentUser) {

          await auth.currentUser.delete().catch(() => undefined);

          await signOut(auth);

        }

        throw toRegisterError(error);

      }

    },

    [],

  );



  const logout = useCallback(async () => {

    await signOut(auth);

    setUser(null);

  }, []);



  const value = useMemo(

    () => ({

      user,

      initializing,

      login,

      register,

      logout,

      isAdmin: user?.rol === RolUsuario.ADMIN,

    }),

    [user, initializing, login, register, logout],

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


