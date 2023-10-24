import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject, catchError, take, takeUntil } from 'rxjs'
import { FootballDataService } from '../../../../services/football-data.service'
import { FootballUpdatesService } from '../../../../services/football-updates.service'
import { FixturesFaceToFace } from '../../../../shared/interfaces/fixtures-face-to-face.interface'

@Component({
  selector: 'app-fixtures-face-to-face',
  templateUrl: './fixtures-face-to-face.component.html',
  styleUrls: ['./fixtures-face-to-face.component.scss'],
})
export class FixturesFaceToFaceComponent implements OnInit, OnDestroy {
  public fixtureFaceToFace: FixturesFaceToFace[] = []
  public loadingFixtures: boolean = false

  private teamId: number = 0
  private countryName: string = ''
  private destroySub$: Subject<boolean>

  constructor(
    public footballUpdateService: FootballUpdatesService,
    private footballService: FootballDataService,
    private activedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.destroySub$ = new Subject<boolean>()
  }

  ngOnInit(): void {
    this.footballUpdateService.pageTitle$.next('Fixture Face To Face')
    this.footballUpdateService.errorMsgs$.next(null)

    this.activedRouter.params.pipe(takeUntil(this.destroySub$)).subscribe((params) => {
      if (params['country-name'] && params['team-id']) {
        this.countryName = params['country-name']
        this.teamId = params['team-id']
        this.loadFixtureFaceToFace()
      }
    })
  }

  ngOnDestroy(): void {
    this.destroySub$.next(true)
  }

  loadFixtureFaceToFace(): void {
    this.loadingFixtures = true
    const season = new Date().getFullYear().toString()
    this.footballService
      .getFixtureFaceToFace(season, '10', this.teamId)
      .pipe(
        take(1),
        takeUntil(this.destroySub$),
        catchError((e) => {
          this.loadingFixtures = false
          this.footballUpdateService.errorMsgs$.next(['Something goes wrong!'])
          throw e
        })
      )
      .subscribe((fixtureFaceToFace) => {
        this.loadingFixtures = false
        this.fixtureFaceToFace = fixtureFaceToFace
      })
  }

  goBack(): void {
    this.footballUpdateService.countrySelected$.next(this.countryName)
    this.router.navigate(['football-updates'])
  }
}
