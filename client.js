'use strict';

//////////////////////
/* DATABASE FUNCTIONS */
function load_game() {
    const gameInfo = JSON.parse(localStorage.getItem('savedgame'));
    console.log(gameInfo);
    return gameInfo;
}

function save_game(gameInfo) {
    localStorage.setItem('savedgame', JSON.stringify(gameInfo));
}

//////////////////////////////////////
// Glue between play and game
// Play is the main client interaction point
// Game is the main enforcer of rules

function newGame() {
    console.log(`create a new game`);
    
    // Create a new game (game.js)
    const gameData = startGame();
    
    // Save in local storage
    save_game(gameData);
    
    // Get current view of the game (game.js)
    const view = getGameView();
    return view;
}

function loadGame() {
    console.log(`load a game`);
    
    // Load from local storage
    const gameData = load_game();
    let view;
    
    if (gameData === null) {
        // No local storage, so make a new game
        view = newGame();
    }
    else {
        // Restore game info from local storage (game.js)
        updateGame(gameData);
        view = getGameView();
    }
    
    // Update user display (play.js)
    updateScreen(view);
}

function makeMove(move) {
    // Process move (game.js)
    const gameData = parseAction(move);
    
    // Save in local storage
    save_game(gameData);
    
    // Get current view of the game (game.js)
    const view = getGameView();
    
    // Update user display (play.js)
    updateScreen(view);
}

window.onload = loadGame;
