// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([25, -5], 3);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/konts832/cjeoqig508fhb2sp9kba1n8zp/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia29udHM4MzIiLCJhIjoiY2pkcDg4dzk0MGNhMzJxcWxjaTR2ZzQ4diJ9.Cmy3Kx6eXu8a_IL8ZbkWxQ', {
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'konts832'
});

// Initialze source data
var source = new carto.source.SQL('SELECT * FROM meteorite_landings_joinall');

// Create style for the data
var style = new carto.style.CartoCSS(`
#layer {
  marker-width: 11;
  marker-fill: ramp([fall], (#f7de3e, #ec2682), ("Fell", "Found"), "=");
  marker-fill-opacity: 1;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #4b4343;
  marker-line-opacity: 1;
}
`);

// Add style to the data
var layer = new carto.layer.Layer(source, style);

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);

/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var meteortype = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (meteortype === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    source.setQuery("SELECT * FROM meteorite_landings_joinall");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    source.setQuery("SELECT * FROM meteorite_landings_joinall WHERE right_class_type = '" + meteortype + "'");
  }
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + meteortype + '"');
});