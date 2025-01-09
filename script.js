// Location settings (you can update these to your city or use geolocation)
const latitude = 2.0691; //IPG
const longitude = 111.6779; // IPG

// API URL for prayer times (based on location)
const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`; // Method 2 is for ISNA calculation

// Update the current date on the page
const currentDate = new Date();
document.getElementById('current-date').textContent = currentDate.toDateString();

// Function to generate prayer times from API
async function generatePrayerTimes() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Get today's prayer times
        const prayerTimes = data.data.timings;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const prayerTimeBox = document.getElementById('prayer-time-box');
        prayerTimeBox.innerHTML = ''; // Clear previous prayer times

        // List of 5 main prayers
        const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        // Loop through the main prayer times and display them
        mainPrayers.forEach(prayer => {
            const prayerDiv = document.createElement('div');
            prayerDiv.classList.add('prayer');

            // Highlight the current prayer
            if (prayerTimes[prayer] === currentTime) {
                prayerDiv.classList.add('current-prayer');
            }

            prayerDiv.textContent = `${prayer}: ${prayerTimes[prayer]}`;
            prayerTimeBox.appendChild(prayerDiv);
        });

        // Update countdown for the next prayer
        getNextPrayerCountdown(prayerTimes, mainPrayers);
    } catch (error) {
        console.error("Error fetching prayer times:", error);
    }
}

// Function to calculate and display countdown to the next prayer
function getNextPrayerCountdown(prayerTimes, mainPrayers) {
    const currentTime = new Date();
    let nextPrayerTime = null;
    let nextPrayerName = '';

    // Find the next prayer
    for (let i = 0; i < mainPrayers.length; i++) {
        const prayer = mainPrayers[i];
        const prayerTimeString = prayerTimes[prayer];
        const [hours, minutes] = prayerTimeString.split(':');
        const prayerDate = new Date(currentTime.toDateString() + ` ${hours}:${minutes}:00`);

        // Skip if the prayer time has already passed
        if (prayerDate > currentTime) {
            nextPrayerTime = prayerDate;
            nextPrayerName = prayer;
            break;
        }
    }

    // If no next prayer (it's the last one for the day), set next to Fajr
    if (!nextPrayerTime) {
        const [hours, minutes] = prayerTimes.Fajr.split(':');
        nextPrayerTime = new Date(currentTime.toDateString() + ` ${hours}:${minutes}:00`);
        nextPrayerName = 'Fajr';
    }

    const timeDifference = nextPrayerTime - currentTime;
    const minutesLeft = Math.floor(timeDifference / (1000 * 60));

    // Update countdown display
    document.getElementById('countdown').textContent = `${minutesLeft} Minutes (${nextPrayerName})`;
}

// Call the function to generate prayer times on page load
generatePrayerTimes();

// Update prayer times and countdown every minute
setInterval(generatePrayerTimes, 60000);
