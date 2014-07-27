/* Required functions to calculate distance */
var distance = require('distance');

// Global variables
var myCard;
var myPosition;
var prevLat = -1;
var prevLong = -1;
var currLat = -1;
var currLong = -1;
var totalDistance = 0;
var heading = -1;
var speed = -1;
var altitude = -1;
var accuracy = -1;

var imperial = true;
var units = ["", ""];
var timer = 5000;
var count = 0;

var gps = {

  getLocation : function(card) {
    console.log("getLocation");
    myCard = card;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else {
      myCard.body("Geolocation is not supported by this device.");
    }
  },
  
  showPosition : function(position) {
    myPosition = position;
    prevLat = currLat;
    prevLong = currLong;
    currLat = position.coords.latitude;
    currLong = position.coords.longitude;
    
    /* Only used on reset of data  to prevent problems with distance*/
    if (prevLat === -1 && prevLong === -1) {
      prevLat = currLat;
      prevLong = currLong;
    }
    
    heading = position.coords.heading;
    speed = position.coords.speed;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    
    // Calculate distance from previous location to current location
    totalDistance += distance.findDistance(prevLat, prevLong, currLat, currLong, imperial);
    
    // Set speed to 0 if not moving as -1 is returned normally
    if (speed === -1) {
      speed = 0;
    }
    
    // Convert m/s to km/s
    speed /= 1000;
    // Convert km/s to km/hr
    speed *= 3600;
    
    if (imperial) {
      units[0] = "mi";
      units[1] = "mph";
      // Convert km/s to mi/hr
      speed = distance.toMiles(speed);
    } else {
      units[0] = "km";
      units[1] = "kmh";
    }
    
    // Log information and update UI
    console.log("Current Latitude: " + currLat); 
    console.log("Current Longitude: " + currLong);
    console.log("Speed: " + speed);
    console.log("Heading: " + heading);
    console.log("Altitude: " + altitude);
    console.log("Accuracy: " + accuracy);
    myCard.body("Curr:\n" + currLat + "\n" + currLong + "\nDistance: " + totalDistance + " " + units[0] +
                  "\nHeading: " + heading + "\nSpeed: " + speed + " " + units[1]);
    
    count++;
    myCard.title("GPS: " + count);
    
    // Not best practice, but for now just a simple timer loop
    setInterval(gps.getLocation(myCard), this.timer);
  },
  
  showError : function(error) {
    console.log("ERROR!");
    switch(error.code) {
      case error.PERMISSION_DENIED:
        myCard.body("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        myCard.body("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        myCard.body("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        myCard.body("An unknown error occurred.");
        break;
    }
  }
  
};
this.exports = gps;