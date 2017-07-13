import { Message } from '../../domain/chat/message'

export class Room {
  Id: string;
  Name: string;
  Tag: string;
  Pwd: string;
  CreatedBy: string;
  Users: string[];
  LastMessage: Date;
  Messages: Message[];

  constructor(room){
    this.Id = room.id;
    this.Name=room.name;
    this.Tag = room.tag;
    this.Messages = [];
    this.Users = room.users;
  }

}