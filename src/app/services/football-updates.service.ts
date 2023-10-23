import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FootballUpdatesService {
  public pageTitle = new BehaviorSubject('')
  public countrySelected = new BehaviorSubject('England')

  constructor() {}
}
