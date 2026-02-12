import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderComponent from "./components/Header/HeaderComponent"
import RegisterPage from "./pages/RegisterPage"
import TasksPage from "./pages/Tasks/TasksPage"
import HomePage from "./pages/Home/HomePage"
// import ProtectedRoute from "./routes/ProtectedRoute"
import { AuthProvider, useAuth } from "./context/AuthContext"
import LoginModal from "./pages/Login/LoginPage"

function AppContent() {
    const { showLoginModal, closeLoginModal } = useAuth()

    return (
        <>
            <HeaderComponent />
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/own-tasks"
                    element={
                        /*
                        Desabilitado temporalmente para realizar pruebas sin necesidad de loguearse. 
                        Para reactivar, envolver <TasksPage /> con <ProtectedRoute allowedRoles={["ADMINISTRADOR", "VOLUNTARIO"]}> 
                        y descomentar la importación al inicio del archivo:
                        */
                        <TasksPage />
                    }
                />
                <Route path="/" element={<HomePage />} />
            </Routes>
            <LoginModal open={showLoginModal} onClose={closeLoginModal} />
        </>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
            <ToastContainer position="bottom-right" />
        </AuthProvider>
    )
}
