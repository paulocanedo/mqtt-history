module.exports = {
  host: 'ws://192.168.0.100:3000',
  outputfile: './history.json',
  topics: [
    'casa/+/temperatura',
    'casa/+/humidade'
  ]
};
// module.exports = {
//   host: 'ws://localhost:3000',
//   outputfile: './history.json',
//   topics: [
//     'home/+/temperature',
//     'home/+/humidity'
//   ]
// };
