import {game} from "./gameLogic.js";
import {clickTileEventHandler} from "./eventHandler.js";

export function createNewGameboard(){
    $('#game .gameboard').empty();
    let horizontalRow = Array(14);
    for(let horizontal = 0; horizontal<14; horizontal++){
        let verticalRow = Array(14);
        for(let vertical = 0; vertical<14; vertical++){
            let blocked = (horizontal < 3 && vertical < 3) || (horizontal > 10 && vertical < 3) || (horizontal < 3 && vertical > 10) || (horizontal > 10 && vertical > 10);
            verticalRow[vertical] = new Tile(blocked, horizontal, vertical);
        }
        horizontalRow[horizontal] = verticalRow;
    }
    return horizontalRow;
}

class Tile{
    constructor(blocked=false, x, y){
        this.blocked = blocked;
        this.x = x;
        this.y = y;

        this.free = blocked? false:true;
        this.chessPiece = null;

        this.element = document.createElement('div');

        this.element.classList.add('tile');
        if(this.blocked){
            this.element.classList.add('blocked');
        } else{
            $(this.element).click({tile: this}, clickTileEventHandler);
            if(this.y%2==0){ 
                if(this.x%2==0){
                    this.element.classList.add('white');
                } else {
                    this.element.classList.add('black');
                }
            } else {
                if(this.x%2==0){
                    this.element.classList.add('black');
                } else {
                    this.element.classList.add('white');
                }
            }
        }
        $('#game .gameboard').append(this.element);
    }
    available(move){
        if(this.blocked){
            return false;
        } else {
            return this.free || (move.chessPiece.player != this.chessPiece.player);
        }
    }
}


export class Move{
    constructor(chessPiece, from, to){
        this.chessPiece = chessPiece;
        this.from = from;
        this.to = to;
        this.isValid = this.checkValidity();
        if(this.isValid){
            this.execute();
        } else {
            console.error('Invalid move!');
        }
    }
    checkValidity(){
        if(!this.to.available(this)){
            return false;
        }
        if(!this.chessPiece.chessPieceType.moveValidator(this)){
            return false;
        }
        // TODO: We still need to check if our move endangers the king.
        // TODO: We still need to check if a move by our king endagers himself.
        return true;
    }
    // TODO: We still need to send our Move to the server.
    execute(){
        if(this.to.chessPiece!=null){
            window.player.points += this.to.chessPiece.chessPieceType.points;
            this.to.chessPiece.removeFromGame();
            console.log(window.player.name + " has earned "+ this.to.chessPiece.chessPieceType.points + "points and now has a total of "+ window.player.points + " points!");
        }
        this.chessPiece.moveToTile(this.to);
    }
}

// Returns other players corresponding tile
export function convertToPlayerCO(player, tile){
    if(player.playerNumber==2){
        return game.gameboard[Math.abs(tile.y-13)][tile.x];
    } else if(player.playerNumber==3) {
        return game.gameboard[Math.abs(tile.x-13)][Math.abs(tile.y-13)];
    } else if(player.playerNumber==4){
        return game.gameboard[tile.y][Math.abs(tile.x-13)];
    } else {
        return tile;
    }
}

// Equal width to height
$('#game .gameboard').width($('#game .gameboard').height());
$('#game .chesspieces').height($('#game .gameboard').height());
$('#game .chesspieces').width($('#game .gameboard').width());
$(window).resize(function(){
    $('#game .gameboard').width($('#game .gameboard').height());
    $('#game .chesspieces').height($('#game .gameboard').height());
    $('#game .chesspieces').width($('#game .gameboard').width());
    $('#game .chesspieces svg').css('font-size', $('#game .chesspieces').height()/14).width($('#game .chesspieces').height()/14).height($('#game .chesspieces').height()/14);
    game.players.forEach(function(player){
        player.chessPieces.forEach(function(chesspiece){
            chesspiece.moveToTile(chesspiece.tile);
        });
    });
});

// TODO: Player stats still need to be showed to the players. (collapsable boxes?)