import { Player } from "./player.js";
import { server } from "./server.js";
export class Game {
    /**
     * Constructor for Game class
     * @param {Player[]} players Players to add to the game
     */
    constructor(players) {
        this.players = players;
        this.playersTurn = new PlayerTurnQueue(this.players);

        this.initPlayers();
        console.log("A game has started!");
        this.giveTurn(this.playersTurn.currentTurn());
    }

    /**
     * Send Player info to all players in this game.
     */
    initPlayers() {
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
    announcePlayerLeft(left) {
        if (this.players.filter(p => { return p.dead == false && p.left == false; }).length <= 1) {
            this.gameOver();
            return;
        }
        if (this.playersTurn.currentTurn() == left) {
            this.playersTurn.nextTurn();
        }
        this.playersTurn.removePlayer(left);
        this.players.forEach((player) => {
            if (player.left == false) {
                player.sendMessage({ type: 'playerLeft', data: left.playerNumber });
            }
        });
    }
    /**
     * @param {Player} turn Player whose turn it is.
     */
    giveTurn(turn) {
        this.players.forEach((player) => {
            if (player.left == false) {
                player.sendMessage({ type: 'playerTurn', data: turn.playerNumber });
            }
        });
    }

    gameOver() {
        let won = {player: -1, points: -1};
        this.players.forEach((player)=>{
            if(player.points > won.points){
                won.player = player.playerNumber;
                won.points = player.points;
            }
        });
        this.players.forEach(p => {
            if (p.left == false) {
                p.sendMessage({ type: 'gameOver', data: won});
                p.playing = false;
                p.game = null;
                p.points = 0;
            }
        });
        let index = server.games.indexOf(this);
        if (index != -1) {
            server.games.splice(index, 1);
        }
        this.players = null;
    }
}

class PlayerTurnQueue {
    constructor(players) {
        this.list = [];
        players.forEach(player => {
            this.list.push(player);
        });
    }
    /**
     * Check if queue is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.list.length == 0;
    }
    /**
     * Get player who's turn it is
     * @returns {Player}
     */
    currentTurn() {
        if (!this.isEmpty()) {
            return this.list[0];
        } else {
            return null;
        }
    }

    /**
     * Give the turn to the next player
     * @returns {Player}
     */
    nextTurn() {
        if (!this.isEmpty()) {
            this.list.push(this.list[0]);
            this.list.splice(0, 1);
            return this.list[0];
        } else {
            return null;
        }
    }

    /**
     * Remove player from turn queue
     * @param {Player} player
     */
    removePlayer(player) {
        if (!this.isEmpty()) {
            let index = this.list.indexOf(player);
            if (index != -1) {
                this.list.splice(index, 1);
            }
        }
    }
}