let watchId;
let lastPlaceName = "";
const pkey = "one1";
let destinationLat = null;
let destinationLon = null;
let currentdata = [];

// Get stored data
function getstoragedata() {
  const data = localStorage.getItem(pkey);
  currentdata = data ? JSON.parse(data) : [];
}

// Save data to local storage
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

// Fetch place name from coordinates
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
    return "Location unavailable";
  }
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Speak function using Web Speech API
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Start watching the location
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

        // Update current location in the HTML
        document.getElementById("latitude").textContent = latitude.toFixed(6);
        document.getElementById("longitude").textContent = longitude.toFixed(6);

        // Fetch place name
        const placeName = await fetchPlaceName(latitude, longitude);
        document.getElementById("place-name").textContent = placeName;

        // Calculate and display distance to destination
        const distance = calculateDistance(latitude, longitude, destinationLat, destinationLon);
        document.getElementById("kilometers").textContent = `${distance.toFixed(2)} km`;

        // Speak the place name if it changes
        if (placeName !== lastPlaceName) {
          speak(`You are now at ${placeName}`);
          lastPlaceName = placeName;

          // Save the updated location to local storage
          getstoragedata();
          savetolocalstorage(pkey, placeName, latitude, longitude);
        }
      },
      function (error) {
        alert("Error retrieving location: " + error.message);
      },
      {
        enableHighAccuracy: true, // Use high accuracy for GPS
        maximumAge: 0, // Do not use cached location
        timeout: 5000, // Wait for up to 5 seconds
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Stop watching the location
function stopWatching() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    alert("Stopped location tracking.");
  }
}
