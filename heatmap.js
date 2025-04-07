// Load Leaflet and Heatmap plugin
const leafletScript = document.createElement('script');
leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
document.head.appendChild(leafletScript);

const heatScript = document.createElement('script');
heatScript.src = "https://unpkg.com/leaflet.heat/dist/leaflet-heat.js";
document.head.appendChild(heatScript);

const leafletStyle = document.createElement('link');
leafletStyle.rel = "stylesheet";
leafletStyle.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
document.head.appendChild(leafletStyle);

// Wait until libraries are loaded
function initHeatmap(data) {
  const rows = data.tables.DEFAULT;

  const heatData = rows.map(row => [
    parseFloat(row.dimensions[0]), // latitude
    parseFloat(row.dimensions[1]), // longitude
    parseFloat(row.metrics[0]) // intensity
  ]);

  const map = L.map('container').setView([0, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);

  L.heatLayer(heatData, {
    radius: 25,
    blur: 15,
    maxZoom: 17,
  }).addTo(map);
}

function checkLoaded(callback) {
  if (window.L && window.L.heatLayer) {
    callback();
  } else {
    setTimeout(() => checkLoaded(callback), 100);
  }
}

// Load from Looker Studio
google.visualization.events.addListener(window, 'dsccReady', () => {
  dscc.subscribeToData(data => {
    document.getElementById('container').innerHTML = ""; // Clear existing map
    checkLoaded(() => initHeatmap(data));
  });
});
