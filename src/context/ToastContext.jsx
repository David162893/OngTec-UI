import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const originalMethods = {};
        const methods = ['success', 'error', 'info', 'warning', 'warn'];

        methods.forEach(method => {
            originalMethods[method] = toast[method];
            toast[method] = (...args) => {
                if (notificationsEnabled) {
                    return originalMethods[method](...args);
                }
            };
        });

        return () => {
            methods.forEach(method => {
                toast[method] = originalMethods[method];
            });
        };
    }, [notificationsEnabled]);

    const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

    return (
        <ToastContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
            {children}
        </ToastContext.Provider>
    );
}