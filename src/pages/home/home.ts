import { Component } from '@angular/core';
import { NavController,NavParams,AlertController,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Room } from '../../domain/chat/room'
import { Message } from '../../domain/chat/message'
import { User } from '../../domain/chat/user'
import { ChatPage } from '../chat/chat'
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
    public Users: User[] = [];

    constructor(public navCtrl: NavController,
    public paramCtrl: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl:LoadingController,
    public http: Http) {
        this.user = JSON.parse(paramCtrl.get('user'));
    }

    ionViewDidEnter(){
        this.rooms = [];
        this.messages  = [];
        this.Users = [];
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
                this.getContacts(element.users.toString())
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
            if(JSON.parse(messages)){
            JSON.parse(messages).forEach(message => {
                let m = new Message(message);
                r.Messages.push(m);
                r.LastMessage = new Date(m.createdIn);
            });
        }
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

    getContacts(userID: String){
        userID.trim().split(',').forEach(id => {
            let hash = this.user.token;
            let header: Headers = new Headers();
            header.append('Content-Type', 'application/json');
            header.append('Authorization', 'Basic '+ hash);
            let options = new RequestOptions({headers: header});
            this.http.get('http://localhost:8080/goid/'+id, options)
            .map(res => res.text())
            .toPromise().then(user => {
                if(JSON.parse(user)){
                    this.Users.push(JSON.parse(user));
                }
            }, err =>{
                console.log(err);
                this.alertCtrl.create({
                title: 'Falha carregamento',
                buttons: [{ text: 'Ok' }],
                subTitle: 'Não foi possível obter usuários.' 
                }).present();
            });
        });
    }  

    orderArray(){
        this.rooms = this.rooms.sort(function(a,b) { 
            return new Date(b.LastMessage).getTime() - new Date(a.LastMessage).getTime() 
        });
    }

    SelecionaSala(room: Room){
        this.navCtrl.push(ChatPage,{'room': room,'users': this.Users,'user': this.user});
    }

}
