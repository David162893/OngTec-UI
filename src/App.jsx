import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "@/layout/MainLayout/MainLayout"
import SimpleLayout from "@/layout/SimpleLayout/SimpleLayout"
import RegisterPage from "./pages/Register/RegisterPage"
import OwnTasksPage from "./pages/OwnTasks/OwnTasksPage"
import HomePage from "./pages/Home/HomePage"
import ProtectedRoute from "./routes/ProtectedRoute"
import { AuthProvider, useAuth } from "./context/AuthContext"
import LoginModal from "./pages/Login/LoginPage"
import ProfilePage from "./pages/Profile/ProfilePage";
import NotFound from "./pages/NotFound/NotFoundPage"
import UsersPage from "./pages/Users/UsersPage";


function AppContent() {
    const { showLoginModal, closeLoginModal } = useAuth()
    return (
        <>
            <Routes>

                {/* Rutas CON header */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/own-tasks"
                        element={
                            /*
                            Desabilitado temporalmente para realizar pruebas sin necesidad de loguearse. 
                            Para reactivar, envolver <OwnTasksPage /> con <ProtectedRoute allowedRoles={["ADMINISTRADOR", "VOLUNTARIO"]}> 
                            y descomentar la importación al inicio del archivo:
                            */
                            <OwnTasksPage />
                        }
                    />
                    <Route
                        path="/tasks"
                        element={
                            /*
                            Desabilitado temporalmente para realizar pruebas sin necesidad de loguearse. 
                            Para reactivar, envolver <OwnTasksPage /> con <ProtectedRoute allowedRoles={["ADMINISTRADOR", "VOLUNTARIO"]}> 
                            y descomentar la importación al inicio del archivo:
                            */
                            <OwnTasksPage />
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            /*
                            Desabilitado temporalmente para realizar pruebas sin necesidad de loguearse. 
                            Para reactivar, envolver <UsersPage /> con <ProtectedRoute allowedRoles={["ADMINISTRADOR", "VOLUNTARIO"]}> 
                            y descomentar la importación al inicio del archivo:
                            */
                            <UsersPage />
                        }
                    />
                    <Route path="/profile" element={<ProfilePage />} />

                </Route>

                {/* Rutas SIN header */}
                <Route element={<SimpleLayout />}>
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer
                position="bottom-right"
                limit={5}  // solo para no acumular demasiados
                autoClose={3000}
            />

            <LoginModal open={showLoginModal} onClose={closeLoginModal} />
        </>
    )
}


export default function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    )
}
