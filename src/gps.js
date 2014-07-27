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
    console.log("showPostition");
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
    
    totalDistance += distance.findDistance(prevLat, prevLong, currLat, currLong, imperial);
    heading = position.coords.heading;
    speed = position.coords.speed;
    altitude = position.coords.altitude;
    accuracy = position.coords.accuracy;
    
    console.log("Current Latitude: " + currLat); 
    console.log("Current Longitude: " + currLong);
    console.log("Speed: " + speed);
    console.log("Heading: " + heading);
    console.log("Altitude: " + altitude);
    console.log("Accuracy: " + accuracy);
    myCard.body("Curr:\n" + currLat + "\n" + currLong + "\nDistance: " + totalDistance + "\nHeading: " + heading +
                  "\nSpeed: " + speed);
  },
  
  showError : function(error) {
    console.log("error");
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