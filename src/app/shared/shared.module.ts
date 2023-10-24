import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { LoadingComponent } from './components/loading/loading.component'
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component'

@NgModule({
  declarations: [LoadingComponent, PageNotFoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [LoadingComponent],
})
export class SharedModule {}
