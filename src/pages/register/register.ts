import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Headers, RequestOptions } from '@angular/http';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

    public user;
    
    public name: string;
    public email: string;
    public password: string;

  constructor(public navCtrl: NavController,
  public http: Http,
  public alertCtrl: AlertController,
  public loadingCtrl:LoadingController) {

  }

    doRegister() {
        let loader = this.loadingCtrl.create({
            content: "Criando usuário, aguarde...",
        });
        loader.present();
        let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic YWRtaW46YWRtaW4=');
        let options = new RequestOptions({headers: header});
        this.user = {name : this.name,email: this.email, pwd: this.password};
        this.http.post('http://localhost:8080/goid',this.user,options)
        .map(res => res.text())
       .toPromise().then(data => {
           loader.dismiss();
           this.doLogin();
        }, err =>{
            console.log(err);

            loader.dismiss(); 

            this.alertCtrl.create({
                title: 'Falha no cadastro',
                buttons: [{ text: 'Ok' }],
                subTitle: 'Não foi possível fazer o cadastro com os dados enviados.' 
            }).present();
        })
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
           this.navCtrl.setRoot(TabsPage,{'user': user});
           loader.dismiss();
        }, err =>{
            console.log(err);

            loader.dismiss(); 

            this.alertCtrl.create({
                title: 'Falha no login',
                buttons: [{ text: 'Ok' }],
                subTitle: 'Não foi possível fazer o login com os dados enviados.' 
            }).present();
        });
    }
}
