# Legacybot
This is a Discordbot for helping out with "play by post" games of [Legacy: Life Among the Ruins](https://ufopress.co.uk/our-games/legacy-life-among-ruins/). 

## Installation
Past [this link](https://discordapp.com/api/oauth2/authorize?client_id=619678791626915850&permissions=8&scope=bot) into your browser and select the server you'd like the bot to join.

## Commands
All commands to Legacybot begin with a forward slash "/".  Legacybot supports the following commands:

### Legacy Bot Commands 
| Command/Alias        | Args           | Example  | Notes |
| ------------- |:-------------:| -----:|:----------:|
| `/help` or `/h` or @Legacybot   | none | `/h`  | Ask the bot for help. |  
| `/family` or `/f`   | `name='<STRING>'` | `/f`, `/f name="Duhnah"`, `/f --all`| A `/f` command will get the family associated with the player (if any; see the `set-family` command). A `/f --all` command  will list all the families currently in play for your guild. `/f name="Duhnah"` command will list the family sheet for the family with the name "Duhnah".  |  
| `/new-family` or `/nf`   | `-p="Playbook Name"` `-n="Family Name"`| `/new-family -p="Cultivator of the New Flesh" -n="Duhnah"`  | This will create a new family. If a family already exists with this name, nothing will happen (all family names must be unique).  By creating a new family, that family is not assigned to the Discord user unless the user adds the family. The playbook must be one of the core Legacy family classes; see ["Supported Family Playbooks"](#supported-family-playbooks) section below. | 
 /`set-family` or `/sf`    | family name      |   `/set-family "Duhnah"` | Associates a user with the named family. This won't delete the family. |
| `/set-family-stats` or `/sfs` | `s=<INT> r=<INT> g=<INT> m=<INT> d=<INT> t=<INT>`      |    `/sfs g=-1` | Sets the named stat, with the short-hand `r` for `reach`, `g` for `grasp`, `s` for `sleight`, `d` for data, and `t` for `tech`. The stat will be set for the family associated with the user.|
| `/treaty` or `/t` | `give` or `get` or `spend` `"Family Name"`  |  `/t give "The Faith"`, `/t get "The Faith"` , `/t spend "The Faith" ` | For every other family in the game, you can have Treaty on them, and they can have Treaty on you. To get Treaty on them, use the `get` command. To give them treaty on you, use the `give` command. To spend treaty with them, use `spend`. To see your current treaties, just type in  `/t`. |
| `/surplus` or `/s` | `add` or `remove `"Resource Name"`  |  `/s add "Barter Goods"` ` | Adds or removes a Surplus |
| `/need` or `/n` | `add` or `remove` `"Resource Name"`  |  `/ add "Barter Goods"` | Adds or removes a Need |



### Commands To Develop
| Command        | Args           | Example  | Notes |
| ------------- |:-------------:| -----:|:----------:|
| /drop-family      | family name      |   /drop-family "Duhnah" | Disassociates a user with the named family. This won't delete the family. |
| /delete-family | family name | /delete-family "Duhnah" | Deletes the named family. Legacybot will ask you if you are sure about this. Only the Discord user associated with a family can run this command.
| /new-character     | character class=class name, name=character name | /new-character class="The Reaver" name="Max"  | This will create a new character. If a family already exists with this name, nothing will happen (all family names must be unique).  By creating a new family, that family is assigned to the Discord user unless the user dumps the family. The class must be one of the core Legacy family classes; see the ["Supported Classes"](#supported-classes) section below. | |
|/add-character      | character name      |   /add-character "Max" | Associates a user with the named character.  |
| /set-character-stats or /scs | steel=<INT> force=<INT> lore=<INT> sway=<INT> |    /scs force=1 lore=0 sway=-1 | Sets the named stat. The stat will be set for the character associated with the user.|
|/drop-character      |  character name     |   /dump-character "Max" | Disassociates a user with the named character. This won't delete the character. |
| /delete-character | character name | /delete-character "Max" | Deletes the named character. Legacybot will ask you if you are sure about this? Only the Discord user associated with a character can run this command.
| /roll|  --a --d  --b=<int>  |  /roll --a --b=1 |  Rolls the dice for your assumed Family or Character, taking into account all their bonuses. `/r --a --b=1` will roll with advantage and +1 modifier. `/r --d` will roll with disadvantage. |

## Development
First clone this Github repo locally.

### Configuration
Second, create your bot on the [Discord Developer Portal](https://discordapp.com/developers/applications/). 

Third, make a note of the your `token` and `owner id`. These can be configured into the app in two ways:

1) Via `config/default.json`. Put the token and owner_id into these fields. Note, this is not secure, so please be careful!
2) By setting the environment variables `LEGACY_BOT_TOKEN` and `LEGACY_BOT_OWNER_ID`. These will override the config/default.json file keys. 

### Installing Locally
Run `make install`

### Testing
Run a `make test` to run the unit tests. Tests can be found in `test_legacybot.js`.

### Running
Run `make run`

## Supported Family Playbooks

## Supported Classes 


