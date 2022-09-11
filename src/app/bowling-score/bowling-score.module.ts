import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BowlingScoreComponent } from './bowling-score.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: BowlingScoreComponent }];

@NgModule({
  declarations: [BowlingScoreComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BowlingScoreModule {}
