let selectedVoice = null;
let voices = [];

// Initialize voices, add voice selection elements, and load saved voice on page load
document.addEventListener("DOMContentLoaded", () => {
  addVoiceSelectionElements();
  loadVoices(); // Load voices and set up voice selection
});

// Load voices and populate dropdown
function loadVoices() {
  if (typeof speechSynthesis === "undefined") {
    console.log("Speech synthesis not supported in this browser.");
    return;
  }

  // Load voices after they are available, then set the saved voice if any
  speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
    populateVoiceList();
    loadSavedVoice(); // Load saved voice once voices are loaded
  };
}

// Populate the dropdown with available voices
function populateVoiceList() {
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = ""; // Clear previous options

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Save the selected voice to localStorage
function saveSelectedVoice() {
  const voiceSelect = document.getElementById("voiceSelect");
  const selectedIndex = voiceSelect.value;
  selectedVoice = voices[selectedIndex];
  localStorage.setItem("selectedVoice", JSON.stringify({ name: selectedVoice.name, lang: selectedVoice.lang }));
  alert("Voice selection saved!");
  selectvoice();
}

// Load the saved voice from localStorage and set the dropdown accordingly
function loadSavedVoice() {
  const savedVoiceData = JSON.parse(localStorage.getItem("selectedVoice"));
  if (savedVoiceData) {
    selectedVoice = voices.find(voice => voice.name === savedVoiceData.name && voice.lang === savedVoiceData.lang);
    if (selectedVoice) {
      setSelectedVoiceInDropdown(); // Set dropdown to saved voice
    }
  }
}

// Set the dropdown to display the saved or selected voice
function setSelectedVoiceInDropdown() {
  const voiceSelect = document.getElementById("voiceSelect");
  const selectedIndex = voices.findIndex(voice => voice === selectedVoice);
  if (selectedIndex !== -1) {
    voiceSelect.value = selectedIndex;
  }
}

// Function to speak text using the selected or saved voice
function speak(text) {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance(text);
    
    // Set the voice if available
    if (selectedVoice) {
      speech.voice = selectedVoice;
    } else {
      // Default to the first voice if no voice is selected
      speech.voice = voices[0];
    }

    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(speech);
  } else {
    console.log("Speech synthesis not supported in this browser.");
  }
}

// Function to add voice selection elements to the page
function addVoiceSelectionElements() {
  const container = document.createElement("div");
  container.innerHTML = `
    <button onclick="showVoiceSelection()">Select Voice</button>
    <div id="voiceSelectionContainer" style="display:none;">
      <label for="voiceSelect">Choose a speaker:</label>
      <select id="voiceSelect"></select>
      <button onclick="saveSelectedVoice()">Save Voice Selection</button>
    </div>
  `;

  document.body.appendChild(container);
}

// Show the voice selection container
function showVoiceSelection() {
  const voiceSelectionContainer = document.getElementById("voiceSelectionContainer");
  voiceSelectionContainer.style.display = "block";

}
function selectvoice()
{
    const voiceSelectionContainer = document.getElementById("voiceSelectionContainer");
    voiceSelectionContainer.style.display="none";
}


