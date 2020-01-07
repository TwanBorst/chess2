import {Move, convertToPlayerCO} from "./gameBoard.js";
import {server, game} from "./gameLogic.js";

/**
 * Select chess piece event
 * @param {JQuery.ClickEvent} event
 */
export function clickChessPieceEventHandler(event){
    let chesspiece = event.data.chesspiece;
    if(chesspiece.player.you){
        if(chesspiece.player.selectedChessPiece!=chesspiece){
            console.log('Selected other chesspiece.');
            chesspiece.player.selectedChessPiece=chesspiece;
        } else {
            console.log('Deselected chesspiece.');
            chesspiece.player.selectedChessPiece = null;
        }
    } else {
        // @ts-ignore
        if(window.player.selectedChessPiece!=null){
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
export function clickTileEventHandler(event){
    let tile = event.data.tile;
    // @ts-ignore
    if(window.player.selectedChessPiece!=null){
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
export function serverMessageHandler(event){
    let message = JSON.parse(event.data);
    console.log(message);
    if(message.type==undefined||message.data==undefined){
        return;
    } else if(message.type=="addPlayer"){
        game.addPlayer(message.data.name, message.data.totalPoints, message.data.playerNumber, message.data.you);
    } else if(message.type=="playerLeft"){
        game.players.forEach((player)=>{
            if(player.playerNumber==message.data){
                player.playerDead();
                return;
            }
        });
    } else if(message.type=="playerTurn"){
        game.players.forEach(player=>{
            if(player.playerNumber==message.data){
                player.yourTurn = true;
                return;
            }
        });
    } else if(message.type=="move"){
        let player = game.players.find(e => e.playerNumber==message.data.player);
        let from = convertToPlayerCO(player, game.gameboard[message.data.move.from.x][message.data.move.from.y]);
        let to = convertToPlayerCO(player, game.gameboard[message.data.move.to.x][message.data.move.to.y]);
        if(from.chessPiece!=null){
            if(to.chessPiece!=null){
                player.points += to.chessPiece.chessPieceType.points;
                to.chessPiece.removeFromGame();
                console.log(player.name + "has earned "+ to.chessPiece.chessPieceType.points+ " points and now has a total of "+ player.totalPoints + " points!");
            }
            from.chessPiece.moveToTile(to);
        }
        player.yourTurn = false;
    }
}



// TODO: Console messages should be replaced by recognizable sounds or visual changes.