# LegacyBot Tutorial 

This document teaches you how to use Legacybot! This is a bot that will help you play the Legacy Game from UFO Press. 

NEW USER NOTE! Legacybot currently doesn't support running commands through anything but the web interface due to lack of support for Apple's UNICODE versions of the quote character `"` and the `-` character. Legacy bot, as a flavor of [UNIX command line](https://en.wikipedia.org/wiki/In_the_Beginning..._Was_the_Command_Line)  makes extensive use of both characters. 

## Table of Contents
1. [The Basics](#the-basics): getting started with legacy bot with the `.h` command
2. [Family Playbooks](#family-playbooks)
    - [Starting a Family](#starting-a-family): creating new families with the `.nf` command
    - [Setting your Family](#setting-your-family): taking on a family with the `.sf` command
    - [The Family Command](#the-basic-family-command): look at your family with the `.f` command
    - [All Families](#all-families): look at all families with the `.f -all` command
    - [Family Properties](#family-properties): getting, setting, adding to, and deleting your family's properties (stats, moves, etc)
    - [Treaty](#treaty): Giving and getting treaty from other families with the `.t` command
3. [Character Playbooks](#character-playbooks): manage your character playbook with the `.c` and `.sc` commands.
4. [Rolling Dice](#rolling-dice): roll them bones with the `.roll` command.

## The Basics
A few import things to understand first:
1)  All LegacyBot commands start with a `.` That means if you want to send a command to Legacybot, you would type in something like `.help`. 
2) All Legacybot commands have long forms and short forms. That means you can type in both `.help` and `.h` and both will do the same thing.
3) All Legacy bot commands will __self destruct__ after a default of 30 seconds. That means they will get deleted from the Discord channel! If you want a message to stick around longer than that, all commands take an optional `-k` argument where you set how long you want the command to stick around. For example, `-k=60` will keep the message for 60 seconds, and `-k=forever` will keep the message around forever.

![help](assets/screenshots/help.png)

## Commands 
You can learn about what commands ar
e available by typing in `.help -c`, or `.h -c`. All commands can be run with a `-h` flag to learn about that command.

## Family Playbooks
Families are at the heart of the Legacy game, and Legacybot has a variety of commands to let you interact with your Family playbook sheet.

### Starting a Family 

The `.family` is how you check your and other player's families, but before you do that you have to create a family first. Run the `.new-family -h` ( or `.nf -h`) command to have a look at its syntax and exmaples, or, if you want to jump right in, here's an exmaple of how to create a new family: `.nf p=tyrant n="The Citadel"`

And you should see something like this - ah, LegacyBot, babbling in the native tongue of long-dead programmers!

![new-family](assets/screenshots/new-family.png)

Note that, even though I typed in `p=tyrant`, it matched the playbook against the game's stock plabyook __The Tyrant Kings__. Legacybot will do that for any playbooks you type in that match, as a subset, against the Legacy Family Playbooks.

### Setting your family
Anyone can create a family, but it takes a real wanderer of the ruins to take ownership of it! To do that you run the `.set-family`, or `.sf`, command. In this case, `.sf "The Citadel"`.

![new-family](assets/screenshots/set-family.png)

Now that you've set your family, you can use the `.family` command to have a look at it. This is one of the beefier commands that Legacybot provides.

### The Basic Family Command

If you run simply `.family` or `.f` then Legacybot will show you a __text__ version of your Family. If you run `.f -i` then you will get an __image__ version of your Family. I find the text version more useful, because it shows you all the properties of a Family that you can change.

### All Families
You can list all the families currently in play with the `.f -all` version of the family command.

### Family Properties
At the heart of the `.family` command tools are the __property commands__. All properties of your family playbook can be retrieved or edited using these commands. You can see the list of all properties available to you with the `.f -p` 

Here are some examples to get an idea of how this works:
* `.f set name "New Family Name"` sets your name
* `.f get name` gets your name
* `.f remove name` deletes your name
* `.f add moves Sacrifice` adds the sacrifice move to your moves list
* `.f set reach 1` sets your reach to 1

Note: For bulk changing of your stats, you can also can also set your `Reach`, `Grasp`, and `Sleight` stats using the `.family-stats` command. Here's an example, setting Reach to 1, Grasp to 0 and Sleight to -1. `.fs r=1 s=-1 g=0`

### Family Resource Tracks
Mood is automatically calculated from Surplus and Need, but Data and Tech are set using the `family-resouce` command. To get a resource, do something like this: `.fr get data`. To spend a resource, do `.fr spend data`. You can get or spend more than one by using a `+` modifier, for example `.fr get data +2`. 

### Treaty

Treaty can be given or taken using the `.treaty` command. To give treaty to another Family, use the `.t give` command. For example:

![treaty](assets/screenshots/treaty1.png)

Treaty can be spent using `.treaty spend "Bullet Farm"`, for example. Remember you can always do a `-help` with any command, or example `.treaty -help`.

### Surplus and Need
Surplus and need can also managed using the `.surplus` and `.need` commands. They are easy to use. To create a surplus, do something like `.surplus add "Barter Goods"`. 

![surplus-needs](assets/screenshots/surplus-needs.png)

After you've added some needs and surpluses, they will show up on your Family sheet, along with Mood:

![surplus-needs](assets/screenshots/surplus-needs-2.png)


## Character Playbooks

Legacybot supports Characters too! To create a new charcter, run the `.character`. Note, you have to have an associated family before you can create a standard character. As with Families, Legacybot will auto-match against existing Character Playbooks if the playbook you type in contains their name.

![char](assets/screenshots/char1.png)

You can also create Quick Characters using the `.quick-character` command.

![quick](assets/screenshots/quick.png)

### Character Attributes

Character attributes are edit-able the same way that Family attributes are set -- see the [Family Properties](#family-properties) section above for a refresher, and run `.c -p` to have a look at all the character properties available for editing.

Note, you can also use the `.cs` command to bulk edit your stats. 

![cstats](assets/screenshots/cstats.png)


## Rolling Dice

Legacybot has a complete dice rolling solution. Run `.roll -h` to have a look:

![dice](assets/screenshots/dice1.png)

Let's roll some bones!

![dice](assets/screenshots/dice2.png)
























 


