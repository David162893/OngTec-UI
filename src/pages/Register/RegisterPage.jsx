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

    const { data: genders = [] } = useGetGenders()
    const { data: roles = [] } = useGetRoles()
    const { data: localidades = [] } = useGetLocalidades()
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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
    }

    const handleDisabled = Object.values(formData).some(value => !value)

    return (
        <div className={styles.registerPage}>
            <h1>Registro</h1>

            <form onSubmit={handleSubmit}>

                <FormInputComponent
                    label="Nombre"
                    name="nombre"
                    className={styles.inputText}
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="Primer Apellido"
                    name="apellido1"
                    className={styles.inputText}
                    value={formData.apellido1}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="Segundo Apellido"
                    name="apellido2"
                    className={styles.inputText}
                    value={formData.apellido2}
                    onChange={handleChange}
                />

                <FormInputComponent
                    label="Email"
                    name="email"
                    className={styles.inputEmail}
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="Número de Teléfono"
                    name="numeroTelefono"
                    className={styles.inputPhone}
                    value={formData.numeroTelefono}
                    onChange={handleChange}
                    required
                />

                <FormInputComponent
                    label="DNI / NIE"
                    name="dniNie"
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
                    className={styles.inputPassword}
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                />

                <FormSelectComponent
                    label="Género"
                    name="generoId"
                    className={styles.inputSelect}
                    wrapperClassName={styles.selectWrapper}
                    value={formData.generoId}
                    onChange={handleChange}
                    options={genders.map(g => ({
                        value: g.id,
                        label: g.nombre
                    }))}
                    required
                />


                <FormSelectComponent
                    label="Rol"
                    name="rolId"
                    className={styles.inputSelect}
                    wrapperClassName={styles.selectWrapper}
                    value={formData.rolId}
                    onChange={handleChange}
                    options={roles.map(r => ({
                        value: r.id,
                        label: r.nombre
                    }))}
                    required
                />

                <FormSelectComponent
                    label="Localidad"
                    name="localidadId"
                    type="select"
                    className={styles.inputSelect}
                    wrapperClassName={styles.selectWrapper}
                    onChange={handleChange}
                    options={localidades.map(l => ({
                        value: l.id,
                        label: l.nombre
                    }))}
                    required
                />

                <ButtonComponent type="submit" variant="submitBtn" disabled={handleDisabled}>
                    Registrarse
                </ButtonComponent>

            </form>
        </div>
    )
}