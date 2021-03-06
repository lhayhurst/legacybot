const assert = require('assert');
const FamilyPlaybookGameData = require('../family_playbook');
const PingCommand = require('../commands/ping');
const Discord = require('discord.js');
const HelpEmbed = require('../view/help_embed');
const HelpCommand = require('../commands/help');
const FamiliesCommand = require('../commands/family');
const DropFamilyCommand = require('../commands/drop_family');
const NeedCommand = require('../commands/need');
const SurplusCommand = require('../commands/surplus');
const SetFamilyCommand = require('../commands/set_family');
const FamilyStatCommand = require('../commands/family_stat');
const TreatyCommand = require('../commands/treaty');
const FamilyResourceCommand = require('../commands/family_resource');
const CharacterPlaybook = require('../character_playbook');
const NewCharacterCommand = require('../commands/new_character');
const QuickCharacterCommand = require('../commands/quick_character');
const CharacterCommand = require('../commands/character');
const SetCharacterCommand = require('../commands/set_character');
const DropCharacterCommand = require('../commands/drop_character');
const RollCommand = require('../commands/roll');

const CommandsMetadata = require( '../commands/commands_metadata');
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

describe('process ping bot command', () => {
    it('can process a ping bot command', () => {
        let commandText = '/ping';
        assert.ok( PingCommand.reply( commandText ) === "You Bet!");
    });
});


describe( 'find stock playbook', () => {
    it( 'can find a stock playbook', () => {
       let pbName = "Starfarers";
       let stockPlaybook = FamilyPlaybookGameData.find_stock_playbook( pbName );
      assert.strictEqual('The Stranded Starfarers', stockPlaybook );
       pbName = "Stairfarers";
       stockPlaybook = FamilyPlaybookGameData.find_stock_playbook( pbName );
      assert.strictEqual( null, stockPlaybook );

       //check case insenitive as well
        pbName = "starfarers";
        stockPlaybook = FamilyPlaybookGameData.find_stock_playbook( pbName );
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

describe( 'drop character command line help', () => {
    it( 'get help', () => {
        let command = new DropCharacterCommand();
        let commandName =  CommandsMetadata.getCommands().drop_character.id;
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



