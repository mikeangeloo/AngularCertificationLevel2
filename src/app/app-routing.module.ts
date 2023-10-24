import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'football-updates',
  },
  {
    path: 'football-updates',
    loadChildren: () =>
      import('./modules/football-updates/football-updates.module').then(
        (footballModule) => footballModule.FootballUpdatesModule
      ),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
