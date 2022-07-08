var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modalTaskName = document.querySelector(".modal-task-name");
var modalTaskTime = document.querySelectorAll(".modal-task-time");

// open modal
function handleOpenModal () {
    modal.style.display = "block";
}

// close modal
function handleCloseModal () {
    modal.style.display = "none";
    
    // clear inputs upon closing
    modalTaskName.value = "";
    for(let i = 0; i < modalTaskTime.length; i++)
        modalTaskTime[i].value = 0;
}

// form submit
const app = document.getElementById("app");
const form = document.querySelector("form");
const taskName = document.querySelector(".modal-task-name");
const taskTimeHr = document.getElementById("task-time-hr");
const taskTimeMin = document.getElementById("task-time-min");
const taskTimeSec = document.getElementById("task-time-sec");

// Lifecycle
const existingTasks = JSON.parse(localStorage.getItem('tasks'));
const taskData = existingTasks || [];
var cnt = 1 || existingTasks.length;

// To populate existing todos
taskData.forEach(task => {
    displayTask(task);
})

function displayTask(task) {
    var template = document.getElementById("sample-task").content;
    var copyTask = document.importNode(template, true);

    // console.log(task);

    copyTask.getElementById("task").setAttribute('id', `task-${cnt}`);
    copyTask.getElementById(`task-${cnt}`).innerHTML = task.taskName;
    copyTask.getElementById("timer").setAttribute('id', `timer-${cnt}`); 
    copyTask.getElementById(`timer-${cnt}`).innerHTML = task.taskTimeHr + " : " + task.taskTimeMin + " : " + task.taskTimeSec;
    cnt = cnt + 1;

    app.insertBefore(copyTask, app.firstChild);
    
}

function addTasks(task) {
    taskData.unshift(task);
    displayTask(task);
    localStorage.setItem('tasks', JSON.stringify(taskData));
}

form.onsubmit = function (e) {
    e.preventDefault();

    var task = { taskName: taskName.value, taskTimeHr: taskTimeHr.value, taskTimeMin: taskTimeMin.value, taskTimeSec: taskTimeSec.value };
    addTasks(task);
    handleCloseModal();
}

// start timer
var isTimerOn = false;
var timer;

// audio settings
var audio = document.getElementById("timer-chime");

function toggleTimer (id) {
    var index = id.split('-')[1];
    const taskName = document.getElementById(`task-${index}`).innerHTML;
    const timerBtn = document.getElementById(id);

    const timerHr = parseInt(timerBtn.innerHTML.split(" : ")[0]) || 0;
    const timerMin = parseInt(timerBtn.innerHTML.split(" : ")[1]) || 0;
    const timerSec = parseInt(timerBtn.innerHTML.split(" : ")[2]) || 0;

    const timerValue = timerHr * 3600 + timerMin * 60 + timerSec;
    var timerCount = timerValue - 1;

    var hours, minutes, seconds;

    if(isTimerOn) {
        isTimerOn = false;
        clearInterval(timer);
    } else {
        timer = setInterval(function () {
            isTimerOn = true;
            hours = Math.floor(timerCount / 3600);
            minutes = Math.floor(( timerCount - (hours * 3600) ) / 60);
            seconds = Math.floor(timerCount - (hours * 3600) - (minutes * 60));
            
            timerBtn.innerHTML = hours + " : " + minutes + " : " + seconds;
    
            if (timerCount <= -1) {
                audio.loop = true;
                audio.load();
                audio.play();
                isTimerOn = false;
                var task = JSON.parse(localStorage.getItem('tasks')).filter(task => task.taskName === taskName)[0];
                timerBtn.innerHTML = task.taskTimeHr + " : " + task.taskTimeMin + " : " + task.taskTimeSec;
                setTimeout(() => {
                    alert(`Time over for ${taskName}`);
                    audio.pause();
                }, 500);
                clearInterval(timer);
            }
    
            timerCount--;
    
        }, 1000);
    }
}

// Dark Mode
const darkModeToggleBtn = document.querySelector(".dark-mode-switch");
const darkModeIcon = document.querySelector(".fa-solid");
const nav = document.querySelector("nav");
const navMenuTitle = document.querySelector(".nav-menu-title");
const taskContainer = document.querySelectorAll(".task-container");
const taskTitle = document.querySelectorAll(".task-title");
const footerHelperText = document.querySelector(".footer-helperText");
const addTasksIcon = document.querySelector(".fa-clipboard-list");

darkModeToggleBtn.addEventListener('click', function() {
    darkModeIcon.classList.toggle("fa-sun");
    darkModeIcon.classList.toggle("fa-moon");

    nav.classList.toggle("nav-dark");
    navMenuTitle.classList.toggle("nav-menu-title-dark");
    darkModeToggleBtn.classList.toggle("dark-mode-switch-active");
    app.classList.toggle("app-dark");

    for(let i = 0; i < taskContainer.length; i++) {
        taskContainer[i].classList.toggle("task-container-dark");
        taskTitle[i].classList.toggle("task-title-dark");
    }

    footerHelperText.classList.toggle("footer-helperText-dark");
    addTasksIcon.classList.toggle("fa-clipboard-list-dark");
})