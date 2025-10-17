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

  // Generic showToast function that can handle different types
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    switch (type) {
      case 'success':
        toastService.success(message);
        break;
      case 'error':
        toastService.error(message);
        break;
      case 'warning':
        toastService.warning(message);
        break;
      case 'info':
      default:
        toastService.info(message);
        break;
    }
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showToast
  };
};

export default useToast;
