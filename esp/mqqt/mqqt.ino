#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
const char *ssid = "adm";      // Enter your Wi-Fi name
const char *password = "gBpOU@kBGtk$2025";  // Enter Wi-Fi password
// const char *ssid = "RT-GPON-72";      // Enter your Wi-Fi name
// const char *password = "0005056607";  // Enter Wi-Fi password

// MQTT Broker
const char *mqtt_broker = "178.208.65.214";
// const char *mqtt_broker = "192.168.0.13";
const char *topic = "test";
const char *mqtt_username = "";
const char *mqtt_password = "";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// const int LED = 2;  //встроенный светодиод (вывод I/O 2)

unsigned long lastMsg = 0;
const long interval = 1000; // 1 секунда
unsigned long accumulator = 0;
char buf[100];

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);

  // pinMode(LED, OUTPUT);
  // digitalWrite(LED, HIGH);
  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");
  //connecting to a mqtt broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("Public EMQX MQTT broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.printf("%d. ", client.state());
      delay(2000);
    }
  }
  // Publish and subscribe
  client.subscribe(topic);
}

void callback(char *topic, byte *payload, unsigned int length) {
  // Serial.print("Message arrived in topic: ");
  // Serial.println(topic);
  // Serial.print("Message:");
  // String message;
  
  // for (int i = 0; i < length; i++) {
  //   Serial.print((char)payload[i]);
  //   message += (char)payload[i];
  // }
  // Serial.println();
  // Serial.println("-----------------------");

  // if (String(topic) == "test") {
  //   Serial.print("Changing output to ");
  //   if (message == "on") {
  //     Serial.println("on");
  //     digitalWrite(LED, HIGH);
  //   } else if (message == "off") {
  //     Serial.println("off");
  //     digitalWrite(LED, LOW);
  //   }
  // }
}

void loop() {
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;
    
    itoa(accumulator, buf, 10);
    client.publish("test-2", buf);
    accumulator = accumulator + 1;
    buf[0] = 0;
  }
}