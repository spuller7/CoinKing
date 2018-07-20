import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuySellPage } from './buy-sell';

@NgModule({
  declarations: [
    BuySellPage,
  ],
  imports: [
    IonicPageModule.forChild(BuySellPage),
  ],
})
export class BuySellPageModule {}
