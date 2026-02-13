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
