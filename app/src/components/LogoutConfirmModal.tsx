import React from 'react';
import { AppDialogModal } from './AppDialogModal';

interface LogoutConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => (
  <AppDialogModal
    visible={visible}
    title="Cerrar sesión"
    message="¿Estás seguro de que querés cerrar sesión?"
    variant="default"
    secondaryLabel="Cancelar"
    onSecondary={onCancel}
    primaryLabel="Cerrar sesión"
    onPrimary={onConfirm}
  />
);
