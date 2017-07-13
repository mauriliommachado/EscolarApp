export class Message {
  Id: string;
  Text: string;
  createdIn: string;
  createdBy: string;

  constructor(message){
    this.Id = message.id;
    this.Text=message.text;
    this.createdIn = message.createdIn;
    this.createdBy = message.createdBy
  }
}