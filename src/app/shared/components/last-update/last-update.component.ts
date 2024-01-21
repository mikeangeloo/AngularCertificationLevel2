import { Component, OnInit } from '@angular/core'
import { FootballUpdatesService } from '../../../services/football-updates.service'

@Component({
  selector: 'app-last-update',
  templateUrl: './last-update.component.html',
  styleUrls: ['./last-update.component.scss'],
})
export class LastUpdateComponent implements OnInit {
  constructor(public footballUpdateServ: FootballUpdatesService) {}

  ngOnInit(): void {}

  setYearSelected(year: string) {
    if (this.footballUpdateServ.seasonSelected$.value !== year) {
      this.footballUpdateServ.seasonSelected$.next(year)
    }
  }
}
