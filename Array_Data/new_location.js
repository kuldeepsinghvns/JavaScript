let lastPlaceName = "";
let watchId;
const pkey = "one1";
let currentdata = [];
let destinationLat = null;
let destinationLon = null;

getstoragedata();

// Speak function
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Fetch Place Name
async function fetchPlaceName(latitude, longitude) {
  try {
    const apiKey = "95ffeb9038034ad0b306becc0e96dfac";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted;
    }
  } catch (error) {
    console.error("Error fetching place name:", error);
    return "Unable to fetch location name";
  }
}

// Calculate Distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const lat1Rad = lat1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Start Tracking
function startWatching() {
  destinationLat = parseFloat(document.getElementById("destination-lat").value);
  destinationLon = parseFloat(document.getElementById("destination-lon").value);

  if (isNaN(destinationLat) || isNaN(destinationLon)) {
    alert("Please enter valid destination coordinates.");
    return;
  }

  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById("latitude").textContent = latitude;
        document.getElementById("longitude").textContent = longitude;

        const placeName = await fetchPlaceName(latitude, longitude);
        document.getElementById("place-name").textContent = placeName;

        const distance = calculateDistance(
          latitude,
          longitude,
          destinationLat,
          destinationLon
        );
        document.getElementById("kilometers").textContent =
          distance.toFixed(2) + " km";

        if (placeName !== lastPlaceName) {
          speak(placeName);
          getstoragedata();
          savetolocalstorage(pkey, placeName, latitude, longitude);
          lastPlaceName = placeName;
        }
      },
      function (error) {
        alert("Error retrieving location: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Save to Local Storage
function savetolocalstorage(pkey, placeName, latitude, longitude) {
  const dateTime = new Date().toISOString();
  const jsonstring = {
    datetime: dateTime,
    placename: placeName,
    lat: latitude,
    long: longitude,
  };
  currentdata.push(jsonstring);
  localStorage.setItem(pkey, JSON.stringify(currentdata));
}

// Get Stored Data
function getstoragedata() {
  const data = localStorage.getItem(pkey);
  if (data) {
    currentdata = JSON.parse(data);
  } else {
    currentdata = [];
  }
}
