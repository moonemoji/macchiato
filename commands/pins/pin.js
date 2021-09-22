const { Pins } = require("../../db/dbObjects.js");
const { MessageEmbed } = require("discord.js");
const { hyperlink } = require("@discordjs/builders");

module.exports = {
    data:
    {
        name: "Pin",
        type: 3,
    },
    execute: async (interaction) => {
        const msg = interaction.options.getMessage("message");

        // first try to pin the message to this channel's pins
        try {
            await msg.pin();
        }
        // we can't do that, it's time to use the pin overflow channel
        catch (error) {
            // construct embed
            // send

            // grab the pin overflow channel
            let canPin = true;
            const channelId = (await Pins.findByPk(interaction.guildId)).dataValues.channel_id;
            const ch = await interaction.client.channels.fetch(channelId).catch(() => { canPin = false; });

            // we can't pin this
            if (!canPin) {
                await interaction.reply({ content: "Sorry, pins are full and there's no overflow channel...so there's nothing I can do.", ephemeral: true });
                return;
            }

            const exampleEmbed = new MessageEmbed()
                .setColor("#FFCD5B")
                .setAuthor(msg.author.username, msg.author.avatarURL())
                .setDescription(msg.content)
                .addFields(
                    { name: "Source", value: "[Jump to message](" + msg.url + ")" },
                )
                .setTimestamp(msg.createdAt);

            await ch.send({ embeds: [exampleEmbed] });
        }

        await interaction.reply({ content: "Message pinned!", ephemeral: true });
    },
};