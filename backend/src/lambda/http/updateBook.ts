import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateBookRequest } from '../../requests/UpdateBookRequest'
import { getUserId } from '../utils'
import { isBookExist, updateBook } from '../../businessLogic/books'
import { Book } from '../../models/Book'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateBook');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`event -> ${JSON.stringify(event, null, 2)}`)
  const bookId: string = event.pathParameters.bookId
  const userId: string = getUserId(event);
  logger.info(`bookId -> ${bookId}`);
  const updatedBook: UpdateBookRequest = JSON.parse(event.body)

  const isBookAvailable = await isBookExist(bookId, userId);
  logger.info(`is Book available -> ${isBookAvailable}`);
  if (!isBookAvailable) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'This Book You\'re trying to update  does\'nt exist!'
      })
    }
  }
  const updatedItem: Book = await updateBook(updatedBook, bookId, userId);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}