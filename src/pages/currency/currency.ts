import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CurrencyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-currency',
  templateUrl: 'currency.html',
})
export class CurrencyPage {

  currency = "";

  constructor(private navParams: NavParams, private view: ViewController, private storage: Storage)
  {
    
  }

  ionViewDidLoad() {
    this.currency = this.navParams.get('data').currency;
  }

  currencyChange(currency)
  {
    this.storage.set('currency', currency);
    this.view.dismiss(currency);
  }
}
