import { Player } from "./player.js";
import { Lobby } from "./lobby.js";
import { Game } from "./game.js";
import WebSocket from "ws";

class Server{
    constructor(){
        this.lobbies = {};
        this.players = Array();
        this.games = Array();

        this.addLobby("public");
        this.sendStatsInterval = setInterval(()=>{this.sendStats.apply(this)}, 4000);
    }
    /**
     * Add player to Server
     * @param {WebSocket} ws Players websocket
     * @param {String} playerID Players name
     * @param {Lobby} lobby Players lobby
     * @returns {Player} Player that was added
     */
    addPlayer(ws, playerID=null, lobby=null){
        let player = new Player(ws, playerID, lobby)
        this.players.push(player);
        return player;
    }

    /**
     * Remove player from Server
     * @param {Player} player Player to remove.
     */
    removePlayer(player){
        let index = this.players.indexOf(player);
        if(index!=-1){
            this.players.splice(index, 1);
        }
    }

    /**
     * Make a lobby
     * @param {String} id ID for the lobby
     * @returns {Lobby}
     */
    addLobby(id){
        if(this.lobbies[id]==undefined){
            this.lobbies[id] = new Lobby(id);
            return this.lobbies[id];
        } else {
            console.error("Lobby '"+id+"' already exists!");
        }
    }

    /**
     * Create a game
     * @param {Player[]} players Players in the new game
     */
    addGame(players){
        this.games.push(new Game(players));
    }

    /**
     * Get lobby with this id
     * @param {String} id 
     * @returns {?Lobby} Lobby or null if it does not exist
     */
    getLobby(id){
        if(this.lobbies[id]!=undefined){
            return this.lobbies[id];
        } else {
            return null;
        }
    }

    /**
     * Send stats to all players
     *
     */
    sendStats(){
        this.players.forEach((player)=>{
            let queueSize;
            if(player.lobby==null||player.lobby.id=="public"){
                queueSize = this.getLobby("public").players.length();
            } else {
                queueSize = player.lobby.players.length;
            }
            player.sendMessage({type: "stats", data: {totalPlayerCount: this.players.length, queueSize: queueSize, activeGames: this.games.length}});
        });
    }
}

export let server = new Server();