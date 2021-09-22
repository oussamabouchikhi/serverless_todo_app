import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import * as AWS from 'aws-sdk'

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODOS_TABLE){}

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
}