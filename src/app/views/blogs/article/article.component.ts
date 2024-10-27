import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Params } from '@angular/router'
import { AuthService } from 'src/app/core/auth/auth.service'
import { ArticleService } from 'src/app/shared/services/article.service'
import { CommentService } from 'src/app/shared/services/comment.service'
import { environment } from 'src/environments/environment'
import { ArticleRelate } from 'src/types/article-related.type'
import { ArticleType } from 'src/types/article.type'
import { Comments } from 'src/types/comments.type'
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
export class ArticleComponent implements OnInit {

  public article!: ArticleType
  public articleRelate!: ArticleRelate
  public comments!: GetComments
  public displayComments!: Comments
  public serverStaticPath: string = environment.serverStaticPath
  public isLogged: boolean = false
  public isComments: boolean = false
  public isShowComments: boolean = false
  public isHideComments: boolean = false
  public isShowAllComments: boolean = false
  public formComment = this.fb.group({
    text: ['']
  })


  constructor(private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private articleService: ArticleService,
    private authService: AuthService,
    private commentService: CommentService,
    private fb: FormBuilder,
  ) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLogged) => {
      this.isLogged = isLogged
    })

    this.activeRoute.params.subscribe((params: Params) => {
      if (params['url']) {
        this.articleService.getArticle(params['url']).subscribe((article: ArticleType) => {
          if (article) {

            this.article = article

            if (article.commentsCount === 0) {
              this.isComments = true
            }

            if (article.commentsCount && article.commentsCount > 3) {
              this.isShowAllComments = true
            }
            this.getComments(this.article.id)
          }
        })

        this.articleService.getArticleRelate(params['url']).subscribe((articleRelate: ArticleRelate) => {
          this.articleRelate = articleRelate
        })
      }
    })
  }

  getComments(id: string) {
    const params: GetParamComments = {
      offset: 0,
      article: id,
    }

    this.commentService.getComment(params)
      .subscribe((data: GetComments | DefaultResponseType) => {
        this.comments = data as GetComments
        this.displayComments = this.comments.comments.slice(0, 3)

      })
  }


  getAllComments(articleId: string) {
    const params: GetParamComments = {
      offset: this.comments.comments.length,
      article: articleId,
    }

    this.commentService.getComment(params)
      .subscribe((data: GetComments | DefaultResponseType) => {
        const newComments = (data as GetComments).comments
        this.comments.comments.push(...newComments)
        this.displayComments = [...this.comments.comments]
        this.isShowAllComments = newComments.length === 10
        this.isHideComments = !this.isShowAllComments
      })
  }

  hideComments() {
    this.displayComments = this.comments.comments.slice(0, 3)
    this.isShowComments = false
    this.isHideComments = false
    this.isShowAllComments = true
  }

  doComment(articleId: string,): void {
    this.isComments = false
    if (this.formComment.value.text) {
      const newObj: doComment = {
        text: this.formComment.value.text,
        article: articleId
      }
      this.commentService.doComment(newObj).subscribe((data: DefaultResponseType) => {
        if ((data as DefaultResponseType).message !== undefined) {
          this._snackBar.open((data as DefaultResponseType).message)
          this.formComment.reset()
          this.getComments(articleId)
        }
      })
    }
  }

  likeOrDislike(emotion: string, commentId: string, articleId: string): void {
    if (emotion && commentId && articleId) {
      const newObj: likeAndDislike = {
        action: emotion
      }

      this.commentService.likeAndDislike(newObj, commentId).subscribe({
        next: (data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error === false) {
            this._snackBar.open(emotion === 'violate' ? 'Жалоба отправлена' : 'Ваш голос учтен')
            this.getComments(articleId)
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            const errorMessage = errorResponse.error?.message || 'Ошибка при отправке'
            this._snackBar.open(errorMessage)
          }
        }
      })

    }
  }
}
