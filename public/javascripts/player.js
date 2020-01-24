import { game, server } from "./gameLogic.js";
import { ChessPiece, rook, knight, bishop, queen, king, pawn } from "./chessPiece.js";
import { convertToPlayerCO, GetCheckingChesspieces, TileSafeForKing, KingSafeAfterMove, windowPos } from "./gameBoard.js";
import { Timer } from "./timer.js";

export class Player {
    /**
     * Creates an instance of Player.
     * @param {String} name Name of the player
     * @param {Number} totalPoints Total points player has awarded
     * @param {Number} playerNumber
     * @param {boolean} [you=false] If this is you or not
     */
    constructor(name, totalPoints, playerNumber, you = false) {
        this.name = name;
        this.you = you;
        if (you) {
            // @ts-ignore
            window.player = this;
        }
        this.totalPoints = totalPoints;
        this.playerNumber = playerNumber;
        this.chessPieces = Array();
        this.points = 0;
        this.selectedChessPiece = null;
        this.yourTurn = false;
        this.checkMated = false;
        this.dead = false;
        this.timer = null;
        this.createPieces();
        this.createWindow();
    }

    /**
     * Fired when player is defeated or left
     */
    playerDead() {
        this.yourTurn = false;
        this.dead = true;
        $('.playerFrame[player='+this.playerNumber+'] .name').text(this.name + " (left)");
        this.chessPieces.forEach((chesspiece) => {
            chesspiece.playerDead();
        });
    }

    checkForCheckmate() {
        let ChessPieces = GetCheckingChesspieces();
        if (ChessPieces.length > 0) {
            console.warn("You're checked!");
            let canMove = false;
            let king = this.chessPieces.find(c => { return c.chessPieceType.name == "king"; });
            if (king.tile.x <= 12 && !game.gameboard[king.tile.x + 1][king.tile.y].blocked && (game.gameboard[king.tile.x + 1][king.tile.y].free || game.gameboard[king.tile.x + 1][king.tile.y].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x + 1][king.tile.y])) {
                    game.gameboard[king.tile.x + 1][king.tile.y].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.x >= 1 && !game.gameboard[king.tile.x - 1][king.tile.y].blocked && (game.gameboard[king.tile.x - 1][king.tile.y].free || game.gameboard[king.tile.x - 1][king.tile.y].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x - 1][king.tile.y])) {
                    game.gameboard[king.tile.x - 1][king.tile.y].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.y <= 12 && !game.gameboard[king.tile.x][king.tile.y + 1].blocked && (game.gameboard[king.tile.x][king.tile.y + 1].free || game.gameboard[king.tile.x][king.tile.y + 1].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x][king.tile.y + 1])) {
                    game.gameboard[king.tile.x][king.tile.y + 1].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.y >= 1 && !game.gameboard[king.tile.x][king.tile.y - 1].blocked && (game.gameboard[king.tile.x][king.tile.y - 1].free || game.gameboard[king.tile.x][king.tile.y - 1].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x][king.tile.y - 1])) {
                    game.gameboard[king.tile.x][king.tile.y - 1].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.y >= 1 && king.tile.x <= 12 && !game.gameboard[king.tile.x + 1][king.tile.y - 1].blocked && (game.gameboard[king.tile.x + 1][king.tile.y - 1].free || game.gameboard[king.tile.x + 1][king.tile.y - 1].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x + 1][king.tile.y - 1])) {
                    game.gameboard[king.tile.x + 1][king.tile.y - 1].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.y >= 1 && king.tile.x >= 1 && !game.gameboard[king.tile.x - 1][king.tile.y - 1].blocked && (game.gameboard[king.tile.x - 1][king.tile.y - 1].free || game.gameboard[king.tile.x - 1][king.tile.y - 1].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x - 1][king.tile.y - 1])) {
                    game.gameboard[king.tile.x - 1][king.tile.y - 1].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.y <= 12 && king.tile.x <= 12 && !game.gameboard[king.tile.x + 1][king.tile.y + 1].blocked && (game.gameboard[king.tile.x + 1][king.tile.y + 1].free || game.gameboard[king.tile.x + 1][king.tile.y + 1].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x + 1][king.tile.y + 1])) {
                    game.gameboard[king.tile.x + 1][king.tile.y + 1].element.classList.add("green");
                    canMove = true;
                }
            }
            if (king.tile.y <= 12 && king.tile.x >= 1 && !game.gameboard[king.tile.x - 1][king.tile.y + 1].blocked && (game.gameboard[king.tile.x - 1][king.tile.y + 1].free || game.gameboard[king.tile.x - 1][king.tile.y + 1].chessPiece.player != king.player)) {
                if (TileSafeForKing(this, game.gameboard[king.tile.x - 1][king.tile.y + 1])) {
                    game.gameboard[king.tile.x - 1][king.tile.y + 1].element.classList.add("green");
                    canMove = true;
                }
            }

            // Check if there's a chance that we might be able to block a chesspiece.
            if (ChessPieces.length == 1) {
                if (this.chessPieces.some(c => {
                    // @ts-ignore
                    return c.chessPieceType.moveValidator({ from: c.tile, to: ChessPieces[0].tile, chessPiece: c }) && KingSafeAfterMove({ from: c.tile, to: ChessPieces[0].tile, chessPiece: c });
                })) {
                    ChessPieces[0].tile.element.classList.add('green');
                    canMove = true;
                }
                if (ChessPieces[0].chessPieceType.name != "knight" && (Math.abs(king.tile.x - ChessPieces[0].tile.x) > 1 || Math.abs(king.tile.y - ChessPieces[0].tile.y) > 1)) {
                    let changeX = Math.sign(king.tile.x - ChessPieces[0].tile.x);
                    let changeY = Math.sign(king.tile.y - ChessPieces[0].tile.y);
                    for (let i = 1; game.gameboard[ChessPieces[0].tile.x + i * changeX][ChessPieces[0].tile.y + i * changeY] != king.tile; i++) {
                        if (this.chessPieces.some(c => {
                            // @ts-ignore
                            return c.chessPieceType.moveValidator({ from: c.tile, to: game.gameboard[ChessPieces[0].tile.x + i * changeX][ChessPieces[0].tile.y + i * changeY], chessPiece: c }) && KingSafeAfterMove({ from: c.tile, to: game.gameboard[ChessPieces[0].tile.x + i * changeX][ChessPieces[0].tile.y + i * changeY], chessPiece: c });
                        })) {
                            game.gameboard[ChessPieces[0].tile.x + i * changeX][ChessPieces[0].tile.y + i * changeY].element.classList.add('green');
                            canMove = true;
                        }
                    }
                }
            }
            if (!canMove) {
                this.yourTurn = false;
                console.log("You're checkmate, you can continue to watch, but you wont be able to participate anymore. The person with the highest points at the end of the game will win.");
                king.removeFromGame();
                this.playerDead();
                let players = [];
                ChessPieces.forEach(c => {
                    c.player.points += 20;
                    players.push(c.player.playerNumber);
                    console.log(c.player.name + " has earned 20 points for having a part in the checkmate of " + this.name + " and now has a total of " + c.player.points + " points!");
                });

                server.send(JSON.stringify({ type: "checkmate", data: { checkmate: this.playerNumber, players: players } }));
            }
        }
    }

    /**
     * Creates and renders all chessPieces for this player.
     */
    createPieces() {
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

    createWindow(){
        this.timer = new Timer();
        let timer = $('<div class="timer"></div>').append(this.timer.element);
        let element = $('<div class="playerFrame"></div>');
        let name = $('<div class="name">'+this.name+'</div>');
        let points = $('<div class="points">'+this.points+'</div>');
        element.attr('player', this.playerNumber);
        element.height($(windowPos(this.playerNumber).element).height()*3+'px');
        element.width(element.height()+'px');
        element.css('top', $(windowPos(this.playerNumber).element).position().top + 'px').css('left', $(windowPos(this.playerNumber).element).position().left + 'px');
        element.append(name);
        element.append(timer);
        element.append(points);
        $('#game').append(element);
    }
}