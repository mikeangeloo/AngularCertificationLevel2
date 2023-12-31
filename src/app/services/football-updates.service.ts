import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FootballUpdatesService {
  public readonly countriesToFetch = [
    {
      country: 'England',
      leagueName: 'Premier League',
    },
    {
      country: 'Spain',
      leagueName: 'La Liga',
    },
    {
      country: 'Germany',
      leagueName: 'Bundesliga',
    },
    {
      country: 'France',
      leagueName: 'Ligue 1',
    },
    {
      country: 'Italy',
      leagueName: 'Serie A',
    },
  ]

  public pageTitle$ = new BehaviorSubject('')
  public countrySelected$ = new BehaviorSubject('England')
  public errorMsgs$ = new BehaviorSubject<Array<string> | null>(null)
  public dataLastCapturedInfo$ = new BehaviorSubject<{ data: string; timeCaptured: number } | null>(
    null
  )

  constructor() {}
}
