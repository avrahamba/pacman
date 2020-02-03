'use strict';
var WALL = '█';
var FOOD = '.';
var SUPER_FOOD = '•';
var CHERRY = '🍒';
var EMPTY = ' ';

var gEatCount;

var gIntervalCarry = null;
var gBoard;
var gGame = {
    score: 0,
    isOn: false
};

function init() {
    var elEndGame = document.querySelector('.end-game');
    elEndGame.innerHTML = '';
    gBoard = buildBoard();

    gEatCount = calcEatCount(gBoard);

    createPacman(gBoard);
    gIntervalCarry = setInterval(createCarry, 15000);
    printMat(gBoard, '.board-container');
    createGhosts(gBoard);
    // console.table(gBoard);
    gGame.isOn = true;
    gGame.score = 0;
    document.querySelector('header h3 span').innerText = gGame.score;
}

function calcEatCount(board) {
    var res = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === FOOD || board[i][j] === GHOST || board[i][j] === SUPER_FOOD) {
                res++;
            }
        }
    }
    return res;
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < 31; i++) {
        board.push([]);
        for (var j = 0; j < 28; j++) {
            board[i][j] = FOOD;

            if (i === 0 || i === 31 - 1 ||
                j === 0 || j === 28 - 1) {

                board[i][j] = WALL;
            }
        }
    }
    addWall(board, 2, 5, 2, 6);
    addWall(board, 2, 5, 7, 12);
    addWall(board, 1, 5, 13, 15);
    addWall(board, 2, 5, 16, 21);
    addWall(board, 2, 5, 22, 26);
    addWall(board, 6, 8, 2, 6);
    addWall(board, 6, 14, 7, 9);
    addWall(board, 6, 8, 10, 18);
    addWall(board, 6, 14, 19, 21);
    addWall(board, 6, 8, 22, 26);
    addWall(board, 9, 11, 8, 12);
    addWall(board, 9, 11, 16, 20);
    addWall(board, 8, 11, 13, 15);
    addWall(board, 12, 17, 10, 18);
    addWall(board, 9, 14, 0, 6);
    addWall(board, 15, 20, 0, 6);
    addWall(board, 21, 23, 2, 6);
    addWall(board, 23, 26, 4, 6);
    addWall(board, 24, 26, 0, 3);
    addWall(board, 27, 29, 2, 12);
    addWall(board, 24, 27, 7, 9);
    addWall(board, 21, 23, 7, 12);
    addWall(board, 24, 26, 10, 18);
    addWall(board, 26, 29, 13, 15);
    addWall(board, 27, 29, 16, 26);
    addWall(board, 15, 20, 7, 9);
    addWall(board, 18, 20, 10, 18);
    addWall(board, 19, 23, 13, 15);
    addWall(board, 24, 27, 19, 21);
    addWall(board, 21, 23, 16, 21);
    addWall(board, 15, 20, 19, 21);
    addWall(board, 9, 14, 22, 27);
    addWall(board, 15, 20, 22, 27);
    addWall(board, 24, 26, 25, 27);
    addWall(board, 21, 26, 22, 24);
    addWall(board, 21, 23, 24, 26);

    board[3][1] = SUPER_FOOD;
    board[3][26] = SUPER_FOOD;
    board[22][1] = SUPER_FOOD;
    board[22][26] = SUPER_FOOD;
    board[14][0] = EMPTY;
    board[14][27] = EMPTY;
    return board;
}

function addWall(board, sI, eI, sJ, eJ) {
    for (var i = sI; i < eI; i++) {
        for (var j = sJ; j < eJ; j++) {

            board[i][j] = WALL;
        }
    }

}

function updateScore(value) {
    // Update both the model and the dom for the score
    gGame.score += value;
    document.querySelector('header h3 span').innerText = gGame.score;
    if (gEatCount <= 1) victory();
}

function createCarry() {
    var emptyCoord = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptyCoord.push({ i: i, j: j });
            }
        }
    }
    var coord = emptyCoord[getRandomIntInclusive(0, emptyCoord.length - 1)];
    gBoard[coord.i][coord.j] = CHERRY;
    renderCell(coord, CHERRY);
}

function gameOver() {
    var strHtml = `<h1>GAME OVER</h1><br><input type="button" value="play again" onclick="init()">`;
    console.log('Game Over');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    gIntervalGhosts = null;
    clearInterval(gIntervalCarry);
    gIntervalCarry = null;
    var elEndGame = document.querySelector('.end-game');
    elEndGame.innerHTML = strHtml;
}

function victory() {
    var strHtml = `<h1>VICTORY!!!</h1><br><input type="button" value="play again" onclick="init()">`;
    console.log('victorious');
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    gIntervalGhosts = null;
    clearInterval(gIntervalCarry);
    gIntervalCarry = null;
    var elEndGame = document.querySelector('.end-game');
    elEndGame.innerHTML = strHtml;
}