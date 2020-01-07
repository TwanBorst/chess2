import {server} from "./server.js"
export class Player {
    constructor(socket, playerID = null, lobby = null) {
        this.socket = socket
        this.lobby = lobby
        this.playerID = playerID;

        this.playing = false;
        this.left = false;
        this.totalPoints = 0;
        this.game = null;

        this.socket.addEventListener('message', (evt) => {this.socketMessageReceived.apply(this, [evt])});
    }
    sendMessage(object){
        this.socket.send(JSON.stringify(object));
    }
    joinLobby(lobby) {
        console.log("Player '" + this.playerID + "' joined lobby '" + lobby.id + "'.");
        lobby.addPlayer(this);
        this.lobby = lobby;
    }
    joinGame(game) {
        this.game = game;
        this.playing = true;
    }
    socketMessageReceived(evt) {
        let message = JSON.parse(evt.data);
        if (message.type == undefined) {
            return;
        }
        if (message.type == "lobby" && message.lobby != undefined && message.lobby.length != 0) {
            if (message.lobby == "public") {
                // Public lobby
                let publicLobby = server.getLobby("public");

                if (publicLobby == null) {
                    console.error("Public lobby is gone!");
                    // TODO: We still need to handle the response to the player..
                    return;
                }
                this.joinLobby(publicLobby);
            } else {
                let lobby = server.getLobby(message.lobby);
                if (lobby == null) {
                    lobby = server.addLobby(lobbyID);
                }
                this.joinLobby(lobby);
            }
        }
    }
    toClient(){
        return {name: this.playerID, totalPoints: this.totalPoints};
    }
}