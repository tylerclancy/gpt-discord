const Discord = require('discord.js');
const axios = require('axios');
const { Client } = Discord;
const client = new Client({
  intents: ['GuildMessages', 'Guilds', 'MessageContent'],
});

require('dotenv').config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  console.log(message);

  if (message.content.startsWith('!chat')) {
    const query = message.content.slice(6);

    if (!query) {
      message.reply('Please provide a message after the !chat command.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: query,
            },
          ],
          max_tokens: 50,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      console.log(response.data);
      const reply = response.data.choices[0].message.content;

      message.reply(reply);
    } catch (error) {
      console.error(`Error fetching GPT-3 response: ${error.message}`);
      message.reply('Sorry, there was an error processing your request.');
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
