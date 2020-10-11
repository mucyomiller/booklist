import { Book } from '../models/Book'
import { BooksAccess } from '../dataLayer/booksAccess'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { UpdateBookRequest } from '../requests/UpdateBookRequest';

const bookAccess = new BooksAccess();

export async function getAllBooks(userId: string): Promise<Book[]> {
    const books = await bookAccess.getUserBooks(userId);
    return books;
}

export async function createBook(request: CreateBookRequest, userId: string): Promise<Book> {
    return await bookAccess.createBook(request, userId);
}

export async function deleteBook(bookId: string, userId: string): Promise<Boolean> {
    return await bookAccess.deleteBookById(bookId, userId);
}

export async function isBookExist(bookId: string, userId: string): Promise<Boolean> {
    return await bookAccess.isBookExist(bookId, userId);
}

export async function getSignedURL(bookId: string, userId: string): Promise<string> {
    return await bookAccess.getSignedURL(bookId, userId);
}
export async function updateBook(updatedBook: UpdateBookRequest, bookId: string, userId: string): Promise<Book> {
    return await bookAccess.updateBook(updatedBook, bookId, userId);
}