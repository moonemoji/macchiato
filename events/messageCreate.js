const fs = require("fs");
const markovText = require("node-markovify").markovTwitter;

const fileContents = fs.readFileSync("./events/macchiato_text.txt", "utf8");
const configOptions = { tweets:fileContents.split("\n"), stateSize:2, numTweetsToPredict: 1 };
const markovModel = new markovText(configOptions);

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (
            message.author.bot ||
            (!message.content.toLowerCase().startsWith("hey macchi") &&
            !message.content.toLowerCase().startsWith("hey macccha"))
        ) {
            return;
        }

        await message.channel.sendTyping();
        let answer = null;
        markovModel.generateMarkovTweets(configOptions, function(tweets) {
            answer = tweets[0].replace("\r", "");
        });

        await message.channel.send(answer);
    },
};