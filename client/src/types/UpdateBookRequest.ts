export interface UpdateBookRequest {
  title: string
  authors: string
  category?: string
  isbn?: string
  done: boolean
}
