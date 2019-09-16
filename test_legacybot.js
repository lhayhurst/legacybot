const assert = require('assert');
const db = require('./db');
const DbUtil = require('./commands/dbutil');
const FamilyPlaybook = require('./family_playbook');
const PingCommand = require('./commands/ping');
const Discord = require('discord.js');
const HelpEmbed = require('./commands/help_embed');
const HelpCommand = require('./commands/help');
const FamiliesCommand = require('./commands/family');
const DropFamilyCommand = require('./commands/drop_command');
const NeedCommand = require('./commands/need');
const SurplusCommand = require('./commands/surplus');
const SetFamilyCommand = require('./commands/set_family');
const FamilyStatCommand = require('./commands/family_stat');
const TreatyCommand = require('./commands/treaty');
const FamilyResourceCommand = require('./commands/family_resource');
const CharacterPlaybook = require('./character_playbook');
const NewCharacterCommand = require('./commands/new_character');
const QuickCharacterCommand = require('./commands/quick_character');
const CharacterCommand = require('./commands/character');
const SetCharacterCommand = require('./commands/set_character');

const RollCommand = require('./commands/roll');

const CommandsMetadata = require( './commands/commands_metadata');
const config = require('config');

describe('can config', () => {
   it('should be able to get a config value', () => {
       let ownerID = config.get('LegacyBotOwnerID');
       let prefix = config.get('LegacyBotCommandPrefix');
       let token = config.get('LegacyBotToken');
       assert.ok( token != null && token.length > 0);
       assert.ok( prefix != null && prefix.length > 0);
       assert.ok( ownerID != null && ownerID.length > 0);

   })
});

describe('make db', () => {
    it('should be able to make a db', () => {
        let mydb = db.create();
        assert.ok(mydb != null);
    });
});

describe('query db', () => {
    it('should be able to query a db', () => {
        let mydb = db.create();
        let doc = { playbook: 'The Hive', n: 5 };
        mydb.insert(doc);
        mydb.find({ playbook: 'The Hive' }).then((docs) => {
            let foundDoc = docs[0];
            assert.ok(foundDoc.playbook === 'The Hive');
        }).catch(() => {
            assert.ok(false);
        });
    });
});

describe('create family playbook ', () => {
    it('can create a family playbook', () => {
        let family = new FamilyPlaybook('Cultivator');
        family.name = 'Duhnah';
        assert.ok(family.playbook === 'Cultivator');
        assert.ok(family.name === 'Duhnah');
        family.reach = 1;
        assert.ok(1 === family.reach);
    });
});

describe('persist family playbook ', () => {
    it('can persist a family playbook', () => {
        let playbookName = 'Cultivator';
        let familyName = 'duhnah';
        let family = new FamilyPlaybook(playbookName);
        family.name = familyName;
        family.reach = 1;
        let mydb = db.create();
        mydb.insert(family);
        mydb.find({ family_name : familyName }).then((docs) => {
            assert.ok(docs.length === 1);
            let insertedRec = docs[0];
            assert.ok(familyName === insertedRec.family_name);
            assert.ok(playbookName === insertedRec.family_playbook);
            assert.ok(insertedRec.family_reach === 1);
        }).catch(() => {
            assert.fail();
        });
    });
});

describe('process ping bot command', () => {
    it('can process a ping bot command', () => {
        let commandText = '/ping';
        assert.ok( PingCommand.reply( commandText ) === "You Bet!");
    });
});

describe('do treaty stuff', () => {
    it('can give and receive treaties for two families', () => {
        let fam1 = new FamilyPlaybook("The Cultivators", 1);
        let fam2 = new FamilyPlaybook("The Hive", 1);

        fam1.giveTreatyTo(fam2);
        assert.ok(fam1.treaties[fam2.name]);
       assert.strictEqual(1, fam1.treaties[fam2.name].on_me );
        assert.ok(fam2.treaties[fam1.name]);
       assert.strictEqual(1, fam2.treaties[fam1.name].me_on );

       assert.strictEqual(true, fam1.hasTreatyWith(fam2));
       assert.strictEqual(true, fam2.hasTreatyWith(fam1));

        fam2.spendsTreatyWith(fam1);
       assert.strictEqual(0, fam2.treaties[fam1.name].me_on );
        assert.ok(fam2.treaties[fam1.name]);
       assert.strictEqual(0, fam1.treaties[fam2.name].on_me );

       assert.strictEqual(false, fam1.hasTreatyWith(fam2));
       assert.strictEqual(false, fam2.hasTreatyWith(fam1));

        fam1.receiveTreatyFrom(fam2, 2);
       assert.strictEqual(true, fam1.hasTreatyWith(fam2));
       assert.strictEqual(true, fam2.hasTreatyWith(fam1));
       assert.strictEqual(2, fam1.treaties[fam2.name].me_on );
       assert.strictEqual(2, fam2.treaties[fam1.name].on_me );

    });
});

describe( 'find stock playbook', () => {
    it( 'can find a stock playbook', () => {
       let pbName = "Starfarers";
       let stockPlaybook = FamilyPlaybook.find_stock_playbook( pbName );
      assert.strictEqual('The Stranded Starfarers', stockPlaybook );
       pbName = "Stairfarers";
       stockPlaybook = FamilyPlaybook.find_stock_playbook( pbName );
      assert.strictEqual( null, stockPlaybook );

       //check case insenitive as well
        pbName = "starfarers";
        stockPlaybook = FamilyPlaybook.find_stock_playbook( pbName );
       assert.strictEqual('The Stranded Starfarers', stockPlaybook );

    });
});

describe( 'command line help', () => {
    it( 'get help', () => {
        let command_name = "help";
        let help_command = new HelpCommand();
        let help_embed = new HelpEmbed( command_name,
            help_command.command_args,
            help_command.aliases,
            help_command.comments,
            help_command.examples
            );
        assert.ok(help_embed);
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);

        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
       assert.strictEqual( command_name, embed.title);
    });
});

describe( 'register commands test', () => {
    it( 'can register a commands ', () => {
        let registeredCommands = CommandsMetadata.getCommands();
        let help_command = new HelpCommand();
       assert.strictEqual( help_command.id, registeredCommands[help_command.id].id );
        assert.ok(registeredCommands[help_command.id].note);
    });
});

describe( 'family command line help', () => {
    it( 'get help', () => {
        let command = new FamiliesCommand();
        let commandName =  CommandsMetadata.getCommands().family.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok( command.options );
        assert.ok(help_embed);
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
       assert.strictEqual( commandName, embed.title);
    });
});

describe( 'drop family command line help', () => {
    it( 'get help', () => {
        let command = new DropFamilyCommand();
        let commandName =  CommandsMetadata.getCommands().drop_family.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok( command.options );
        assert.ok(help_embed);
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
       assert.strictEqual( commandName, embed.title);
    });
});

describe( 'need family command line help', () => {
    it( 'get help', () => {
        let command = new NeedCommand();
        let commandName =  CommandsMetadata.getCommands().need.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok( help_embed.commands );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        assert.ok(help_embed.argumentHelpText);
        assert.ok(help_embed.commandsHelpText);

        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'surplus family command line help', () => {
    it( 'surplus help', () => {
        let command = new SurplusCommand();
        let commandName =  CommandsMetadata.getCommands().surplus.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok( help_embed.commands );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        assert.ok(help_embed.argumentHelpText);
        assert.ok(help_embed.commandsHelpText);

        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});


describe( 'set family command line help', () => {
    it( 'set family help', () => {
        let command = new SetFamilyCommand();
        let commandName =  CommandsMetadata.getCommands().set_family.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        assert.ok(help_embed.argumentHelpText);

        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'set family stat command line help', () => {
    it( 'set family stat help', () => {
        let command = new FamilyStatCommand();
        let commandName =  CommandsMetadata.getCommands().family_stat.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'treaty help', () => {
    it( 'treaty help', () => {
        let command = new TreatyCommand();
        let commandName =  CommandsMetadata.getCommands().treaty.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok( help_embed.commandsHelpText);
        assert.ok( help_embed.argumentHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'roll command help', () => {
    it( 'roll help', () => {
        let command = new RollCommand();
        let commandName =  CommandsMetadata.getCommands().family_stat.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'family resource help', () => {
    it( 'family resource help', () => {
        let command = new FamilyResourceCommand();
        let commandName =  CommandsMetadata.getCommands().family_resource.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok( help_embed.commandsHelpText);
        assert.ok( help_embed.argumentHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'new character help', () => {
    it( 'new character help', () => {
        let command = new NewCharacterCommand();
        let commandName =  CommandsMetadata.getCommands().new_character.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'quick character help', () => {
    it( 'quick character help', () => {
        let command = new QuickCharacterCommand();
        let commandName =  CommandsMetadata.getCommands().quick_character.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'character help', () => {
    it( 'character help', () => {
        let command = new CharacterCommand();
        let commandName =  CommandsMetadata.getCommands().character.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});

describe( 'set character help', () => {
    it( 'set character help', () => {
        let command = new SetCharacterCommand();
        let commandName =  CommandsMetadata.getCommands().set_character.id;
        let help_embed = new HelpEmbed( commandName,
            command.command_args,
            command.aliases,
            command.comments,
            command.examples
        );
        assert.ok(help_embed);
        assert.ok( help_embed.arguments );
        assert.ok(help_embed.optionsHelpText);
        assert.ok(help_embed.argumentHelpText);
        assert.ok(help_embed.examplesHelpText);
        let embed = help_embed.embed;
        assert.ok(embed);
        assert.ok( embed instanceof Discord.RichEmbed);
        assert.ok( embed.title );
        assert.strictEqual( commandName, embed.title);
    });
});


describe( 'character playbooks', () => {
    let playbooks = CharacterPlaybook.playbooks();

    it( 'character playbooks', () => {
        assert.ok( playbooks );
        assert.strictEqual( 14, Object.keys(playbooks).length );
    });

    it( 'find stock playbooks', () => {
        let spb = CharacterPlaybook.find_stock_playbook("elder");
        assert.ok( spb );
        assert.strictEqual( "The Elder", spb);
        spb = CharacterPlaybook.find_stock_playbook("Elder");
        assert.ok( spb );
        assert.strictEqual( "The Elder", spb);
        spb = CharacterPlaybook.find_stock_playbook("foobar");
        assert.ok( spb == null );
    })
});


describe( 'character db queries', async () => {

    let test_db = db.create();
    let playbook = 'Survivor';
    let name = 'Max';
    let guild_id = 1;
    let user_id = 1;

    it("can't get a character that doesn't exist yet", async () => {
        let character = await DbUtil.get_character(name, guild_id, "test-family", db_override=test_db)
        assert.ok( character == null );
    });

    it("create and get", async () => {

        await DbUtil.insert_character(name, playbook, guild_id, "test-family", 0, 0, 0, 0, test_db);

        //its inserted, now go get it
        let character = await DbUtil.get_character(name, guild_id, "test-family", db_override=test_db)
        assert.ok( character );
        assert.strictEqual( playbook, character.playbook);
        assert.strictEqual( name, character.name);
    });

    it("get character by playbook", async () => {
        await DbUtil.insert_character(name, playbook, guild_id, "test-family", test_db);

        //its inserted, now go get it
        let character = await DbUtil.get_character_by_playbook(playbook, guild_id, test_db)
        assert.ok( character );
        assert.strictEqual(0, character.force);
        assert.strictEqual(0, character.lore);
        assert.strictEqual(0, character.steel);
        assert.strictEqual(0, character.sway);

        assert.strictEqual( playbook, character.playbook);
        assert.strictEqual( name, character.name);
    });

    it("get character by user", async () => {

        await DbUtil.insert_character(name, playbook, guild_id, "test-family", test_db);

        //its inserted, now go get it
        let character = await DbUtil.get_character_by_playbook(playbook, guild_id, test_db)
        assert.ok( character );
        assert.strictEqual( playbook, character.playbook);
        assert.strictEqual( name, character.name);

        //now update it
        await DbUtil.update_character( character, "character_user_id", user_id, test_db);

        //now go get it by user
        let character2 = await DbUtil.get_users_character(user_id, guild_id, test_db);
        assert.ok( character2);
        assert.strictEqual( playbook, character2.playbook);
        assert.strictEqual( name, character2.name);
        assert.strictEqual( user_id, character2.user_id);

    });

    it("can get_guild_characters", async () => {
        let characters = await DbUtil.get_guilds_characters(guild_id, db_override=test_db)
        assert.ok(characters.length >0) ;
    });

});



