// Modified script from Andrew Hedges. The location of the original script is:
// http://andrew.hedges.name/experiments/haversine/


/*
	This script is pretty basic, but if you use it, please let me know.  Thanks!
	Andrew Hedges, andrew(at)hedges(dot)name
*/
  
var distance = {

  Rm : 3961, // mean radius of the earth (miles) at 39 degrees from the equator
  Rk : 6373, // mean radius of the earth (km) at 39 degrees from the equator
  
  mileConv : 0.621371, // conversion factor from km to mi
  ftConv : 3.28084, // conversion factor from m to ft
  
  
  // convert degrees to radians
  deg2rad : function(deg) {
    var rad = deg * Math.PI/180; // radians = degrees * pi/180
    return rad;
  },
    
  // round to given precision (decimal places)
  round : function(num, precision) {
    return Math.round( num * Math.pow(10, precision) ) / Math.pow(10, precision) ;
  },

  /* main function */
  findDistance : function(t1, n1, t2, n2, imperial) {
    var lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, dist;
  
    // convert coordinates to radians
    lat1 = this.deg2rad(t1);
    lon1 = this.deg2rad(n1);
    lat2 = this.deg2rad(t2);
    lon2 = this.deg2rad(n2);
  
    // find the differences between the coordinates
    dlat = lat2 - lat1;
    dlon = lon2 - lon1;
  
    // here's the heavy lifting
    a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
    c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
    dm = c * this.Rm; // great circle distance in miles
    dk = c * this.Rk; // great circle distance in km
  
    // round the results down to the nearest 1/1000
    if (imperial) {
      dist = this.round(dm, 3);
      if (dist < 0.003) dist = 0;
    } else {
      dist = this.round(dk, 3);
      if (dist < 0.002) dist = 0;
    }
  
    // display the result
    return dist;
  },
  
  toMiles: function(speed) {
    return speed * this.mileConv;
  },
  
  toFeet: function(height) {
    return height * this.ftConv;
  }

};

this.exports = distance;