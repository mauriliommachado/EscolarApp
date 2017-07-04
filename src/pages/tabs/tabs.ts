import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Component } from '@angular/core';
import { NavController,NavParams,AlertController,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  public params
  public user;
  public rooms;

  constructor(public navCtrl: NavController,
  public paramCtrl: NavParams) {
      this.user = JSON.parse(paramCtrl.get('user'));
      this.params = paramCtrl.data;
  }
}
