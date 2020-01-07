import { Player } from "./player.js";
import { Lobby } from "./lobby.js";
import { Game } from "./game.js";

class Server{
    constructor(){
        this.lobbies = {};
        this.players = Array();
        this.games = Array();

        this.addLobby("public");
    }
    addPlayer(ws, playerID=null, lobby=null){
        let player = new Player(ws, playerID, lobby)
        this.players.push(player);
        return player;
    }
    addLobby(id){
        if(this.lobbies[id]==undefined){
            this.lobbies[id] = new Lobby(id);
        } else {
            console.error("Lobby '"+id+"' already exists!");
        }
    }
    addGame(players){
        this.games.push(new Game(players));
    }
    getLobby(id){
        if(this.lobbies[id]!=undefined){
            return this.lobbies[id];
        } else {
            return null;
        }
    }
}

export let server = new Server();