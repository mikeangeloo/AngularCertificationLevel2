import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { take } from 'rxjs'
import { FootballDataService } from '../../../../services/football-data.service'
import { FootballUpdatesService } from '../../../../services/football-updates.service'
import { FixturesFaceToFace } from '../../../../shared/interfaces/fixtures-face-to-face.interface'

@Component({
  selector: 'app-fixtures-face-to-face',
  templateUrl: './fixtures-face-to-face.component.html',
  styleUrls: ['./fixtures-face-to-face.component.scss'],
})
export class FixturesFaceToFaceComponent implements OnInit {
  public fixtureFaceToFace: FixturesFaceToFace[] = []

  private teamId: number = 0
  private countryName: string = ''

  constructor(
    public footballUpdateService: FootballUpdatesService,
    private footballService: FootballDataService,
    private activedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.footballUpdateService.pageTitle.next('Fixture Face To Face')

    this.activedRouter.params.subscribe((params) => {
      if (params['country-name'] && params['team-id']) {
        this.countryName = params['country-name']
        this.teamId = params['team-id']
        this.loadFixtureFaceToFace()
      }
    })
  }

  loadFixtureFaceToFace(): void {
    const season = new Date().getFullYear().toString()
    this.footballService
      .getFixtureFaceToFace(season, '10', this.teamId)
      .pipe(take(1))
      .subscribe((fixtureFaceToFace) => {
        this.fixtureFaceToFace = fixtureFaceToFace
      })
  }

  goBack(): void {
    this.footballUpdateService.countrySelected.next(this.countryName)
    this.router.navigate(['football-updates'])
  }
}
