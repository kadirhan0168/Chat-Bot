# Chat-Bot

### Opdracht 2 - Netwerken en Security

###### Written by Kadirhan Akin

---

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/en/download/current)
- ESP32 microcontroller
- DHT22 temperature and humidity sensor
- Jumper wires
- Micro USB cable

## Preparation
1. Connect the OUT pin of the DHT22 sensor to [GPI04](https://www.upesy.com/cdn/shop/articles/doc-esp32-pinout-reference-wroom-devkit_9db79068-c59c-4142-91f0-bb361d3b7dac.jpg?v=1706553444) of the ESP32
2. Connect the VCC pin of the DHT22 sensor to 5V output of the ESP32
3. Connect the GND pin of the DHT22 sensor to GND of the ESP32
4. Change the ssid and pass in secret.h to the credentials of your network

## Installation
1. Download the project files or clone the repository:
    ```
    git clone https://github.com/kadirhan0168/Chat-App.git
    ```
2. Upload chatbot.ino to your ESP32
3. Install MQTT.js by running the following command in the terminal:
    ```
    npm install mqtt --save
    ```
4. Start Docker Desktop.
5. Change your working directory to the directory that contains the `docker-compose.yml` file.
6. Execute the following command in your terminal:
    ```
    docker compose up -d
    ```

## Usage
Open your browser and go to localhost:
    ```
    https://localhost
    ```
You can send various commands to the connected bots. The bot running on your ESP32 is "BOT-1060024". Make sure to type/copy the commands exactly as shown below, anything else will be ignored by the bot.

Run the following command to turn the built-in LED of the ESP32 on
```
BOT-1060024: led:aan
```
Run the following command to turn the built-in LED of the ESP32 off
```
BOT-1060024: led:uit
```
Run the following command to receive the temperature measured by the DHT22 sensor
```
BOT-1060024: temperatuur
```
Run the following command to receive the humidity measured by the DHT22 sensor
```
BOT-1060024: vochtigheid
```
