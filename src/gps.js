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
var prevTime = -1;
var currTime = -1;
var speed = -1;
var altitude = -1;
var accuracy = -1;

var locationOptions = {
  timeout: 15000,
  maximumAge: 6000,
  enableHighAccuracy: true
};

//var tracker;

var count = 0;
var path = '';

var imperial = true;
var units = [];

var gps = {

  startTrack : function(card) {
    myCard = card;
    if (navigator.geolocation) {
      console.log("Updating location");
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError, locationOptions);
    } else {
      myCard.body("Geolocation is not supported by this device.");
    }
  },
  
  //clearTrack : function() {
    //console.log("Stopping tracking");
    //tracker.clearWatch();
  //},
  
  showPosition : function(position) {
   
    prevLat = currLat;
    prevLong = currLong;
    currLat = position.coords.latitude;
    currLong = position.coords.longitude;
    
    path = '[' + currLat + ',' + currLong + '],' + path;
    console.log('path: ' + path);
    
    prevTime = currTime;
    currTime = new Date().getTime();
    
    /* Only used on reset of data  to prevent problems with distance*/
    if (prevLat === -1 || prevLong === -1 || prevTime === -1) {
      prevLat = currLat;
      prevLong = currLong;
      prevTime = currTime;
    }
    
    // Calculate distance from previous location to current location
    var tempDist = distance.findDistance(prevLat, prevLong, currLat, currLong, imperial);
    totalDistance = distance.round(tempDist + totalDistance, 3); // Double rounding to make sure
    
    heading = distance.getBearing(prevLat, prevLong, currLat, currLong);
    speed = distance.getSpeed(tempDist, prevTime, currTime);
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    
   
    // Set heading to unknown("?") instead of "-1"
    if (heading === -1) {
      heading = "?";
    }
    
    // Set speed to 0 if not moving as -1 is returned normally
    if (speed === -1) {
      speed = "?";
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
    
    // Log final data
    console.log("-----------------------------------------------");
    console.log("Current Latitude: " + currLat); 
    console.log("Current Longitude: " + currLong);
    console.log("Speed (From GPS): " + speed);
    console.log("Heading (From GPS): " + heading);
    console.log("Altitude: " + altitude);
    console.log("Accuracy: " + accuracy);
    console.log("-----------------------------------------------");
    
    // Update UI
    count++;
    myCard.title("pebBiker: " + count);
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