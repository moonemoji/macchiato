const { SlashCommandBuilder } = require("@discordjs/builders");
const { units, choices } = require("./units.json");
// const { CommandInteractionOptionResolver } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("convert")
        .setDescription("Converts between metric and imperial units.")
        .addStringOption(option =>
            option.setName("value")
                .setDescription("The value you want to convert.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("source")
                .setDescription("The source unit.")
                .setRequired(true)
                .addChoices(choices))
        .addStringOption(option =>
            option.setName("destination")
                .setDescription("The destination unit.")
                .setRequired(true)
                .addChoices(choices)),
    async execute(interaction) {
        let value = interaction.options.getString("value");
        const source = interaction.options.getString("source");
        const dest = interaction.options.getString("destination");
        let returnVal;

        value = parseValue(value, source);
        if (value == undefined) {
            await interaction.reply("Sorry, I don't know what that is...I can only convert numbers.");
            return;
        }

        if (units[source] != units[dest]) {
            await interaction.reply("Oh, those aren't compatible units! Try again?");
            return;
        }
        else if (source == dest) {
            await interaction.reply("Um, are you sure you need my help with that?");
            return;
        }
        else if (units[source] == "length") {
            returnVal = lengthConversion(value, source, dest);
        }

        switch (units[source]) {
        case "length":
            returnVal = lengthConversion(value, source, dest);
            break;
        case "temperature":
            if (source == "C") { // C <-> F is the only conversion
                returnVal = Number((value * (9/5)) + 32);
            }
            else {
                returnVal = Number((value - 32) * (5/9));
            }
        case "volume":
            returnVal = volumeConversion(value, source, dest);
        }

        // some rounding
        if (dest != "ftin") {
            returnVal = returnVal.toFixed(2);
        }

        await interaction.reply(returnVal + " " + dest);
    },
};

function parseValue(value, source) {
    // if it's not a ft'in" string, parsing it is much simpler
    if (source != "ftin") {
        try {
            value = Number(value);
            return value;
        }
        catch (error) {
            return;
        }
    }

    let nums = value.split("'");
    if (nums.length != 2) { return; }

    nums[1] = nums[1].slice(0, -1);

    try {
        nums[0] = Number(nums[0]);
        nums[1] = Number(nums[1]);
    }
    catch (error) {
        return;
    }

    return nums;
}

function lengthConversion(value, source, dest) {
    switch (source) {
    case "ftin":
        value = value[0] * 12 + value[1];
        source = "in"; // we want to fall through

    case "in":
        switch (dest) {
        case "in": // because of ftin this is the only allowed in->in case
            return value;
        case "cm":
            return value * 2.54;
        case "ft":
            return value / 12;
        case "ftin":
            return Math.floor(value / 12) + "'" + value % 12 + "\"";
        }

    case "cm":
        switch (dest) {
        case "in":
            return value / 2.54;
        case "ftin":
            return Math.floor((value/2.54) / 12) + "'" + ((value/2.54) % 12).toFixed(2) + "\"";
        case "ft":
            return (value / 2.54) / 12;
        }

    case "ft":
        switch (dest) {
        case "in":
            return value * 12;
        case "cm":
            return value * 12 * 2.54;
        case "ftin":
            return Math.floor(value) + "'" + ((value - Math.floor(value))*12).toFixed(2) + "\"";
        }
    }
}

function volumeConversion(value, source, dest) {
    switch (source) {
    case "mL":
        switch (dest) {
        case "cups":
            return value / 237;
        case "tbsp":
            return value / 14.787;
        case "tsp":
            return value / 4.929;
        }

    case "cups":
        switch (dest) {
        case "mL":
            return value * 237;
        case "tbsp":
            return value * 16;
        case "tsp":
            return value * 48;
        }

    case "tbsp":
        switch (dest) {
        case "mL":
            return value * 14.787;
        case "cups":
            return value / 16;
        case "tsp":
            return value * 3;
        }

    case "tsp":
        switch (dest) {
        case "mL":
            return value * 4.929;
        case "cups":
            return value / 48;
        case "tbsp":
            return value / 3;
        }
    }
}