import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    public user;

    public email: string;
    public password: string;

  constructor(public navCtrl: NavController,
  public http: Http,
  public alertCtrl: AlertController,
  public loadingCtrl:LoadingController) {

  }

    signIn() {
        this.navCtrl.push(RegisterPage);
    }

    doLogin() {
        let loader = this.loadingCtrl.create({
            content: "Validando, aguarde...",
        });
        loader.present();
        let hash = btoa(this.email+":"+this.password);
        console.log(hash);
        this.http.get('http://localhost:8080/goid/validate/'+hash)
        .map(res => res.text())
       .toPromise().then(user => {
           this.user = user;
           this.navCtrl.setRoot(HomePage,{'user': user});
           loader.dismiss();
        }, err =>{
            console.log(err);

            loader.dismiss(); 

            this.alertCtrl.create({
                title: 'Falha no login',
                buttons: [{ text: 'Ok' }],
                subTitle: 'Não foi possível fazer o login com os dados enviados.' 
            }).present();
        })
    }
}
