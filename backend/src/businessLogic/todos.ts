import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'

const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    return todoAccess.getTodosForUser(userId)
}