import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { LastUpdateComponent } from './components/last-update/last-update.component'
import { LoadingComponent } from './components/loading/loading.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

@NgModule({
  declarations: [LoadingComponent, PageNotFoundComponent, LastUpdateComponent],
  imports: [CommonModule, RouterModule],
  exports: [LoadingComponent, LastUpdateComponent],
})
export class SharedModule {}
