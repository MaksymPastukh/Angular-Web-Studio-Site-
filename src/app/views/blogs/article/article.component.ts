import { Component, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { ArticleService } from 'src/app/shared/services/article.service'
import { environment } from 'src/environments/environment'
import { ArticleRelate } from 'src/types/article-related.type'
import { ArticleType } from 'src/types/article.type'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  public article!: ArticleType
  public articleRelate!: ArticleRelate
  public serverStaticPath: string = environment.serverStaticPath


  constructor(private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private articleService: ArticleService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if (params['url']) {
        this.articleService.getArticle(params['url']).subscribe((article: ArticleType) => {
          this.article = article
        })

        this.articleService.getArticleRelate(params['url']).subscribe((articleRelate: ArticleRelate) => {
          this.articleRelate = articleRelate
        })
      }
    })
  }

}
