import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user;

  constructor(public navCtrl: NavController, public paramCtrl: NavParams, public alertCtrl: AlertController) {
      this.user = JSON.parse(paramCtrl.get('user'));
      this.alertCtrl.create({
                title: 'Bem vindo!',
                buttons: [{ text: 'Ok' }],
                subTitle: this.user.name
            }).present();
  }

}
