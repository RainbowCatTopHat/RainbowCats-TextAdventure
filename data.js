//Tags (Need implementation):
//[c] and [/c]: these tags signifies clickable text, whatever they encompasses can be clicked on and added to the input, also italicizes.
//[t]: this tag refers to whatever target the player tried to interact with, which is then inserted into the text at that position.

//define all the constant data
const data = {

    //miscellaneous text
    miscellaneous: {
        //Intro text for the start of the game
        welcomeMessage: '[Welcome to a text based adventure created by RainbowCatTopHat. I hope you enjoy my game!][chain]miscellaneous.intro_0[/chain]',

        intro_0: 'In an alternate reality called the Waking Dream there exists an object known as the Dream Star. Which is said to grant any single wish to whomever manages to find it. In order to determine that only someone worthy may make a wish the Waking Dream is full of far too many wacky puzzles and challenges...[chain]miscellaneous.intro_1[/chain]',

        intro_1: "Or so you've heard.  But, with how fantastical the legend is —and frankly how many conflicting versions of the story exist— you had long ago dismissed it as just a fairytale.[chain]miscellaneous.intro_2[/chain]",

        intro_2: 'That is until one night while walking alone you came across a pale white door shimmering in a rainbow colored sheen. The clearly magical door was blocking the trail, directly in your path.[chain]miscellaneous.intro_3[/chain]',

        intro_3: 'You were still reasonably skeptical. Could this mysterious door really be related to that old legend, was it really possible to earn a wish? Yet you only hesitated for a second before you opened the door and stepped inside. After all, who would give up the opportunity to make their wish come true?[chain]miscellaneous.tutorialStart[/chain]',
        
        //All the tutorial text
        //Message for when the tutorial starts.
        tutorialStart: 'After entering the mysterious door you fall for what seems like forever, over 100 billion picoseconds. Your fall is stopped abruptly when you land on your face. The ground is polished cold stone. Just where have you ended up?[chain]miscellaneous.tutorial_0[/chain]',
        
        //When they start the game, before they've typed any commands
        tutorial_0: "[Welcome to the Waking Dream! In here the world works differently, you'll need to type \
        in commands to interact with the world around you. The first of these commands is the 'look' command, \
        used to observe your surroundings or specific objects for more information. To get started try the command \
        '[c]look at tutorial room[/c]', either by typing it into the input down below manually or by clicking the italicized \
        text up here. Then hit enter or press the green button to the right of the input.]",

        //After they've typed in the command to look around the tutorial room
        tutorial_1: "[By looking around the room you've learned what objects are around you! \
        To help you keep track, every object that you've seen is added to the red list just right of here \
        called the Room Index. You can even click on the names of objects to add them to the input just like \
        the command buttons. Next, try looking at some of the objects in the room.]",

        //All the invalid command uses text and system output
        //Used in the intro to tell the player to advance text.
        advanceText: '[Press enter to advance text...]',
        
        //Used as the default response when an invalid command is given.
        invalidCommand: 'Invalid command',

        //invalid text when looking at something that doesn't exist or is in another room
        invalidLook: "You look for the [t]. You can't find one anywhere nearby.",

        //invalid text when trying to take something that doesn't exist or is in another room
        invalidTake: "You cannot take the [t]. No matter how you try.",

        //invalid text when trying to take a room
        invalidRoomTake: "You cannot take the [c][t][/c]. Obviously! That's an entire room!",

        //invalid text when trying to take something already inside your inventory.
        invalidInventoryTake: "You CAN take the [c][t][/c]... you should know, considering you already did. \
        Look, it's in your inventory right now!",

        //invalid text when trying to use something that doesn't exist or is in another room
        invalidUse: "You can't think of any uses for [t]. Must not be very useful.",

        //invalid text when trying to use a room
        invalidRoomUse: "Use the [c][t][/c]? For what, hosting a party?",

        //invalid text for trying to travel to something that isn't a room (or one you've never been to)
        invalidTravel: "You try to travel to the [t], but get lost on the way there and end up back where you started.",

        //invalid text for trying to travel to the room you are currently standing in.
        invalidTravelCurrentRoom: "Without even needing to move, you've already arrived at the [t].",

        //invalid text for trying to solve a cipher and entering a nonfunctional code.
        invalidCipher: "You speak the secret cipher '[t]', but nothing happens. Oops, seems that wasn't it.",
    },

    //First zone the tutorial
    'tutorial room': {
        look: 'Glancing around you find yourself in a nearly featureless white room. The walls, floor, and celing are made of smooth polished marble. In the center of the room sits a marble pedestal. Behind it is a marble archway that appears to lead to another room. On the wall to the left of the one with the archway is the tutorial exit door, unexpectedly not made of marble but quartz instead.[chain]miscellaneous.tutorial_1[/chain]',
        travel: 'You hop, skip, and jump over to the tutorial room.',
    },

    'pedestal': {
        look: "Investigating the pedestal reveals a paper key placed atop it. It wasn't hidden or anything, you just didn't notice it when glancing around the room because the key blends into the marble surface.",
        take: "Yeah, so the pillar is slightly taller than waist high and entirely solid (from what you can tell) so it's pretty heafty. Even straining as hard as you can is only enough to shift the thing slightly. Unless you find some power gloves or one of those dolly hand trucks the pedestal isn't leaving this room anytime soon. Also what would you do with it?",
        use: "You're fresh out of priceless works of art, or ancient artifacts in need of displaying.",
    },

    'paper door': {
        look: "Before you stands a door made out of 100% paper. It lacks the wooden frame of Japanese sliding paper doors, and is closer in appearance to a door from a pop-up book if it were life sized. Drawn onto the door with what looks like crayon is a square window, and a drawing of a lock below the handle. It looks incredibly flimsy, yet impeads your path all the same.",
        'use_locked=true': "You pull on the handle, being incredibly careful not to tear the whole thing off. Using this fraction of your strength the door doesn't budge! It must be locked, you suppose you'll have to find a key. Not like there's any other way to get past.",
        'use_locked=false_room=twotorial room': "You pull on the handle and the door swings open effortlessly. You venture forth into the room beyond.",
        'use_locked=false_room=tutorial hallway': "You swing open the door with all the force you can (which isn't that much really, the door is effectively weightless) and march into the hallway.",
    },

    'paper key': {
        look: "This is what seems to be a key made entirely out of paper. It's an impressive bit of origami, and you can't figure out how they got the bow hole to work without cutting the paper. You almost unfold the key to find out before you catch yourself, wouldn't want to accidentally risk destroying it when you might need it later.",
        take: 'Well this certainly does look like a key item. And so you grab the paper key and attach it to your keyring. It was kind of weird that you had a keyring without any keys, but very useful right now.',
        use: "You twist the key through the air pantomiming an unlocking motion. It seems like this key only works when used on something else. Probably something locked, but you're just spitballing.",
        'use_on=pedestal_inv=paper key': "No way, finders keepers. This paper key is yours now. Not like the pedestal was using it.",
        'use_on=paper door': "You bash the flimsy paper key into the drawing of a lock on the equally flimsy paper door. Unsuprisingly the key is crumpled beyond usability from this, and you discard the shredded remains. Thankfully through the power of dream logic the drawing of a lock has opened!",
    },

    archway: {
        'look_room=tutorial room': "This looks to be a curved marble archway set into the wall. It's open, and you can see what looks like a hallway through the opening.",
        'look_room=tutorial hallway': "This looks to be a curved marble archway set into the wall. It's open, and you can see the room you appeared in this 'Waking Dream' world through the opening.",
        'use_room=tutorial room': "You walk through the open archway into the tutorial room.",
	    'use_room=tutorial hallway': "You travel through the archway into the tutorial hallway",
    },

    'tutorial exit': {
        look: "A plain door that wouldn't stand out much, save for the giant neon sign placed on it reading 'EXIT'. Around the handle of the door is a combination lock, which looks like it takes a five digit number code. Uh oh, hopefully that's written down somewhere nearby or your quest might be over rather soon.",
        take: "You peel the door from the wall and are halfway through shoving it into your inventory when you realize that you'll need the door to leave. You carefully extract the exit from your pocket and put it back on the wall as close to how it was as possible.",
        cipher: "You hear the sound of a lock clicking open. Turning toward the tutorial exit you can see that the door is no longer locked! Looks like that was the correct combination.",
        'use_locked=false': "You have beaten the tutorial! This is the current end of content",
    },

    'tutorial hallway': {
        look: "This hallway... is very empty. It's a straight path with the archway on one side and a paper door opposite. No windows, no paintings, not even any litter or dust in the corners. You'd rate this hallway 3/10 overall.",
        travel: 'You roll over to the tutorial hallway.',
    },

    'twotorial room': {
        look: "This room reminds you of the other one, the tutorial room, and so you declare it the twotorial room. With that out of the way you look around finding this room just as barren as the hallway you came from, if not more so. The only object is a helpful sign on the wall opposite you. It just gives off the vibe of providing useful information.",
        travel: 'You take things two at a time as you travel to the twotorial room.',
    },

    'helpful sign': {
        look: "The sign reads: \"I'm such a scatterbrained fop I forgot the code to the exit! I made the code something really really basic so I wouldn't forget (which didn't work, clearly). Knowing me it follows some 'obvious' pattern. From what I remember the first couple digits were '12...' and I think the last digit was equal to its placement in the sequence.\n - Placeholder Name\"\nWell, given the lack of skeletons you've seen hopefully they managed to escape. That bodes well for your own chances.",
    },

    /*outdated dialog below:
    lookText: {
        //First testing room, the strange cabin?
        'strange cabin?': 'Observing your surroundings you find yourself in some sort of [c]strange cabin?[/c] \
        The cobwebs in the corners and the dust covering every surface make it clear no one has been here in years. \
        The room is sparse and windowless, large [c]oak door[/c] in the wall opposite you the only clear entrance. \
        To your left is a dusty [c]bed[/c] and adjacent is an equally dusty [c]nightstand[/c].',

        'oak key': 'This is an [c]oak key[/c], not carved out of wood but instead coated in bark like a branch. \
        Its twisted shape makes it seem almost naturally grown.',

        'oak door': {
            locked: "You called this an [c]oak door[/c] not because you recognize the grain or color of the wood, \
            but instead because the door visually appears similar to an oak tree. It is coated in a bark-like texture, \
            and it's only really discernable as a door due to the branch handle and its placement in the wall. \
            Tugging on the handle reveals the door is locked... or that this is a push door. Pushing on the door confirms the first theory. \
            Drat.",

            unlocked: "You called this an [c]oak door[/c] not because you recognize the grain or color of the wood, \
            but instead because the door visually appears similar to an oak tree. It is coated in a bark-like texture, \
            and it's only really discernable as a door due to the branch handle and its placement in the wall. \
            Thanks to the [c]oak key[/c] you used the door is unlocked. And revealed to be pulled open as you originally guessed, sweet!",
        },

        nightstand: 'This is a [c]nightstand[/c] containing an [c]oak key[/c].',

        bed: 'This is a [c]bed[/c]. It is moldy, enough so that you decide against sleeping in it. Or touching it.',
        
        //test item
        'test item': "This is a test item. You shouldn't see this dialog.",

        //Keep at the bottom of LookText
        invalid: "You look for the [t]. You can't find one anywhere nearby.",
    },
    takeText: {
        //Strange Cabin? testing text
        'oak key': 'Indeed! The [c]oak key[/c] looks extremely convienient and useful, \
        so naturally you grab it and add it to your inventory.',

        bed: "Mmm, no thanks. It wouldn't fit into your pocket and even if it did why would you want to keep a moldy [c]bed[/c]???",

        //Keep at the bottom of takeText
        invalid: "You cannot take the [t]. No matter how you try.",

        invalidRoom: "You cannot take the [c][t][/c]. Obviously! That's an entire room!",

        invalidInventory: "You CAN take the [c][t][/c]... you should know, considering you already did. \
        Look, it's in your inventory right now!",
    },
    useText: {
        //Strange cabin testing text
        'oak key': {
            default: "Sure, but a key is useless by itself. So use the [c]oak key[/c] on... what?",

            'oak door': 'You use the [c]oak key[/c] to open the [c]oak door[/c]. This breaks the [c]oak key[/c].',

            invalid: "The [c]oak key[/c] didn't seem to have any use with that.",

        },

        bed: "You aren't tired, and even if you were you'd rather sleep on the floor.",

        //Keep at the bottom of useText
        invalid: "You can't think of any uses for [t]. Must not be very useful.",

        invalidRoom: "Use the [c][t][/c]? For what, hosting a party?",
    },
    */
}
    
//export it
if (typeof module === 'object') module.exports = data;
