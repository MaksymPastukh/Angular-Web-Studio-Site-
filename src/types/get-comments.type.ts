export type GetComments = {
  allCount: number,
  comments: {
    id: string,
    text: string,
    date: string,
    isAction?: string
    likesCount: number,
    dislikesCount: number,
    user: {
      id: string
      name: string
    }
  }
}
