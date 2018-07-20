import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-currency',
  templateUrl: 'currency.html',
})
export class CurrencyPage {

  currency = "";

  constructor(private navParams: NavParams, private view: ViewController, private storage: Storage, public navCtrl: NavController)
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

  closePopup() 
  {
    this.navCtrl.pop();
  }
}
