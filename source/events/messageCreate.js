require('dotenv/config');
const { Events } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");

const botID = process.env.APPID;
const channelID = process.env.CHANNEL_ID;


const config = new Configuration({
    apiKey: process.env.KEY,
});

const openai = new OpenAIApi(config);



module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        if (message.author.bot) return;
        if (message.channel.id !== channelID) return;
        // wont trigger the bot
        if (message.content.startsWith('!')) return;

        let log = [{ role: "system", content: "You are a sarcastic chatbot. Reply should be humorous. Answer within 4 lines" }];

        await message.channel.sendTyping();

        let previousMsg = await message.channel.messages.fetch({ limit: 15 });
        previousMsg.reverse();

        previousMsg.forEach((msg) => {
            if (message.content.startsWith('!')) return;
            if (msg.author.id !== botID && message.author.bot) return;
            if (msg.author.id !== message.author.id) return;

            log.push({
                role: 'user',
                content: msg.content
            })
        })




        const result = await openai
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: log,
                max_tokens: 256,
            }).catch((err) => {
                console.log('ERROR');
                message.channel.send(`\`\`\`diff\n-${err}\`\`\``);
                return;
            });

        message.reply(result.data.choices[0].message)

    },
};