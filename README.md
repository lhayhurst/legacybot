# Legacybot
This is a Discordbot for helping out with "play by post" games of [Legacy: Life Among the Ruins](https://ufopress.co.uk/our-games/legacy-life-among-ruins/). If you want to jump right in, the commands used by the bot are listed below, and the [TUTORIAL.md](TUTORIAL.md) has a bunch of examples. 

## Installation
Past [this link](https://discordapp.com/api/oauth2/authorize?client_id=619678791626915850&permissions=8&scope=bot) into your browser and select the server you'd like the bot to join.

## Commands
All commands to Legacybot begin with a dot "."  Legacybot's command help is built in to the bot; to get started, typing in `help -c`

### Commands To Develop
| Command        | Args           | Example  | Notes |
| ------------- |:-------------:| -----:|:----------:|
| /new-character     | character class=class name, name=character name | /new-character class="The Reaver" name="Max"  | This will create a new character. If a family already exists with this name, nothing will happen (all family names must be unique).  By creating a new family, that family is assigned to the Discord user unless the user dumps the family. The class must be one of the core Legacy family classes; see the ["Supported Classes"](#supported-classes) section below. | |
|/add-character      | character name      |   /add-character "Max" | Associates a user with the named character.  |
| /set-character-stats or /scs | steel=<INT> force=<INT> lore=<INT> sway=<INT> |    /scs force=1 lore=0 sway=-1 | Sets the named stat. The stat will be set for the character associated with the user.|
|/drop-character      |  character name     |   /dump-character "Max" | Disassociates a user with the named character. This won't delete the character. |
| /delete-character | character name | /delete-character "Max" | Deletes the named character. Legacybot will ask you if you are sure about this? Only the Discord user associated with a character can run this command.

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


