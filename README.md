# mqtt-history
A simple persistence service for MQTT protocol based on [mqtt.js](https://github.com/mqttjs/MQTT.js)

## install as a systemctl service (ubuntu for example)

```bash
sudo cp ./mqtt-history.service /lib/systemd/system/
sudo systemctl enable /lib/systemd/system/mqtt-history.service
sudo service mqtt-history start
```
