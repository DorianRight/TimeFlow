let timer = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let interval = null;
let sessions = 0;
let totalTime = 0;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionsDisplay = document.getElementById('sessions');
const focusTimeDisplay = document.getElementById('focusTime');

function updateDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateStats() {
    sessionsDisplay.textContent = sessions;
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    focusTimeDisplay.textContent = `${hours}h ${minutes}m`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        interval = setInterval(() => {
            timer--;
            updateDisplay();

            if (timer === 0) {
                // Session completed
                sessions++;
                totalTime += 25 * 60;
                updateStats();

                // Reset timer
                timer = 25 * 60;
                isRunning = false;
                clearInterval(interval);

                alert('Session completed! Great work!');
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(interval);
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(interval);
    timer = 25 * 60;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
updateStats();