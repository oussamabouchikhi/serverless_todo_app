import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    return todoAccess.getTodosForUser(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const createdAt = new Date().toISOString()
    const todoId = uuid.v4()
    return await todoAccess.createTodo({
        userId,
        todoId,
        createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
    })
}