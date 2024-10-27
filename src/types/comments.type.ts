export type Comments = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  violate?: boolean,
  user: {
    id: string
    name: string
  }
}[]
