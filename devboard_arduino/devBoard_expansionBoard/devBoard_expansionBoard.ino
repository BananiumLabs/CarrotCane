#include <Wire.h>
#include <LiquidCrystal.h>
#include <NewPing.h>

LiquidCrystal lcd(8, 9, 4, 5, 6, 7);           // select the pins used on the LCD panel

int LED = 13;
int commandInt = -1;
int pResistor = A2;

short refreshTimer = 0; // Holds speed for LCD refresh speed - DO NOT MODIFY


#define TRIGGER_PIN   13 // Arduino pin tied to trigger pin on ping sensor.
#define ECHO_PIN      12 // Arduino pin tied to echo pin on ping sensor.

#define ALARM_PIN     A1 // Change back to 11 later

#define MAX_DISTANCE 300 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.
unsigned int pingSpeed = 50; // How frequently are we going to send out a ping (in milliseconds). 50ms would be 20 times a second.
unsigned long pingTimer;     // Holds the next ping time.
double lastDistance = -1;
double runningAvg = 0; //Current value of the average
int currAvg = 0; // Current number of values calculated into the average. Maxes out at AVG_COUNT
int AVG_COUNT = 15; // Max number of values to check before the current value to calculate avg
int ALARMLENGTH = 25; //ms
int alarm_current = 0;

String commandList[] = {
  "LED0ON",
  "LED0OFF"
};


int lcd_key     = 0;
int adc_key_in  = 0;
#define btnRIGHT  0
#define btnUP     1
#define btnDOWN   2
#define btnLEFT   3
#define btnSELECT 4
#define btnNONE   5



byte rightArrow[8] = {
  B00000,
  B00100,
  B00010,
  B11111,
  B00010,
  B00100,
  B00000,
  B00000
};

int lineLocation = 0;
boolean changedLine = false;
boolean startProg = false;
boolean displayed = false;

int currentRoutine = -1;
int read_LCD_buttons(){               // read the buttons
    adc_key_in = analogRead(0);       // read the value from the sensor 
    //Serial.println(adc_key_in);
   
    if (adc_key_in > 800) return btnNONE; 

    if (adc_key_in < 50)   return btnRIGHT;  
    if (adc_key_in < 200)  return btnUP; 
    if (adc_key_in < 350)  return btnDOWN; 
    if (adc_key_in < 450)  return btnLEFT; 
    if (adc_key_in < 650)  return btnSELECT;  


    return btnNONE;                // when all others fail, return this.
}

void(* resetFunc) (void) = 0; //declare reset function @ address 0




void setup() {
  // Define the LED pin as Output
  Serial.begin(115200);
  pinMode (LED, OUTPUT);
  pinMode (ALARM_PIN, OUTPUT);
  pinMode(pResistor, INPUT);// Set pResistor - A0 pin as an input (optional)

  digitalWrite(LED, LOW);
  // Start the I2C Bus as Slave on address 1
  Wire.begin(1); 
  // Attach a function to trigger when something is received.
  Wire.onReceive(receiveEvent);
  lcd.begin(16, 2);
  lcd.createChar(0, rightArrow);
  Serial.println("Extension Board Active");
  lcd.print("Extension Board");
  delay(500);
  //lcd.setCursor(0,2);
  currentRoutine = -1;
  
  pingTimer = millis(); // Start now.

}
void receiveEvent(int bytes) {
  commandInt = Wire.read();    // read one character from the I2C
  Serial.println(commandInt);
  lcd.clear();
  lcd.setCursor(0,1);
  lcd.write("RAW:");
  lcd.print(commandInt);
  lcd.setCursor(0,2);
  
  lcd.print(commandList[commandInt]);
}
void loop() {
  lcd_key = read_LCD_buttons();
  switch (lcd_key) {
    case btnUP:{
      if(lineLocation > 0) {
        lineLocation--;
        changedLine = true;
      }
      break;
    }
    case btnDOWN:{
      if(lineLocation < 1) {
        lineLocation++;
        changedLine = true;
      }
      break;
    }
    case btnSELECT:{
      displayed = false;
      currentRoutine = lineLocation;
      break;
    }
    case btnLEFT:{
      currentRoutine = -1;
      displayed = false;
      lcd.clear();
      lcd.setCursor(0,0);
      break;
    }
  }
  if(commandInt == 2) { //2 is pause
      resetFunc();  //call reset
      currentRoutine = -1;
      displayed = false;
      lcd.clear();
      lcd.setCursor(0,0);
      commandInt = -1;
      lineLocation = 0;
      lcd.print("---BUSY---");
      lcd.setCursor(0,1);
      lcd.print("-Please Wait-");
      
  }
  if(commandInt == 3) { //3 is start
    currentRoutine = 0;
    displayed = false;
    lcd.clear();
    lcd.setCursor(0,0);
    commandInt = -1;
    lineLocation = 0;
  }
  if(changedLine) {
    lcd.setCursor(0,lineLocation);
    lcd.write(byte(0));
    if(lineLocation == 1) {
      lcd.setCursor(0, 0);
      lcd.print(" ");
    }
    if(lineLocation == 0) {
      lcd.setCursor(0, 1);
      lcd.print(" ");
    }
    changedLine = false;
  }
  if(currentRoutine == -1) {
    if(!displayed) {
      alarm_current = 0;
      digitalWrite(ALARM_PIN, LOW);

      lcd.clear(); 
      lcd.setCursor(3,0);             // set the LCD cursor   position 
      lcd.print("MAIN MENU");
      delay(500);
        

      lcd.setCursor(0,0);             // set the LCD cursor   position 
      lcd.print(" Start CarrotCane");
      lcd.setCursor(0,1);
      lcd.print(" Configuration");
      lcd.setCursor(0,lineLocation);
      lcd.write(byte(0));
      displayed = true;
    }
  }
  if(currentRoutine == 0) {
      if(!displayed) {
        displayed = true;
      }
      if (millis() >= pingTimer) {   // pingSpeed milliseconds since last ping, do another ping.
      pingTimer += pingSpeed;      // Set the next ping time.
      sonar.ping_timer(echoCheck); // Send out the ping, calls "echoCheck" function every 24uS where you can check the ping status.
    }
    
    //If value received is 0 blink LED for 200 ms
//    if (commandInt != -1) {
//      digitalWrite(LED, HIGH);
//      delay(200);
//      digitalWrite(LED, LOW);
//      delay(200);
//      commandInt = -1;
//    }
  }

  if(currentRoutine == 1) {
      if(!displayed) {
        lcd.clear();
        lcd.print("Please use WEB");
        lcd.setCursor(0,1);
        lcd.print("control panel!");
        displayed = true;
      }
  }
  
}

void echoCheck() { // Timer2 interrupt calls this function every 24uS where you can check the ping status.
  // Don't do anything here!
  if (sonar.check_timer()) { // This is how you check to see if the ping was received.
    // Here's where you can add code.
    

    if(refreshTimer >= 2) {
      Serial.print("Ping: ");
      Serial.print(sonar.ping_result / US_ROUNDTRIP_CM); // Ping returned, uS result in ping_result, convert to cm with US_ROUNDTRIP_CM.
      Serial.println("cm");
      
      lcd.clear();
      lcd.print("DIST: ");
      lcd.print(sonar.ping_result / US_ROUNDTRIP_CM); // Ping returned, uS result in ping_result, convert to cm with US_ROUNDTRIP_CM.
      lcd.println("cm      ");
      lcd.setCursor(0,2);

      lcd.print(runningAvg / (sonar.ping_result / US_ROUNDTRIP_CM));
      lcd.print(" ");
      lcd.print(runningAvg);
      refreshTimer = 0;



      
    }
    refreshTimer++;
    
    if((runningAvg / (sonar.ping_result / US_ROUNDTRIP_CM)) > 2 && alarm_current == 0 && sonar.ping_result != 0) {
      // Minimum 130 MAX 255
      // DO NOT BYPASS RESISTOR!!!!!
      analogWrite(ALARM_PIN, 255);
      alarm_current++;
    }
    if (alarm_current != 0) {
      alarm_current++;
    }
    if (alarm_current > ALARMLENGTH){
      analogWrite(ALARM_PIN, 0);
      alarm_current = 0;
    }



       lastDistance = sonar.ping_result / US_ROUNDTRIP_CM;
       if(currAvg < AVG_COUNT)
          currAvg++;

       runningAvg = (runningAvg * ((currAvg - 1.0)/(currAvg)) + (lastDistance / currAvg));

    
  }
  // Don't do anything here!
}
