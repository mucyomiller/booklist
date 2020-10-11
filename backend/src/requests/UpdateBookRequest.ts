/**
 * Fields in a request to update a single Book item.
 */
export interface UpdateBookRequest {
  title: string
  authors: string
  category: string
  isbn: string
  done: boolean
}