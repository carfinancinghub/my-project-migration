/**
 * Cod1 Crown Toast Manager
 * File name: ToastManager.jsx
 * File location: frontend/src/components/common/ToastManager.jsx
 * Provides polished toast shortcuts for success, error, info, and loading messages.
 */
import { toast } from 'react-hot-toast';

const ToastManager = {
  success: (message) => toast.success(message, { duration: 3000, position: 'top-right' }),
  error: (message) => toast.error(message, { duration: 4000, position: 'top-right' }),
  info: (message) => toast(message, { duration: 3500, position: 'top-right' }),
  loading: (message) => toast.loading(message, { position: 'top-right' }),
};

export { toast }; // <-- now you can import { toast }
export default ToastManager;
