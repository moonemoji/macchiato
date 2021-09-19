// Require the necessary discord.js classes
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const { getAllFiles } = require("./helpers");

const commandPath = "./commands";

let files = [];
files = getAllFiles(commandPath, files).filter(file => file.endsWith(".js"));

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

for (const file of files) {
    const command = require(file);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once("ready", () => {
    console.log("Ready!");
});

// Login to Discord with your client's token
client.login(token);

// Run commands
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

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