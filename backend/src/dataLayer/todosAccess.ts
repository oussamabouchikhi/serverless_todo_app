import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import * as AWS from 'aws-sdk'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ){}

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()
      
    const items = result.Items

    return items as TodoItem[]
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
      ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
      }
    }).promise()
    
    const items = result.Items

    return items as TodoItem[]
  }
    
  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
        TableName: this.todoTable,
        Item: todo,
      }).promise()
      
    return todo   
  }

  async updateTodo(updatedTodo: any): Promise<TodoItem> {
    await this.docClient.update({
        TableName: this.todoTable,
        Key: { 
          todoId: updatedTodo.todoId, 
          userId: updatedTodo.userId 
        },
        ExpressionAttributeNames: {"#N": "name"},
        UpdateExpression: "set #N = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
            ":name": updatedTodo.name,
            ":dueDate": updatedTodo.dueDate,
            ":done": updatedTodo.done,
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()
      
    return updatedTodo   
  }

  async deleteTodo(userId: string, todoId: string) {
    const params = {
        TableName: this.todoTable,
        Key: {
          todoId, 
          userId
        }
      }
    await this.docClient.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to delete item", JSON.stringify(err))
      }
      else {
          console.log("Item deleted successfully!", JSON.stringify(data))
      }
    }).promise()
    
  }

  async createAttachmentPresignedUrl(updatedTodo: any): Promise<TodoItem> {
    await this.docClient.update({
      TableName: this.todoTable,
      Key: { 
        todoId: updatedTodo.todoId, 
        userId: updatedTodo.userId 
      },
      ExpressionAttributeNames: {"#A": "attachmentUrl"},
      UpdateExpression: "set #A = :attachmentUrl",
      ExpressionAttributeValues: {
          ":attachmentUrl": updatedTodo.attachmentUrl,
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
      
    return updatedTodo  
  }
}