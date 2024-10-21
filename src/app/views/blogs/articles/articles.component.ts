import { Component, HostListener, OnInit } from '@angular/core'
import { ArticleService } from "../../../shared/services/article.service"
import { CategoriesType } from "../../../../types/categories.type"
import { DefaultResponseType } from "../../../../types/default-response.type"
import { ArticlesType } from "../../../../types/articles.type"

@Component({
  selector: 'app-article-card',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  public sortingOpen: boolean = false
  public categorySort!: CategoriesType
  public articles!: ArticlesType
  public pages: number[] = []

  constructor(private articleService: ArticleService) {
  }

  ngOnInit(): void {

    this.articleService.getCategories()
      .subscribe((category: CategoriesType | DefaultResponseType) => {
        this.categorySort = category as CategoriesType


        this.articleService.getArticles()
          .subscribe((data: ArticlesType) => {
            this.pages = []

            for (let index = 0; index <= data.pages; index++) {
              this.pages.push(index)
            }

            console.log(this.pages)


            this.articles = data as ArticlesType

          })


      })
  }


  toggleSorting() {
    this.sortingOpen = !this.sortingOpen
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    if (this.sortingOpen && (event.target as HTMLElement).className.indexOf('articles-sort') === -1) {
      this.sortingOpen = false
    }
  }

}
