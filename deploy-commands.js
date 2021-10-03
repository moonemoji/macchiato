const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token, testClient, test_token } = require("./config.json");
const { getAllFiles } = require("./helpers");

const commands = [];
let commandFiles = [];
commandFiles = getAllFiles("./commands", commandFiles).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(file);

    if ("type" in command.data) { // context menu
        commands.push(command.data);
    }
    else {
        commands.push(command.data.toJSON());
    }
}

let rest = null;
if (process.argv.length > 2 && process.argv[2] == "global") {
    rest = new REST({ version: "9" }).setToken(token);
}
else {
    rest = new REST({ version: "9" }).setToken(test_token);
}

(async () => {
    try {
        if (process.argv.length > 2 && process.argv[2] == "global") {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
        }
        else if (process.argv.length > 2 && process.argv[2] == "clear") {
            await rest.put(
                Routes.applicationGuildCommands(testClient, guildId),
                { body: [] },
            );
        }
        else {
            await rest.put(
                Routes.applicationGuildCommands(testClient, guildId),
                { body: commands },
            );
        }

        if (process.argv.length > 2 && process.argv[2] == "global") {
            console.log("Successfully registered global commands.");
        }
        else {
            console.log("Successfully registered guild commands.");
        }
    }
    catch (error) {
        console.error(error);
    }
})();