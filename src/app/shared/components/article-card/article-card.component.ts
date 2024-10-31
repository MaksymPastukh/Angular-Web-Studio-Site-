import { Component, Input, OnInit } from '@angular/core'
import { environment } from "../../../../environments/environment"
import { ArticleType } from "../../../../types/article.type"

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleType
  @Input() customStyle!: string
  public serverStaticPath: string = environment.serverStaticPath

  constructor() {
  }
}
