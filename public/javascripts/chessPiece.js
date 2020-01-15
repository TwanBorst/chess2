import {clickChessPieceEventHandler} from "./eventHandler.js";
import {game} from "./gameLogic.js";
import {Tile, convertFromPlayerCO, TileSafeForKing} from "./gameBoard.js";

export class ChessPiece {
    constructor(tile, player, chessPieceType){
        this.tile = tile;
        this.player = player;
        this.chessPieceType = chessPieceType;

        this.tile.free = false;
        this.tile.chessPiece = this;
        this.hasMoved = false;
        
        this.element = $('<div>');
        this.element.append(this.chessPieceType.element.clone());
        this.element.children().last().attr('player', this.player.playerNumber);
        this.element.children().last().css('font-size', $('#game .chesspieces').height()/14).width($('#game .chesspieces').height()/14).height($('#game .chesspieces').height()/14);
        
        this.moveToTile(this.tile, false);

        this.element.on("click", {chesspiece: this}, clickChessPieceEventHandler);

        $('#game .chesspieces').append(this.element);
        
    }
    playerDead(){
        if(this.chessPieceType.name!="king"){
            this.chessPieceType.points = 0;
        }
        // The chesspieces only turn black if the chesspieces were viewed before this event.
        this.element.children().last().attr('player', -1);
    }

    /**
     * Move this chesspiece to another tile.
     * @param {Tile} tile
     * @param {boolean} [hasMoved=true]
     */
    moveToTile(tile, hasMoved=true){
        this.tile.free = true;
        this.tile.chessPiece = null;
        this.tile = tile;
        this.tile.free = false;
        this.tile.chessPiece = this;
        $(this.element).css({'top': $(tile.element).position().top +'px', 'left': $(tile.element).position().left+'px'})
        this.hasMoved = hasMoved;
    }
    removeFromGame(){
        this.tile.chesspiece = null;
        this.tile.free = true;
        this.player.chessPieces.splice(this.player.chessPieces.indexOf(this), 1);
        this.tile = null;
        this.player = null;
        this.element.remove();
    }
}

export class ChessPieceType {
    constructor(name, points, moveValidator, element){
        this.name = name;
        this.points = points;
        this.moveValidator = moveValidator;
        this.element = element
    }
}

export let pawn = new ChessPieceType("pawn", 1, function(move){
    // This move validator can only validate moves for pawns of window.player, so we convert the tiles in the move to the corresponding tiles of player window.player to make this also work for other players.
    move.from = convertFromPlayerCO(move.chessPiece.player, move.from);
    move.to = convertFromPlayerCO(move.chessPiece.player, move.to);

    if((move.from.y == move.to.y+1) && (Math.abs(move.from.x-move.to.x) == 1)){
        return (move.to.chessPiece!=null) && (!move.to.chessPiece.player.you);
    } else if(move.chessPiece.hasMoved){
        return (move.from.x == move.to.x) && (move.to.y+1 == move.from.y);
    } else {
        return (move.from.x == move.to.x) && ((move.to.y+1 == move.from.y) || (move.to.y+2 == move.from.y));
    }
}, $("<i>", {"class": "fas fa-chess-pawn"}));

export let rook = new ChessPieceType("rook", 5, function(move){
    if(move.from.x==move.to.x&&move.from.y!=move.to.y){
        let change = (move.from.y<move.to.y)? 1:-1;
        for(let i=move.from.y+change; i != move.to.y; i+=change){
            if(!game.gameboard[move.from.x][i].free){
                return false;
            }
        }
    } else if(move.from.y==move.to.y&&move.from.x!=move.to.x){
        let change = (move.from.x<move.to.x)? 1:-1;
        for(let i=move.from.x+change; i != move.to.x; i+=change){
            if(!game.gameboard[i][move.from.y].free){
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}, $("<i>", {"class": "fas fa-chess-rook"}));

export let bishop = new ChessPieceType("bishop", 5, function(move){
    if(move.from.x==move.to.x||move.from.y==move.to.y){
        return false;
    } else if(Math.abs(move.from.x-move.to.x)!=Math.abs(move.from.y-move.to.y)){
        return false;
    } else {
        let changeX = (move.from.x<move.to.x)? 1:-1;
        let changeY = (move.from.y<move.to.y)? 1:-1;

        for(let i = 1; i < Math.abs(move.from.x-move.to.x); i++){
            if(!game.gameboard[move.from.x+i*changeX][move.from.y+i*changeY].free){
                return false;
            }
        }
        return true;
    }
}, $("<i>", {"class": "fas fa-chess-bishop"}));

export let knight = new ChessPieceType("knight", 3, function(move){
    return (Math.abs(move.from.x-move.to.x)==1&&Math.abs(move.from.y-move.to.y)==2) || (Math.abs(move.from.x-move.to.x)==2&&Math.abs(move.from.y-move.to.y)==1)
}, $("<i>", {"class": "fas fa-chess-knight"}));

export let king = new ChessPieceType("king", 20, function(move){
    return Math.abs(move.from.x-move.to.x)<2&&Math.abs(move.from.y-move.to.y)<2&&TileSafeForKing(move.chessPiece.player, move.to);
}, $("<i>", {"class": "fas fa-chess-king"}));

export let queen = new ChessPieceType("queen", 9, function(move){
    if((move.from.x==move.to.x&&move.from.y!=move.to.y)||(move.from.x!=move.to.x&&move.from.y==move.to.y)){
        return rook.moveValidator(move);
    } else if (Math.abs(move.from.x-move.to.x)==Math.abs(move.from.y-move.to.y)){
        return bishop.moveValidator(move);
    } else {
        return false;
    }
}, $("<i>", {"class": "fas fa-chess-queen"}));

export let promotedQueen = new ChessPieceType("promotedQueen", 1, queen.moveValidator, $("<i>", {"class": "fas fa-chess-queen"}));

