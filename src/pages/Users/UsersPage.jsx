import { useState, useEffect } from "react"
import TableComponent from "@/components/Table/TableComponent"
import FormModal from "@/components/FormModal/FormModalComponent"
import { useUsers } from "@/hooks/useUserQueries"
import useUserMutations from "@/hooks/useUserMutations"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useGetCountries } from "@/hooks/useCountryQueries"
import { useGetRegion } from "@/hooks/useRegionQueries"
import { useGetLocalidades } from "@/hooks/useLocalidadQueries"
import { useGetGenders } from "@/hooks/useGenderQueries"
import styles from "./UsersPage.module.scss"
import loadingGif from "@/assets/loading.gif"

export default function UsersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [page, setPage] = useState(0)
    const [size] = useState(10)
    const [allUsers, setAllUsers] = useState([])
    const [hasMore, setHasMore] = useState(true)

    const { users, loading, error } = useUsers(page, size)
    const { updateUser, deleteUser, loading: mutationLoading } = useUserMutations()

    useEffect(() => {
        if (!users) return
        if (users.length === 0) { setHasMore(false); return }
        setAllUsers(prev => {
            const existingIds = new Set(prev.map(u => u.id))
            const newOnes = users.filter(u => !existingIds.has(u.id))
            return [...prev, ...newOnes]
        })
        if (users.length < size) setHasMore(false)
    }, [users])

    const { sentinelRef } = useInfiniteScroll({
        onLoadMore: () => setPage(prev => prev + size),
        loading,
        hasMore
    })

    function handleUserEdit(user) {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    function handleSave(updatedUser) {
        const toISO = (dateObj) => {
            if (!dateObj?.year || !dateObj?.month || !dateObj?.day) return null
            return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}T00:00:00Z`
        }

        const normalized = {
            ...selectedUser,
            ...updatedUser,
            id: selectedUser.id,
            dateOfBirth: toISO(updatedUser.dateOfBirth),
        }

        updateUser(normalized)
        setIsModalOpen(false)
        setSelectedUser(null)
    }

    function handleUserDelete(user) {
        deleteUser(user.id)
        setAllUsers(prev => prev.filter(u => u.id !== user.id))
    }

    function parseISOToDateObject(isoString) {
        if (!isoString) return { day: "", month: "", year: "" }
        const cleaned = String(isoString).replace(/Z$/, "").split("T")[0]
        const [year, month, day] = cleaned.split("-")
        return { day: String(Number(day)), month: String(Number(month)), year }
    }

    const getEditableData = (user) => {
        if (!user) return {}
        return {
            name: user.name,
            surname1: user.surname1,
            surname2: user.surname2,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dniNie: user.dniNie,
            dateOfBirth: parseISOToDateObject(user.dateOfBirth),
            gender: user.gender,
            country: user.idCountry ? { id: user.idCountry, name: user.country } : null,
            region: user.idRegion ? { id: user.idRegion, name: user.region } : null,
            location: user.idLocation ? { id: user.idLocation, name: user.location } : null,
        }
    }

    return (
        <>
            {error && <p className={styles.error}>Error al cargar los usuarios</p>}

            {allUsers.length > 0 && (
                <>
                    <TableComponent
                        data={allUsers}
                        hiddenColumns={["id", "activated", "password", "rol", "idCountry", "idRegion", "idLocation"]}
                        columnOrder={[
                            "name", "surname1", "surname2",
                            "email", "phoneNumber", "dniNie",
                            "gender.name", "country", "region", "location",
                            "dateOfBirth"
                        ]}
                        columnLabels={{
                            name: "Nombre",
                            email: "Email",
                            phoneNumber: "Teléfono",
                            dniNie: "DNI / NIE",
                            country: "País",
                            region: "Región",
                            location: "Localidad",
                            dateOfBirth: "Fecha de nacimiento",
                            gender: "Género",
                            surname1: "Primer apellido",
                            surname2: "Segundo apellido"
                        }}
                        columnFilterTypes={{
                            "gender.name": "multiselect",
                            "country": "multiselect",
                            "region": "multiselect",
                            "location": "multiselect",
                            "dateOfBirth": "date",
                        }}
                        onEdit={handleUserEdit}
                        onDelete={handleUserDelete}
                    />
                    <div ref={sentinelRef} style={{ height: 1 }} />
                </>
            )}

            {(loading || mutationLoading) && (
                <div className={styles.loadingWrapper}>
                    <img src={loadingGif} alt="Cargando..." />
                </div>
            )}

            {allUsers.length > 0 && !hasMore && !loading && (
                <p className={styles.noMore}>Todos los usuarios cargados</p>
            )}

            {selectedUser && (
                <FormModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Editar usuario"
                    initialData={getEditableData(selectedUser)}
                    onSubmit={handleSave}
                    selectHooks={{
                        gender: () => useGetGenders(),
                        country: () => useGetCountries(),
                        region: (formData) => useGetRegion({ idCountry: formData.country?.id ?? null }),
                        location: (formData) => useGetLocalidades({ idRegion: formData.region?.id ?? null }),
                    }}
                />
            )}
        </>
    )
}