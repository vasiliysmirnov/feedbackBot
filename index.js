require("dotenv").config();

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const trelloKey = process.env.TRELLO_KEY;
const trelloToken = process.env.TRELLO_TOKEN;
const trelloIDList = process.env.TRELLO_ID_LIST;

[trelloKey, trelloToken, discordBotToken, trelloIDList].forEach(i => {
  if (!i) {
    console.log("Token is undefined. Please set .env file. Exit...");
    process.exit(0);
  }
});

const discord = require("discord.js");
const client = new discord.Client();
const Trello = require("node-trello");
const trelloClient = new Trello(trelloKey, trelloToken);
const postTrello = require("./events/post_trello");
const getStatus = require("./events/get_status");
const markAsSpam = require("./events/mark_as_spam");
const getAllCards = require("./events/get_all_cards");

// db
const getCount = require("./events/get_count");
const write = require("./events/write");
const getCards = require("./events/get_cards");

const feedbackList = ['bug', 'request', 'feedback', 'suggestion', 'idea'];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  let messageText = message.content;

  if(!message.author.bot && message.type == 'DEFAULT'){

    // if bot is mentioned
    if (message.isMentioned(client.user)) {
      const regex = new RegExp('^<@' + client.user.id + '>\s?(?<text>.*)', 'g');
      let m;
      while ((m = regex.exec(messageText)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        messageText = m[1].trim();
      }
      // if user type some shit
      let msgTxt = messageText.split(':')[0].toLowerCase();
      if (['bug', 'request', 'feedback', 'suggestion', 'idea', '!feedback'].includes(msgTxt) == false) {
        message.reply('I only respond to these commands: bug:, request:, feedback:, suggestion: or idea:');
      }
    }
    
    let feedbackTrigger = messageText.split(':')[0].toLowerCase()

    if (feedbackList.includes(feedbackTrigger)) {
      // count the number of created appeals
      getCount(message, function(count) {
        if (count >= 5){
          // if number of appeals is >= 5, get the last 5 and mark them as a spam
          message.channel.send('Sorry, but you can send only 5 bug reports to me in 24 hours. Please try again tomorrow!');
          getCards(message, function(cards) {
            for (let index = 0; index < cards.length; index++) {
              markAsSpam(trelloClient, cards[index].cardId)
            }
          })
        } else {
          // post to trelo
          postTrello(trelloClient, trelloIDList, message, messageText, feedbackTrigger).then((data) => {
            console.log(`SUCCESS!: ${JSON.stringify(data)}`);
            // write data to data base
            write(message, data.id);
            // send the message
            message.channel.send(`Thanks, ${message.author.username}! Your ${feedbackTrigger} saved with id: ${data.id}! You can later check the status of your ${feedbackTrigger} by typing !feedback`);
          }).catch((err) => {
            console.log(`FAILED!: ${err}`);
            message.channel.send(`oops ☹️ ${err}`);
          });
        }
      })

    } else if (messageText.startsWith('!feedback')) {
      // get status of the feedback from trello
      getStatus(message, function(cards) {
        for (let index = 0; index < cards.length; index++) {
          getAllCards(trelloClient, cards[index].cardId).then((data) => {
            console.log(`SUCCESS!: ${JSON.stringify(data)}`);
            message.channel.send(`Hi, ${message.author.username}! Status of your feedback ${cards[index].cardId}  is: ${data.name}!`);
          }).catch((err) => {
            console.log(`FAILED!: ${err}`);
            message.channel.send(`oops ☹️ ${err}`);
          })
        }
      });
    }
  }
});

client.login(discordBotToken);
