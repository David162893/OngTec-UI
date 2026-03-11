import { useState, useEffect, useMemo } from "react"
import TableComponent from "@/components/Table/TableComponent"
import FormModal from "@/components/FormModal/FormModalComponent"
import { useUserTasks } from "@/hooks/useTaskQueries"
import useTaskMutations from "@/hooks/useTaskMutations"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useGetCountries } from "@/hooks/useCountryQueries"
import { useGetRegion } from "@/hooks/useRegionQueries"
import { useGetLocalidades } from "@/hooks/useLocalidadQueries"
import { useGetStatuses } from "@/hooks/useStatusQueries"
import { useGetTaskTypes } from "@/hooks/useTaskTypeQueries"
import { User } from "@/utils/User"
import styles from "./OwnTasksPage.module.scss"
import loadingGif from "@/assets/loading.gif"

export default function TaskPage() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)

    const [page, setPage] = useState(0)
    const [size] = useState(10)

    const [allTasks, setAllTasks] = useState([])
    const [hasMore, setHasMore] = useState(true)

    const { tasks, loading, error } = useUserTasks(User.getUserId(), page, size)
    const { updateTask, deleteTask, loading: mutationLoading } = useTaskMutations()

    const { minYear, maxYear } = useMemo(() => {
        const years = allTasks.flatMap(t =>
            [t.startDate, t.endDate]
                .filter(Boolean)
                .map(d => new Date(d).getUTCFullYear())
        ).filter(y => !isNaN(y))

        if (!years.length) return { minYear: undefined, maxYear: undefined }
        return {
            minYear: Math.min(...years) - 100,
            maxYear: Math.max(...years) + 100,
        }
    }, [allTasks])

    useEffect(() => {

        if (!tasks) return

        if (tasks.length === 0) {
            setHasMore(false)
            return
        }

        setAllTasks(prev => {

            const existingIds = new Set(prev.map(t => t.id))
            const newOnes = tasks.filter(t => !existingIds.has(t.id))

            return [...prev, ...newOnes]

        })

        if (tasks.length < size) setHasMore(false)

    }, [tasks])

    const { sentinelRef } = useInfiniteScroll({
        onLoadMore: () => setPage(prev => prev + size),
        loading,
        hasMore
    })

    function parseISOToDateObject(isoString) {
        if (!isoString) return { day: "", month: "", year: "" }
        const d = new Date(isoString)
        return {
            day: String(d.getUTCDate()),
            month: String(d.getUTCMonth() + 1),
            year: String(d.getUTCFullYear()),
        }
    }

    function handleTaskEdit(task) {
        setSelectedTask(task)
        setIsModalOpen(true)
    }

    function handleSave(updatedTask) {
        const toISO = (dateObj) => {
            if (!dateObj?.year || !dateObj?.month || !dateObj?.day) return null
            return `${dateObj.year}-${String(dateObj.month).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}T00:00:00Z`
        }

        const normalized = {
            ...selectedTask,
            ...updatedTask,
            id: selectedTask.id,
            startDate: toISO(updatedTask.startDate),
            endDate: toISO(updatedTask.endDate),
        }

        updateTask(normalized)
        setIsModalOpen(false)
        setSelectedTask(null)
    }

    function handleTaskDelete(task) {

        deleteTask(task.id)

        setAllTasks(prev =>
            prev.filter(t => t.id !== task.id)
        )

    }

    const getEditableData = (task) => {
        if (!task) return {}
        return {
            description: task.description,
            taskType: task.taskType,
            requirements: task.requirements,
            country: task.idCountry ? { id: task.idCountry, name: task.country } : null,
            region: task.idRegion ? { id: task.idRegion, name: task.region } : null,
            location: task.idLocation ? { id: task.idLocation, name: task.location } : null,
            requiredUsers: task.requiredUsers,
            endDate: parseISOToDateObject(task.endDate),
            startDate: parseISOToDateObject(task.startDate),
            status: task.status,
        }
    }

    return (
        <>
            {error && <p className={styles.error}>Error al cargar las tareas</p>}

            {allTasks.length > 0 && (
                <>
                    <TableComponent
                        data={allTasks}
                        hiddenColumns={["id", "idParentTask", "idCountry", "idLocation", "idRegion"]}
                        columnLabels={{
                            description: "Descripción",
                            taskType: "Tipo de tarea",
                            requirements: "Requisitos",
                            country: "País",
                            region: "Región",
                            location: "Ubicación",
                            requiredUsers: "Usuarios requeridos",
                            endDate: "Fecha fin",
                            startDate: "Fecha inicio",
                            status: "Estado",
                        }}
                        columnOrder={[
                            "description", "taskType.name", "requirements.name",
                            "country", "region", "location",
                            "requiredUsers", "endDate", "startDate",
                            "status"
                        ]}
                        columnFilterTypes={{
                            "requirements.name": "multiselect",
                            "status.name": "multiselect",
                            "taskType.name": "multiselect",
                            startDate: "date",
                            endDate: "date"
                        }}
                        onEdit={handleTaskEdit}
                        onDelete={handleTaskDelete}
                    />

                    <div ref={sentinelRef} style={{ height: 1 }} />
                </>
            )}

            {(loading || mutationLoading) && (
                <div className={styles.loadingWrapper}>
                    <img src={loadingGif} alt="Cargando..." />
                </div>
            )}

            {allTasks.length > 0 && !hasMore && !loading && (
                <p className={styles.noMore}>Todas las tareas cargadas</p>
            )}

            {selectedTask && (
                <FormModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Editar tarea"
                    initialData={getEditableData(selectedTask)}
                    onSubmit={handleSave}
                    selectHooks={{
                        country: () => useGetCountries(),
                        region: (formData) => useGetRegion({ idCountry: formData.country?.id ?? null }),
                        location: (formData) => useGetLocalidades({ idRegion: formData.region?.id ?? null }),
                        status: () => useGetStatuses(),
                        taskType: () => useGetTaskTypes()
                    }}
                    dateProps={{ minYear, maxYear }}
                />
            )}
        </>
    )
}