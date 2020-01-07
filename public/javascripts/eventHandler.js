import {Move} from "./gameBoard.js";
import {server, game} from "./gameLogic.js";

// Select chess piece event
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
        if(window.player.selectedChessPiece!=null){
            new Move(window.player.selectedChessPiece, window.player.selectedChessPiece.tile, chesspiece.tile);
        } else {
            console.error('This is not your chesspiece.');
        }
    }
}

export function clickTileEventHandler(event){
    let tile = event.data.tile;
    if(window.player.selectedChessPiece!=null){
        new Move(window.player.selectedChessPiece, window.player.selectedChessPiece.tile, tile);
    } else {
        console.log('No chesspiece on this tile. If you want to move to it select a chesspiece first!');
    }
}

export function serverMessageHandler(event){
    let message = JSON.parse(event.data);
    if(message.type&&message.type=="addPlayer"&&message.data){
        game.addPlayer(message.data.name, message.data.totalPoints, message.data.playerNumber, message.data.you);
    }
}



// TODO: Console messages should be replaced by recognizable sounds or visual changes.