import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map, of } from 'rxjs'
import { Country } from '../shared/interfaces/country.interface'
import { FixturesFaceToFace } from '../shared/interfaces/fixtures-face-to-face.interface'
import { League } from '../shared/interfaces/league.interface'
import { Standing } from '../shared/interfaces/standing.interface'

@Injectable({
  providedIn: 'root',
})
export class FootballDataService {
  private readonly API_KEY = 'b887fa32a795d9949334a48e6698785e'
  private readonly API_HOST = 'v3.football.api-sports.io'
  //private readonly API_URL = 'https://v3.football.api-sports.io'
  private readonly API_URL = 'https://54248bd0-a803-4942-b8a0-3779a328cac0.mock.pstmn.io'
  private readonly CUSTOM_HEADERS = new HttpHeaders()
  private readonly LOCAL_CACHE = 'apiCache'

  constructor(private http: HttpClient) {
    this.CUSTOM_HEADERS.append('x-rapidapi-key', this.API_KEY)
    this.CUSTOM_HEADERS.append('x-rapidapi-host', this.API_HOST)
  }

  public getCountries(countryNames?: string[], countrySelected?: string): Observable<Country[]> {
    const cachedData = this.returnFromApiCache<[], ContryResponse>([], 'countries')
    let apiCall = this.http.get<FootballApiResponse<[], ContryResponse>>(
      `${this.API_URL}/countries`
    )
    if (cachedData) {
      apiCall = of(cachedData)
    }
    return apiCall.pipe(
      map((data) => {
        const mappedCountries = data.response.map((country: ContryResponse) => {
          return {
            ...country,
            selected: false,
          }
        }) as Country[]
        if (countryNames && countryNames.length > 0) {
          return mappedCountries.filter((country) => countryNames.includes(country.name))
        } else {
          return mappedCountries
        }
      })
    )
  }

  public getLeague(country: string, leagueName: string): Observable<League> {
    const params = {
      name: leagueName,
      country,
    }
    return this.http
      .get<FootballApiResponse<typeof params, { league: LeagueResponse }>>(
        `${this.API_URL}/leagues`,
        { params }
      )
      .pipe(
        map((data) => {
          return data.response
            .map((leagueData) => {
              const league: League = {
                name: leagueData.league.name,
                id: leagueData.league.id,
                type: leagueData.league.type,
                logo: leagueData.league.logo,
              }
              return league
            })
            .filter((league) => league.name === leagueName)[0]
        })
      )
  }

  public getStandings(
    leagueId: number,
    season: string
  ): Observable<{ league: League; standings: Standing[] }> {
    const params = {
      league: leagueId,
      season,
    }

    return this.http
      .get<FootballApiResponse<typeof params, { league: LeagueResponse }>>(
        `${this.API_URL}/standings`,
        { params }
      )
      .pipe(
        map((data) => {
          return data.response.map((standingsData) => {
            return {
              league: standingsData.league,
              standings: standingsData.league.standings[0],
            }
          })[0]
        })
      )
  }

  public getFixtureFaceToFace(
    season: string,
    last: string,
    teamId: number
  ): Observable<FixturesFaceToFace[]> {
    const params = {
      season,
      last,
      team: teamId,
    }

    return this.http
      .get<FootballApiResponse<typeof params, FixtureResponse>>(`${this.API_URL}/fixtures`, {
        params,
      })
      .pipe(
        map((data) => {
          return data.response.map((fixturesData) => {
            const fixturesFaceToFace: FixturesFaceToFace = {
              home: {
                ...fixturesData.teams.home,
                goals: fixturesData.goals.home,
              },
              away: {
                ...fixturesData.teams.away,
                goals: fixturesData.goals.away,
              },
            }
            return fixturesFaceToFace
          })
        })
      )
  }

  private returnFromApiCache<Parameters, Response>(
    requestParams: Parameters,
    apiRoute: string
  ): FootballApiResponse<Parameters, Response> {
    const localApiData: FootballApiResponse<Parameters, Response>[] = JSON.parse(
      localStorage.getItem(this.LOCAL_CACHE) ?? '[]'
    )

    return localApiData.filter(
      (apiCache) => apiCache.parameters === requestParams && apiRoute === apiRoute
    )[0]
  }

  private saveToApiCache<Parameters, Response>(
    response: FootballApiResponse<Parameters, Response>,
    apiRoute: string
  ): void {
    const localApiData: FootballApiResponse<Parameters, Response>[] = JSON.parse(
      localStorage.getItem(this.LOCAL_CACHE) ?? '[]'
    )
    const indexCached = localApiData.findIndex(
      (apiCache) => apiCache.parameters === response.parameters && apiRoute === apiRoute
    )

    if (indexCached !== -1) {
      localApiData.splice(indexCached, 1)
    }

    localApiData.push(response)
  }
}
export interface FootballApiResponse<Parameters, Response> {
  get: string
  parameters: Parameters
  results: number
  paging: {
    current: 1
    total: 1
  }
  response: Array<Response>
}

export interface ContryResponse {
  name: string
  code: string
  flag: string
}

export interface LeagueResponse {
  id: number
  name: string
  type: string
  logo: string
  standings: [StandingsResponse[]]
}

export interface StandingsResponse {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalsDiff: 12
  group: string
  form: string
  status: string
  description: string
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: {
      for: number
      against: number
    }
  }
}

export interface FixtureResponse {
  teams: {
    home: {
      id: number
      name: string
      logo: string
      winner: boolean
    }
    away: {
      id: number
      name: string
      logo: string
      winner: boolean
    }
  }
  goals: {
    home: number
    away: number
  }
}

export interface LocalApiCache<Params> {
  params: Params
  apiRoute: string
}
