import {game} from "./gameLogic.js";
import { ChessPiece, rook, knight, bishop, queen, king, pawn} from "./chessPiece.js";
import { convertToPlayerCO } from "./gameBoard.js";

export class Player{
    constructor(name, totalPoints, playerNumber, you=false){
        this.name = name;
        this.you = you;
        if(you){
            window.player = this;
        }
        this.totalPoints = totalPoints;
        this.playerNumber = playerNumber;
        this.chessPieces = Array();
        this.points = 0;
        this.selectedChessPiece = null;
        this.createPieces();
    }
    createPieces(){
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[3][13]), this, rook));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[4][13]), this, knight));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[5][13]), this, bishop));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[6][13]), this, queen));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[7][13]), this, king));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[8][13]), this, bishop));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[9][13]), this, knight));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[10][13]), this, rook));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[3][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[4][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[5][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[6][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[7][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[8][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[9][12]), this, pawn));
        this.chessPieces.push(new ChessPiece(convertToPlayerCO(this, game.gameboard[10][12]), this, pawn));
    }
}
