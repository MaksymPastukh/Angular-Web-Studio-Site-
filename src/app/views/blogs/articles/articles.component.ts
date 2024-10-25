import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { debounceTime } from 'rxjs'
import { ActivateParamsType } from 'src/types/activate-params.type'
import { AppliedFilters } from 'src/types/applied-filters.type'
import { ArticlesType } from "../../../../types/articles.type"
import { CategoriesType } from "../../../../types/categories.type"
import { DefaultResponseType } from "../../../../types/default-response.type"
import { ArticleService } from "../../../shared/services/article.service"

@Component({
  selector: 'app-article-card',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  public sortingOpen: boolean = false
  public categorySort!: CategoriesType
  public category: CategoriesType[] = []
  public articles!: ArticlesType
  public pages: number[] = []
  public appliedFilters: AppliedFilters[] = []
  public activeParams: ActivateParamsType = {
    categories: []
  }



  constructor(private articleService: ArticleService, private router: Router, private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.articleService.getCategories()
      .subscribe((category: CategoriesType | DefaultResponseType) => {
        this.categorySort = category as CategoriesType


        this.category = category as any

        this.activateRoute.queryParams
          .pipe(
            debounceTime(300)
          )
          .subscribe((params: Params) => {

            const activeParams: ActivateParamsType = { categories: [] }

            if (params.hasOwnProperty('categories')) {
              activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
            }

            if (params.hasOwnProperty('page')) {
              activeParams.page = params['page']
            }

            this.appliedFilters = []

            if (activeParams.categories && activeParams.categories.length > 0) {
              activeParams.categories.forEach((url: string) => {
                const find = this.categorySort.find(categoryUrl => categoryUrl.url === url)

                if (find) {
                  this.appliedFilters.push({
                    name: find.name,
                    value: find.url
                  })
                }
              })
            }

            this.articleService.getArticles(activeParams)
              .subscribe((data: ArticlesType) => {
                this.pages = []

                for (let index = 1; index <= data.pages; index++) {
                  this.pages.push(index)
                }
                this.articles = data as ArticlesType

                if (this.articles.items.length === 0) {

                  console.log(1)

                  this.router.navigate(['/articles'])
                }
              })
          })
      })
  }


  sortCategory(value: string): void {
    if (this.activeParams.page === 2) this.activeParams.page = 1
    if (this.activeParams.categories?.includes(value)) {
      this.activeParams.categories = this.activeParams.categories.filter(url => url !== value)
    } else {
      this.activeParams.categories?.push(value)
    }
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

  removeAppliedFilters(appliedFilter: AppliedFilters): void {
    this.activeParams.categories = this.activeParams.categories?.filter(item => item !== appliedFilter.value)
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number) {
    this.activeParams.page = page
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage(): void {
    if (this.activeParams.page === undefined) this.activeParams.page = 1
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      })
    }
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen
  }

  @HostListener('document:click', ['$event'])
  click(event: Event): void {
    if (this.sortingOpen && (event.target as HTMLElement).className.indexOf('articles-sort') === -1) {
      this.sortingOpen = false
    }
  }

}
