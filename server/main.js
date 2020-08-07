require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const tmi = require('tmi.js');
const dateFormat = require('dateformat');

const client = new tmi.Client({
  options: { debug: false },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASS,
  },
  channels: [process.env.CHANNEL],
});
client.connect().catch(console.error);

io.on('connection', (socket) => {
  console.log('Connected');
  client.on('message', (channel, userstate, message, self) => {
    let messageHandler = {
      displayName: userstate['display-name'],
      date: dateFormat(
        new Date(Number(userstate['tmi-sent-ts'])),
        'dd/mm/yyyy - h:MM:ss TT'
      ),
      message,
      isMod:
        userstate['badges'] !== null &&
        userstate['badges']['mod'] !== undefined,
      isBroad:
        userstate['badges'] !== null &&
        userstate['badges']['broadcaster'] !== undefined,
    };

    socket.emit('serverMessage', messageHandler);
  });

  socket.on('disconnect', () => console.log('Disconnected'));
});

http.listen(process.env.PORT, () => {
  console.log('Started ' + process.env.PORT);
});
