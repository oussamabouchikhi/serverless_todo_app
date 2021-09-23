import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo, getTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
  //   Check if todoId exists
  const item = await getTodo(userId, todoId)

  if (item.length === 0){
    console.log('Incorrect ID: ', todoId)
    return {
      statusCode: 404,
      body: 'todoId does not exist'
    }
  }
  await deleteTodo(userId, todoId)

  return {
    statusCode: 200,
    body: ''
  }
}) 

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
