import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PortfolioNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-portfolio-name',
  templateUrl: 'portfolio-name.html',
})
export class PortfolioNamePage {

  formgroup : FormGroup;
  portfolioName = "";
  name : AbstractControl;

  constructor(private view: ViewController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage)
  {
    this.portfolioName = this.navParams.get('data').portfolioName;

    this.formgroup = formBuilder.group({
      name : [ , Validators.required]
    });

    this.name = this.formgroup.controls['name'];
  }

  portfolioNameChange()
  {
    this.storage.set('portfolioName', this.name.value);
    this.view.dismiss(this.name.value);
  }

}
