import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FixturesFaceToFaceComponent } from './components/fixtures-face-to-face/fixtures-face-to-face.component'
import { StandingsComponent } from './components/standings/standings.component'
import { FootballUpdatesComponent } from './pages/football-updates.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'standings',
  },
  {
    path: '',
    component: FootballUpdatesComponent,
    children: [
      {
        path: 'standings',
        component: StandingsComponent,
      },
      {
        path: 'fixtures-face-to-face/:country-name/:team-id',
        component: FixturesFaceToFaceComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FootballUpdatesRoutingModule {}
