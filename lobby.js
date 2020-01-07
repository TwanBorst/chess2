import {server} from "./server.js";
import { Player } from "./player.js";
export class Lobby{
    /**
     * Constructor for Lobby class.
     * @param {String} id The name of the lobby
     */
    constructor(id){
        this.id = id;
        this.players = new Queue();
    }

    /**
     * Add player to this lobby.
     * @param {Player} player Player to add to the lobby
     */
    addPlayer(player){
        this.players.enqueue(player);
        if(this.players.length()>=4){
            server.addGame([this.players.dequeue(), this.players.dequeue(), this.players.dequeue(), this.players.dequeue()]);
        }
    }

    /**
     * Remove a player from this lobby
     * @param {Player} player Player to remove from this lobby
     */
    removePlayer(player){
        let index = this.players.list.indexOf(player);
        if(index!=-1){
            this.players.list.splice(index, 1);
        }
    }
}

class Queue{
    constructor(){
        this.list = [];
    }

    /**
     * Add player to queue.
     * @param {Player} player Player to add to the queue
     */
    enqueue(player){
        this.list.push(player);
    }

    /**
     * Get first player from the queue
     * @returns {Player} First player in the queue
     */
    dequeue(){
        if(!this.isEmpty()){
            return this.list.shift();
        } else {
            return null;
        }
    }

    /**
     * Check if the queue is empty
     * @returns {boolean}
     */
    isEmpty(){
        return this.list.length == 0;
    }

    /**
     * Size of the queue
     * @returns {Number}
     */
    length(){
        return this.list.length;
    }
}