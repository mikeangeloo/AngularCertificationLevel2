export interface FixturesFaceToFace {
  league: {
    id: number
    name: string
    country: string
  }
  home: {
    id: number
    name: string
    logo: string
    winner: boolean
    goals: number
  }
  away: {
    id: number
    name: string
    logo: string
    winner: boolean
    goals: number
  }
}
