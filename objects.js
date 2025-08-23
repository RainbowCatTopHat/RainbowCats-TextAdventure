//Properties of objects:
//locked: denotes wether an object is locked or unlocked
//unlockObject: for locked objects, this is the object that unlocks it.
//holdable: allows an object to be picked up and added to the inventory.
//breakable: for keys, denotes that the key should be destoryed after being used.

//define all the objects in the game's starting properties.
const startingObjects = {
    //Tutorial objects
    'tutorial exit': {
        locked: true,
        unlockCipher: '12345',
    },

    pedestal: {},

    'paper key': {
        holdable: true,
        breakable: true,
    },

    archway: {
        linkedRooms: ['tutorial room', 'tutorial hallway'],
    },

    'paper door': {
        locked: true,
        unlockObject: 'paper key',
        linkedRooms: ['twotorial room', 'tutorial hallway'],
    },

    'helpful sign': {},

    //Objects inside the strange cabin? (my testing enviroment)
    // 'oak door': {
    //     locked: true,
    //     unlockObject: 'oak key',
    // },

    // bed: {},

    // nightstand: {},

    // 'oak key': {
    //     holdable: true,
    //     breakable: true,
    // },
}
    
//export it
if (typeof module === 'object') module.exports = startingObjects;
