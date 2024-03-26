#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ESPmDNS.h>
#include <DHT.h>
#include "time.h"
#include "secret.h"

int led = 2;
int sensorPin = 4;

DHT dht(4, DHT22);
WiFiClientSecure botClient;
PubSubClient client(botClient);

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 0;
const int   daylightOffset_sec = 3600;

void wifiConnect() {
  WiFi.begin(ssid, pass);
  Serial.println("\nConnecting");

  while(WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String receivedMessage;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    receivedMessage += (char)message[i];
  }
  
  Serial.println();

  if (receivedMessage.substring(0,11) == MQTT_CLIENT_ID) {
    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (receivedMessage.substring(13) == "led:uit") {
      digitalWrite(led, LOW);
      client.publish("chat/message", "LED is uit.");
    }

    if (receivedMessage.substring(13) == "led:aan") {
      digitalWrite(led, HIGH);
      client.publish("chat/message", "LED is aan.");
    }

    if (receivedMessage.substring(13) == "vochtigheid") {
      String vochtigheid = "Vochtigheid is " + String(h) + "%";
      client.publish("chat/message", vochtigheid.c_str());
    }

    if (receivedMessage.substring(13) == "temperatuur") {
      String temperatuur = "Temperatuur is " + String(t) + "°C";
      client.publish("chat/message", temperatuur.c_str());
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASS)) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("chat/message");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void mqtt() {
  client.setServer(MQTT_HOST, MQTT_PORT);

  if (client.connect(MQTT_CLIENT_ID, MQTT_USER, MQTT_PASS)) {
    client.subscribe("chat/message");
    client.publish("chat/message", "BOT-1060024 joined the chat");
  }

  client.setCallback(callback);
}

void printLocalTime() {
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
    return;
  }
  Serial.println(&timeinfo, "%A, %B %d %Y %H:%M:%S");
}

void setup() {
  Serial.begin(115200);
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW);
  WiFi.mode(WIFI_STA);
  wifiConnect();
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();
  botClient.setCACert(local_root_ca);
  dht.begin();
  mqtt();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
