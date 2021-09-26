import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    return todoAccess.getTodosForUser(userId)
}

export async function getTodo(userId: string, todoId: string): Promise<TodoItem[]>{
    return todoAccess.getTodo(userId, todoId)
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

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest, 
    userId: string, 
    todoId: string
): Promise<TodoItem>{
    return await todoAccess.updateTodo({
        userId,
        todoId,
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    })
}

export async function deleteTodo(userId: string, todoId: string){
    return await todoAccess.deleteTodo(userId, todoId)
}
export async function createAttachmentPresignedUrl(updateTodo, userId: string, todoId: string): Promise<TodoItem>{
  return await todoAccess.createAttachmentPresignedUrl({
    userId,
    todoId,
    attachmentUrl: updateTodo.attachmentUrl,
  })
}