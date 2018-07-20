import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { List } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { DataProvider } from '../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  currency = "";
  logo = "";
  portfolioName = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private storage: Storage, private _data: DataProvider) {
    this.updateCurrency();
    this.updatePortfolioName();
  }

  changeCurrency()
  {
    const currencyData = {
      currency : this.currency
    }

    const currencyPage = this.modalCtrl.create('CurrencyPage', {data: currencyData});

    currencyPage.present();

    currencyPage.onDidDismiss((currency) => {
      this.updateCurrency(currency) ;
    });
  }

  changePortfolioName()
  {
    const portfolioName = {
      currency : this.portfolioName
    }

    const portfolioNamePage = this.modalCtrl.create('PortfolioNamePage', {data: portfolioName});

    portfolioNamePage.present();

    portfolioNamePage.onDidDismiss((portfolioName) => {
      $("#menuName").text(portfolioName);
      this.updatePortfolioName() ;
    });
  }

  updateCurrency(currency = null)
  {
      this._data.updateCurrency();
      if(currency == null)
      {
        this.currency = this._data.currency;
      }
      else
      {
        this.currency = currency;
      }

      if(this.currency == "Euro")
      {
        this.logo = "logo-euro";
      }
      else if(this.currency == "Bitcoin")
      {
        this.logo = "logo-bitcoin";
      }
      else
      {
        this.logo = "logo-usd";
      }
  }

  updatePortfolioName()
  {
    this.storage.get('portfolioName').then((val) => {
        if(!val)
        {
          this.storage.set('portfolioName', 'Your Portfolio');
        }
        else
        {
          this.portfolioName = val;
        }
    });
  }

}
