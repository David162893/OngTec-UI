import TableComponent from "@/components/Table/TableComponent"
import { useUserTasks } from "@/hooks/useTaskQueries"
import { User } from "@/utils/User"

export default function TaskPage() {

    const { tasks, loading, error } = useUserTasks(User.getUserId())

    if (loading) return <p>Cargando tareas...</p>

    if (error) return <p>Error al cargar las tareas</p>

    console.log("Tareas del usuario:", tasks)

    return <TableComponent data={tasks && tasks.length > 0 ? tasks : [
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
]} />
}
