import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthForwardGuard } from "./core/auth/auth-forward.guard"
import { LayoutComponent } from "./shared/layout/layout.component"
import { MainComponent } from "./views/main/main.component"

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      {
        path: '',
        loadChildren: () => import('./views/user/user.module').then(m => m.UserModule),
        canActivate: [AuthForwardGuard],
      },
      {
        path: '',
        loadChildren: () => import('./views/blogs/blogs.module').then(m => m.BlogsModule)
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 64]
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
