import { useState } from "react"
import TableComponent from "@/components/Table/TableComponent"
import FormModal from "@/components/FormModal/FormModalComponent"
import { useUserTasks } from "@/hooks/useTaskQueries"
import { User } from "@/utils/User"

export default function TaskPage() {

    const { tasks, loading, error } = useUserTasks(User.getUserId())

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)

    if (loading) return <p>Cargando tareas...</p>
    if (error) return <p>Error al cargar las tareas</p>

    function handleTaskEdit(task) {
        setSelectedTask(task)
        setIsModalOpen(true)
    }

    function handleSave(updatedTask) {
        console.log("Tarea actualizada:", updatedTask)
    }

    return <>
        <TableComponent data={tasks && tasks.length > 0 ? tasks : [
            {
                key: "mundo",
                value: {
                    quiero: "un array",
                    otro: {
                        nested: "con objetos anidados",
                        unomas: "y más niveles"
                    }
                },
                simple: "texto"
            },
            {
                key: "hola",
                value: {
                    quiero: "otro dato",
                    otro: "más info"
                },
                simple: "más texto"
            }
        ]} onEdit={handleTaskEdit} />
        {selectedTask && <FormModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Editar tarea"
            initialData={selectedTask}
            onSubmit={handleSave}
            fields={[
                { name: "title", label: "Título" },
                { name: "description", label: "Descripción" },
                { name: "status", label: "Estado" }
            ]}
        />}
    </>
}
