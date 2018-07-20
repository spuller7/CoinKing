import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ListProvider } from '../../providers/list/list';
import * as $ from 'jquery';

/**
 * Generated class for the ListOptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-options',
  templateUrl: 'list-options.html'
})
export class ListOptionsComponent
{
  public list_value : any;
  text: string;

  constructor(public viewCtrl: ViewController, private _list : ListProvider)
  {
    this.list_value = _list.viewer;
  } 

  close(value)
  {
    this._list.onChange(value);
    this.viewCtrl.dismiss();
  }
}
