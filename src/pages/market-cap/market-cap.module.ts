import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketCapPage } from './market-cap';

@NgModule({
  declarations: [
    MarketCapPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketCapPage),
  ],
})
export class MarketCapPageModule {}
