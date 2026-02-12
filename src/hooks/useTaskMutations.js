import { TaskService } from "@/services/TaskService"

export default function useTaskMutations() {

    const createTask = async (taskData) => {
        try {
            const response = await TaskService.create(taskData)
            return response
        } catch (error) {
            throw error
        }
    }

    const updateTask = async (taskId, taskData) => {
        try {
            const response = await TaskService.update(taskId, taskData)
            return response
        } catch (error) {
            throw error
        }
    }

    const deleteTask = async (taskId) => {
        try {
            const response = await TaskService.delete(taskId)
            return response
        } catch (error) {
            throw error
        }
    }

    return { createTask, updateTask, deleteTask }
}