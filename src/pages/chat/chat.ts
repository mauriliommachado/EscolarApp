import { NavController,NavParams,AlertController,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Room } from '../../domain/chat/room'
import { User } from '../../domain/chat/user'
import { Message } from '../../domain/chat/message'
import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { NomePipe } from '../chat/nomePipe'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  @ViewChild(Content) content: Content;

  public room : Room;
  public users : User[];
  public User;
  public message: string;

  constructor(public navCtrl: NavController,
  public paramCtrl: NavParams,
  public alertCtrl: AlertController,
  public loadingCtrl:LoadingController,
  public http: Http) {
    this.room = paramCtrl.get('room');
    this.users = paramCtrl.get('users');
    this.User = paramCtrl.get('user');
  }

  ionViewDidEnter(){
    this.content.scrollToBottom();
    var ws = new WebSocket("ws://admin:admin@localhost:8083/echo?token="+this.User.token);
    let room = this.room;
    ws.onopen = function() {
    };

    ws.onclose = function() {};

    ws.send = function() {};

    ws.onerror = function() {};
    let scroll = this.scrollToBottom;
    let content = this.content;
    let id = this.User.id;
    ws.onmessage = function(event) {
      let msg : Message = new Message(JSON.parse(event.data));
      if(msg.createdBy==id){
        return;
      }
      room.Messages.push(msg);
      scroll(content);
    };
  }

  send(){
    if(!this.message){
      return;
    }
    let msg : Message = new Message({text: this.message,createdBy:this.User.id,createdIn:new Date()});
    let hash = this.User.token;
    let header: Headers = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'Basic '+ hash);
    let options = new RequestOptions({headers: header});
    this.http.post('http://localhost:8082/goxchange/'+this.room.Id+'/messages',msg , options)
        .map(res => res.text())
        .toPromise().then(data => {
          this.room.Messages.push(msg);
          this.message='';
          this.scrollToBottom(this.content);
        }, err =>{
            console.log(err);
            this.alertCtrl.create({
                title: 'Falha no login',
                buttons: [{ text: 'Ok' }],
                subTitle: 'Não foi possível fazer o login com os dados enviados.' 
            }).present();
        });
  }

    scrollToBottom(content) {
        setTimeout(() => {
            content.scrollToBottom();
        });
    }

    addUser(){
      console.log('addUser');
    }

}
