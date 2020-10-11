# BookList Application

BookList Application is a serverless Application for Bibliophile to keep wishlist and infos on books to read.

# Functionality of the application

This application will allow creating/removing/updating/fetching BOOKLIST. Each BOOK can have an attached book cover.
To use Application `user` has to logs into Application and see his own list.

# Book item

The application should store Book list, and each Book item contains the following fields:

- `bookId` (string) - a unique id for a book
- `createdAt` (string) - date and time when an item was created
- `title` (string) - name of a Book
- `bookCategory` (string) - category of the book (eg: Science fiction)
- `authors` (string) - Names of Author or Authors comma separeted
- `isbn` (string) -International Standard Book Number code for easly searching
- `done` (boolean) - true if an item was completed, false otherwise
- `attachmentUrl` (string) (optional) - a URL pointing to an book cover

# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

- `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

- `GetBooks` - should return all Books for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "bookId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "title": "C++ for dummies",
      "authors": "M Miller, B jacob",
      "isbn": "some numbers",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "bookId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "title": "Send a letter",
      "authors": "John Doe",
      "isbn": "some numbers",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

- `CreateBook` - should create a new BOOK for a current user. DTO sent by client isin the `CreateBookRequest.ts` file

It receives a new Book item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "title": "the book title",
  "authors": "some authors",
  "isbn": "some numbers",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new Book item that looks like this:

```json
{
  "item": {
    "bookId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "title": "Buy milk",
    "authors": "some authors",
    "isbn": "some numbers",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

- `UpdateBook` - should update a Book item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateBookRequest.ts` file

It receives an object that contains three fields that can be updated in a Book item:

```json
{
  "title": "Sapiens: A Brief History of Humankind",
  "authors": "Harari, Yuval Noah",
  "isbn" "9780062316097",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

- `DeleteBook` - should delete a BOOK item created by a current user. Expects an id of a BOOK item to remove.

It should return an empty body.

- `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file (Book Cover) for a BOOK item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless BookList application.