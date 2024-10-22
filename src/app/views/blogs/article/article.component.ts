import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Params, Router } from '@angular/router'
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
  public isShowComments: boolean = false
  public isHideComments: boolean = false
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
          this.article = article
          this.getComments(this.article.id)
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
        this.isShowComments = this.comments.comments.length > 3
      })
  }

  showComments() {
    this.displayComments = this.comments.comments
    this.isShowComments = false
    this.isHideComments = true
  }

  hideComments() {
    this.displayComments = this.comments.comments.slice(0, 3)
    this.isHideComments = false
    this.isShowComments = true
  }

  doComment(id: string,): void {
    if (this.formComment.value.text) {
      const newObj: doComment = {
        text: this.formComment.value.text,
        article: id
      }
      this.commentService.doComment(newObj).subscribe((data: DefaultResponseType) => {
        if ((data as DefaultResponseType).message !== undefined) {
          this._snackBar.open((data as DefaultResponseType).message)
          this.formComment.reset()
          this.getComments(id)
        }
      })
    }
  }
}
