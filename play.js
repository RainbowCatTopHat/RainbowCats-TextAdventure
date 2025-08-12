'use strict';

//Keep track of the user's command and target (and secondary target) for userInput
let userCommand = "";
let userTarget = "";
let userTarget2 = "";

/* BUILD UI */

const ui = {
    enterButton: document.getElementById('enter-button'),
    userInput: document.getElementById('user-input'),
    roomHeader: document.getElementById('room-header'),
    roomList: document.getElementById('room-list'),
    inventoryList: document.getElementById('inventory-list'),
    atlasList: document.getElementById('atlas-list'),
    lookCommand: document.getElementById('look-command'),
    takeCommand: document.getElementById('take-command'),
    useCommand: document.getElementById('use-command'),
    //Temporary
    resetCommand: document.getElementById('reset-command'),
};

//Temporary reset button to wipe save progress
ui.resetCommand.addEventListener('click', function() {
    updateScreen(newGame());
});

//Function for recieving input from the user
function recievedInput(event) {
    if (event.target.id == 'enter-button' || event.key == 'Enter') {
        // console.log('I got input:' + ui.userInput.value);
        makeMove(ui.userInput.value);
        //After reading the input, resets the input field and the stored command/target.
        ui.userInput.value = '';
        userCommand = '';
        userTarget = '';
        userTarget2 = '';
    }
}

//Function to format the user's command and target into nice looking text.
function formatUserInput() {
    // console.log(`Formating based on command:${userCommand}, target:${userTarget}, target2:${userTarget2}`);
    switch (userCommand) {
        case 'look':
            ui.userInput.value = 'look at ' + userTarget;
            break;
        case 'take':
            ui.userInput.value = 'take the ' + userTarget;
            break;
        case 'use':
            //might have two targets or only one
            if (userTarget2 === '') {
                //only 1
                ui.userInput.value = 'use the ' + userTarget;
            } else {
                //has two
                ui.userInput.value = 'use the ' + userTarget + ' on ' + userTarget2;
            }
            break;
        default:
            ui.userInput.value = userTarget;
    }
}

//Function for adding the commands to the user input on click
function addCommand(event) {
    userCommand = event.target.id.substring(0, event.target.id.indexOf('-'));
    if (!(userCommand === 'use')) {
        userTarget2 = '';
    }
    formatUserInput();
}

//Add listeners for clicking the command buttons.
if (ui.lookCommand) {
    ui.lookCommand.addEventListener('click', addCommand);
}

if (ui.takeCommand) {
    ui.takeCommand.addEventListener('click', addCommand);
}

if (ui.useCommand) {
    ui.useCommand.addEventListener('click', addCommand);
}

//Add listeners for clicking the enter button and entering text.
if (ui.enterButton) {
    ui.enterButton.addEventListener('click', recievedInput);
}

if (ui.userInput) {
    ui.userInput.addEventListener('keydown', recievedInput);
}

//function for updating the visuals of the screen to reflect the new game state
function updateScreen(gameState) {
    console.log(gameState);
    //console.log(ui);
    //Update the room-header to be the name of the current room
    ui.roomHeader.innerHTML = gameState['currentPlayerLocation'];

    //Update the room, inventory, and atlas lists with current information
    //roomList wants the impression list for the current room the player is in
    updateList(ui.roomList, gameState['impressions'][gameState['currentPlayerLocation']]);
    //inventory wants the inventory
    updateList(ui.inventoryList, gameState['inventory']);
    //atlas needs the entire dictionary of impressions
    updateList(ui.atlasList, gameState['impressions']);

    //Update the log with it's information.
    let container = document.getElementById('log');
    container.replaceChildren();
    // Loop through each log entry (text) and call on_log
    for (const entry of gameState["log"]) {
        let logElement = on_log(entry);
        container.appendChild(logElement);
    }
    scroll_log_to_end();

    //Go through all the new clickable text elements and add event listeners to them.
    const clickableElements = document.querySelectorAll('.clickable');
    clickableElements.forEach((element) => {
        element.addEventListener('click', function () {
            //We want to add the word clicked to the user's target and their target2 if the use command is being used.
            if (userCommand === 'use') {
                //if userTarget is blank then put the text there, otherwise...
                //if userTarget2 is blank then put the clicked on text there, otherwise cycle down.
                if (userTarget === '') {
                    userTarget = this.textContent;
                } else if (userTarget2 === '') {
                    userTarget2 = this.textContent;
                } else {
                    userTarget = userTarget2;
                    userTarget2 = this.textContent;
                }
            } else {
                userTarget = this.textContent;
            }
            formatUserInput();
        });
        element.addEventListener('mouseenter', function () {
            //Then we want them to visually look different when moused over
            this.style.textDecoration = 'underline';
        });
        element.addEventListener('mouseleave', function () {
            //Then we want them to visually look different when moused over
            this.style.textDecoration = 'none';
        });
    });
}

//scroll to the end of the log
function scroll_log_to_end() {
    let div = document.getElementById('log');
    div.scrollTop = div.scrollHeight;
}

//function for creating a new div for the log
function on_log(text) {
    let p = document.createElement('div');
    //Give the log entry was from the player give it a different class than the server for formating and css.
    if (text.substring(0, 2) === '>>') {
        p.classList.add('log-entry-player');
    } else {
        p.classList.add('log-entry-server');
    }
    p.innerHTML = text;
    return p;
}

//function for filling one of the three lists with given list items and making them clickable elements
function updateList(listHTML, listArray) {
    //listArray will be either a list or a dictionary, if it's a dictionary I want the keys as a list.
    let convertedList = listArray;
    let finalText = '';
    if (!Array.isArray(listArray)) {
        //it isn't a list, so make it one
        //console.log(listHTML, listArray);
        convertedList = Object.keys(listArray);
    }
    //Sort the items in the list because why not
    convertedList.sort();
    //Now, for each item in the list generate tags so it'll be a clickable link and then concatonate to the finalText.
    for (let i = 0; i < convertedList.length; i++) {
        finalText +=
            "<div class='list-index'><div class='list-dot'>- </div><span class='clickable'>" + convertedList[i] + '</span></div>';
    }
    //set the listHTML's innerHTML to whatever the finalText is.
    listHTML.innerHTML = finalText;
}
