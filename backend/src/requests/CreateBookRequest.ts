/**
 * Fields in a request to create a single Book item.
 */
export interface CreateBookRequest {
  title: string
  authors: string
  category: string
  isbn: string
}
