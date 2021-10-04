// Require the necessary discord.js classes
const { Client, Collection, Intents } = require("discord.js");
const { test_token, token } = require("./config.json");
const { getAllFiles } = require("./helpers");

const commandPath = "./commands";
const eventPath = "./events";

let commandfiles, eventFiles = [];
commandfiles = getAllFiles(commandPath, commandfiles).filter(file => file.endsWith(".js"));
eventFiles = getAllFiles(eventPath, eventFiles).filter(file => file.endsWith(".js"));

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

// Populate commands
for (const file of commandfiles) {
    const command = require(file);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// run events
for (const file of eventFiles) {
    const event = require(file);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Ready!");
});

// Login to Discord with your client's token
client.login(test_token);

// Run commands
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand() && !interaction.isContextMenu()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});