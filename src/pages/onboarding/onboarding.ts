import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Skip";

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  skip()
  {
    this.storage.set('usedAppBefore', true);
    this.navCtrl.setRoot(HomePage);
  }

  slideChanged()
  {
    if(this.slides.isEnd())
    {
      this.skipMsg="Alright, let's get started!"; 
    }
  }
}
