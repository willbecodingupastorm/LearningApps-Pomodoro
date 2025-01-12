let timeLeft;
let timerId = null;
let isWorkTime = true;
let userName;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

// Function to get user's name and update title
function getUserNameAndUpdateTitle() {
    userName = prompt("Welcome! What's your name?") || "Friend";  // Default to "Friend" if user cancels or enters nothing
    
    // Update both the page title and the h1 element
    document.title = `${userName}'s Pomodoro Timer`;
    document.querySelector('h1').textContent = `${userName}'s Pomodoro Timer`;
}

// Call this function when the page loads
window.addEventListener('load', getUserNameAndUpdateTitle);

function updateDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title with the user's name and current time
    document.title = `(${timeString}) ${isWorkTime ? 'Work' : 'Break'} - ${userName}'s Pomodoro Timer`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Time to focus!' : 'Take a break!';
    const toggleButton = document.getElementById('toggle-mode');
    toggleButton.innerHTML = isWorkTime ? 
        '<i class="fas fa-sun"></i><span>Work Mode</span>' : 
        '<i class="fas fa-coffee"></i><span>Break Mode</span>';
    updateDisplay(timeLeft);
}

function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode();
            alert(isWorkTime ? 'Break is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);          // Stops the current timer
    timerId = null;                  // Clears the timer ID
    isWorkTime = true;               // Sets the mode to "work time"
    timeLeft = WORK_TIME;            // Resets the time to the default work duration
    modeText.textContent = 'Ready to focus?';  // Updates the display text to show "Ready to focus?"
    updateDisplay(timeLeft);         // Updates the timer display
    startButton.textContent = 'Start';   // Changes the button text to "Start"
}

// Add this to your event listeners section
const toggleButton = document.getElementById('toggle-mode');

toggleButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    switchMode();
    startButton.textContent = 'Start';
});

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay(timeLeft); 