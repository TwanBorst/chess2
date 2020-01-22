import { server } from "./server.js"
import WebSocket from "ws";
import { Lobby } from "./lobby.js";
import { Game } from "./game.js";

export class Player {
    /**
     * Constructor for Player class
     * @param {WebSocket} socket Players websocket
     * @param {String} playerID Players name
     * @param {Lobby} lobby Players lobby
     */
    constructor(socket, playerID = null, lobby = null) {
        this.socket = socket
        this.lobby = lobby
        this.game = null;

        // TODO: Replace playerID by an unique id and add playerName which are loaded from db
        // Stats
        this.playerID = playerID;
        this.totalPoints = 0; // TODO: Grab totalPoints value from database

        // Status
        this.playing = false;

        // Game
        this.playerNumber = 0;
        this.points = 0;
        this.left = false;
        this.dead = false;

        // Events
        this.socket.addEventListener('close', (evt) => { this.playerLeft.apply(this, [evt]) });
        this.socket.addEventListener('message', (evt) => { this.socketMessageReceived.apply(this, [evt]) });
    }

    /**
     * Send a message to the player
     * @param {Object} object
     * @param {String} object.type The type of data that message will contain
     * @param {Object} object.data The data the message will contain
     */
    sendMessage(object) {
        this.socket.send(JSON.stringify(object));
    }

    /**
     * Join this lobby.
     * @param {Lobby} lobby 
     */
    joinLobby(lobby) {
        console.log("Player '" + this.playerID + "' joined lobby '" + lobby.id + "'.");
        this.lobby = lobby;
        lobby.addPlayer(this);
    }

    /**
     * Join this game.
     * @param {Game} game 
     */
    joinGame(game) {
        this.lobby.removePlayer(this);
        this.lobby = null;
        this.game = game;
        this.playing = true;
        this.points = 0;
        this.left = false;
        this.dead = false;
    }

    /**
     * Fired when this player's socket closes.
     * @param {CloseEvent} evt 
     */
    playerLeft(evt) {
        server.removePlayer(this);
        if (this.lobby != null) {
            this.lobby.removePlayer(this);
        }
        if (this.game != null) {
            this.left = true;
            this.playing = false;
            if(this.dead==false){
                this.game.announcePlayerLeft(this);
            }
        }
    }

    /**
     * Fired when server receives message from this players socket
     * @param {MessageEvent} evt
     */
    socketMessageReceived(evt) {
        let message = JSON.parse(evt.data);
        if (message.type == undefined || message.data == undefined) {
            return;
        }
        if (message.type == "lobby" && message.data.length != 0) {
            if (message.data == "public") {
                // Public lobby
                let publicLobby = server.getLobby("public");

                if (publicLobby == null) {
                    console.error("Public lobby is gone!");
                    // TODO: We still need to handle the response to the player..
                    return;
                }
                this.joinLobby(publicLobby);
            } else {
                let lobby = server.getLobby(message.data);
                if (lobby == null) {
                    lobby = server.addLobby(message.data);
                }
                this.joinLobby(lobby);
            }
        } else if (message.type == "move") {
            if (this.game == null) {
                return;
            }
            this.game.players.forEach((player) => {
                if (player != this) {
                    player.sendMessage({ type: 'move', data: { player: this.playerNumber, move: message.data } });
                }
            });
            this.game.giveTurn(this.game.playersTurn.nextTurn());
        } else if (message.type == "checkmate") {
            if (this.game == null) {
                return;
            }
            this.game.players.forEach((player)=>{
                if(player != this){
                    if(message.data.players.includes(this.playerNumber)){
                        this.points += 20;
                    }
                    player.sendMessage({type: 'checkmate', data: {checkmate: message.data.checkmate, players: message.data.players}});
                }
            });
            this.dead = true;
            if(this.game.players.filter(p=>{return p.dead==false&&p.left==false;}).length>1){
                this.game.giveTurn(this.game.playersTurn.nextTurn());
                this.game.playersTurn.removePlayer(this);
            } else {
               this.game.gameOver();
            }
        } else if (message.type == "replace") {
            if (this.game == null) {
                return;
            }
            this.game.players.forEach((player)=>{
                if(player != this){
                    player.sendMessage({type: 'replace', data: {player: this.playerNumber, tile: message.data.tile, type: message.data.type}});
                }
            });
        }
    }
    toClient() {
        return { name: this.playerID, totalPoints: this.totalPoints };
    }
}