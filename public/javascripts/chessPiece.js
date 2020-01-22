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
        this.points = this.chessPieceType.points;
        
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
            this.points = 0;
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
}, $('<svg viewBox="0 0 320 512"><path fill="currentColor" d="M105.1 224H80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h16v5.49c0 44-4.14 86.6-24 122.51h176c-19.89-35.91-24-78.51-24-122.51V288h16a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-25.1c29.39-18.38 49.1-50.78 49.1-88a104 104 0 0 0-208 0c0 37.22 19.71 69.62 49.1 88zM304 448H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg>', {"class": "fas fa-chess-pawn"}));

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
}, $('<svg viewBox="0 0 384 512"><path fill="currentColor" d="M368 32h-56a16 16 0 0 0-16 16v48h-48V48a16 16 0 0 0-16-16h-80a16 16 0 0 0-16 16v48H88.1V48a16 16 0 0 0-16-16H16A16 16 0 0 0 0 48v176l64 32c0 48.33-1.54 95-13.21 160h282.42C321.54 351 320 303.72 320 256l64-32V48a16 16 0 0 0-16-16zM224 320h-64v-64a32 32 0 0 1 64 0zm144 128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg>', {"class": "fas fa-chess-rook"}));

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
}, $('<svg viewBox="0 0 320 512"><path fill="currentColor" d="M8 287.88c0 51.64 22.14 73.83 56 84.6V416h192v-43.52c33.86-10.77 56-33 56-84.6 0-30.61-10.73-67.1-26.69-102.56L185 285.65a8 8 0 0 1-11.31 0l-11.31-11.31a8 8 0 0 1 0-11.31L270.27 155.1c-20.8-37.91-46.47-72.1-70.87-92.59C213.4 59.09 224 47.05 224 32a32 32 0 0 0-32-32h-64a32 32 0 0 0-32 32c0 15 10.6 27.09 24.6 30.51C67.81 106.8 8 214.5 8 287.88zM304 448H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg>', {"class": "fas fa-chess-bishop"}));

export let knight = new ChessPieceType("knight", 3, function(move){
    return (Math.abs(move.from.x-move.to.x)==1&&Math.abs(move.from.y-move.to.y)==2) || (Math.abs(move.from.x-move.to.x)==2&&Math.abs(move.from.y-move.to.y)==1)
}, $('<svg viewBox="0 0 384 512"><path fill="currentColor" d="M19 272.47l40.63 18.06a32 32 0 0 0 24.88.47l12.78-5.12a32 32 0 0 0 18.76-20.5l9.22-30.65a24 24 0 0 1 12.55-15.65L159.94 208v50.33a48 48 0 0 1-26.53 42.94l-57.22 28.65A80 80 0 0 0 32 401.48V416h319.86V224c0-106-85.92-192-191.92-192H12A12 12 0 0 0 0 44a16.9 16.9 0 0 0 1.79 7.58L16 80l-9 9a24 24 0 0 0-7 17v137.21a32 32 0 0 0 19 29.26zM52 128a20 20 0 1 1-20 20 20 20 0 0 1 20-20zm316 320H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"></path></svg>', {"class": "fas fa-chess-knight"}));

export let king = new ChessPieceType("king", 20, function(move){
    return Math.abs(move.from.x-move.to.x)<2&&Math.abs(move.from.y-move.to.y)<2&&TileSafeForKing(move.chessPiece.player, move.to);
}, $('<svg viewBox="0 0 448 512"><path fill="currentColor" d="M400 448H48a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm16-288H256v-48h40a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8h-40V8a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v40h-40a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h40v48H32a32 32 0 0 0-30.52 41.54L74.56 416h298.88l73.08-214.46A32 32 0 0 0 416 160z"></path></svg>', {"class": "fas fa-chess-king"}));

export let queen = new ChessPieceType("queen", 9, function(move){
    if((move.from.x==move.to.x&&move.from.y!=move.to.y)||(move.from.x!=move.to.x&&move.from.y==move.to.y)){
        return rook.moveValidator(move);
    } else if (Math.abs(move.from.x-move.to.x)==Math.abs(move.from.y-move.to.y)){
        return bishop.moveValidator(move);
    } else {
        return false;
    }
}, $('<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 112a56 56 0 1 0-56-56 56 56 0 0 0 56 56zm176 336H80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm72.87-263.84l-28.51-15.92c-7.44-5-16.91-2.46-22.29 4.68a47.59 47.59 0 0 1-47.23 18.23C383.7 186.86 368 164.93 368 141.4a13.4 13.4 0 0 0-13.4-13.4h-38.77c-6 0-11.61 4-12.86 9.91a48 48 0 0 1-93.94 0c-1.25-5.92-6.82-9.91-12.86-9.91H157.4a13.4 13.4 0 0 0-13.4 13.4c0 25.69-19 48.75-44.67 50.49a47.5 47.5 0 0 1-41.54-19.15c-5.28-7.09-14.73-9.45-22.09-4.54l-28.57 16a16 16 0 0 0-5.44 20.47L104.24 416h303.52l102.55-211.37a16 16 0 0 0-5.44-20.47z"></path></svg>', {"class": "fas fa-chess-queen"}));

export let promotedQueen = new ChessPieceType("promotedQueen", 1, queen.moveValidator, $('<svg viewBox="0 0 512 512"><path fill="currentColor" d="M256 112a56 56 0 1 0-56-56 56 56 0 0 0 56 56zm176 336H80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm72.87-263.84l-28.51-15.92c-7.44-5-16.91-2.46-22.29 4.68a47.59 47.59 0 0 1-47.23 18.23C383.7 186.86 368 164.93 368 141.4a13.4 13.4 0 0 0-13.4-13.4h-38.77c-6 0-11.61 4-12.86 9.91a48 48 0 0 1-93.94 0c-1.25-5.92-6.82-9.91-12.86-9.91H157.4a13.4 13.4 0 0 0-13.4 13.4c0 25.69-19 48.75-44.67 50.49a47.5 47.5 0 0 1-41.54-19.15c-5.28-7.09-14.73-9.45-22.09-4.54l-28.57 16a16 16 0 0 0-5.44 20.47L104.24 416h303.52l102.55-211.37a16 16 0 0 0-5.44-20.47z"></path></svg>', {"class": "fas fa-chess-queen"}));

export let ChessPieceTypes = {pawn: pawn, bishop: bishop, rook: rook, knight: knight, king: king, queen: queen, promotedQueen: promotedQueen};
