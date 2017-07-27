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
        this.reset();
    }

    reset(){
        this.rooms = [];
        this.messages  = [];
        this.Users = [];
        this.getChats();
    }


    getChats(){

        let hash = this.user.token;
        let header: Headers = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Basic '+ hash);
        let options = new RequestOptions({headers: header});
        this.http.get('http://localhost:8081/goroom/user/'+ this.user.id, options)
        .map(res => res.text())
        .toPromise().then(rooms => {
            if(rooms.length>4){
                JSON.parse(rooms).forEach(element => {
                    this.getMessages(element);
                    this.getContacts(element.users.toString())
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

    add(){
        let prompt = this.alertCtrl.create({
        title: 'Novo Chat',
        message: "Digite o nome do chat",
        inputs: [
            {
            name: 'name',
            placeholder: 'Nome'
            },
        ],
        buttons: [
            {
            text: 'Cancelar',
            handler: data => {
                console.log('Cancel clicked');
            }
            },
            {
            text: 'Criar',
            handler: data => {
                console.log(data.name.replace(/\s/g,''));
                let room : Room = new Room({name: data.name, tag:"@"+data.name.replace(/\s/g,'')});
                let hash = this.user.token;
                let header: Headers = new Headers();
                header.append('Content-Type', 'application/json');
                header.append('Authorization', 'Basic '+ hash);
                let options = new RequestOptions({headers: header});
                this.http.post('http://localhost:8081/goroom', room, options)
                    .map(res => res.text())
                    .toPromise().then(data => {
                    this.reset();
                    }, err =>{
                        console.log(err);
                        this.alertCtrl.create({
                            title: 'Falha no login',
                            buttons: [{ text: 'Ok' }],
                            subTitle: 'Não foi possível fazer o login com os dados enviados.' 
                        }).present();
                    });
            }
            }
        ]
        });
        prompt.present();
  }

  busca(){
    let prompt = this.alertCtrl.create({
    title: 'Adicionar Chat',
    message: "Digite o tag do chat",
    inputs: [
            {
            name: 'tag',
            placeholder: 'Tag'
            },
        ],
    buttons: [
            {
            text: 'Cancelar',
            handler: data => {
                console.log('Cancel clicked');
            }
            },
            {
            text: 'Adicionar',
            handler: data => {
                let hash = this.user.token;
                let header: Headers = new Headers();
                header.append('Content-Type', 'application/json');
                header.append('Authorization', 'Basic '+ hash);
                let options = new RequestOptions({headers: header});
                this.http.post('http://localhost:8081/goroom/'+data.tag+"/users", null,options)
                    .map(res => res.text())
                    .toPromise().then(data => {
                    this.reset();
                    }, err =>{
                        console.log(err);
                        this.alertCtrl.create({
                            title: 'Falha no login',
                            buttons: [{ text: 'Ok' }],
                            subTitle: 'Não foi possível fazer o login com os dados enviados.' 
                        }).present();
                    });
            }
        }
    ]
    });
    prompt.present();
  }
    

}
