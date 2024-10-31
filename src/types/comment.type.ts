export type Comment = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  isAction?: string,
  user: {
    id: string
    name: string
  }
}
