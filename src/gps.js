/* Required functions to calculate distance */
var distance = require('distance');

// Global variables
var myCard;
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
var units = [];

var gps = {

  getLocation : function(card) {
    console.log("getLocation");
    myCard = card;
    if (navigator.geolocation) {
      myCard.title("Updating");
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else {
      myCard.body("Geolocation is not supported by this device.");
    }
  },
  
  showPosition : function(position) {
    prevLat = currLat;
    prevLong = currLong;
    currLat = position.coords.latitude;
    currLong = position.coords.longitude;
    
    /* Only used on reset of data  to prevent problems with distance*/
    if (prevLat === -1 && prevLong === -1) {
      prevLat = currLat;
      prevLong = currLong;
    }
    
    // Calculate distance from previous location to current location
    totalDistance += distance.findDistance(prevLat, prevLong, currLat, currLong, imperial);
    
    heading = position.coords.heading;
    speed = position.coords.speed;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    
    // Set heading to unknown("?") instead of "-1"
    if (heading === -1) {
      heading = "?";
    }
    
    // Set speed to 0 if not moving as -1 is returned normally
    if (speed === -1) {
      speed = 0;
    } else {
      // Convert m/s to km/s
      speed /= 1000;
      // Convert km/s to km/hr
      speed *= 3600;
    }
    
    if (imperial) {
      units[0] = "ft";
      units[1] = "mi";
      units[2] = "mph";
      // Convert km/s to mi/hr
      speed = distance.toMiles(speed);
      // Convert altitude from m to ft
      altitude = distance.toFeet(altitude);
    } else {
      units[0] = "m";
      units[1] = "km";
      units[2] = "kmh";
    }
    
    altitude = distance.round(altitude, 2);
    
    // Log information and update UI
    console.log("Current Latitude: " + currLat); 
    console.log("Current Longitude: " + currLong);
    console.log("Speed: " + speed);
    console.log("Heading: " + heading);
    console.log("Altitude: " + altitude);
    console.log("Accuracy: " + accuracy);
    myCard.title("pebBiker");
    myCard.body("Dist: " + totalDistance + " " + units[1] + "\nAlt: " + altitude + " " + units[0] +
                  "\nHeading: " + heading + "\nSpeed: " + speed + " " + units[2]);
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