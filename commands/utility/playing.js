const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playing")
        .setDescription("Give Macchiato a game to play!")
        .addStringOption(option =>
            option.setName("game")
                .setDescription("The game Macchi should play.")
                .setRequired(true)),
    async execute(interaction) {
        const game = interaction.options.getString("game");
        interaction.client.user.setActivity(game);
        await interaction.reply("Thanks! Hope I like it!");
    },
};