import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';

/**
 * Generated class for the MarketCapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-market-cap',
  templateUrl: 'market-cap.html',
})
export class MarketCapPage {

  marketCapListData = [];
  marketCapListDataFormatted = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public _data: DataProvider, public storage: Storage) {
    this.storage.get("storedCoins").then(val => {
      this.loadMarketCapList(val);
    });
  }

  loadMarketCapList(storedCoins, start = 0, topTen = 0)
  {
    let coinsInTopTen = topTen;
    let storedCoinSymbols = storedCoins.Coins.map((a) => (a.symbol));
    this._data.getCoinMarketCapList(start).subscribe((val:any) => {
      /*Object.size = function(obj) {
          var size = 0, key;
          for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
          }
          return size;
      };*/

      for(var key in val.data)
      {
        if($.inArray(val.data[key].symbol, storedCoinSymbols) != -1 || val.data[key].rank <= 10)
        {
          if(val.data[key].rank <= 10 && $.inArray(val.data[key].symbol, storedCoinSymbols) != -1)
          {
            coinsInTopTen++;
          }

          let marketcap = val.data[key].quotes[("" + this._data.currencySymbol) + ""].market_cap;
          marketcap = marketcap/1000000000;

          let coinDetails = {
            'symbol': val.data[key].symbol,
            'rank': val.data[key].rank,
            'marketcap': marketcap,
            'price': val.data[key].quotes[("" + this._data.currencySymbol) + ""].price,
            'percentchange': val.data[key].quotes[("" + this._data.currencySymbol) + ""].percent_change_24h,
            'imageURL': "https://s2.coinmarketcap.com/static/img/coins/16x16/" + val.data[key].id + ".png"}

          this.marketCapListData.push(coinDetails);
          this.marketCapListData.sort((itemA, itemB) => {
            if (itemA.rank < itemB.rank)
            {
              return -1;
            }
            if (itemA.rank > itemB.rank)
            {
              return 1;
            }
            return 0;
          });
        }
      }
      console.log(this.marketCapListData.length + ' ' + (storedCoinSymbols.length + (10 - coinsInTopTen)));
      if(this.marketCapListData.length != storedCoinSymbols.length + (10 - coinsInTopTen))
      {
        this.loadMarketCapList(storedCoins, start + 100, coinsInTopTen);
      }
    });
  }

}
