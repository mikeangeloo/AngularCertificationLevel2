import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

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
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
