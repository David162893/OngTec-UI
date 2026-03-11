import { useState, useEffect, useRef } from "react"
import styles from "./ProfilePage.module.scss"
import { useGetGenders } from "@/hooks/useGenderQueries"
import { useGetLocalidades } from "@/hooks/useLocalidadQueries"
import { useGetRegion } from "@/hooks/useRegionQueries"
import { useGetCountries } from "@/hooks/useCountryQueries"
import { useUpdateProfile } from "@/hooks/useProfileMutations"
import { useGetProfile } from "@/hooks/useProfileQueries"
import FormInputComponent from "@/components/FormInput/FormImputComponent"
import FormDateComponent from "@/components/FormDate/FormDateComponent"
import FormSelectComponent from "@/components/FormSelect/FormSelectComponent"
import ButtonComponent from "@/components/Button/ButtonComponent"
import ModalComponent from "@/components/Modal/ModalComponent"

export default function ProfilePage() {

    const { data: genders = [], loading: loadingGenders } = useGetGenders()
    const { data: profile } = useGetProfile()
    const { mutate: updateProfile, loading: updatingProfile } = useUpdateProfile()

    const [isEditing, setIsEditing] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" })
    const [passwordError, setPasswordError] = useState("")

    const [fecha, setFecha] = useState(() => {
        const birthDate = profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null
        return {
            day: birthDate ? String(birthDate.getDate()) : "",
            month: birthDate ? String(birthDate.getMonth() + 1) : "",
            year: birthDate ? String(birthDate.getFullYear()) : ""
        }
    })

    const [formData, setFormData] = useState(() => ({
        name: profile?.name || "",
        surname1: profile?.surname1 || "",
        surname2: profile?.surname2 || "",
        email: profile?.email || "",
        phoneNumber: profile?.phoneNumber?.toString() || "",
        dniNie: profile?.dniNie || "",
        dateOfBirth: profile?.dateOfBirth || "",
        genderId: profile?.gender?.id?.toString() || "",
        idCountry: profile?.idCountry?.toString() || "",
        idRegion: profile?.idRegion?.toString() || "",
        idLocation: profile?.idLocation?.toString() || ""
    }))

    const [activeCountryId, setActiveCountryId] = useState("")
    const [activeRegionId, setActiveRegionId] = useState("")

    const countryInitialized = useRef(false)
    const regionInitialized = useRef(false)

    const { data: countries = [], loading: loadingCountries } = useGetCountries()
    const { data: regions = [], loading: loadingRegions } = useGetRegion({ idCountry: activeCountryId })
    const { data: localidades = [], loading: loadingLocalidades } = useGetLocalidades({ idRegion: activeRegionId })

    // Paso 1: cuando countries carga, activar el país del usuario
    useEffect(() => {
        if (countryInitialized.current) return
        if (!loadingCountries && countries.length > 0 && profile?.idCountry) {
            setActiveCountryId(profile.idCountry.toString())
            countryInitialized.current = true
        }
    }, [loadingCountries, countries])

    // Paso 2: cuando regions carga para ese país, activar la región del usuario
    useEffect(() => {
        if (regionInitialized.current) return
        if (!loadingRegions && regions.length > 0 && profile?.idRegion) {
            setActiveRegionId(profile.idRegion.toString())
            regionInitialized.current = true
        }
    }, [loadingRegions, regions])

    // Países: { id, country }
    const countryOptions = countries.map(c => ({
        value: String(c.id),
        label: c.country
    }))

    // Regiones: { idRegion, region }
    const regionOptions = regions.map(r => ({
        value: String(r.idRegion),
        label: r.region
    }))

    // Localidades: { id, location }
    const localidadOptions = localidades.map(l => ({
        value: String(l.id),
        label: l.location
    }))

    // Géneros: { id, name }
    const genderOptions = genders.map(g => ({
        value: String(g.id),
        label: g.name
    }))

    const isLoadingSelects = loadingGenders || loadingCountries || loadingRegions || loadingLocalidades

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCountryChange = (e) => {
        const { value } = e.target
        setActiveCountryId(value)
        setActiveRegionId("")
        setFormData(prev => ({ ...prev, idCountry: value, idRegion: "", idLocation: "" }))
    }

    const handleRegionChange = (e) => {
        const { value } = e.target
        setActiveRegionId(value)
        setFormData(prev => ({ ...prev, idRegion: value, idLocation: "" }))
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
            const birthDate = profile.dateOfBirth ? new Date(profile.dateOfBirth) : null
            setFecha({
                day: birthDate ? String(birthDate.getDate()) : "",
                month: birthDate ? String(birthDate.getMonth() + 1) : "",
                year: birthDate ? String(birthDate.getFullYear()) : ""
            })
            setFormData({
                name: profile.name || "",
                surname1: profile.surname1 || "",
                surname2: profile.surname2 || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber?.toString() || "",
                dniNie: profile.dniNie || "",
                dateOfBirth: profile.dateOfBirth || "",
                genderId: profile.gender?.id?.toString() || "",
                idCountry: profile.idCountry?.toString() || "",
                idRegion: profile.idRegion?.toString() || "",
                idLocation: profile.idLocation?.toString() || ""
            })
            setActiveCountryId(profile.idCountry?.toString() || "")
            setActiveRegionId(profile.idRegion?.toString() || "")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { day, month, year } = fecha
        const dateOfBirth = day && month && year
            ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}Z`
            : ""
        try {
            await updateProfile({ ...formData, dateOfBirth })
            setSuccessMessage("Perfil actualizado correctamente.")
            setErrorMessage("")
            setIsEditing(false)
        } catch {
            setErrorMessage("Error al actualizar el perfil. Inténtalo de nuevo.")
        }
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
        setPasswordError("")
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        if (!passwordData.password || !passwordData.confirmPassword) {
            setPasswordError("Completa ambos campos.")
            return
        }
        if (passwordData.password !== passwordData.confirmPassword) {
            setPasswordError("Las contraseñas no coinciden.")
            return
        }
        try {
            await updateProfile({ password: passwordData.password })
            setShowPasswordModal(false)
            setPasswordData({ password: "", confirmPassword: "" })
            setPasswordError("")
            setSuccessMessage("Contraseña actualizada correctamente.")
        } catch {
            setPasswordError("Error al actualizar la contraseña.")
        }
    }

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false)
        setPasswordData({ password: "", confirmPassword: "" })
        setPasswordError("")
    }

    const { surname2, ...requiredFields } = formData
    const isFormValid = Object.values(requiredFields).every(value => !!value)
        && fecha.day && fecha.month && fecha.year

    return (
        <div className={styles.profilePage}>

            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {formData.name?.[0]?.toUpperCase()}
                    {formData.surname1?.[0]?.toUpperCase()}
                </div>
                <div className={styles.profileTitle}>
                    <h1>Mi Perfil</h1>
                    <p className={styles.profileSubtitle}>
                        {formData.name} {formData.surname1} {formData.surname2}
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
                            label="Nombre" name="name" placeholder="Tu nombre"
                            value={formData.name} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="Primer Apellido" name="surname1" placeholder="Apellido 1"
                            value={formData.surname1} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="Segundo Apellido" name="surname2" placeholder="Apellido 2 (opcional)"
                            value={formData.surname2} onChange={handleChange}
                        />
                        <FormDateComponent
                            label="Fecha de nacimiento" name="dateOfBirth"
                            value={fecha} onChange={(e) => setFecha(e.target.value)} required
                        />
                        <FormSelectComponent
                            label="Género"
                            name="genderId"
                            value={formData.genderId}
                            onChange={handleChange}
                            disabled={loadingGenders || !isEditing}
                            options={genderOptions}
                            required
                        />
                    </fieldset>

                    <fieldset className={styles.fieldset} disabled={!isEditing}>
                        <legend className={styles.legend}>Dirección</legend>

                        <FormSelectComponent
                            label="País"
                            name="idCountry"
                            value={formData.idCountry}
                            onChange={handleCountryChange}
                            disabled={loadingCountries || !isEditing}
                            options={countryOptions}
                            required
                        />
                        <FormSelectComponent
                            label="Región / Provincia"
                            name="idRegion"
                            value={formData.idRegion}
                            onChange={handleRegionChange}
                            disabled={loadingRegions || !isEditing || !formData.idCountry}
                            options={regionOptions}
                            required
                        />
                        <FormSelectComponent
                            label="Localidad"
                            name="idLocation"
                            value={formData.idLocation}
                            onChange={handleChange}
                            disabled={loadingLocalidades || !isEditing || !formData.idRegion}
                            options={localidadOptions}
                            required
                        />
                    </fieldset>

                    <fieldset className={styles.fieldset} disabled={!isEditing}>
                        <legend className={styles.legend}>Datos de contacto</legend>

                        <FormInputComponent
                            label="Email" name="email" placeholder="john.doe@mail.com"
                            value={formData.email} onChange={handleChange} required
                        />
                        <FormInputComponent
                            label="Número de Teléfono" name="phoneNumber" placeholder="612345678"
                            value={formData.phoneNumber} onChange={handleChange} required
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

            <ModalComponent
                open={showPasswordModal}
                onClose={handleClosePasswordModal}
                title="Cambiar contraseña"
                className={styles.passwordModal}
            >
                <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
                    <FormInputComponent
                        label="Nueva contraseña" name="password" type="password" placeholder="********"
                        value={passwordData.password} onChange={handlePasswordChange} required
                    />
                    <FormInputComponent
                        label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="********"
                        value={passwordData.confirmPassword} onChange={handlePasswordChange} required
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