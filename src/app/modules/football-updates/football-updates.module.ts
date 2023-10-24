import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { SharedModule } from '../../shared/shared.module'
import { FixturesFaceToFaceComponent } from './components/fixtures-face-to-face/fixtures-face-to-face.component'
import { StandingsComponent } from './components/standings/standings.component'
import { FootballUpdatesRoutingModule } from './football-updates-routing.module'
import { FootballUpdatesComponent } from './pages/football-updates.component'

@NgModule({
  declarations: [FootballUpdatesComponent, StandingsComponent, FixturesFaceToFaceComponent],
  imports: [CommonModule, FootballUpdatesRoutingModule, SharedModule],
})
export class FootballUpdatesModule {}
