import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Params } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/core/auth/auth.service'
import { ArticleService } from 'src/app/shared/services/article.service'
import { CommentService } from 'src/app/shared/services/comment.service'
import { LoaderService } from 'src/app/shared/services/loader.service'
import { environment } from 'src/environments/environment'
import { ArticleCommentActions } from 'src/types/article-comment-actions.type'
import { ArticleRelate } from 'src/types/article-related.type'
import { ArticleType } from 'src/types/article.type'
import { Comment } from 'src/types/comment.type'
import { DefaultResponseType } from 'src/types/default-response.type'
import { doComment } from 'src/types/do-comment.type'
import { GetComments } from 'src/types/get-comments.type'
import { GetParamComments } from 'src/types/get-param-comments.type'
import { likeAndDislike } from 'src/types/likeAndDislike.type'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {

  public article: ArticleType | null = null
  public articleRelate: ArticleRelate | null = null
  public displayComments: Comment[] = []
  public articleActions: ArticleCommentActions[] = []
  public serverStaticPath: string = environment.serverStaticPath
  public isLogged: boolean = false
  public isComments: boolean = false
  public isHideComments: boolean = false
  public isShowAllComments: boolean = false
  private offset: number = 3
  public formComment = this.fb.group({
    text: ['']
  })

  private subscriptionArticle: Subscription | null = null
  private subscriptionActivateParams: Subscription | null = null
  private subscriptionRelate: Subscription | null = null
  private subscriptionAddComment: Subscription | null = null
  private subscriptionComments: Subscription | null = null
  private subscriptionGetActions: Subscription | null = null
  private subscriptionAction: Subscription | null = null
  private subscriptionLogged: Subscription | null = null

  constructor(private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private articleService: ArticleService,
    private authService: AuthService,
    private commentService: CommentService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
  ) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.subscriptionLogged = this.authService.isLogged$.subscribe((isLogged) => {
      this.isLogged = isLogged
      if (!isLogged) {
        this.getArticle()
      }
    })

    this.getArticle()
  }

  getArticle(): void {
    this.subscriptionActivateParams = this.activeRoute.params.subscribe((params: Params) => {
      if (params['url']) {
        this.subscriptionArticle = this.articleService.getArticle(params['url']).subscribe((article: ArticleType) => {
          if (article) {
            this.article = article
            this.displayComments = article.comments ? article.comments : []
            if (article.commentsCount === 0) this.isComments = true
            if (article.commentsCount && article.commentsCount > 3) this.isShowAllComments = true

            if (this.isLogged) {
              this.isActionPerson()
            }
          }
        })

        this.subscriptionRelate = this.articleService.getArticleRelate(params['url']).subscribe((articleRelate: ArticleRelate) => {
          this.articleRelate = articleRelate
        })
      }
    })
  }


  getAllComments(articleId: string): void {
    this.loaderService.show()

    const params: GetParamComments = {
      offset: this.offset,
      article: articleId,
    }

    this.subscriptionComments = this.commentService.getComment(params)
      .subscribe((data: GetComments | DefaultResponseType) => {
        const newComments = data as GetComments
        this.displayComments = this.displayComments.concat(newComments.comments)
        this.loaderService.hide()

        if (this.displayComments.length < newComments.allCount) this.offset += 10
        this.isActionPerson()

        this.isShowAllComments = this.displayComments.length < newComments.allCount
        if (!this.isShowAllComments) {

          this.offset = 3
          this.isHideComments = true
        }
      })

  }

  isActionPerson() {
    if (this.isLogged && this.article) {
      this.subscriptionGetActions = this.commentService.getActionsComment(this.article.id)
        .subscribe((data: ArticleCommentActions[] | DefaultResponseType) => {
          this.articleActions = data as ArticleCommentActions[]
          this.displayComments.forEach(item => {
            this.articleActions.map(itemActions => {
              if (item.id === itemActions.comment) {
                if (itemActions.action === 'like' || itemActions.action === 'dislike') {
                  item.isAction = itemActions.action
                }
              }
            })
          })
        })
    }
  }

  hideComments(): void {
    this.displayComments = this.displayComments.slice(0, 3)
    this.isHideComments = false
    this.isShowAllComments = true
  }

  doComment(articleId: string): void {
    this.isComments = false
    if (this.formComment.value.text) {
      const newObj: doComment = {
        text: this.formComment.value.text,
        article: articleId
      }
      this.subscriptionAddComment = this.commentService.doComment(newObj).subscribe((data: DefaultResponseType) => {
        if ((data as DefaultResponseType).message !== undefined) {
          this._snackBar.open((data as DefaultResponseType).message)
          this.formComment.reset()
          this.getArticle()
        }
      })
    }
  }

  likeOrDislike(emotion: string, commentId: string): void {
    if (this.isLogged) {
      const newObj: likeAndDislike = {
        action: emotion
      }

      this.subscriptionAction = this.commentService.likeAndDislike(newObj, commentId)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error === false) {

              this.displayComments = this.displayComments.map(comment => {
                let updateAction: Comment = { ...comment }

                if (comment.id === commentId) {
                  if (comment.isAction === emotion) {
                    if (emotion === 'like') updateAction.likesCount--
                    if (emotion === 'dislike') updateAction.dislikesCount--
                    updateAction.isAction = ''
                  } else {
                    if (comment.isAction === 'like') updateAction.likesCount--
                    if (comment.isAction === 'dislike') updateAction.dislikesCount--

                    if (emotion === 'like') updateAction.likesCount++
                    if (emotion === 'dislike') updateAction.dislikesCount++
                    updateAction.isAction = emotion
                  }
                }
                return updateAction
              })
              this._snackBar.open(emotion === 'violate' ? 'Жалоба отправлена' : 'Ваш голос учтен')
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(emotion === 'violate' ? 'Жалоба уже была отправлена' : errorResponse.error.message)
            }
          }
        })
    } else {
      this._snackBar.open('Для того что бы оценить войдите в свой профиль')
    }
  }

  ngOnDestroy(): void {
    this.subscriptionArticle?.unsubscribe()
    this.subscriptionActivateParams?.unsubscribe()
    this.subscriptionRelate?.unsubscribe()
    this.subscriptionAddComment?.unsubscribe()
    this.subscriptionComments?.unsubscribe()
    this.subscriptionGetActions?.unsubscribe()
    this.subscriptionAction?.unsubscribe()
    this.subscriptionLogged?.unsubscribe()
  }
}


