import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import { toast } from 'react-toastify';

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de un ToastProvider');

    const { notificationsEnabled, toggleNotifications } = context;

    const notify = (message, type = 'info', options = {}) => {
        if (notificationsEnabled) {
            toast[type](message, options);
        }
    };

    return { notificationsEnabled, toggleNotifications, notify, toast };
}; 