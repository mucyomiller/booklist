import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { getUserId } from '../utils'
import { Book } from '../../models/Book'
import { createBook } from '../../businessLogic/books'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(`event -> ${JSON.stringify(event, null, 2)}`)
  const request: CreateBookRequest = JSON.parse(event.body)
  const userId: string = getUserId(event);
  const createdBook: Book = await createBook(request, userId);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: createdBook
    })
  }
}
