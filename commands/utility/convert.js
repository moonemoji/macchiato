const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("convert")
        .setDescription("Converts between metric and imperial units.")
        .addNumberOption(option =>
            option.setName("value")
                .setDescription("The value you want to convert.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("source")
                .setDescription("The source unit.")
                .setRequired(true)
                .addChoice("feet", "ft"))
        .addStringOption(option =>
            option.setName("destination")
                .setDescription("The destination unit.")
                .setRequired(true)
                .addChoice("feet", "ft")),
    async execute(interaction) {


        await interaction.reply("Converting ${value} ${source} to ${destination}");
    },
};