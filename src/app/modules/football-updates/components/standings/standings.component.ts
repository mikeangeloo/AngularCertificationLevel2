import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { mergeMap, take, tap } from 'rxjs'
import { FootballDataService } from '../../../../services/football-data.service'
import { FootballUpdatesService } from '../../../../services/football-updates.service'
import { Country } from '../../../../shared/interfaces/country.interface'
import { Standing } from '../../../../shared/interfaces/standing.interface'

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit {
  public countries: Country[] = []
  public standings: Standing[] = []

  private countriesToFetch = [
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

  constructor(
    public footballUpdateService: FootballUpdatesService,
    private footBallService: FootballDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.footballUpdateService.pageTitle.next('Football Updates')
    this.loadCountries()
  }

  loadCountries() {
    const searchCountries = this.countriesToFetch.map((countriesInfo) => countriesInfo.country)
    this.footBallService
      .getCountries(searchCountries)
      .pipe(take(1))
      .subscribe((contries) => {
        this.countries = contries
        if (this.footballUpdateService.countrySelected) {
          this.loadCountryStandings(this.footballUpdateService.countrySelected.value)
        }
      })
  }

  loadCountryStandings(countryName: string) {
    this.markCountrySelection(countryName)

    const leagueName = this.countriesToFetch.find(
      (countryInfo) => countryInfo.country === countryName
    )?.leagueName
    const season = new Date().getFullYear().toString()
    if (leagueName) {
      this.footBallService
        .getLeague(countryName, leagueName)
        .pipe(
          take(1),
          mergeMap((league) => {
            return this.footBallService.getStandings(league.id, season)
          }),
          tap((standingsResponse) => {
            this.standings = standingsResponse.standings
          })
        )
        .subscribe()
    }
  }

  public goToFixturesFaceToFace(teamId: number) {
    const countryNameSelected = this.getCountrySelected().name
    this.footballUpdateService.countrySelected.next(countryNameSelected)
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
