import { Outlet } from "react-router-dom"
import HeaderComponent from "@/components/Header/HeaderComponent"

export default function MainLayout() {
    return (
        <>
            <HeaderComponent />
            <Outlet />
        </>
    )
}
