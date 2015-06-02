/*
 * Get all of the incident data and push to an array
 * Get location of browswer calling the app
 */
$(document).ready(function(){
  // get user position from browser
  navigator.geolocation.getCurrentPosition(success, error, options);
  // get incident data from table
  $("#results table tr").each(function(row, tr){
    var time = new Date($(tr).find('td:eq(4)'));
    results[row]={
      "loc":$(tr).find('td:eq(0)').text(),
      "lat":$(tr).find('td:eq(1)').text(),
      "lng":$(tr).find('td:eq(2)').text(),
      "desc":$(tr).find('td:eq(3)').text(),
      "time":$(tr).find('td:eq(4)').text(),
      "dur":$(tr).find('td:eq(5)').text()
    }
  });
});
/*
 * Initialize the map, build the markers and info windows
 * @param lat map centerpoint lat
 * @param lng map centerpoint lng
 */
function initialize(lat,lng) {
  mapOptions = {
    center: new google.maps.LatLng(lat,lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  };
  // assign map to container 
  map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
  // activate traffic layer 
  trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
  // get incident info, build marker and info window
  $.each(results, function(row){
    var center = new google.maps.LatLng(results[row].lat,results[row].lng)
    var pos_marker_options = {
      position: center,
      icon: alert_icon,
      clickable: true,
      map: map
    }
    addMarker(pos_marker_options);
    buildInfoWindow(this, center);  
  });
}
/*
 * Add a marker to the map and push to the array.
 * @param options the marker options
 */
function addMarker(options) {
  pos_marker = new google.maps.Marker(options);
  pos_markers.push(pos_marker);
}
/*
 * Display an info window on click
 * @param incident the incident information array
 * @param center the centerpoint of the incident
 */
function buildInfoWindow(incident,center){
  // build the string to put in the info box
  var contentString = "<div><h3 style='margin:10px 0'>" + incident.loc + "</h3><p>" + incident.desc + "</p><p><strong>Estimated Duration: </strong>" + incident.dur + "</p></div>";
  // build an info window object
  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    position:center
  });
  // close old info windows and open new window on click
  google.maps.event.addListener(pos_marker, 'click', function() {
    for (var i = 0; i < info_windows.length; i++) {
      info_windows[i].close();
    }
    info_windows.push(infowindow);
    infowindow.open(map);
  });
}
/*
 * Build map with user position
 * @param pos the lat/lng of the user 
 */
function success(pos) {
  crd = pos.coords;
  initialize(crd.latitude,crd.longitude);
};
/*
 * Build map with default position
 * @param err didn't get user lat/lng
 */
function error(err) {
  initialize(DLAT,DLNG);
};

// **********************
// Global Variables     *
// **********************

var DLAT = 41.7704269;
var DLNG = -72.6748323;
var results = [];
var alert_icon = 'http://projects.courant.com/traffic/img/alert-icon.png';
var info_windows = [];
var pos_markers = []; 
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};