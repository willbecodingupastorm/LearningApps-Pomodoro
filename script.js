let timeLeft;
let timerId = null;
let isWorkTime = true;
let userName;
let currentFocus = '';

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function showNameModal() {
    const modal = document.getElementById('name-modal');
    const input = document.getElementById('name-input');
    const submit = document.getElementById('name-submit');

    modal.classList.add('active');
    input.focus();

    return new Promise((resolve) => {
        submit.onclick = () => {
            const name = input.value || "Friend";
            modal.classList.remove('active');
            resolve(name);
        };

        input.onkeypress = (e) => {
            if (e.key === 'Enter') submit.click();
        };
    });
}

function showFocusModal() {
    const modal = document.getElementById('focus-modal');
    const input = document.getElementById('focus-input');
    const submit = document.getElementById('focus-submit');

    modal.classList.add('active');
    input.focus();

    return new Promise((resolve) => {
        // Handle click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                input.value = '';
                resolve('');
            }
        });

        // Handle escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                input.value = '';
                document.removeEventListener('keydown', escapeHandler);
                resolve('');
            }
        });

        submit.onclick = () => {
            const focus = input.value;
            modal.classList.remove('active');
            input.value = '';
            resolve(focus);
        };

        input.onkeypress = (e) => {
            if (e.key === 'Enter') submit.click();
        };
    });
}

async function getUserNameAndUpdateTitle() {
    userName = await showNameModal();
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

async function startTimer() {
    if (timerId !== null) return;
    
    if (!timeLeft) {
        timeLeft = WORK_TIME;
    }

    if (isWorkTime && !currentFocus) {
        currentFocus = await showFocusModal();
        if (!currentFocus) {
            return; // Exit if no focus was set
        }
        const focusTextElement = document.getElementById('focus-text');
        focusTextElement.innerHTML = `Focusing on: <span>${currentFocus}</span>`;
        focusTextElement.classList.add('active');
    }

    // Show reset button when timer starts
    document.getElementById('reset').classList.remove('hidden');

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);

        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode();
            if (!isWorkTime) {
                currentFocus = '';
                document.getElementById('focus-text').textContent = '';
                document.getElementById('focus-text').classList.remove('active');
            }
            alert(isWorkTime ? 'Break is over! Time to work!' : 'Work time is over! Take a break!');
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    currentFocus = '';
    modeText.textContent = 'Ready to focus?';
    document.getElementById('focus-text').textContent = '';
    document.getElementById('focus-text').classList.remove('active');
    // Hide reset button when timer is reset
    document.getElementById('reset').classList.add('hidden');
    updateDisplay(timeLeft);
    startButton.textContent = 'Start';
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

const addTimeButton = document.getElementById('add-time');

addTimeButton.addEventListener('click', () => {
    timeLeft += 5 * 60; // Add 5 minutes in seconds
    updateDisplay(timeLeft);
}); 