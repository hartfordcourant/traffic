//vars
var DLAT = 41.7704269;
var DLNG = -72.6748323;
var alerts = [];

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

//get user position
$(document).ready(function(){
	navigator.geolocation.getCurrentPosition(success, error, options);
	
	$("table#alert_markers tr").each(function(row, tr){
		alerts[row]={
      "pid":parseInt($(tr).find('td:eq(0)').text()),
			"loc":$(tr).find('td:eq(1)').text(),
			"lat":parseFloat($(tr).find('td:eq(2)').text()),
			"lng":parseFloat($(tr).find('td:eq(3)').text()),
      "note":$(tr).find('td:eq(4)').text()
		}
	});
  //activate insert page
  $("button#insert").addClass("active");
  $("div.insert.page").css("display","block");
  
  buildUpdate($("select#update").val());

});

/*
 *
 */
function initialize(lat,lng) {
  /* configure map options */
  mapOptions = {
    center: new google.maps.LatLng(lat,lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  /* assign map to container */
  map = new google.maps.Map(document.getElementById("control-map-canvas"),mapOptions);
  
  /* activate traffic layer */
  trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  /* position accident marker */
  $.each(alerts, function(row){
    new google.maps.Marker({
      position: new google.maps.LatLng(alerts[row].lat,alerts[row].lng),
      map: map,
      title: alerts[row].loc
    });
  });	

  /* Get lat lng on click */
  google.maps.event.addListener(map, 'click', function(evt) {
    $("input#lat").val(evt.latLng.lat());
    $("input#lng").val(evt.latLng.lng());
    console.log(evt.latLng.lat() + " " + evt.latLng.lng());
  });
}
/*
 * 
 */
function buildUpdate(newID){
    $.each(alerts,function(row){
      if(newID == alerts[row].pid){
         $("div.update.page input#loc").val(alerts[row].loc);
         $("div.update.page input#lat").val(alerts[row].lat);
         $("div.update.page input#lng").val(alerts[row].lng);
         $("div.update.page textarea#note").val(alerts[row].note);
      }
    });
}
/*
 *
 */
function success(pos) {
  crd = pos.coords;
  initialize(crd.latitude,crd.longitude);
};
function error(err) {
  //alert('ERROR(' + err.code + '): ' + err.message);
  initialize(DLAT,DLNG);
};

//// EVENTS GO HERE ////////////////////////

//
$("button").click(function(){
  //activate button
  $("button").removeClass("active");
  $(this).addClass("active");
  //activate page
  $("div.page").css("display","none");
  $("div." + this.id + ".page").css("display","block");
});
//
$("select#update").change(function(){
  buildUpdate($("select#update").val());
})