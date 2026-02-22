import { useState } from "react"
import styles from "./ProfilePage.module.scss"
import { useGetGenders } from "@/hooks/useGenderQueries"
import { useGetLocalidades } from "@/hooks/useLocalidadQueries"
import { useUpdateProfile } from "@/hooks/useProfileMutations"
import { useGetProfile } from "@/hooks/useProfileQueries"
import FormInputComponent from "@/components/FormInput/FormImputComponent"
import FormDateComponent from "@/components/FormDate/FormDateComponent"
import FormSelectComponent from "@/components/FormSelect/FormSelectComponent"
import ButtonComponent from "@/components/Button/ButtonComponent"
import ModalComponent from "@/components/Modal/ModalComponent"

export default function ProfilePage() {

    const { data: genders = [], loading: loadingGenders } = useGetGenders()
    const { data: localidades = [], loading: loadingLocalidades } = useGetLocalidades()
    const { data: profile, loading: loadingProfile } = useGetProfile()
    const { mutate: updateProfile, loading: updatingProfile } = useUpdateProfile()

    const [isEditing, setIsEditing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({ contrasena: "", confirmarContrasena: "" })
    const [passwordError, setPasswordError] = useState("")

    const [fecha, setFecha] = useState(() => {
        if (profile?.fechaNacimiento) {
            const d = new Date(profile.fechaNacimiento)
            return { day: String(d.getDate()), month: String(d.getMonth() + 1), year: String(d.getFullYear()) }
        }
        return { day: "", month: "", year: "" }
    })

    const [formData, setFormData] = useState(() => ({
        nombre: profile?.nombre || "",
        apellido1: profile?.apellido1 || "",
        apellido2: profile?.apellido2 || "",
        email: profile?.email || "",
        numeroTelefono: profile?.numeroTelefono || "",
        dniNie: profile?.dniNie || "",
        fechaNacimiento: profile?.fechaNacimiento || "",
        generoId: profile?.generoId || "",
        localidadId: profile?.localidadId || ""
    }))

    const isLoadingSelects = loadingGenders || loadingLocalidades

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleEdit = () => {
        setIsEditing(true)
        setSuccessMessage("")
        setErrorMessage("")
    }

    const handleCancel = () => {
        setIsEditing(false)
        setSuccessMessage("")
        setErrorMessage("")
        if (profile) {
            const birthDate = profile.fechaNacimiento ? new Date(profile.fechaNacimiento) : null
            setFecha({
                day: birthDate ? String(birthDate.getDate()) : "",
                month: birthDate ? String(birthDate.getMonth() + 1) : "",
                year: birthDate ? String(birthDate.getFullYear()) : ""
            })
            setFormData({
                nombre: profile.nombre || "",
                apellido1: profile.apellido1 || "",
                apellido2: profile.apellido2 || "",
                email: profile.email || "",
                numeroTelefono: profile.numeroTelefono || "",
                dniNie: profile.dniNie || "",
                fechaNacimiento: profile.fechaNacimiento || "",
                generoId: profile.generoId || "",
                localidadId: profile.localidadId || ""
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { day, month, year } = fecha
        const fechaNacimiento = day && month && year
            ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : ""
        try {
            await updateProfile({ ...formData, fechaNacimiento })
            setSuccessMessage("Perfil actualizado correctamente.")
            setErrorMessage("")
            setIsEditing(false)
        } catch {
            setErrorMessage("Error al actualizar el perfil. Inténtalo de nuevo.")
        }
    }

    // ── Modal contraseña ──────────────────────────────────────────────────────

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
        setPasswordError("")
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (!passwordData.contrasena || !passwordData.confirmarContrasena) {
            setPasswordError("Completa ambos campos.")
            return
        }
        if (passwordData.contrasena !== passwordData.confirmarContrasena) {
            setPasswordError("Las contraseñas no coinciden.")
            return
        }
        try {
            await updateProfile({ contrasena: passwordData.contrasena })
            setShowPasswordModal(false)
            setPasswordData({ contrasena: "", confirmarContrasena: "" })
            setPasswordError("")
            setSuccessMessage("Contraseña actualizada correctamente.")
        } catch {
            setPasswordError("Error al actualizar la contraseña.")
        }
    }

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false)
        setPasswordData({ contrasena: "", confirmarContrasena: "" })
        setPasswordError("")
    }

    // ── Validación ────────────────────────────────────────────────────────────

    const { apellido2, ...requiredFields } = formData
    const isFormValid = Object.values(requiredFields).every(value => !!value)
        && fecha.day && fecha.month && fecha.year

    if (loadingProfile) {
        return (
            <div className={styles.profilePage}>
                <p className={styles.loadingText}>Cargando perfil...</p>
            </div>
        )
    }

    return (
        <div className={styles.profilePage}>

            {/* Header */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {formData.nombre?.[0]?.toUpperCase()}{formData.apellido1?.[0]?.toUpperCase()}
                </div>
                <div className={styles.profileTitle}>
                    <h1>Mi Perfil</h1>
                    <p className={styles.profileSubtitle}>
                        {formData.nombre} {formData.apellido1} {formData.apellido2}
                    </p>
                </div>
            </div>

            {successMessage && <div className={styles.successAlert}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>

                <div className={styles.fieldsGrid}>

                    <fieldset className={styles.fieldset} disabled={!isEditing}>
                        <legend className={styles.legend}>Datos personales</legend>

                        <FormInputComponent
                            label="Nombre" name="nombre" placeholder="Tu nombre"
                            value={formData.nombre} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="Primer Apellido" name="apellido1" placeholder="Apellido 1"
                            value={formData.apellido1} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="Segundo Apellido" name="apellido2" placeholder="Apellido 2 (opcional)"
                            value={formData.apellido2} onChange={handleChange}
                        />
                        <FormDateComponent
                            label="Fecha de nacimiento" name="birthdate"
                            value={fecha} onChange={(e) => setFecha(e.target.value)} required
                        />
                        <FormSelectComponent
                            label="Género" name="generoId" value={formData.generoId}
                            onChange={handleChange} disabled={loadingGenders || !isEditing}
                            options={genders.map(g => ({ value: g.id, label: g.nombre }))} required
                        />
                        <FormSelectComponent
                            label="Localidad" name="localidadId" value={formData.localidadId}
                            onChange={handleChange} disabled={loadingLocalidades || !isEditing}
                            options={localidades.map(l => ({ value: l.id, label: l.nombre }))} required
                        />
                    </fieldset>

                    <fieldset className={styles.fieldset} disabled={!isEditing}>
                        <legend className={styles.legend}>Datos de contacto</legend>

                        <FormInputComponent
                            label="Email" name="email" placeholder="john.doe@mail.com"
                            value={formData.email} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="Número de Teléfono" name="numeroTelefono" placeholder="612345678"
                            value={formData.numeroTelefono} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="DNI / NIE" name="dniNie" placeholder="12345678A o X1234567B"
                            value={formData.dniNie} onChange={handleChange} required
                        />
                    </fieldset>

                </div>

                <div className={styles.actions}>
                    <ButtonComponent
                        type="button"
                        variant="changePasswordBtn"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Cambiar contraseña
                    </ButtonComponent>

                    {!isEditing ? (
                        <ButtonComponent type="button" variant="editBtn" onClick={handleEdit}>
                            Editar perfil
                        </ButtonComponent>
                    ) : (
                        <>
                            <ButtonComponent type="button" variant="cancelBtn" onClick={handleCancel}>
                                Cancelar
                            </ButtonComponent>
                            <ButtonComponent
                                type="submit" variant="submitBtn"
                                disabled={!isFormValid || isLoadingSelects || updatingProfile}
                            >
                                {updatingProfile ? "Guardando..." : "Guardar cambios"}
                            </ButtonComponent>
                        </>
                    )}
                </div>

            </form>

            {/* Modal contraseña */}
            <ModalComponent
                open={showPasswordModal}
                onClose={handleClosePasswordModal}
                title="Cambiar contraseña"
                className={styles.passwordModal}
            >
                <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
                    <FormInputComponent
                        label="Nueva contraseña" name="contrasena" type="password" placeholder="********"
                        value={passwordData.contrasena} onChange={handlePasswordChange} required
                    />
                    <FormInputComponent
                        label="Confirmar contraseña" name="confirmarContrasena" type="password" placeholder="********"
                        value={passwordData.confirmarContrasena} onChange={handlePasswordChange} required
                    />

                    {passwordError && <p className={styles.modalError}>{passwordError}</p>}

                    <div className={styles.modalActions}>
                        <ButtonComponent type="button" variant="cancelBtn" onClick={handleClosePasswordModal}>
                            Cancelar
                        </ButtonComponent>
                        <ButtonComponent type="submit" variant="submitBtn" disabled={updatingProfile}>
                            {updatingProfile ? "Guardando..." : "Guardar"}
                        </ButtonComponent>
                    </div>
                </form>
            </ModalComponent>

        </div>
    )
}