import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FootballUpdatesRoutingModule } from './football-updates-routing.module';
import { FootballUpdatesComponent } from './pages/football-updates.component';
import { StandingsComponent } from './components/standings/standings.component';
import { FixturesFaceToFaceComponent } from './components/fixtures-face-to-face/fixtures-face-to-face.component';


@NgModule({
  declarations: [
    FootballUpdatesComponent,
    StandingsComponent,
    FixturesFaceToFaceComponent
  ],
  imports: [
    CommonModule,
    FootballUpdatesRoutingModule
  ]
})
export class FootballUpdatesModule { }
