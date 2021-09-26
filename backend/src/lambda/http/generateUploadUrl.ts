import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUploadUrl } from '../../helpers/attachmentUtils'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const bucketName = process.env.ATTACHEMENTS_S3_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    
     // Update dynamoDb with Url
    const uploadUrl = getUploadUrl(todoId)
    const userId = getUserId(event)
    const updatedTodo = {
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    }

    await createAttachmentPresignedUrl(updatedTodo, userId, todoId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
