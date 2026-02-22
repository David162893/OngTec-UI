import { useState } from "react"
import styles from "./RegisterPage.module.scss"
import { useGetGenders } from "@/hooks/useGenderQueries"
import { useGetRoles } from "@/hooks/useRoleQueries"
import { useGetLocalidades } from "@/hooks/useLocalidadQueries"
import FormInputComponent from "@/components/FormInput/FormImputComponent"
import FormDateComponent from "@/components/FormDate/FormDateComponent"
import FormSelectComponent from "@/components/FormSelect/FormSelectComponent"
import ButtonComponent from "@/components/Button/ButtonComponent"

export default function RegisterPage() {

    const { data: genders = [], loading: loadingGenders } = useGetGenders()
    const { data: roles = [], loading: loadingRoles } = useGetRoles()
    const { data: localidades = [], loading: loadingLocalidades } = useGetLocalidades()

    const [fecha, setFecha] = useState({ day: "", month: "", year: "" })
    const [formData, setFormData] = useState({
        nombre: "",
        apellido1: "",
        apellido2: "",
        email: "",
        numeroTelefono: "",
        dniNie: "",
        fechaNacimiento: "",
        contrasena: "",
        generoId: "",
        rolId: "",
        localidadId: ""
    })

    const isLoadingSelects = loadingGenders || loadingRoles || loadingLocalidades

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const { day, month, year } = fecha
        const fechaNacimiento = day && month && year
            ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : ""

        const payload = { ...formData, fechaNacimiento }
        console.log(payload)
    }

    const { apellido2, ...requiredFields } = formData
    const isFormValid = Object.values(requiredFields).every(value => !!value)
        && fecha.day && fecha.month && fecha.year

    return (
        <div className={styles.registerPage}>
            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>

                <FormInputComponent
                    label="Nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    className={styles.inputText}
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="Primer Apellido"
                    name="apellido1"
                    placeholder="Apellido 1"
                    className={styles.inputText}
                    value={formData.apellido1}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="Segundo Apellido"
                    name="apellido2"
                    placeholder="Apellido 2 (opcional)"
                    className={styles.inputText}
                    value={formData.apellido2}
                    onChange={handleChange}
                />

                <FormInputComponent
                    label="Email"
                    name="email"
                    placeholder="john.doe@mail.com"
                    className={styles.inputEmail}
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="Número de Teléfono"
                    name="numeroTelefono"
                    placeholder="612345678"
                    className={styles.inputPhone}
                    value={formData.numeroTelefono}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="DNI / NIE"
                    name="dniNie"
                    placeholder="12345678A o X1234567B"
                    className={styles.inputDniNie}
                    value={formData.dniNie}
                    onChange={handleChange}
                    required
                />

                <FormDateComponent
                    label="Fecha de nacimiento"
                    name="birthdate"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                />

                <FormInputComponent
                    label="Contraseña"
                    name="contrasena"
                    type="password"
                    placeholder="********"
                    className={styles.inputPassword}
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                />

                <FormSelectComponent
                    label="Género"
                    name="generoId"
                    value={formData.generoId}
                    onChange={handleChange}
                    disabled={loadingGenders}
                    options={genders.map(g => ({ value: g.id, label: g.nombre }))}
                    required
                />

                <FormSelectComponent
                    label="Rol"
                    name="rolId"
                    value={formData.rolId}
                    onChange={handleChange}
                    disabled={loadingRoles}
                    options={roles.map(r => ({ value: r.id, label: r.nombre }))}
                    required
                />

                <FormSelectComponent
                    label="Localidad"
                    name="localidadId"
                    value={formData.localidadId}
                    onChange={handleChange}
                    disabled={loadingLocalidades}
                    options={localidades.map(l => ({ value: l.id, label: l.nombre }))}
                    required
                />

                <ButtonComponent
                    type="submit"
                    variant="submitBtn"
                    disabled={!isFormValid || isLoadingSelects}
                >
                    Registrarse
                </ButtonComponent>

            </form>
        </div>
    )
}