const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, Permissions } = require("discord.js");
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
                    .setCustomId("pinPermsAny")
                    .setLabel("Let anyone use it")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("pinPermsMod")
                    .setLabel("Only let mods use it")
                    .setStyle("PRIMARY"),
            );

        await interaction.reply({ content: "Should moderators be the only ones able to use my pin command?", components: [row], ephemeral: true });

        const collector = interaction.channel.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });

        let replied = false;
        collector.on("collect", i => {
            if (i.customId == "pinPermsAny") {
                Pins.upsert({ guild_id: interaction.guildId, mod_only: 0 });
                interaction.editReply({ content: "Got it, from now on anyone can use my pin command.", components: [] });
                collector.stop();
                replied = true;
            }
            else if (i.customId == "pinPermsMod") {
                Pins.upsert({ guild_id: interaction.guildId, mod_only: 1 });
                interaction.editReply({ content: "Got it, from now on only mods can use my pin command.", components: [] });
                collector.stop();
                replied = true;
            }
        });

        await new Promise(resolve => setTimeout(resolve, 15000));
        if (!replied) {
            await interaction.editReply({ content: "Sorry, I can only wait for so long...try again?", components: [] });
        }
    },
};