import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import * as $ from 'jquery';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-donate',
  templateUrl: 'donate.html',
})
export class DonatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private clipboard: Clipboard, public toastCtrl: ToastController) {

  }

  copyBitcoinAddress()
  {
    this.clipboard.copy($("#bitcoinAddress").text());
    this.presentToast();
  }
  copyEthereumAddress()
  {
    this.clipboard.copy($("#ethereumAddress").text());
    this.presentToast();
  }
  copyBitcoinCashAddress()
  {
    this.clipboard.copy($("#bitcoinCashAddress").text());
    this.presentToast();
  }
  copyLitecoinAddress()
  {
    this.clipboard.copy($("#litecoinAddress").text());
    this.presentToast();
  }
  copyDashAddress()
  {
    this.clipboard.copy($("#dashAddress").text());
    this.presentToast();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Address Copied to Clipboard',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}
