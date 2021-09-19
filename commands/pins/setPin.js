const { SlashCommandBuilder } = require("@discordjs/builders");
const Sequelize = require("sequelize");
const BOT_DB = "../../bot.db";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pinchannel")
        .setDescription("Sets a channel for overflow pins. For use with the pin command.")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The pin overflow channel.")
                .setRequired(true)),
    async execute(interaction) {
        const ch = interaction.options.getChannel("channel");

        await interaction.reply("Done! From now on, if pins are full, I'll send pins in that channel instead.");
    },
};