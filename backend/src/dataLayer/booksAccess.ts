import { Book } from "../models/Book";
import { CreateBookRequest } from "../requests/CreateBookRequest";
import { UpdateBookRequest } from "../requests/UpdateBookRequest";
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { createLogger } from "../utils/logger";

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('BooksAccess');

export class BooksAccess {
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly booksTable = process.env.BOOKLIST_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ) { }

    async getUserBooks(userId: string): Promise<Book[]> {
        const result = await this.docClient.query({
            TableName: this.booksTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items as Book[]
    }

    async createBook(request: CreateBookRequest, userId: string): Promise<Book> {
        const bookId = uuid.v4()
        const createdBook = {
            bookId,
            userId,
            ...request
        }
        await this.docClient.put({
            TableName: this.booksTable,
            Item: createdBook
        }).promise()

        return createdBook as unknown as Book;
    }


    async getBookById(id: string, userId: string): Promise<Book> {
        const result = await this.docClient
            .get({
                TableName: this.booksTable,
                Key: {
                    bookId: id,
                    userId: userId
                }
            })
            .promise()
        return result.Item as Book
    }

    async isBookExist(id: string, userId: string): Promise<Boolean> {
        const result = await this.docClient
            .get({
                TableName: this.booksTable,
                Key: {
                    bookId: id,
                    userId: userId
                }
            })
            .promise()
        const response = !!result.Item;
        logger.debug(`assertion reponse -> ${response}`);
        return response;
    }

    async updateBook(updatedBook: UpdateBookRequest, bookId: string, userId: string): Promise<Book> {

        const oldOne = await this.getBookById(bookId, userId);

        const updatedItem = {
            bookId,
            userId,
            createdAt: oldOne.createdAt,
            attachmentUrl: oldOne.attachmentUrl,
            ...updatedBook
        }

        await this.docClient.put({
            TableName: this.booksTable,
            Item: updatedItem
        }).promise()

        return updatedItem as Book
    }

    async deleteBookById(bookId: string, userId: string): Promise<Boolean> {
        const params = {
            TableName: this.booksTable,
            userId: userId,
            Key: {
                bookId: bookId,
                userId: userId
            }
        }

        let err: AWS.AWSError, data: AWS.DynamoDB.DocumentClient.DeleteItemOutput = await this.docClient.delete(params).promise();
        if (err) {
            console.error(` we were unable to delete this Book ${JSON.stringify(err, null, 2)}`);
            return false;
        }
        console.log(`Book was deleted successfully ${JSON.stringify(data, null, 2)}`);
        return true;
    }

    async getSignedURL(bookId: string, userId: string): Promise<string> {

        const BUCKET = process.env.S3_BUCKET
        const URL_EXP = process.env.SIGNED_URL_EXPIRATION
        const imageId = uuid.v4()

        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: BUCKET,
            Key: imageId,
            Expires: URL_EXP
        })

        const imageUrl = `https://${BUCKET}.s3.amazonaws.com/${imageId}`

        // update existing image URL on current Book
        const updateImageUrl = {
            TableName: this.booksTable,
            Key: { "bookId": bookId, "userId": userId },
            UpdateExpression: "set attachmentUrl = :a",
            ExpressionAttributeValues: {
                ":a": imageUrl
            },
            ReturnValues: "UPDATED_NEW"
        }
        await this.docClient.update(updateImageUrl).promise()
        return signedUrl;
    }

}