import {server} from "./server.js";
export class Lobby{
    constructor(id){
        this.id = id;
        this.players = new Queue();
    }
    addPlayer(player){
        this.players.enqueue(player);
        if(this.players.length()>=4){
            server.addGame([this.players.dequeue(), this.players.dequeue(), this.players.dequeue(), this.players.dequeue()]);
        }
    }
}

class Queue{
    constructor(){
        this.list = [];
    }
    enqueue(obj){
        this.list.push(obj);
    }
    dequeue(){
        if(!this.isEmpty()){
            return this.list.shift();
        } else {
            return null;
        }
    }
    isEmpty(){
        return this.list.length == 0;
    }
    length(){
        return this.list.length;
    }
}