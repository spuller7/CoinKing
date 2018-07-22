import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController, AlertController } from 'ionic-angular';
import * as $ from 'jquery';

/**
 * Generated class for the WatchlistConfigurationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-watchlist-configuration',
  templateUrl: 'watchlist-configuration.html',
})
export class WatchlistConfigurationPage {

	objectKeys = Object.keys;
	selectedCoins : any;
	raw = [];
	selected = [];
	allcoins:any;
  coins: any;
  coinsOwned = [];

	constructor(private _data: DataProvider, private alertCtrl: AlertController, public loading: LoadingController, private storage: Storage, public navCtrl: NavController, public navParams: NavParams, private _transactions: DatabaseProvider) {
  }

  ionViewDidLoad() {
	  let loader = this.loading.create({
		  content: 'Loading Coins..',
		  spinner: 'crescent'
	  });

    this.storage.get('storedCoins').then((val) => {
      this.selectedCoins = val;
    });
      loader.present().then(() => {
        

        this._data.allCoins()
          .subscribe(res => {
            this.raw = res['data'];
            this.allcoins = res['data'];
            this.coins = this.objectKeys(this.allcoins);
            loader.dismiss();

            this.selected = this.selectedCoins.Coins.map(a => a.symbol);
            this.getCoinHoldings();
          })
      });
    }

    getCoinHoldings()
    {
      let coinsHeld = this._transactions.getOwnedCoinAmount();
      this.coinsOwned = [];
      coinsHeld.then((res) => {
        this.coinsOwned = res;
      });
    }

    coinSelect(coin, name, id)
    {
      if($.inArray(coin, this.selected) != -1)
      {
        if(this.coinsOwned[coin] > 0)
        {
          let alert = this.alertCtrl.create({
            title: 'Erase Holdings',
            message: "Seems you have holdings in this coin. Removing this coin will remove the coin's transaction history. Would you still like to proceed?",
            buttons: [
              {
                text: 'No, Keep Coin',
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: 'Yes, Remove Coin',
                handler: () => {
                  this._transactions.removeCoinData(coin);
                  this.removeCoin(coin);
                }
              }
            ]
          });
          alert.present();
        }
        else
        {
          this.removeCoin(coin);
        }
      }
      else
      {
        let imageURL = "https://s2.coinmarketcap.com/static/img/coins/16x16/" + id + ".png";
        this._data.getCoinID(coin).subscribe(res => {
          let ccID = res['Data'][coin]['Id'];
          this.addCoin(coin, name, imageURL, ccID);
        });
      }
    }

    addCoin(coin, name, imageURL, ccID)
    {
      
      var selectedCoin = this._data.createCoinObject(name, coin, imageURL, ccID)
      this.selectedCoins.Coins.push(selectedCoin);
      this.storage.set('storedCoins', this.selectedCoins);
      this.selected = this.selectedCoins.Coins.map(a => a.symbol);
    }

    removeCoin(coin)
    {
      for(var i = 0; i < this.selectedCoins.Coins.length; i += 1) {
        if(this.selectedCoins.Coins[i].symbol === coin) {
          this.selectedCoins.Coins.splice(i, 1);
          this.storage.set('storedCoins', this.selectedCoins);
        }
      }
      const index = this.selected.indexOf(coin);
      this.selected.splice(index, 1);

    }

    searchCoins(ev: any) {

      let val = ev.target.value;
      let allcoins = this.raw;
      let filteredList = [];
      if (val && val.trim() != '') 
      {  
        for(var i = 0; i< allcoins.length; i++)
        {
          if (allcoins[i].symbol.includes(val.toUpperCase()) || allcoins[i].name.toUpperCase().includes(val) || allcoins[i].name.includes(val.toUpperCase())) {
            filteredList.push(i);
          }
        }
      }
      else
      {
        filteredList = this.objectKeys(this.allcoins);
      }
      this.coins = (filteredList);
    }
}

