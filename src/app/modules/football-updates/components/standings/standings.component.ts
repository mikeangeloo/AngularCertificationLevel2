import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { mergeMap, take, tap } from 'rxjs'
import { FootballDataService } from '../../../../services/football-data.service'
import { Country } from '../../../../shared/interfaces/country.interface'
import { Standing } from '../../../../shared/interfaces/standing.interface'

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
})
export class StandingsComponent implements OnInit {
  public title = 'Football Updates'

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

  constructor(private footBallService: FootballDataService, private router: Router) {}

  ngOnInit(): void {
    this.loadCountries()
  }

  loadCountries() {
    const searchCountries = this.countriesToFetch.map((countriesInfo) => countriesInfo.country)
    this.footBallService
      .getCountries(searchCountries)
      .pipe(take(1))
      .subscribe((contries) => {
        this.countries = contries
        if (this.countries[0]?.name) {
          this.loadCountryStandings(this.countries[0].name)
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
            console.log('standingsResponse', standingsResponse.standings)
            this.standings = standingsResponse.standings
          })
        )
        .subscribe()
    }
  }

  public goToFixturesFaceToFace(teamId: number) {
    this.router.navigate(['football-updates/fixtures-face-to-face', teamId])
  }

  private markCountrySelection(countryName: string) {
    for (let country of this.countries) {
      country.selected = country.name === countryName
    }
  }
}
