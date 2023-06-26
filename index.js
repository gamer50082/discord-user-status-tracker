const { Client, Intents } = require('discord.js');
const fs = require('fs');
const express = require('express');

const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});

const app = express();
const port = 33303;
const botToken = 'MTEwODU4ODg5NzQ3NjI4MDQxMA.GjxS8o.7U9wR9XpnF6oyWhvPWT6FiwF4rVFPCECmQZWrM';

app.get('/user/stats/:userId', (req, res) => {
  const userId = req.params.userId;

  fs.readFile('status.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the file.');
      return;
    }

    const lines = data.split('\n');
    const userHistory = lines.filter(line => line.includes(`(${userId})`));

    res.send(userHistory);
  });
});

app.get('/user/now/:userId', (req, res) => {
  const userId = req.params.userId;

  fs.readFile('status.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while reading the file.');
      return;
    }

    const lines = data.split('\n');
    const userLines = lines.filter(line => line.includes(`(${userId})`));

    if (userLines.length === 0) {
      res.status(404).send('No status changes found for the user.');
      return;
    }

    const latestLine = userLines[userLines.length - 1];

    res.send(latestLine);
  });
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const { user, status, clientStatus } = newPresence;
  const userId = user.id;
  const userName = user.username;
  const timestamp = new Date();

  const statusMessage = `${timestamp} - User ${userName} (${userId}) changed status to ${status}`;
  fs.appendFile('status.txt', statusMessage + '\n', (err) => {
    if (err) console.error(err);
  });
});

app.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
});

client.login(botToken);
