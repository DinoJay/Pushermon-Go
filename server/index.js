const Hapi = require("hapi");
const server = new Hapi.Server();
const fetch = require("node-fetch");
const ngeohash = require("ngeohash");
const utils = require("./utils");
const Pusher = require("pusher");
const fs = require("fs");
require("dotenv").config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "eu",
  encrypted: true
});

const dummyData = require("./dummyData");

// const createDummyData = limit => d3.range(limit).map(i => ({
//   id: i,
//   text: 'dummy',
//   completed: false,
//   title: 'The evil detective',
//   description: 'You defended the evil detective from taking over the control of the blackmarket!',
//   place: 'Brussels, Marolles',
//   contentType: 'Art, Culture, Comics',
//             // TODO: change in future to component
//   coords: { 0, 0 },
//   challenge: 'Quiz',
//   difficulty: 'hard',
//   xpPoints: 100,
//   decksOfFriends: ['Nils', 'Kiran', 'Babba']
// }));


console.log("Pusher", process.env.PUSHER_APP_ID);
// List of channels that have users subscribed to
const channels = new Set();

// const tls = {
//   key: fs.readFileSync('./server.key'),
//   cert: fs.readFileSync('./server.crt')
// };

server.connection({
  port: process.env.PORT || 8000
  // tls
});

server.register([require("inert"), require("vision")], (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: "POST",
    path: "/channelhook",
    handler (request, reply) {
      console.log("init channelhook");
      console.log("handler", request.payload);

      const webhook = pusher.webhook({
        rawBody: JSON.stringify(request.payload),
        headers: request.headers
      });
      //
      if (!webhook.isValid()) {
        console.log("Invalid webhook");
        return reply(400);
      } else {
        reply(200);
      }

      webhook.getEvents().forEach((e) => {
        console.log("event", e);
        if (e.name == "channel_occupied") {
          channels.add(e.channel);
        }
        if (e.name == "channel_vacated") {
          channels.delete(e.channel);
        }
      });
    }
  });

  server.route({
    method: "GET",
    path: "/api/data",
    handler (request, reply) {
      console.log("request", request.query);
      if (!request.query)
        reply(dummyData);
      else reply(dummyData.filter(() => true));
    }
  });
  // server.route({
  //   method: 'GET',
  //   path: '/',
  //   handler (request, reply) {
  //     reply.view('index');
  //   }
  // });

  // Static resources
  // server.route({
  //   method: "GET",
  //   path: "/{param*}",
  //   handler: {
  //     directory: {
  //       path: "public"
  //     }
  //   }
  // });
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log("Server running at:", server.info.uri);

  function notification() {
    const channelArray = Array.from(channels);
    // TODO: remove random later
    const bounds = channelArray[Math.floor(Math.random() * channelArray.length)];
    if (bounds) {
      // const boundingBox = ngeohash.decode_bbox(bounds);
      // const lngMin = boundingBox[1];
      // const lngMax = boundingBox[3];
      // const latMin = boundingBox[0];
      // const latMax = boundingBox[2];

      pusher.trigger(bounds, "notification");
      console.log("notification", boundingBox);
          // const data = {
          //   id: 'Quizz',
          //   name: 'Quizz',
          //   sprite: `dump`,
          //   coordinates: [lng, lat],
          //   expires: parseInt((new Date()).getTime() + duration, 10),
          //   hp: pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat,
          //   types: pokemon.types.map(type => type.type.name[0] + type.type.name.substring(1))
    }
  }

  setTimeout(notification, 5000);
});
