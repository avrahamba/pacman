var GHOST = '&#9782;';

var gIntervalGhosts;
var gGhosts;

function createGhost(board, i, j) {
    var ghost = {
        location: {
            i: i,
            j: j
        },
        currCellContent: board[i][j],
        color: getRandomColor()
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
    renderCell(ghost.location, getGhostHTML(ghost));
}


function createGhosts(board) {
    gGhosts = [];

    // empty the gGhosts array, create some ghosts
    createGhost(board, 11, 12);
    createGhost(board, 11, 13);
    createGhost(board, 11, 14);
    createGhost(board, 11, 15);
    //  and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create theghost moveDiff
        var nextLocation = getNextMove(ghost.location);
        if (nextLocation === null) return;
        /* var nextLocation = {
                 i: ghost.location.i + moveDiff.i,
                 j: ghost.location.j + moveDiff.j
             }
          */ // console.log('ghost.location', ghost.location, 'nextLocation', nextLocation, 'moveDiff', moveDiff)

        // if WALL - give up
        if (gBoard[nextLocation.i][nextLocation.j] === WALL) return
            // if GHOST - give up
        if (gBoard[nextLocation.i][nextLocation.j] === GHOST) {
            return
        }

        // if PACMAN - gameOver
        if (gBoard[nextLocation.i][nextLocation.j] === gPacmanIcon) {
            if (gPacman.isSuper) {
                if (gGhosts[i].currCellContent === FOOD || gGhosts[i].currCellContent === SUPER_FOOD) {
                    updateScore((gGhosts[i].currCellContent === FOOD) ? 1 : 10);
                    gEatCount--;
                }
                gGhosts.splice(i, 1);
                gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
                renderCell(ghost.location, ghost.currCellContent)
                return;
            } else {
                gameOver()
                return
            }
        }

        // set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)

        // move the ghost
        ghost.location = nextLocation

        // keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]

        // move the ghost and update model and dom
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))

    }
}

function getNextMove(location) {
    var locations = [];
    //הבלאגן כביכול בפונקציה אומר בעצם שהרוח תמיד תעדיף את את הצעד שיקרב אותה לפקמאן

    var pacmanI = 0;
    if (gPacman.location.i > location.i) pacmanI = 1;
    else if (gPacman.location.i < location.i) pacmanI = -1;
    var pacmanJ = 0;
    if (gPacman.location.j > location.j) pacmanJ = 1;
    else if (gPacman.location.j < location.j) pacmanJ = -1;

    switch (pacmanI) {
        case -1:
            switch (pacmanJ) {
                case -1:
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    break;
                case 0:
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });

                    break;
                case 1:
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    break;
            }
            break;
        case 0:
            switch (pacmanJ) {
                case -1:
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    break;
                case 1:
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    break;
            }
            break;
        case 1:
            switch (pacmanJ) {
                case -1:
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    break;
                case 0:
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    break;
                case 1:
                    if (gBoard[location.i + 1][location.j] !== WALL && gBoard[location.i + 1][location.j] !== GHOST) locations.push({ i: location.i + 1, j: location.j });
                    if (gBoard[location.i][location.j + 1] !== WALL && gBoard[location.i][location.j + 1] !== GHOST) locations.push({ i: location.i, j: location.j + 1 });
                    if (gBoard[location.i][location.j - 1] !== WALL && gBoard[location.i][location.j - 1] !== GHOST) locations.push({ i: location.i, j: location.j - 1 });
                    if (gBoard[location.i - 1][location.j] !== WALL && gBoard[location.i - 1][location.j] !== GHOST) locations.push({ i: location.i - 1, j: location.j });
                    break;
            }
            break;
    }
    if (locations.length === 0) return null;
    return locations[0];
}


function getGhostHTML(ghost) {
    if (gPacman.isSuper) return `<span style="color:aqua;">${GHOST}</span>`
    return `<span style="color:${ghost.color};">${GHOST}</span>`
}