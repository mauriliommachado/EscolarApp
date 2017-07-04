import { Component } from '@angular/core';
import { NavController,NavParams,AlertController,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user;
  public rooms : Room[] = [];
  public messages: Message[] = [];


  constructor(public navCtrl: NavController,
  public paramCtrl: NavParams,
  public alertCtrl: AlertController,
  public loadingCtrl:LoadingController,
  public http: Http) {
    this.user = JSON.parse(paramCtrl.get('user'));
    this.getChats();
  }

  getChats(){
    let loader = this.loadingCtrl.create({
        content: "Carregando chats, aguarde...",
    });
    loader.present();
    let hash = this.user.token;
    let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic '+ hash);
        let options = new RequestOptions({headers: header});
    this.http.get('http://localhost:8081/goroom/user/'+ this.user.id, options)
    .map(res => res.text())
    .toPromise().then(rooms => {
        JSON.parse(rooms).forEach(element => {
            this.getMessages(element);
        });
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

  getMessages(room){
    let r = new Room(room);
    let hash = this.user.token;
    let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic '+ hash);
        let options = new RequestOptions({headers: header});
    this.http.get('http://localhost:8082/goxchange/'+room.id+'/messages', options)
    .map(res => res.text())
    .toPromise().then(messages => {
        this.messages = JSON.parse(messages);
        let m = new Message(messages);
        r.Messages.push(m);
    }, err =>{
        console.log(err);
        this.alertCtrl.create({
            title: 'Falha no login',
            buttons: [{ text: 'Ok' }],
            subTitle: 'Não foi possível fazer o login com os dados enviados.' 
        }).present();
    });
    this.rooms.push(r);
  }  

}

export class Room {
  Id: string;
  Name: string;
  Tag: string;
  Pwd: string;
  CreatedBy: string;
  Users: string[];
  Messages: Message[];

  constructor(room){
    this.Id = room.id;
    this.Name=room.name;
    this.Tag = room.tag;
    this.Messages = [];
  }

}

export class Message {
  Id: string;
  Text: string;
  createdIn: string;
  Pwd: string;
  createdBy: string;

  constructor(message){
    this.Id = message.id;
    this.Text=message.text;
    this.createdIn = message.createdIn;
  }
}
