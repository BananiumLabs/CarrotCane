#include <Wire.h>

String inputString = "";         // a String to hold incoming data
boolean stringComplete = false;  // whether the string is complete

String commandList[] = {
  "LED0ON",
  "LED0OFF",
  "PAUSE",
  "START"
};


void setup() {
  // initialize serial:
  Serial.begin(9600);
  // reserve 200 bytes for the inputString:
  inputString.reserve(200);
  Serial.println("Dev Board Initializing...");
  Wire.begin();
  pinMode(9, OUTPUT);   
  
  Serial.println("Dev Board Initialized!");
  Serial.println("Please head to http://localhost:3000 To Get Started!");
}

void loop() {
  // print the string when a newline arrives:
  if (stringComplete) {
    int commandInt = -1;
    
    Serial.println(inputString);

    //START CUSTOM LOGIC FROM THIS LINE -----

    for(int i = 0; i < sizeof(commandList) / sizeof(String); i++) {
      if(inputString == commandList[i]) {
        commandInt = i;
      }
    }
    if(commandInt == -1) {
      Serial.println("FAIL: INVALID COMMAND");
    }
    if(commandInt != -1) {
      Wire.beginTransmission(1);
      Wire.write(commandInt);
      Wire.endTransmission();
    }
    switch(commandInt) {
      case 0: digitalWrite(9, HIGH);
        Serial.println("SUCCESS: LED0ON");
        break;
      case 1: digitalWrite(9, LOW);
        Serial.println("SUCCESS: LED0OFF");
        break;
      case 2: Serial.println("SUCCESS: PAUSE");
        break;
      case 3: Serial.println("SUCCESS: START");
        break;
    }

    
//    if(inputString.indexOf("LED0ON") >= 0 ) {
//        digitalWrite(9, HIGH);
//        Serial.println("SUCCESS: LED0ON");
//    }
//     if(inputString.indexOf("LED0OFF") >= 0 ) {
//        digitalWrite(9, LOW);
//        Serial.println("SUCCESS: LED0OFF");
//     }



    // DO NOT WRITE BELOW THIS LINE ----
    inputString = "";
    stringComplete = false;
  }
}

/*
  SerialEvent occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      inputString.trim();
      stringComplete = true;
    }
  }
}


