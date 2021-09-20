const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const { Pins } = require("../../db/dbObjects.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pinperms")
        .setDescription("Sets whether or not non-moderators can use the pin command."),
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

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("pinPermsYes")
                    .setLabel("Let anyone use it")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("pinPermsNo")
                    .setLabel("Only let mods use it")
                    .setStyle("PRIMARY"),
            );

        await interaction.reply({ content: "Should moderators be the only ones able to use my pin command?", components: [row] });
        //Pins.upsert({ guild_id: interaction.guildId, channel_id: ch.id });
    },
};