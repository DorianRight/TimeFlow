let timer = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let interval = null;
let sessions = 0;
let totalTime = 0;
let isBreakTime = false;
let tasks = [];

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('timeflow-data');
    if (saved) {
        const data = JSON.parse(saved);
        sessions = data.sessions || 0;
        totalTime = data.totalTime || 0;
        tasks = data.tasks || [];
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        sessions: sessions,
        totalTime: totalTime,
        tasks: tasks,
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem('timeflow-data', JSON.stringify(data));
}

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionsDisplay = document.getElementById('sessions');
const focusTimeDisplay = document.getElementById('focusTime');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

function updateDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update background based on timer state
    if (isBreakTime) {
        document.body.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)';
        document.querySelector('header h1').textContent = 'Break Time';
    } else {
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.querySelector('header h1').textContent = 'TimeFlow';
    }
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
                if (!isBreakTime) {
                    // Work session completed
                    sessions++;
                    totalTime += 25 * 60;
                    updateStats();
                    saveData();

                    // Start break
                    isBreakTime = true;
                    timer = 5 * 60; // 5 minute break
                    updateDisplay();
                    alert('Focus session done! Time for a 5-minute break.');
                } else {
                    // Break completed
                    isBreakTime = false;
                    timer = 25 * 60;
                    updateDisplay();
                    isRunning = false;
                    clearInterval(interval);
                    alert('Break over! Ready for the next session?');
                }
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
    isBreakTime = false;
    timer = 25 * 60;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Task management functions
function addTask(text) {
    if (text.trim()) {
        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(task);
        saveData();
        renderTasks();
        taskInput.value = '';
    }
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveData();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-task" onclick="deleteTask(${task.id})">×</button>
        `;
        taskList.appendChild(li);
    });
}

// Event listeners
addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask(taskInput.value);
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize app
loadData();
updateDisplay();
updateStats();
renderTasks();