import { useCallback } from 'react';
import toastService from '../services/toastService';

export const useToast = () => {
  const showSuccess = useCallback((message: string) => {
    toastService.success(message);
  }, []);

  const showError = useCallback((error: any) => {
    toastService.error(error);
  }, []);

  const showInfo = useCallback((message: string) => {
    toastService.info(message);
  }, []);

  const showWarning = useCallback((message: string) => {
    toastService.warning(message);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};

export default useToast;
