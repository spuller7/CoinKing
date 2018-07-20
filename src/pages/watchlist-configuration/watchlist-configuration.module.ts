import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WatchlistConfigurationPage } from './watchlist-configuration';

@NgModule({
  declarations: [
    WatchlistConfigurationPage,
  ],
  imports: [
    IonicPageModule.forChild(WatchlistConfigurationPage),
  ],
})
export class WatchlistConfigurationPageModule {}
