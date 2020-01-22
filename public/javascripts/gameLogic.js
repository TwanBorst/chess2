import {Player} from "./player.js";
import {createNewGameboard} from "./gameBoard.js";
import {serverMessageHandler} from "./eventHandler.js";
let game = null;
createNewGameboard();
let temporaryPlayers = [
    {name: "Twan", totalPoints: 0, playerNumber: 1},
    {name: "Pravesha", totalPoints: 50, playerNumber: 2},
    {name: "Merel", totalPoints: 60, playerNumber: 3},
    {name: "Lynn", totalPoints: 40, playerNumber: 4}
];

export class Game{
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
    gameOver(){
        $('#game .chesspieces').empty();
        // @ts-ignore
        window.game = null;
        // @ts-ignore
        window.player = null;
    }
    static startGame(){
        // @ts-ignore
        if(window.game!=null){
            // @ts-ignore
            window.game.gameOver();
        }
        game = new Game();
        // @ts-ignore
        window.game = game;
    }
}

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
//
// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     var expires = "expires="+d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }
//
// function getCookie(cname) {
//     var name = cname + "=";
//     var ca = document.cookie.split(';');
//     for(var i = 0; i < ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }
//
// function checkCookie() {
//     var user = getCookie("username");
//     if (user != "") {
//         alert("Welcome again " + user);
//     } else {
//         user = prompt("Please enter your name:", "");
//         if (user != "" && user != null) {
//             setCookie("username", user, 365);
//         }
//     }
// }

// function setCookie() {
//     let date = new Date();
//     let cookieName = "Cookie";
//     date.setTime(d.getTime() + (24 * 60 * 60 * 1000));
//     let expires = "expires=" + date.toUTCString();
//     document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
//     let cookieValue = document.cookie;
//     let start = cookieValue.indexOf(" " + cookieName + "=");
//     if (cookieValue != "") {
//         start = cookieValue.indexOf("=", start) + 1;
//         let end = cookieValue.indexOf(";", start);
//         if (end == -1) {
//             end = cookieValue.length;
//         }
//         cookieValue = prompt("The number of time you have visited in one day:", unescape(cookieValue.substring(start, end)));
//     }
//
//     return cookieValue;
// }
//
// window.checkCookie = checkCookie;
//
// let elem = document.getElementById("pauseMenu");
// async function openFullscreen(){
//     if (elem.requestFullscreen) {
//         await elem.requestFullscreen();
//     } else if (elem.mozRequestFullScreen) { /* Firefox */
//         await elem.mozRequestFullScreen();
//     } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
//         await elem.webkitRequestFullscreen();
//     } else if (elem.msRequestFullscreen) { /* IE/Edge */
//         await elem.msRequestFullscreen();
//     }
// }
// window.openFullscreen = openFullscreen;

export {game, server};

// TODO: Turns still need to be implemented.
// TODO: Receiving other players moves and executing them still needs to be implemented.
// TODO: Make menu buttons functional. (In a menu.js module file)
// TODO: Database and user system???


