import {Player} from "./player.js";
import { server } from "./server.js";
export class Game {
    /**
     * Constructor for Game class
     * @param {Player[]} players Players to add to the game
     */
    constructor(players) {
        this.players = players;
        this.playersTurn = new CLinkedList(this.players);

        this.initPlayers();
        console.log("A game has started!");
        this.giveTurn(this.playersTurn.current.element);
    }

    /**
     * Send Player info to all players in this game.
     */
    initPlayers(){
        this.players.forEach((player, index) => {
            player.joinGame(this);
            let toSend = player.toClient();
            player.playerNumber = toSend.playerNumber = index + 1;
            toSend.you = true;
            player.sendMessage({ type: 'addPlayer', data: toSend });
        });
        this.players.forEach((player, index) => {
            let toSend = player.toClient();
            toSend.playerNumber = index + 1;
            toSend.you = false;
            this.players.forEach((e) => {
                if (player != e) {
                    e.sendMessage({ type: 'addPlayer', data: toSend });
                }
            });
        });
    }
    /**
     * @param {Player} left Player who left.
     */
    announcePlayerLeft(left){
        if(this.players.filter(p=>{return p.dead==false&&p.left==false;}).length<=1){
            this.gameOver();
            return;
        }
        if(this.playersTurn.current!=null&&this.playersTurn.current.element==left){
            this.playersTurn.getNext();
        }
        this.players.forEach((player)=>{
            if(player.left==false){
                player.sendMessage({type: 'playerLeft', data: left.playerNumber});
            }
        });
    }
    /**
     * @param {Player} turn Player whose turn it is.
     */ 
    giveTurn(turn){
        this.players.forEach((player)=>{
            if(player.left==false){
                player.sendMessage({type: 'playerTurn', data: turn.playerNumber});
            }
        });
    }

    gameOver(){
        this.players.forEach(p=>{
            if(p.left==false){
                p.sendMessage({type: 'gameOver', data: {}});
                p.playing = false;
                p.game = null;
                p.points = 0;
            }
        });
        let index = server.games.indexOf(this);
        if(index!=-1){
            server.games.splice(index, 1);
        }
        this.players = null;
    }
}
class CLinkedList {
    /**
     * @param {Player[]} elements All players in the CLinkedList
     */
    constructor(elements) {
        this.head = null;
        this.tail = null;
        this.current = null;
        elements.forEach(element => {
            this.add(element);
        });
    }
    
    /**
     * Add a player to the list
     * @param {Player} element 
     */
    add(element) {
        if (this.head == null) {
            this.current = this.head = this.tail = new Node(element);
            this.head.next = this.head;
            this.head.previous = this.head;
        } else {
            this.tail.next = new Node(element);
            this.tail.next.previous = this.tail;
            this.tail = this.tail.next;
            this.tail.next = this.head;
        }
    }

    /**
     * Remove a player from the list
     * @param {Player} element 
     */
    remove(element) {
        if (this.head != null) {
            let e = this.current;
            do {
                if (e.element == element) {
                    if (this.current == e) {
                        this.current = this.current.next;
                    }
                    e.previous.next = e.next;
                    e.next.previous = e.previous;
                    return e;
                } else {
                    e = e.next;
                }
            } while (e != this.current);
        }
    }
    /**
     * Get the next player in the turn list.
     * @returns {Node}
     */
    getNext() {
        this.current = this.current.next;
        return this.current;
    }
}
class Node {
    /**
     * @param {Player} element 
     */
    constructor(element) {
        this.previous = null;
        this.next = null;
        this.element = element;
    }
}