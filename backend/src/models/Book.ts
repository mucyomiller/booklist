export interface Book {
  userId: string
  bookId: string
  createdAt: string
  title: string
  authors: string
  category: string
  done: boolean
  attachmentUrl?: string
}
