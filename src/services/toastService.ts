import { toast, ToastOptions } from 'react-toastify';

// Common toast configuration
const toastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Helper function to extract error messages from various error response formats
export const extractErrorMessage = (error: any): string => {
  // If error is a string, return it directly
  if (typeof error === 'string') return error;

  // Handle axios error objects
  if (error.response && error.response.data) {
    const errorData = error.response.data;

    // Format 1: { detail: "error message" }
    if (errorData.detail) {
      return errorData.detail;
    }
    
    // Format 2: { success: false, message: "error message", errors: { field: ["error"] } }
    if (errorData.message && errorData.success === false) {
      // If there are specific field errors, include them
      if (errorData.errors) {
        const fieldErrors = Object.entries(errorData.errors)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            }
            return `${field}: ${messages}`;
          })
          .join('; ');
        
        return `${errorData.message}. ${fieldErrors}`;
      }
      
      return errorData.message;
    }

    // If we have a response data but no structured error, try to stringify it
    if (typeof errorData === 'object') {
      return JSON.stringify(errorData);
    }
  }

  // Default error message
  return error.message || 'An unknown error occurred';
};

const toastService = {
  success: (message: string) => {
    toast.success(message, toastOptions);
  },
  error: (error: any) => {
    const message = extractErrorMessage(error);
    toast.error(message, toastOptions);
  },
  info: (message: string) => {
    toast.info(message, toastOptions);
  },
  warning: (message: string) => {
    toast.warning(message, toastOptions);
  }
};

export default toastService;
