// Create a Discord Bot using OpenAI API that interacts on the discord server
require("dotenv").config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_KEY || configuration.apiKey });

// Check for when a message on discord is sent
client.on("messageCreate", async function (message) {
  // Check if message starts with "$"
  if (!message.content.startsWith("$")) return;
  // Remove the "$" prefix from the message
  const command = message.content.slice(1);
  try {
    if (message.author.bot) return;
    const response = await openai.createCompletion({
      prompt: command,
      model: "text-davinci-002",
    });
    message.reply(response.choices[0].text);
  } catch (err) {
    console.log(err);
  }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);