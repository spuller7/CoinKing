import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  transactionHistory = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _transactions: DatabaseProvider) {
    this.getTransactionHistory();
  }

  getTransactionHistory()
  {
    this._transactions.readTransactionTable().then((res) => {
      this.transactionHistory = res;
    });
  }

}
