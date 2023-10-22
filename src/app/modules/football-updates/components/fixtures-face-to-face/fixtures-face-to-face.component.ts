import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { take } from 'rxjs'
import { FootballDataService } from '../../../../services/football-data.service'
import { FixturesFaceToFace } from '../../../../shared/interfaces/fixtures-face-to-face.interface'

@Component({
  selector: 'app-fixtures-face-to-face',
  templateUrl: './fixtures-face-to-face.component.html',
  styleUrls: ['./fixtures-face-to-face.component.scss'],
})
export class FixturesFaceToFaceComponent implements OnInit {
  public title = 'Fixture Face To Face'
  public fixtureFaceToFace: FixturesFaceToFace[] = []
  private teamId: number = 0

  constructor(
    private activedRouter: ActivatedRoute,
    private router: Router,
    private footBallService: FootballDataService
  ) {}

  ngOnInit(): void {
    this.activedRouter.params.subscribe((params) => {
      if (params['teamId']) {
        this.teamId = params['teamId']
        this.loadFixtureFaceToFace()
      }
    })
  }

  loadFixtureFaceToFace(): void {
    const season = new Date().getFullYear().toString()
    this.footBallService
      .getFixtureFaceToFace(season, '10', this.teamId)
      .pipe(take(1))
      .subscribe((fixtureFaceToFace) => {
        this.fixtureFaceToFace = fixtureFaceToFace
      })
  }

  goBack(): void {
    this.router.navigateByUrl('football-updates')
  }
}
