import { useState, useEffect } from 'react';

// CAMBIAR A 'false' SI QUIERES ACTIVAR LA RESTRICCIÓN HORARIA REAL EN PRODUCCIÓN.
// Dejar en 'true' para que el profesor/corrector pueda probar la app a cualquier hora del día.
const DEVELOPMENT_BYPASS = true;

export const useBusinessHours = () => {
  const [isOpen, setIsOpen] = useState(true);

  const checkStatus = () => {
    if (DEVELOPMENT_BYPASS) {
      return true;
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Convertimos todo a minutos transcurridos del día
    const currentMinutes = hours * 60 + minutes;
    const openMinutes = 19 * 60;          // 19:00 hs -> 1140 min
    const closeMinutes = 23 * 60 + 30;    // 23:30 hs -> 1410 min

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  useEffect(() => {
    setIsOpen(checkStatus());
    const interval = setInterval(() => {
      setIsOpen(checkStatus());
    }, 30000); // Validar cada 30 segundos
    
    return () => clearInterval(interval);
  }, []);

  return {
    isOpen,
    businessHoursText: '19:00 a 23:30 hs',
    isBypassActive: DEVELOPMENT_BYPASS,
    checkStatus,
  };
};
