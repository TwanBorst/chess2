import { game } from "./gameLogic.js";
import { clickTileEventHandler } from "./eventHandler.js";
import { ChessPiece } from "./chessPiece.js";
import { Player } from "./player.js";

/**
 * Creates and renders new gameboard.
 * @returns {Tile[][]} 2D Tile array
 */
export function createNewGameboard() {
    $('#game .gameboard').empty();
    let horizontalRow = Array(14);
    for (let horizontal = 0; horizontal < 14; horizontal++) {
        let verticalRow = Array(14);
        for (let vertical = 0; vertical < 14; vertical++) {
            let blocked = (horizontal < 3 && vertical < 3) || (horizontal > 10 && vertical < 3) || (horizontal < 3 && vertical > 10) || (horizontal > 10 && vertical > 10);
            verticalRow[vertical] = new Tile(blocked, horizontal, vertical);
        }
        horizontalRow[horizontal] = verticalRow;
    }
    return horizontalRow;
}

export class Tile {
    /**
     *Creates an instance of Tile.
     * @param {boolean} [blocked=false] Whether this Tile is unable to contain chesspieces
     * @param {Number} x Horizontal location of tile
     * @param {Number} y Vertical location of tile
     */
    constructor(blocked = false, x, y) {
        this.blocked = blocked;
        this.x = x;
        this.y = y;

        this.free = blocked ? false : true;
        this.chessPiece = null;

        this.element = document.createElement('div');

        this.element.classList.add('tile');
        if (this.blocked) {
            this.element.classList.add('blocked');
        } else {
            $(this.element).click({ tile: this }, clickTileEventHandler);
            if (this.y % 2 == 0) {
                if (this.x % 2 == 0) {
                    this.element.classList.add('white');
                } else {
                    this.element.classList.add('black');
                }
            } else {
                if (this.x % 2 == 0) {
                    this.element.classList.add('black');
                } else {
                    this.element.classList.add('white');
                }
            }
        }
        $('#game .gameboard').append(this.element);
    }

    /**
     * Check whether this tile can be used by this move
     *
     * @param {Move} move
     * @returns {boolean}
     */
    available(move) {
        if (this.blocked) {
            return false;
        } else {
            return this.free || (move.chessPiece.player != this.chessPiece.player);
        }
    }
}


export class Move {
    /**
     *Creates an instance of Move.
     * @param {ChessPiece} chessPiece
     * @param {Tile} from
     * @param {Tile} to
     */
    constructor(chessPiece, from, to) {
        this.chessPiece = chessPiece;
        this.from = from;
        this.to = to;
        this.isValid = this.checkValidity();
        if (this.isValid) {
            this.execute();
        } else {
            console.error('Invalid move!');
        }
    }

    /**
     * Whether this move is a valid one or not
     * @returns {boolean}
     */
    checkValidity() {
        if (!this.chessPiece.player.yourTurn) {
            return false;
        }
        if (!this.to.available(this)) {
            return false;
        }
        if (!this.chessPiece.chessPieceType.moveValidator(this)) {
            return false;
        }
        let safe = true;
        // If the moving chessPiece is not a king, check whether the king is still safe after the move.
        if (this.chessPiece.chessPieceType.name != "king") {
            safe = KingSafeAfterMove(this);
        }
        return safe;
    }

    /**
     * Execute this move
     */
    execute() {
        if (this.to.chessPiece != null) {
            // @ts-ignore
            window.player.points += this.to.chessPiece.chessPieceType.points;
            this.to.chessPiece.removeFromGame();
            // @ts-ignore
            console.log("You have earned " + this.to.chessPiece.chessPieceType.points + " points and you now have a total of " + window.player.points + " points!");
        }
        this.chessPiece.moveToTile(this.to);
        this.chessPiece.player.yourTurn = false;

        $('.tile.green').removeClass('green');

        // @ts-ignore
        window.server.send(JSON.stringify({ type: 'move', data: { from: { x: this.from.x, y: this.from.y }, to: { x: this.to.x, y: this.to.y } } }));
    }
}
/**
 * Check whether a certain player can attack your king next move.
 *
 * @param {Player} player Player that might have checked you.
 */
export function CheckedBy(player) {
    // @ts-ignore
    return PlayerCheckedPlayer(window.player, player);
}

/**
 * Check whether a certain player can attack another specific player's king next move.
 * 
 * @param {Player} kingPlayer
 * @param {Player} attacker
 */
export function PlayerCheckedPlayer(kingPlayer, attacker) {
    let king = kingPlayer.chessPieces.find(k => { return k.chessPieceType.name == "king"; });
    attacker.chessPieces.some(c => {
        return c.chessPieceType.moveValidator({ from: c.tile, to: king.tile, chessPiece: c });
    });
}
/**
 * Get all chesspieces from a certain player that currently check your king.
 *
 * @param {Player} player Player owning the chesspieces
 * @returns {ChessPiece[]}
 */
export function GetSpecificCheckingChesspieces(player) {
    // @ts-ignore
    let king = window.player.chessPieces.find(k => { return k.chessPieceType.name == "king"; });
    return player.chessPieces.filter(c => {
        return c.chessPieceType.moveValidator({ from: c.tile, to: king.tile, chessPiece: c });
    });
}

/**
 * Get all chesspieces from all players that currently check your king.
 * 
 * @returns {ChessPiece[]}
 */
export function GetCheckingChesspieces() {
    let chessPieces = [];
    // @ts-ignore
    game.players.filter(p => { return p.dead == false && p != window.player; }).forEach(p => {
        chessPieces.push(GetSpecificCheckingChesspieces(p));
    });
    // @ts-ignore
    return chessPieces.flat();
}

/**
 * Check whether the tile is safe for this player's king
 * @param {Player} player Player associated with king
 * @param {Tile} tile Tile to check
 */
export function TileSafeForKing(player, tile) {
    return !game.players.filter(p=>{return !p.dead;}).some(p => {
        if (p != player) {
            return p.chessPieces.some(c => {
                return c.chessPieceType.moveValidator({ from: c.tile, to: tile, chessPiece: c });
            });
        } else {
            return false;
        }
    });
}

/**
 * Check whether your king is still safe after your move.
 *
 * @param {Move} move The move you want to make.
 * @returns {boolean} Whether your king will be safe or not.
 */
export function KingSafeAfterMove(move) {
    if (move.chessPiece.chessPieceType.name != "king") {
        let safe = true;
        // Act like the move has already happend. (Only values that are being checked by moveValidators will be changed.)
        move.from.free = true;
        let temp = move.to.chessPiece;
        if (temp != null) {
            temp.player.chessPieces.splice(temp.player.chessPieces.indexOf(temp), 1);
        } else {
            move.to.free = false;
        }
        // Check if the king is still safe
        if (!TileSafeForKing(move.chessPiece.player, move.chessPiece.player.chessPieces.find(c => { return c.chessPieceType.name == "king"; }).tile)) {
            safe = false;
        }
        // Revert all changes
        if (temp != null) {
            temp.player.chessPieces.push(temp);
        } else {
            move.to.free = true;
        }
        move.from.free = false;
        return safe;
    } else {
        return TileSafeForKing(move.chessPiece.player, move.to);
    }
}

/**
 * Returns the corresponding tile of another players chesspieces depending on their player number and yours.
 *
 * @param {Player} player Other player
 * @param {Tile} tile Tile it would be on if it were youre chesspiece
 * @returns {Tile} Corresponding tile
 */
export function convertToPlayerCO(player, tile) {
    // @ts-ignore
    let you = window.player.playerNumber;
    if (you > player.playerNumber) {
        you -= 4;
    }
    if (player.you) {
        return tile;
    } else if (you + 1 == player.playerNumber) {
        return game.gameboard[Math.abs(tile.y - 13)][tile.x];
    } else if (you + 2 == player.playerNumber) {
        return game.gameboard[Math.abs(tile.x - 13)][Math.abs(tile.y - 13)];
    } else {
        return game.gameboard[tile.y][Math.abs(tile.x - 13)];
    }
}

/**
 * The inverse of convertToPlayerCO.
 *
 * @param {Player} player Other player
 * @param {Tile} tile Tile it would be on if it were youre chesspiece
 * @returns {Tile} Corresponding tile
 */
export function convertFromPlayerCO(player, tile) {
    // @ts-ignore
    let you = window.player.playerNumber;
    if (you < player.playerNumber) {
        you += 4;
    }
    if (player.you) {
        return tile;
    } else if (you - 1 == player.playerNumber) {
        return game.gameboard[Math.abs(tile.y - 13)][tile.x];
    } else if (you - 2 == player.playerNumber) {
        return game.gameboard[Math.abs(tile.x - 13)][Math.abs(tile.y - 13)];
    } else {
        return game.gameboard[tile.y][Math.abs(tile.x - 13)];
    }
}

// Equal width to height
$('#game .gameboard').width($('#game .gameboard').height());
$('#game .chesspieces').height($('#game .gameboard').height());
$('#game .chesspieces').width($('#game .gameboard').width());
$(window).resize(function () {
    $('#game .gameboard').width($('#game .gameboard').height());
    $('#game .chesspieces').height($('#game .gameboard').height());
    $('#game .chesspieces').width($('#game .gameboard').width());
    $('#game .chesspieces svg').css('font-size', $('#game .chesspieces').height() / 14).width($('#game .chesspieces').height() / 14).height($('#game .chesspieces').height() / 14);
    game.players.forEach(function (player) {
        player.chessPieces.forEach(function (chesspiece) {
            chesspiece.moveToTile(chesspiece.tile);
        });
    });
});

// TODO: Player stats still need to be showed to the players. (collapsable boxes?)