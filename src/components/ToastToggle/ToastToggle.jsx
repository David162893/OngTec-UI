import React from 'react'
import { useToast } from '@/hooks/useToast'
import ButtonComponent from '../Button/ButtonComponent'

export default function ToastToggleButton({ className }) {
    const { notificationsEnabled, toggleNotifications, toast } = useToast()

    const handleToggle = () => {
        const willBeEnabled = !notificationsEnabled

        toggleNotifications()

        if (willBeEnabled) {
            setTimeout(() => toast.success("¡Notificaciones reactivadas!"), 100)
        }
    }

    return (
        <ButtonComponent 
            variant={notificationsEnabled ? "toastOn" : "toastOff"}
            onClick={handleToggle}
            className={className}
        >
            {notificationsEnabled ? '🔔 On' : '🔕 Off'}
        </ButtonComponent>
    )
}