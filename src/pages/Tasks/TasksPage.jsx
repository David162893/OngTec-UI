import { useState } from "react"
import TableComponent from "@/components/Table/TableComponent"
import FormModal from "@/components/FormModal/FormModalComponent"
import { toast } from "react-toastify"
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

    function handleTaskDelete(task) {
        toast.info(`Tarea "${task.title}" eliminada`)
    }

    const getEditableData = (task) => {
        if (!task) return {}
        return {
            country: task.country,
            description: task.description,
            endDate: task.endDate,
            location: task.location,
            region: task.region,
            requiredUsers: task.requiredUsers,
            startDate: task.startDate,
            status: task.status?.name,
            taskType: task.taskType?.name,
        }
    }

    return <>
        <TableComponent data={tasks && tasks.length > 0 ? tasks : [
            {
                "glossary": {
                    "title": "example glossary",
                    "GlossDiv": {
                        "title": "S",
                        "GlossList": {
                            "GlossEntry": {
                                "ID": "SGML",
                                "SortAs": "SGML",
                                "GlossTerm": "Standard Generalized Markup Language",
                                "Acronym": "SGML",
                                "Abbrev": "ISO 8879:1986",
                                "GlossDef": {
                                    "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                    "GlossSeeAlso": ["GML", "XML"]
                                },
                                "GlossSee": "markup"
                            }
                        }
                    }
                }
            }
        ]}
            hiddenColumns={["id", "idCountry", "idLocation", "idRegion"]}
            onEdit={handleTaskEdit}
            onDelete={handleTaskDelete}
        />
        {selectedTask && (
            <FormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Editar tarea"
                initialData={getEditableData(selectedTask)}
                onSubmit={handleSave}
            />
        )}
    </>
}
