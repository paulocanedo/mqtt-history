const fs = require('fs');
const mqtt = require('mqtt');

const client = mqtt.connect('ws://192.168.0.100:3000');
const serializer = {};
const AUTOSAVE_INTERVAL = 1 * 1000;

let modified = false;

function autoSave() {
  if(modified) {
    save(serializer);
  }
}

function save(obj) {
  let file = "history.json";
  fs.writeFile(file, JSON.stringify(obj), (err) => {
    if (err) throw err;

    console.log(new Date().toString(), 'save success');
    console.log(serializer);
    modified = false;
  });
}

function pushToTopic(topic, timestamp, message) {
  let collection = serializer[topic];
  if(!collection) {
    collection = [];
  }
  collection.push({'timestamp': timestamp, 'value': message});
  serializer[topic] = collection;
}

client.on('connect', ack => {
  console.log(new Date().toString(), 'connected');
});

client.subscribe('casa/+/temperatura');
client.subscribe('casa/+/humidade');

client.on('message', function (topic, buffer) {
  let message = buffer.toString();
  let timestamp = new Date();

  modified = true;
  pushToTopic(topic, timestamp, message);
  console.log(timestamp.toString(), 'message received');
});

let saverTimerId = setInterval(autoSave, AUTOSAVE_INTERVAL);
