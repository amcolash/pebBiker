/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

/* Required libraries and other files */
var UI = require('ui');
//var Vector2 = require('vector2');
var gps = require('gps');

// Global variable of the timer that is used in tracking
var timer;
var pollTime = 5;
// convert seconds to ms
pollTime *= 1000;


/* Helper functions before the main app */
var getUnits = function() {
  if (gps.imperial) {
    return 'imperial';
  } else {
    return 'metric';
  }
};

var pause = function(main) {
  // cloud pebble complains about this, but is a valid function
  clearTimeout(timer);
  
  // change icon to let user know that if  tracking was happening, it has now stopped
  main.icon('images/menu_icon.png');
  main.title("pebBiker");
  // Get data from watch and update the UI
  //gps.clearTrack();
  console.log('Tracking paused');
};

var update = function(main) {
  // cloud pebble complains about this, but is a valid function
  clearTimeout(timer);
  
  main.title("Tracking");
  // change icon to let the user know that tracking is happening
  main.icon('images/menu_icon_inv.png');
  gps.startTrack(main);
  // Set timer to update every x seconds
  timer = setTimeout(function() { update(main); }, pollTime);
};

/* End helper functions*/

/* Main function and intiialization */
var main = new UI.Card({
  title: 'pebBiker',
  icon: 'images/menu_icon.png',
  //subtitle: 'Hello World!',
  body: '\nPress up button for options, select to track, down to stop tracking'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Reset',
        subtitle: 'Clear current ride'
      }, {
        title: 'Units',
        subtitle: 'Current: ' + getUnits()
      }, {
        title: 'Hard Reset',
        subtitle: 'Reset all data (if things seem broken)'
      }]
    }]
  });
  
  menu.on('select', function(e) {
    console.log('Selected item: ' + e.section + ' ' + e.item);
    if (e.section === 0) {
      if (e.item === 0) {
        console.log('1st item');
        gps.totalDistance = 0;
      }
      if (e.item === 1) {
        console.log('2nd item');
      }
      if (e.item === 2) {
        console.log('3rd item');
        gps.imperial = !gps.imperial;
        menu.item(0, 2, { title: 'Units', subtitle: 'Current: ' + getUnits() });
      }
      if (e.item === 3) {
        console.log('4th item');
      }
    }
  });
  menu.show();
});

main.on('click', 'down', function(e) {
  pause(main);
});

main.on('click', 'select', function(e) {
  console.log("Starting tracking");
  update(main);
});