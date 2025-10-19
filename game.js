'use strict';

// Full set of game information
let globalGameData = {};

//New save file information
const gameTemplate = {
    // Current room the player is in
    currentPlayerLocation: 'tutorial room',
    
    // Current rooms we have been in and all of the objects that could be encountered and their current location (inside a room).
    world: {
        'tutorial room': ['archway', 'paper key', 'pedestal', 'tutorial exit'],
        'tutorial hallway': ['archway', 'paper door'],
        'twotorial room': ['paper door', 'helpful sign'],
    },
    //All the impressions the player has had, which is the list of objects and rooms that the player has seen once before.
    impressions: { 'tutorial room': [] },
    //The player's inventory, which starts empty.
    inventory: [],
    //The log
    log:[],
    //All of the data for the objects inside the game
    objects: structuredClone(startingObjects),
    //Storage for flags in the game to keep track of what the player has done outside of objects.
    flags: {
        nextChain: 'miscellaneous.intro_0',
        hiddenElements: [true, true, true, true, true, true],
        tutorialPopupsSeen: [false, false, false, false, false, false, false, false, false, false, false, false],
    }
};

//Function to help parse the user's input into a valid command or return invalid if it can't
function parseCommand(move) {
    let wordList = move.split(' ');
    //return what the command is based on the first word in their input
    return wordList[0];
}

//Function to figure out what part of the user's input is the target. (remove leading commands and flair text like 'at' or 'the')
function parseTarget(game, move) {
    //First attempt to figure out the user's target based on the atlas, the inventory, and the room list (All valid targets).
    let validTargets = [...Object.keys(game.impressions), ...game.impressions[game.currentPlayerLocation], ...game.inventory];
    for (const t of validTargets) {
        if (move.includes(t)) {
            return t;
        }
    }
    //Split the user input into an array based on spaces.
    let wordList = move.split(' ');
    //Trim the commands from the output (assuming we failed to figure out what their target is). Otherwise return the whole input.
    switch (wordList[0]) {
        case 'look':
            //Remove the first word because it's a command
            wordList.shift();
            //Remove 'at' because it was likely added by the look button.
            (wordList[0] === 'at') && wordList.shift()
            break;
        case 'take':
            wordList.shift();
            //Remove 'the' because it was likely added by the take button.
            (wordList[0] === 'the') && wordList.shift()
            break;
        case 'use':
            wordList.shift();
            //Remove 'the' because it was likely added by the use button.
            (wordList[0] === 'the') && wordList.shift()
            break;
        case 'cipher:':
            wordList.shift();
            break;
        case 'travel':
            wordList.shift();
            //Remove 'to' because it was likely added by the travel button.
            (wordList[0] === 'to') && wordList.shift()
            break;
        default:
            //Just nonsense, return everything
            return move;
    }
    //rebuild the target, and return the full string.
    let text = '';
    for (let i = 0; i < wordList.length; i++) {
      text += wordList[i];
      if (i < wordList.length - 1) {
        text += " "
      }
    }
    return text;
}

//Function to add an entry of text to the log
function newLog(game, target, entry, entryName) {
    let text = '';
    // Get rid of advance text messages if they are old information (chaining of text)
    if (game.log[game.log.length - 1] === data.miscellaneous.advanceText) {
        game.log.pop();
    }
    //Find the right entry of text
    text = data[entry][entryName];
    //enhance the text with html elements
    text = enhanceText(text, game, target);
    //update the log
    game.log.push(text);
    
    // Limit size of log to max
    const MAX_LOG_SIZE = 100;
    if (game.log.length > MAX_LOG_SIZE) {
        game.log.splice(0, game.log.length - MAX_LOG_SIZE);
    }
}

//Function to make checking the properties of objects slightly easier (by combining checking it has the property with checking it)
//Also ensures that the object exists.
function checkObjectProperty(game, object, property, value = true) {
    if (Object.keys(game.objects).includes(object)) {
        //object exists
        if (game.objects[object].hasOwnProperty(property)) {
            //object has the property
            return game.objects[object][property] === value
        } else {
            //object doesn't have the property, return false unless the value to be checked was false
            return (value === false) ? true : false
        }
    } else {
        //object doesn't exist
        return false
    }
}

//Function to find the best dialog based on the conditions.
function dialogConditionChecker(game, dialogList, target, target2 = undefined) {
    //First things first, sort the list of dialog based on it's length (and just hope that always works.) longest to shortest.
    dialogList.sort((a, b) => b.length - a.length);
    //now go through the dialog options, checking if they are possible until one succeeds, then return that.
    for (const dialog of dialogList) {
        //Does it have a condition?
        if (dialog.indexOf('_') >= 0) {
            //First, is there a second condition? If so then recursively call this function until there isn't
            if (dialog.indexOf('_', dialog.indexOf('_') + 1) > 0) {
                //if the recursively called function failed a condition then continue to the next bit of dialog.
                if (dialogConditionChecker(game, [dialog.substring(dialog.indexOf('_', dialog.indexOf('_') + 1))], target2) === false) {
                    continue;
                }
            }
            //Then what is that condition (and the condition's check)?
            let check = dialog.substring(dialog.indexOf('=') + 1, dialog.indexOf('_', dialog.indexOf('_') + 1) !== -1 ? dialog.indexOf('_', dialog.indexOf('_') + 1) : dialog.length);
            switch (dialog.substring(dialog.indexOf('_') + 1, dialog.indexOf('='))) {
                case 'inv':
                    //the condition is whether an object is in the player's inventory
                    if (game.inventory.includes(check)) {
                        //it is! return the dialog
                        return dialog;
                    } else {
                        //it isn't, try the next dialog
                        continue;
                    }
                case 'room':
                    //the condition is whether the player is inside a specific room
                    if (game.currentPlayerLocation === check) {
                        //it is! return the dialog
                        return dialog;
                    } else {
                        //it isn't try the next dialog
                        continue;
                    }
                case 'on':
                    //the condition is whether the player is targeting a specific object
                    if (target2 === check) {
                        //it is! return the dialog
                        return dialog;
                    } else {
                        //it isn't, try the next dialog
                        continue;
                    }
                case 'locked':
                    //the condition is whether the object the player is targeting (usually a door) is locked/unlocked.
                    if (game.objects[target].hasOwnProperty('locked') && game.objects[target].locked === (check === 'true')) {
                        //it is! return the dialog
                        return dialog;
                    } else {
                        //it isn't, try the next dialog
                        continue;
                    }
            }
        } else {
            //Then it succeeds by default!
            return dialog;
        }
    }
    //If somehow none of the dialog succeeds then return 'false'. Should only happen with recursive checks.
    return false
}

//Function to parse the look action and return correct log entry, and update impressions
function parseLook(game, target) {
    //The user looked at something!
    //Valid targets to look at are the current location, anything inside the room, and the inventory.
    let validTargets = [game.currentPlayerLocation, ...game.impressions[game.currentPlayerLocation], ...game.inventory]
    //We have the target so, we check if the object is simple (it only has one look dialog in data.lookText) or complex.
    if ((!(Object.keys(data).includes(target)) || !(Object.keys(data[target]).some(text => text.startsWith('look')))) || !(validTargets.includes(target))) {
        //The target doesn't exist at all, or is in another room, or has no unique look text.
        newLog(game, target, 'miscellaneous', 'invalidLook')
    } else {
        //We know that the target exists and is inside the current room/is the room, so find the best text by using the condition checker.
        newLog(game, target, target, dialogConditionChecker(game, Object.keys(data[target]).filter(text => text.startsWith('look'))))
    }
}

//Function to parse the take command, return appropiate dialog and update picking up items.
function parseTake(game, target) {
    //The user tried to take something!
    //Because it's funny, have unique dialog if they attempt to take a room or an inventory item.
    //move should already be parsed by parseTarget, this might be slightly redundant.
    let invalidTargetsRooms = Object.keys(game.world);
    let invalidTargetsInventory = [...game.inventory];
    //Find text for attempting to pick up the object
    if (invalidTargetsRooms.includes(target)) {
        //Is their target a room? Then send an error
        newLog(game, target, 'miscellaneous', 'invalidRoomTake')
    } else if (invalidTargetsInventory.includes(target)) {
        //Is their target an inventory item? Then send an error
        newLog(game, target, 'miscellaneous', 'invalidInventoryTake')
    } else if (!(Object.keys(data).includes(target)) || !(Object.keys(data[target]).some(text => text.startsWith('take')))) {
        //The target exists in the room but has no unique take text, or doesn't exist, send an error
        newLog(game, target, 'miscellaneous', 'invalidTake')
    } else {
        //We know that the target exists, so run the dialogConditionChecker to find the best take response.
        newLog(game, target, target, dialogConditionChecker(game, Object.keys(data[target]).filter(text => text.startsWith('take'))))
    }
    //If the target is actually holdable, then add the object to the player's inventory, remove it from the room, and remove impression.
    //Make sure the target exists BEFORE checking its properties.
    if ((Object.keys(game.objects)).includes(target) && game.objects[target].hasOwnProperty('holdable')) {
        //Add to inventory
        game.inventory.push(target);
        //Remove it from the room
        game.world[game.currentPlayerLocation].splice(game.world[game.currentPlayerLocation].indexOf(target), 1);
        //Remove the impression of the object from the room
        game.impressions[game.currentPlayerLocation].splice(game.impressions[game.currentPlayerLocation].indexOf(target), 1);
    }
}

//Function to parse the use command and return intended text.
function parseUse(game, target, target2 = undefined) {
    //The user tried to use something!
    //If they targeted a room, then send them a unique error for fun
    let invalidTargetsRooms = Object.keys(game.world);
    //We have the target so, we check if the object is simple (it only has one look dialog in data.lookText) or complex.
    if (invalidTargetsRooms.includes(target)) {
        //The target is a room, send a unique error.
        newLog(game, target, 'miscellaneous', 'invalidRoomUse')
    } else if (!(Object.keys(data).includes(target)) || !(Object.keys(data[target]).some(text => text.startsWith('use')))) {
        //The target exists in the room, but has no unique use text, or doesn't exist at all. Send an error
        newLog(game, target, 'miscellaneous', 'invalidUse')
    } else {
        //We know that the target exists and has dialog, 
        //so 'use'ing it might have some effect, like unlocking a door or traveling to another room.
        //First, is their target2 something locked and the target the unlock object? (like a door and a key)
        if (checkObjectProperty(game, target2, 'locked') && checkObjectProperty(game, target2, 'unlockObject', target) && game.inventory.includes(target)) {
            //We know the locked object exists, is currently locked, and is unlocked by the target, which is inside the player's inventory currently.
            game.objects[target2].locked = false;
            //if the key is breakable, then break it (remove from inventory).
            if (checkObjectProperty(game, target, 'breakable')) {
                game.inventory.splice(game.inventory.indexOf(target), 1);
            }
        //Second, is their target a door that leads to another area? Then travel them to that area.
        } else if (Object.keys(game.objects).includes(target) && game.objects[target].hasOwnProperty('linkedRooms') && checkObjectProperty(game, target, 'locked', false) && target2 === undefined) {
            //We know the object exists, links multiple rooms, and is unlocked, (also the player has no target2); therefor change the player's position.
            //If they are inside one room put them into the other, and vise versa.
            let otherRoom = (game.objects[target].linkedRooms[0] === game.currentPlayerLocation) ? game.objects[target].linkedRooms[1] : game.objects[target].linkedRooms[0];
            game.currentPlayerLocation = otherRoom;
            //Also remember to add the room as an impression if they've never been before.
            if (!(Object.keys(game.impressions).includes(otherRoom))) {
                //Add the object used to travel to the new room to the starting impression
                game.impressions[otherRoom] = [target];
            }
        }
        //next we find the best dialog with the condition checker function and present the text to the user.
        newLog(game, target, target, dialogConditionChecker(game, Object.keys(data[target]).filter(text => text.startsWith('use')), target, target2))
    }
}

//Function to parse the cipher command
function parseCipher(game, code) {
    //The player has used the cipher command, we check their entire current room's object list for ciphers they might have unlocked.
    let validTargets = [...game.impressions[game.currentPlayerLocation], ...game.inventory];
    //to keep track of if a successful cipher was found (to display error text if not) set this variable
    let foundCipher = false;
    for (const potentialTarget of validTargets) {
        //Iterating through each object, does the object have a cipher? and does their cipher match?
        if (checkObjectProperty(game, potentialTarget, 'unlockCipher', code)) {
            //If yes, then we have our match.
            foundCipher = true;
            //Unlock the door
            game.objects[potentialTarget].locked = false;
            //Then send the dialog for unlocking the cipher to the user.
            newLog(game, potentialTarget, potentialTarget, 'cipher')
        }
    }
    //If a cipher wasn't found then display error text to the user.
    if (!(foundCipher)) {
        newLog(game, code, 'miscellaneous', 'invalidCipher')
    }
}

//Function to parse the travel command
function parseTravel(game, target) {
    //The user wants to travel. First is their target a vaild room?
    let validTargets = [...Object.keys(game.impressions)];
    if (!(validTargets.includes(target))) {
        //Their target isn't a room or they've never been. Send an error.
        newLog(game, target, 'miscellaneous', 'invalidTravel')
    } else if (target === game.currentPlayerLocation) {
        //Their target is the room they are currently in, since that's funny send a unique error.
        newLog(game, target, 'miscellaneous', 'invalidTravelCurrentRoom')
    } else {
        //Their target is a room they've seen at least once. Take them there and give them dialog.
        game.currentPlayerLocation = target;
        newLog(game, target, target, 'travel');
    }
}

//Function to sylize the text based on the tags and update impressions.
function enhanceText(text, game, target = undefined) {
    //return the reformated text at the end
    let enhancedText = text;
    //Create an array to fill with all the new impressions
    let impressionUpdate = [];
    //Create a check, to ensure that no objects outside the current room can be added as impressions to this one.
    let validImpressions = game.world[game.currentPlayerLocation];
    //Before parsing the tags, automatically add [c] and [/c] tags to the text based on what objects are inside the room.
    for (const item of validImpressions) {
        //is the item in the text?
        if (enhancedText.indexOf(item) > 0) {
            //then replace all with tags.
            enhancedText = enhancedText.replaceAll(item, "[c]" + item + "[/c]")
        }
    }
    //First tag! Checking for [t] and if it's in the text replacing it with the player's target.
    if (enhancedText.indexOf('[t]') > 0) {
        while (enhancedText.indexOf('[t]') > 0) {
            //We have this tag! We now break the text into two, before the tag, and after.
            let beforeText = enhancedText.substring(0, enhancedText.indexOf('[t]'));
            let afterText = enhancedText.substring(enhancedText.indexOf('[t]') + 3);
            //We update enhancedText with both halfs, the tag replaced with a string representing the player's target.
            enhancedText = beforeText + target + afterText;
        }
    }
    //Second tag! Checking for clickable text designated with [c] and [/c], if we see one then iterate until we don't
    if (enhancedText.indexOf('[c]') > 0) {
        while (enhancedText.indexOf('[c]') > 0) {
            //We have this tag! We now break the text into two, before the first tag, and after.
            let beforeText = enhancedText.substring(0, enhancedText.indexOf('[c]'));
            let tempText = enhancedText.substring(enhancedText.indexOf('[c]') + 3);
            //Now we split tempText into the middle and the after based on [/c]
            let middleText = tempText.substring(0, tempText.indexOf('[/c]'));
            let afterText = tempText.substring(tempText.indexOf('[/c]') + 4);
            //Quick aside to check if the middle (Our clickable object) is a valid one, and if so then add it to impressionUpdate.
            if (validImpressions.includes(middleText)) {
                impressionUpdate.push(middleText);
            }
            //Back to the text, we update enhancedText with all three parts the tags replaced with html spans with clickable class.
            enhancedText = beforeText + "<span class='clickable'>" + middleText + "</span>" + afterText;
        }
    }
    //chain tag, for chaining messages together
    if (enhancedText.indexOf('[chain]') > 0) {
        while(enhancedText.indexOf('[chain]') > 0) {
            //We have a message to chain!
            //Tag should look like this: [chain]miscellaneous.intro_0[/chain]
            let messageLoc = '';
            //Isolate the message location
            messageLoc = enhancedText.substring(enhancedText.indexOf('[chain]') + 7, enhancedText.indexOf('[/chain]'));
            //Copy the location of the chained message to the game data
            game.flags.nextChain = messageLoc;
            //Delete the entire chain tag, so the player never sees it.
            let tempText = enhancedText.substring(0, enhancedText.indexOf('[chain]')) + enhancedText.substring(enhancedText.indexOf('[/chain]') + 8);
            enhancedText = tempText;
        }
    }
    //Add future tags here
    //Before we end, update the impressions based on impressionUpdate.
    game.impressions[game.currentPlayerLocation] = [...new Set([...game.impressions[game.currentPlayerLocation], ...impressionUpdate])]
    //Finally all the way at the end, return the newly enhanced text
    return enhancedText;
}

//Copy the game template to the new game
function startGame() {
    console.log(`START GAME`);
    globalGameData = structuredClone(gameTemplate);
    newLog(globalGameData, '', 'miscellaneous', 'welcomeMessage');
    newLog(globalGameData, '', 'miscellaneous', 'advanceText');
    console.log(globalGameData);
    return globalGameData;
}

function updateGame(gameData) {
    globalGameData = gameData;
}

function getGameView() {
    return globalGameData;
}

function parseAction(move) {
    //Add the user's text to the log whatever it is that they typed as log as it's not nothing
    if (!(move === '')) {
        globalGameData.log.push(">>" + move);
    }
    //attempt to parse the user's command
    let command = parseCommand(move);
    //attempt to parse the user's target (and if used the 'use' command and their move contains 'on' parse target2)
    let target = undefined;
    let target2 = undefined;
    if (command === 'use' && move.includes(' on ')) {
        target = parseTarget(globalGameData, move.substring(0, move.indexOf(' on ')));
        target2 = parseTarget(globalGameData, move.substring(move.indexOf(' on ') + 4));
    } else {
        target = parseTarget(globalGameData, move);
    }
    //Check for chained message flag
    if (Object.keys(globalGameData.flags).includes('nextChain')) {
        //we need to chain a message, also don't let the player do anything unless it's a dev command
        if (!(command === 'dev')) {
            command = '';
        }
        let chainLocation = globalGameData.flags.nextChain;
        delete globalGameData.flags.nextChain;
        newLog(globalGameData, target, chainLocation.substring(0, chainLocation.indexOf('.')), chainLocation.substring(chainLocation.indexOf('.') + 1));
    }
    //Depending on the command, run different parse functions
    switch (command) {
        case 'look':
            //They are using the look command
            parseLook(globalGameData, target);
            break;
        case 'take':
            //They are using the take command
            parseTake(globalGameData, target);
            break;
        case 'use' :
            //They are using the use command
            parseUse(globalGameData, target, target2);
            break;
        case 'cipher:' :
            //They are using the use command
            parseCipher(globalGameData, target);
            break;
        case 'travel' :
            //They are using the use command
            parseTravel(globalGameData, target);
            break;
        case '' :
            //Empty command, just don't do anything. Not even an error
            break;
        default:
        //Not sure what the user is doing, send them an error!
        newLog(globalGameData, target, 'miscellaneous', 'invalidCommand');
    }
    
    //Did we send a message that chains? If so, then add advanceText to the log
    if (Object.keys(globalGameData.flags).includes('nextChain')) {
        newLog(globalGameData, target, 'miscellaneous', 'advanceText');
    }
    
    // Return updated game information
    return globalGameData;
}
