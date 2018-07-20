import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the BuySellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buy-sell',
  templateUrl: 'buy-sell.html',
})
export class BuySellPage {

  formgroup : FormGroup;
  amount : AbstractControl;
  date : AbstractControl;
  price : AbstractControl;
  coin: CharacterData;
  coinName: Object;
  type: string;
  transactionHistory: any;

  constructor(public loading: LoadingController, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private _data: DataProvider, private _transactions: DatabaseProvider) {
    this.coin = navParams.get('coin');
    this.coinName = navParams.get('name');
    this.type = navParams.get('type');
    var currentPrice = navParams.get('currentPrice');

    this.formgroup = formBuilder.group({
      amount : [ , Validators.required],
      price : [currentPrice, Validators.required],
      date : [new Date().toISOString(), Validators.required]
    });

    this.amount = this.formgroup.controls['amount'];
    this.price = this.formgroup.controls['price'];
    this.date = this.formgroup.controls['date'];
  }

  ionViewDidLoad()
  {
    //this.storage.remove('transactionHistory');

    this.storage.get('transactionHistory').then((val) => {
      if(!val)
      {
        //Create first instance of Transaction History storage
        var transactionObject = { 'transactions' : [] };
        this.transactionHistory = transactionObject;
        this.storage.set("transactionHistory", this.transactionHistory);
      }
      else
      {
        this.transactionHistory = val;
      }
    });
  }

  addTransaction()
  {
    let loader = this.loading.create({
			content: 'Saving Transaction..',
			spinner: 'crescent'
		});

    loader.present().then(() => {
      var date = new Date(this.date.value);
      var today = Math.round((new Date()).getTime() / 1000);
      this._transactions.insertNewTransaction(today, this.coin, this.type, Math.round(date.getTime() / 1000), this.amount.value, this.price.value);
      var newTransaction = this._data.createTransactionData(this.coin, this.type, this.date.value, parseInt(this.amount.value), this.price.value);
      this.transactionHistory.transactions.push(newTransaction);
      this.storage.set('transactionHistory', this.transactionHistory);
      loader.dismiss();

      this.navCtrl.pop();

     });
  }
}
