/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

/* Required libraries and other files */
var UI = require('ui');
//var Vector2 = require('vector2');
var gps = require('gps');

/* Main function and intiialization */
var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  //subtitle: 'Hello World!',
  body: 'Press down button to update'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  
  menu.on('select', function(e) {
    console.log('Selected item: ' + e.section + ' ' + e.item);
  });
  menu.show();
});

main.on('click', 'down', function(e) {
  console.log("down");
  gps.getLocation(main);
});