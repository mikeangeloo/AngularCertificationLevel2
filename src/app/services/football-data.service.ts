import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map, of, tap } from 'rxjs'
import { Country } from '../shared/interfaces/country.interface'
import { FixturesFaceToFace } from '../shared/interfaces/fixtures-face-to-face.interface'
import { League } from '../shared/interfaces/league.interface'
import { Standing } from '../shared/interfaces/standing.interface'
import { DateHandlerUtil } from '../shared/utils/date-handler.util'
import { FootballUpdatesService } from './football-updates.service'

@Injectable({
  providedIn: 'root',
})
export class FootballDataService {
  private readonly API_URL = 'https://v3.football.api-sports.io'
  private readonly LOCAL_CACHE = 'apiCache'

  private loadedAPI: LoadedAPI[] = []

  constructor(private http: HttpClient, private footballUpdateServ: FootballUpdatesService) {}

  public getCountries(countryNames?: string[], countrySelected?: string): Observable<Country[]> {
    const cachedData = this.returnFromApiCache<[], ContryResponse>([], 'countries')
    let apiCall = this.http.get<FootballApiResponse<[], ContryResponse>>(
      `${this.API_URL}/countries`
    )

    if (cachedData) {
      apiCall = of(cachedData)
    }
    return apiCall.pipe(
      tap((data) => {
        if (!cachedData) {
          this.saveToApiCache<[], ContryResponse>(
            { parameters: [], response: data.response },
            'countries'
          )
        }
        this.loadedAPI.push({ route: 'countries', loaded: true })
      }),
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

    const cachedData = this.returnFromApiCache<typeof params, { league: LeagueResponse }>(
      params,
      'leagues'
    )
    let apiCall = this.http.get<FootballApiResponse<typeof params, { league: LeagueResponse }>>(
      `${this.API_URL}/leagues`,
      { params }
    )
    if (cachedData) {
      apiCall = of(cachedData)
    }

    return apiCall.pipe(
      tap((data) => {
        if (!cachedData) {
          this.saveToApiCache<typeof params, { league: LeagueResponse }>(
            { parameters: params, response: data.response },
            'leagues'
          )
        }
      }),
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

    const cachedData = this.returnFromApiCache<typeof params, { league: LeagueResponse }>(
      params,
      'standings'
    )
    let apiCall = this.http.get<FootballApiResponse<typeof params, { league: LeagueResponse }>>(
      `${this.API_URL}/standings`,
      { params }
    )
    if (cachedData) {
      apiCall = of(cachedData)
    }

    return apiCall.pipe(
      tap((data) => {
        if (!cachedData) {
          this.saveToApiCache<typeof params, { league: LeagueResponse }>(
            { parameters: params, response: data.response },
            'standings'
          )
        }
      }),
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

    const cachedData = this.returnFromApiCache<typeof params, FixtureResponse>(params, 'fixtures')
    let apiCall = this.http.get<FootballApiResponse<typeof params, FixtureResponse>>(
      `${this.API_URL}/fixtures`,
      { params }
    )
    if (cachedData) {
      apiCall = of(cachedData)
    }

    return apiCall.pipe(
      tap((data) => {
        if (!cachedData) {
          this.saveToApiCache<typeof params, FixtureResponse>(
            { parameters: params, response: data.response },
            'fixtures'
          )
        }
      }),
      map((data) => {
        return data.response.map((fixturesData) => {
          const fixturesFaceToFace: FixturesFaceToFace = {
            league: {
              id: fixturesData.league.id,
              name: fixturesData.league.name,
              country: fixturesData.league.country,
            },
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
  ): FootballApiResponse<Parameters, Response> | null {
    const localApiData: LocalApiCache<Parameters, Response>[] = JSON.parse(
      localStorage.getItem(this.LOCAL_CACHE) ?? '[]'
    )

    const today = DateHandlerUtil.parseTtl('today', 0)

    const indexCached = localApiData.findIndex(
      (apiCache) =>
        JSON.stringify(apiCache.data.parameters) === JSON.stringify(requestParams) &&
        apiCache.apiRoute === apiRoute
    )

    const cachedData = localApiData.filter(
      (apiCache) =>
        JSON.stringify(apiCache.data.parameters) === JSON.stringify(requestParams) &&
        apiCache.apiRoute === apiRoute
    )[0]

    if (
      indexCached !== -1 &&
      (today > cachedData?.ttl || cachedData?.data?.response.length === 0)
    ) {
      localApiData.splice(indexCached, 1)
      localStorage.setItem(this.LOCAL_CACHE, JSON.stringify(localApiData))
      return null
    }

    if (cachedData?.ttl && (apiRoute === 'standings' || apiRoute === 'fixtures')) {
      this.footballUpdateServ.dataLastCapturedInfo$.next({
        data: apiRoute,
        timeCaptured: cachedData.updatedAt,
      })
    }

    return cachedData?.data
  }

  private saveToApiCache<Parameters, Response>(
    response: Pick<FootballApiResponse<Parameters, Response>, 'parameters' | 'response'>,
    apiRoute: string
  ): void {
    const localApiData: LocalApiCache<Parameters, Response>[] = JSON.parse(
      localStorage.getItem(this.LOCAL_CACHE) ?? '[]'
    )
    const indexCached = localApiData.findIndex(
      (apiCache) =>
        JSON.stringify(apiCache.data.parameters) === JSON.stringify(response.parameters) &&
        apiCache.apiRoute === apiRoute
    )

    if (indexCached !== -1) {
      localApiData.splice(indexCached, 1)
    }

    const ttl = DateHandlerUtil.parseTtl('hours', 2)
    const updatedAt = DateHandlerUtil.parseTtl('today', 0)

    localApiData.push({
      data: response,
      apiRoute,
      ttl,
      updatedAt,
    })

    localStorage.setItem(this.LOCAL_CACHE, JSON.stringify(localApiData))
    if (apiRoute === 'standings' || apiRoute === 'fixtures') {
      this.footballUpdateServ.dataLastCapturedInfo$.next({
        data: apiRoute,
        timeCaptured: updatedAt,
      })
    }
  }
}
export interface FootballApiResponse<Parameters, Response> {
  parameters: Parameters
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
  logo: string
  type: string
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
  league: {
    id: number
    name: string
    country: string
  }
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

export interface LocalApiCache<Parameters, Response> {
  data: Pick<FootballApiResponse<Parameters, Response>, 'parameters' | 'response'>
  apiRoute: string
  ttl: number
  updatedAt: number
}

export interface LoadedAPI {
  route: string
  loaded: boolean
}
