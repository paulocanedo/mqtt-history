#!/usr/bin/nodejs

const mqtt = require('mqtt');
const config = require('./config.js');

let serializer = require('./src/dynamodb_serializer.js');

function init() {
  console.log('connecting', config.host);
  const client = mqtt.connect(config.host);
  client.on('connect', ack => {
    console.log(new Date().toString(), 'connected');
  });

  for(let topic of config.topics) {
    client.subscribe(topic);
  }

  client.on('message', function (topic, buffer) {
    console.log(timestamp.toLocaleString(), 'message received');

    let message = buffer.toString();
    serializer.add(topic, message);
  });
}

init();
