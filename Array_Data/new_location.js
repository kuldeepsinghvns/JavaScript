let lastPlaceName = ""; // Variable to store the last spoken place name
let watchId;
let lastLatitude = "";
let lastLongitude = "";
const pkey = "one1";
let currentdata = [];
getstoragedata();

async function fetchPlaceName(latitude, longitude) {
  try {
    const apiKey = "95ffeb9038034ad0b306becc0e96dfac";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=hi`;
    const response = await fetch(url);

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const placeName = data.results[0].formatted;
      return placeName;
    }
  } catch (error) {
    console.error("Error fetching place name:", error);
    return "Error fetching location name";
  }
}

// save to local storage
function savetolocalstorage(pkey, placeName, latitude, longitude) {
  const dateTime = new Date().toISOString();
  jsonstring =
    `{"datetime":"${dateTime}","placename":"${placeName}","lat":"${latitude}","long":"${longitude}"}`.trim();

  currentdata.push(jsonstring);
  currentdata = JSON.stringify(currentdata);
  localStorage.setItem(pkey, currentdata);
  console.table(jsonstring);
  console.table(JSON.parse(currentdata));
}

function getstoragedata() {
  let data = localStorage.getItem(pkey);
  if (data) {
    currentdata = JSON.parse(data);
  } else currentdata = [];
}

// Calculate the distance between two coordinates in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const lat1Rad = lat1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function startWatching() {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById("latitude").textContent = latitude;
        document.getElementById("longitude").textContent = longitude;

        const placeName = await fetchPlaceName(latitude, longitude);
        document.getElementById("place-name").textContent = placeName;

        // Get the destination coordinates from the input fields
        const destinationLat = parseFloat(
          document.getElementById("destination-lat").value
        );
        const destinationLon = parseFloat(
          document.getElementById("destination-lon").value
        );

        // Ensure that both input fields have valid values before calculating distance
        if (!isNaN(destinationLat) && !isNaN(destinationLon)) {
          const distance = calculateDistance(
            destinationLat,
            destinationLon,
            latitude,
            longitude
          );
          document.getElementById("kilometers").textContent =
            distance.toFixed(2) + " km";

         // If the distance is less than 0.1 km (100 meters) and the sound hasn't been played
         if (distance < 0.1 && !soundPlayed) {
            const alertSound = document.getElementById("alert-sound");
            alertSound.play(); // Play the sound
            soundPlayed = true; // Set the flag to true, preventing further alerts
          } else if (distance >= 0.1) {
            
            soundPlayed = false;
          }
        } else {
          document.getElementById("kilometers").textContent = "-";
        }

        // Speak the place name if it has changed
        if (placeName !== lastPlaceName) {
          speak(placeName);
          getstoragedata();
          savetolocalstorage(pkey, placeName, latitude, longitude);
          lastPlaceName = placeName; // Update the last spoken place name
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

// Optionally stop watching if needed
function stopWatching() {
  if (watchId !== undefined) {
    navigator.geolocation.clearWatch(watchId);
  }
}
