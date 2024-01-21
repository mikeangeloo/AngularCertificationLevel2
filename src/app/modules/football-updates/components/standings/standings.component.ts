import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subject, catchError, mergeMap, take, takeUntil, tap } from 'rxjs'
import { FootballDataService } from '../../../../services/football-data.service'
import { FootballUpdatesService } from '../../../../services/football-updates.service'
import { Country } from '../../../../shared/interfaces/country.interface'
import { Standing } from '../../../../shared/interfaces/standing.interface'

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit, OnDestroy {
  public countries: Country[] = []
  public countriesLoading: boolean = false

  public standings: Standing[] = []
  public standingsLoading: boolean = false

  public errorsData: string = ''

  private destroySub$: Subject<boolean>

  constructor(
    public footballUpdateService: FootballUpdatesService,
    private footBallService: FootballDataService,
    private router: Router
  ) {
    this.destroySub$ = new Subject<boolean>()
  }

  ngOnInit(): void {
    this.footballUpdateService.pageTitle$.next('Football Updates')
    this.footballUpdateService.errorMsgs$.next(null)
    this.loadCountries()

    this.footballUpdateService.seasonSelected$.pipe(
      takeUntil(this.destroySub$)
    ).subscribe(() => {
      if (this.footballUpdateService.countrySelected$) {
        this.loadCountryStandings(this.footballUpdateService.countrySelected$.value)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroySub$.next(true)
  }

  loadCountries() {
    this.countriesLoading = true
    const searchCountries = this.footballUpdateService.countriesToFetch.map(
      (countriesInfo) => countriesInfo.country
    )
    this.footBallService
      .getCountries(searchCountries)
      .pipe(
        take(1),
        takeUntil(this.destroySub$),
        catchError((e) => {
          this.countriesLoading = false
          this.footballUpdateService.errorMsgs$.next(['Something goes wrong!'])
          throw e
        })
      )
      .subscribe((contries) => {
        this.countriesLoading = false
        this.countries = contries
        // if (this.footballUpdateService.countrySelected$) {
        //   this.loadCountryStandings(this.footballUpdateService.countrySelected$.value)
        // }
      })
  }

  loadCountryStandings(countryName: string) {
    this.standingsLoading = true
    this.standings = []
    this.markCountrySelection(countryName)
    this.footballUpdateService.errorMsgs$.next(null)

    const leagueName = this.footballUpdateService.countriesToFetch.find(
      (countryInfo) => countryInfo.country === countryName
    )?.leagueName
    const season = this.footballUpdateService.seasonSelected$.value
    if (leagueName) {
      this.footBallService
        .getLeague(countryName, leagueName)
        .pipe(
          take(1),
          takeUntil(this.destroySub$),
          mergeMap((league) => {
            return this.footBallService.getStandings(league.id, season)
          }),
          tap((standingsResponse) => {
            this.standingsLoading = false
            this.standings = standingsResponse.standings
          }),
          catchError((e) => {
            this.standingsLoading = false
            this.footballUpdateService.errorMsgs$.next(['There is not information to show for this season!'])
            throw e
          })
        )
        .subscribe()
    }
  }

  public goToFixturesFaceToFace(teamId: number) {
    const countryNameSelected = this.getCountrySelected().name
    this.footballUpdateService.countrySelected$.next(countryNameSelected)
    this.router.navigate(['football-updates/fixtures-face-to-face', countryNameSelected, teamId])
  }

  private markCountrySelection(countryName: string) {
    for (let country of this.countries) {
      country.selected = country.name === countryName
    }
  }

  private getCountrySelected(): Country {
    return this.countries.filter((country) => country.selected)[0]
  }
}
