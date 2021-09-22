const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { Pins } = require("../../db/dbObjects.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pinchannel")
        .setDescription("Sets a channel for overflow pins. For use with the pin command.")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The pin overflow channel.")
                .setRequired(true)),
    async execute(interaction) {
        // pin is unavailable in PM
        if (!interaction.inGuild()) {
            await interaction.reply("Sorry, this feature is only available in servers!");
            return;
        }
        else if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            await interaction.reply("You need the `Manage Messages` permission to use this command!");
            return;
        }

        const ch = interaction.options.getChannel("channel");

        if (!ch.isText()) {
            await interaction.reply({ content: "Um...I can't use anything but a text channel for overflow, sorry.", ephemeral: true });
            return;
        }

        await Pins.upsert({ guild_id: interaction.guildId, channel_id: ch.id });
        await interaction.reply("Done! From now on, if pins are full, I'll send pins in " + ch.toString() + ".");
    },
};