const { Pins } = require("../../db/dbObjects.js");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    data:
    {
        name: "Pin",
        type: 3,
    },
    execute: async (interaction) => {
        const msg = interaction.options.getMessage("message");

        if (!interaction.inGuild()) {
            await interaction.reply("Sorry, this feature is only available in servers!");
            return;
        }
        const modOnly = (await Pins.findByPk(interaction.guildId)).dataValues.mod_only;
        if (modOnly != 0 && !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            await interaction.reply("You need the `Manage Messages` permission to use this command!");
            return;
        }

        // first try to pin the message to this channel's pins
        try {
            await msg.pin();
        }
        // we can't do that, it's time to use the pin overflow channel
        catch (error) {
            // grab the pin overflow channel
            let canPin = true;
            const channelId = (await Pins.findByPk(interaction.guildId)).dataValues.channel_id;
            const ch = await interaction.client.channels.fetch(channelId).catch(() => { canPin = false; });

            // we can't pin this
            if (!canPin) {
                await interaction.reply({ content: "Sorry, pins are full and there's no overflow channel...so there's nothing I can do.", ephemeral: true });
                return;
            }

            let pinEmbed = new MessageEmbed()
                .setColor("#FFCD5B")
                .setAuthor(`${msg.author.username} in ${msg.channel.toString()}`, msg.author.avatarURL())
                .setDescription(msg.content)
                .addFields(
                    { name: "Source", value: "[Jump to message](" + msg.url + ")" },
                )
                .setTimestamp(msg.createdAt);

            const img = await msg.attachments.first();
            if (img != undefined) {
                pinEmbed.setImage(img.url);
            }

            await ch.send({ embeds: [pinEmbed] });
        }

        await interaction.reply({ content: "Message pinned!" });
    },
};