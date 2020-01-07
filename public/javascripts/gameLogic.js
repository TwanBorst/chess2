import {Player} from "./player.js";
import {createNewGameboard} from "./gameBoard.js";
import {serverMessageHandler} from "./eventHandler.js";

let temporaryPlayers = [
    {name: "Twan", totalPoints: 0, playerNumber: 1},
    {name: "Pravesha", totalPoints: 50, playerNumber: 2},
    {name: "Merel", totalPoints: 60, playerNumber: 3},
    {name: "Lynn", totalPoints: 40, playerNumber: 4}
];

class Game{
    constructor(){
        this.gameboard = createNewGameboard();
        // Array of players in the game;
        this.players = Array();
        // Array of all moves being made by every single player in the game.
        this.history = Array();
    }
    
    /**
     * Add Player to your game
     *
     * @param {String} name Name of player
     * @param {Number} totalPoints Total points awarded
     * @param {Number} playerNumber
     * @param {boolean} [you=false]
     */
    addPlayer(name, totalPoints, playerNumber, you=false){
        this.players.push(new Player(name, totalPoints, playerNumber, you));
    }
}

let game = new Game();
let server = new WebSocket("ws://"+window.location.hostname+":8005");
server.onmessage = serverMessageHandler;

// game.addPlayer(temporaryPlayers[0].name, temporaryPlayers[0].totalPoints, temporaryPlayers[0].playerNumber, true);
// game.addPlayer(temporaryPlayers[1].name, temporaryPlayers[1].totalPoints, temporaryPlayers[1].playerNumber);
// game.addPlayer(temporaryPlayers[2].name, temporaryPlayers[2].totalPoints, temporaryPlayers[2].playerNumber);
// game.addPlayer(temporaryPlayers[3].name, temporaryPlayers[3].totalPoints, temporaryPlayers[3].playerNumber);
// @ts-ignore
window.game = game;
// @ts-ignore
window.server = server;
export {game, server};

// TODO: Turns still need to be implemented.
// TODO: Receiving other players moves and executing them still needs to be implemented.
// TODO: Make menu buttons functional. (In a menu.js module file)
// TODO: Database and user system???