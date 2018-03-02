#!/usr/bin/nodejs

const fs   = require('fs');
const path = require('path');

const mqtt = require('mqtt');
const config = require('./config.js');

const AUTOSAVE_INTERVAL = 1 * 1000;

var serializer = {};
var modified = false;

function autoSave() {
  if(modified) {
    save(serializer);
  }
}

function save(obj) {
  const file = getCurrentFile();

  fs.writeFile(file, JSON.stringify(obj), (err) => {
    if (err) throw err;

    console.log(new Date().toString(), 'save success');
    modified = false;
  });
}

function getCurrentFile() {
  const filename = getFileName();
  return path.format({
    root: config.outputdir,
    name: `/${filename}`,
    ext: '.json'
  });
}

function getFileName() {
  const today = new Date();
  let day = `${today.getDate()}`;
  let month = `${today.getMonth() + 1}`;
  let year = `${today.getFullYear()}`;

  day = (day.length === 1) ? ('0' + day) : day;
  month = (month.length === 1) ? ('0' + month) : month;

  return `${year}${month}${day}`;
}

function pushToTopic(topic, timestamp, message) {
  let collection = serializer[topic];
  if(!collection) {
    collection = [];
  }
  collection.push({'timestamp': timestamp.getTime(), 'value': message});
  serializer[topic] = collection;
}

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
    let message = buffer.toString();
    let timestamp = new Date();

    modified = true;
    pushToTopic(topic, timestamp, message);
    console.log(timestamp.toLocaleString(), 'message received');
  });

  setInterval(autoSave, AUTOSAVE_INTERVAL);
}

function readFileIfExists(file) {
  if(fs.existsSync(file)) {
    const data = fs.readFileSync(file);
    serializer = JSON.parse(data);
  }
  init();
}

readFileIfExists(getCurrentFile());
