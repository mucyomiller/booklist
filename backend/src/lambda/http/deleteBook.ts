import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { isBookExist, deleteBook } from '../../businessLogic/books'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(`event -> ${JSON.stringify(event, null, 2)}`)
  const bookId: string = event.pathParameters.bookId
  const userId: string = getUserId(event);

  console.log(`bookId -> ${bookId}`)

  const isValidBook = await isBookExist(bookId, userId)
  if (!isValidBook) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'This Book does\'nt exist!'
      })
    }
  }

  const deleted: Boolean = await deleteBook(bookId, userId);
  if (!deleted) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Oops Unexpected error happened while trying  to remove the Book'
      })
    }
  }
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Successfully removed specified Book'
    })
  }
}