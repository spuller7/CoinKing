import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortfolioNamePage } from './portfolio-name';

@NgModule({
  declarations: [
    PortfolioNamePage,
  ],
  imports: [
    IonicPageModule.forChild(PortfolioNamePage),
  ],
})
export class PortfolioNamePageModule {}
