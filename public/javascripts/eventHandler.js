import { Move, convertToPlayerCO, GetCheckingChesspieces, TileSafeForKing, KingSafeAfterMove } from "./gameBoard.js";
import { server, game } from "./gameLogic.js";
import { ChessPieceTypes, ChessPiece } from "./chessPiece.js";

/**
 * Select chess piece event
 * @param {JQuery.ClickEvent} event
 */
export function clickChessPieceEventHandler(event) {
    let chesspiece = event.data.chesspiece;
    if (chesspiece.player.you) {
        if (chesspiece.player.selectedChessPiece != chesspiece) {
            console.log('Selected other chesspiece.');
            chesspiece.player.selectedChessPiece = chesspiece;
        } else {
            console.log('Deselected chesspiece.');
            chesspiece.player.selectedChessPiece = null;
        }
    } else {
        // @ts-ignore
        if (window.player.selectedChessPiece != null) {
            // @ts-ignore
            new Move(window.player.selectedChessPiece, window.player.selectedChessPiece.tile, chesspiece.tile);
        } else {
            console.error('This is not your chesspiece.');
        }
    }
}

/**
 * Select Tile event
 * @param {JQuery.ClickEvent} event
 */
export function clickTileEventHandler(event) {
    let tile = event.data.tile;
    // @ts-ignore
    if (window.player.selectedChessPiece != null) {
        // @ts-ignore
        new Move(window.player.selectedChessPiece, window.player.selectedChessPiece.tile, tile);
    } else {
        console.log('No chesspiece on this tile. If you want to move to it select a chesspiece first!');
    }
}

/**
 * Receive message event
 * @param {MessageEvent} event
 */
export function serverMessageHandler(event) {
    let message = JSON.parse(event.data);
    console.log(message);
    if (message.type == undefined || message.data == undefined) {
        return;
    } else if (message.type == "addPlayer") {
        if ($('#insertName').css('top') == "0px") {
            $('#insertName .loading').toggle();
            $('#insertName .username').toggle();
            $('#insertName').css('top', '-100%');
        }
        game.addPlayer(message.data.name, message.data.totalPoints, message.data.playerNumber, message.data.you);
    } else if (message.type == "playerLeft") {
        game.players.forEach((player) => {
            if (player.playerNumber == message.data) {
                player.playerDead();
                return;
            }
        });
    } else if (message.type == "playerTurn") {
        game.players.forEach(player => {
            if (player.playerNumber == message.data) {
                player.yourTurn = true;
                player.timer.start();
            } else {
                player.timer.stop();
            }
        });
        // @ts-ignore
        if (window.player.yourTurn) {
            // @ts-ignore
            window.player.checkForCheckmate();
        }
    } else if (message.type == "move") {
        let player = game.players.find(e => e.playerNumber == message.data.player);
        let from = convertToPlayerCO(player, game.gameboard[message.data.move.from.x][message.data.move.from.y]);
        let to = convertToPlayerCO(player, game.gameboard[message.data.move.to.x][message.data.move.to.y]);
        if (from.chessPiece != null) {
            if (to.chessPiece != null) {
                player.points += to.chessPiece.points;
                $('.playerFrame[player=' + player.playerNumber + '] .points').text(player.points);
                to.chessPiece.removeFromGame();
                console.log(player.name + " has earned " + to.chessPiece.points + " points and now has a total of " + player.points + " points!");
            }
            from.chessPiece.moveToTile(to);
        }
        player.yourTurn = false;
    } else if (message.type == "checkmate") {
        let checkmate = game.players.find(p => { return p.playerNumber == message.data.checkmate });
        console.log("Player " + checkmate.name + " is checkmate and will no longer be able to continue playing.");
        message.data.players.forEach(n => {
            let player = game.players.find(p => { return p.playerNumber == n; });
            player.points += 20;
            $('.playerFrame[player=' + player.playerNumber + '] .points').text(player.points);
            console.log(player.name + " has earned 20 points for having a part in the checkmate of " + checkmate.name + " and now has a total of " + player.points + " points!");
        });
        checkmate.chessPieces.find(c => { return c.chessPieceType.name == "king"; }).removeFromGame();
        checkmate.playerDead();
    } else if (message.type == "gameOver") {
        // TODO: Show Game over screen with points, who won and a return to menu button.
        // @ts-ignore
        window.player.game.gameOver();
        $('#mainMenu').css('top', '0');
    } else if (message.type == "replace") {
        let player = game.players.find(e => e.playerNumber == message.data.player);
        let tile = convertToPlayerCO(player, game.gameboard[message.data.tile.x][message.data.tile.y]);
        tile.chessPiece.removeFromGame();
        tile.chessPiece = new ChessPiece(tile, player, ChessPieceTypes[message.data.type]);
        player.chessPieces.push(tile.chessPiece);
    } else if (message.type == "timer") {
        let player = game.players.find(e => e.playerNumber == message.data);
        player.timer.stop();
        player.playerDead();
    } else if (message.type == "surrender") {
        let player = game.players.find(e => e.playerNumber == message.data);
        player.timer.stop();
        player.playerDead();
    } else if (message.type == "stats"){
        $('#mainMenu .stats .totalPlayerCount .stat').text(message.data.totalPlayerCount);
        $('#mainMenu .stats .queueSize .stat').text(message.data.queueSize);
        $('#mainMenu .stats .activeGames .stat').text(message.data.activeGames);

        $('#insertName .stat').text(message.data.queueSize);
    }
}