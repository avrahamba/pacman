var gPacman;
const PACMAN_UP = 'ᗢ';
const PACMAN_DOWN = 'ᗣ';
const PACMAN_RIGHT = 'ᗧ';
const PACMAN_LEFT = 'ᗤ';
var gPacmanIcon = PACMAN_RIGHT;


function createPacman(board) {
    gPacman = {
        location: {
            i: 5,
            j: 5
        },
        isSuper: false
    };
    board[gPacman.location.i][gPacman.location.j] = gPacmanIcon;
}

function movePacman(eventKeyboard) {
    if (!gGame.isOn) return;
    // console.log('eventKeyboard:', eventKeyboard);

    var nextLocation = getNextLocation(eventKeyboard);
    // User pressed none-relevant key in the keyboard
    if (!nextLocation) return;

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    // Hitting a WALL, not moving anywhere
    if (nextCell === WALL) return;

    // Hitting FOOD? update score
    if (nextCell === FOOD) {
        updateScore(1);
        gEatCount--;
    } else if (nextCell === SUPER_FOOD) eatingSuperFood();
    else if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            for (var i = 0; i < gGhosts.length; i++) {
                if (gGhosts[i].location.i === nextLocation.i && gGhosts[i].location.j === nextLocation.j) {
                    var ghost = gGhosts.splice(i, 1)[0];
                    if (ghost.currCellContent === FOOD || ghost.currCellContent === SUPER_FOOD) {
                        updateScore((ghost.currCellContent === FOOD) ? 1 : 10);
                        gEatCount--;
                    }
                }
            }
        } else {
            gameOver()
            renderCell(gPacman.location, EMPTY);
            return;
        }
    } else if (nextCell === CHERRY && !gPacman.isSuper) updateScore(10);

    // Update the model to reflect movement
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
    // Update the DOM
    renderCell(gPacman.location, EMPTY);

    // Update the pacman MODEL to new location  
    gPacman.location = nextLocation;

    gBoard[gPacman.location.i][gPacman.location.j] = gPacmanIcon;
    // Render updated model to the DOM
    renderCell(gPacman.location, gPacmanIcon);

}

function eatingSuperFood() {
    gPacman.isSuper = true;

    function renderGhost() {
        for (var i = 0; i < gGhosts.length; i++) {
            renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
        }
    }
    renderGhost();
    setTimeout(function() {
        gPacman.isSuper = false;
        renderGhost();
        for (var i = gGhosts.length; i < 4; i++) {
            var coordI = 11;
            var coordJ = i + 9;
            var loc = gBoard[coordI][coordJ];
            while (gBoard[coordI][coordJ] !== EMPTY && gBoard[coordI][coordJ] !== FOOD) coordJ++;

            createGhost(gBoard, coordI, coordJ);
        }
    }, 5000);
    gEatCount--;
    updateScore(10);
}

function getNextLocation(keyboardEvent) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    };

    switch (keyboardEvent.code) {
        case 'ArrowUp':
            gPacmanIcon = PACMAN_UP
            nextLocation.i--;
            break;
        case 'ArrowDown':
            gPacmanIcon = PACMAN_DOWN
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            gPacmanIcon = PACMAN_LEFT
            if (nextLocation.j === 0)
                nextLocation.j = 27;
            else
                nextLocation.j--;
            break;
        case 'ArrowRight':
            gPacmanIcon = PACMAN_RIGHT
            if (nextLocation.j === 27)
                nextLocation.j = 0;
            else
                nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}