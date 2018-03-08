const AWS = require('aws-sdk');
AWS.config.update({region:'us-west-2'});

const ddb = new AWS.DynamoDB();

const ddb_serializer = (() => {
  const getParams = (topic, message) => {
    const arrayTopic = topic.split('/');
    const aLength = arrayTopic.length;
    const sensor = arrayTopic.slice(-1).join('');
    const place = arrayTopic.slice(0, aLength - 1).join('/');
    const value = parseFloat(message);

    return {
      TableName: 'IotData',
      Item: {
        'timestamp': {S: new Date().toISOString()},
        'sensor': {S: sensor},
        'place': {S: place},
        'value': {N: `${value}`}
      }
    };
  };

  return {
    add: (topic, message) => {
      const params = getParams(topic, message);

      ddb.putItem(params, (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    }
  };

})();

module.exports = ddb_serializer;
