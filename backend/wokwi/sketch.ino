#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>
#include <Adafruit_BMP085.h>

// ——— Config ———
#define WIFI_SSID     "Wokwi-GUEST"
#define WIFI_PASS     ""
#define API_HOST      "http://host.docker.internal:8000"
#define API_KEY       "dev-iot-key-change-in-production"
#define SESSION_ID    "wokwi-esp32-demo"
#define DISTRICT      "Bengaluru"
#define POST_INTERVAL 10000

// ——— Pins ———
#define DHT_PIN   4
#define DHT_TYPE  DHT22
#define POT_PIN   34

// ——— OLED ———
#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ——— Sensors ———
DHT dht(DHT_PIN, DHT_TYPE);
Adafruit_BMP085 bmp;

// ——— Globals ———
unsigned long lastPost = 0;
bool sessionCreated = false;

// ——— OLED Helpers ———
void oledSetup() {
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED init failed");
    for (;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Karnataka Weather");
  display.println("IoT Sensor Node");
  display.println();
  display.println("Connecting WiFi...");
  display.display();
}

void oledShowError(const char* msg) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("ERROR");
  display.println(msg);
  display.display();
}

void oledShowData(float temp, float hum, float pres, float wind, const char* status) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 0);
  display.print("T:"); display.print(temp, 1); display.println("C");
  display.print("H:"); display.print(hum, 1);  display.println("%");
  display.print("P:"); display.print(pres, 0); display.println("hPa");
  display.print("W:"); display.print(wind, 1); display.println("km/h");

  display.println();
  display.setTextSize(1);
  display.print("Status: ");
  display.println(status);

  display.display();
}

// ——— WiFi ———
void wifiConnect() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
    display.clearDisplay();
    display.setCursor(0, 0);
    display.setTextSize(1);
    display.println("WiFi connected!");
    display.println(WiFi.localIP());
    display.display();
    delay(1000);
  } else {
    Serial.println("\nWiFi failed");
    oledShowError("WiFi failed");
    for (;;);
  }
}

// ——— API ———
void createSession() {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(API_HOST "/iot/create-session");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Api-Key", API_KEY);

  String payload = "{\"session_id\":\"" SESSION_ID "\",\"district\":\"" DISTRICT "\"}";
  int code = http.POST(payload);
  Serial.printf("create-session: %d\n", code);
  if (code == 200 || code == 201 || code == 409) {
    sessionCreated = true;
  }
  http.end();
}

void sendSensorData(float temp, float hum, float pres, float wind) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(API_HOST "/iot/sensor-data");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Api-Key", API_KEY);

  String payload = "{"
    "\"session_id\":\"" SESSION_ID "\","
    "\"temperature\":" + String(temp, 1) + ","
    "\"humidity\":" + String(hum, 1) + ","
    "\"pressure\":" + String(pres, 1) + ","
    "\"wind_speed\":" + String(wind, 1) +
    "}";

  int code = http.POST(payload);
  Serial.printf("sensor-data: %d\n", code);

  if (code != 200 && code != 201) {
    oledShowError("API send failed");
  }
  http.end();
}

// ——— Main ———
void setup() {
  Serial.begin(115200);
  delay(1000);

  Wire.begin();
  oledSetup();
  dht.begin();

  if (!bmp.begin()) {
    Serial.println("BMP180 not found");
    oledShowError("BMP180 not found");
    for (;;);
  }

  wifiConnect();
  createSession();
}

void loop() {
  if (millis() - lastPost < POST_INTERVAL) return;
  lastPost = millis();

  // Read sensors
  float temp    = dht.readTemperature();
  float hum     = dht.readHumidity();
  float pres    = bmp.readPressure() / 100.0;  // Pa -> hPa
  int   potRaw  = analogRead(POT_PIN);
  float wind    = map(potRaw, 0, 4095, 0, 500) / 10.0;  // 0-50 km/h

  // Validate DHT
  if (isnan(temp) || isnan(hum)) {
    Serial.println("DHT read failed");
    oledShowError("DHT read failed");
    return;
  }

  // Ensure session
  if (!sessionCreated) {
    createSession();
  }

  // Display on OLED
  oledShowData(temp, hum, pres, wind, sessionCreated ? "Online" : "Offline");

  // Print to serial
  Serial.printf("T=%.1fC  H=%.1f%%  P=%.0fhPa  W=%.1fkm/h\n", temp, hum, pres, wind);

  // Send to backend
  if (sessionCreated) {
    sendSensorData(temp, hum, pres, wind);
  }
}
