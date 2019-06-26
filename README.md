# Bot for Discord and Trello
The bot responds to messages that begin with the words:
`bug:`, `request:`, `feedback:`, `suggestion:`, `idea:`

Bot creates a card in Trello with the name and message, marks the card with the appropriate label.
Also, there is a record in the database `sqlite3`, if a user creates more than 5 cards per day, he is banned, and all his cards are marked with the label `spam`, in order to avoid spam.

To get the status of your hits, you need to type `!feedback`, then the bot will display a list of hits, and their statuses.

## Installation

``` bash
# install dependencies
$ npm install

# to run the server dev, monitors the changes in the files
$ npm run dev

# to run the bot in production
$ npm start

```

## Before the start
Create a file `.env`, it will store keys, tokens and more. For example, there is a `.env.sample`.

The **events/post_trello.js** file contains a list of tags, you need to create the necessary tags on your board, and copy their `id` (you can find them in the browser inspector).
In this file **events/mark_as_spam.js**, you need to replace the `value:` value in quotes with the `id` of your **spam** mark.
PS: yeah, it's not very convenient, but this is how it works.