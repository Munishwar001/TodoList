const addBtn = document.getElementById("addBtn");
const input = document.getElementById("input");
const ul = document.getElementById("ul");
const clrBtn = document.getElementById("clrBtn");
const search = document.getElementById("search");
// Load tasks from localStorage on page load
loadTasks();
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task.text, task.completed, true));
}

addBtn.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
    } else {
        addTask(taskText, false);
        input.value = ""; // Clear input field
    }
});

function addTask(taskText, isCompleted, fromLocalStorage = false) {
    const li = document.createElement("li");

    // Create checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = isCompleted;

    // Set task text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    if (isCompleted) {
        taskSpan.classList.add("completed");
    }

    // Append checkbox and text to list item
    li.appendChild(checkBox);
    li.appendChild(taskSpan);

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.id = "delBtn";
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    li.appendChild(deleteBtn);

    // Add event listeners
    checkBox.addEventListener("change", () => toggleTaskStatus(taskText, checkBox.checked, taskSpan));
    deleteBtn.addEventListener("click", () => {
        li.remove();
        removeTask(taskText);
    });

    ul.appendChild(li);

    // Save to localStorage if not loaded from storage
    if (!fromLocalStorage) {
        saveTaskToLocalStorage(taskText, isCompleted);
    }
}

function saveTaskToLocalStorage(taskText, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: isCompleted });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTaskStatus(taskText, isCompleted, taskSpan) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskIndex = tasks.findIndex(task => task.text === taskText);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = isCompleted;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    if (isCompleted) {
        taskSpan.classList.add("completed");
    } else {
        taskSpan.classList.remove("completed");
    }
}

function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

clrBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
        ul.innerHTML = ""; // Clear tasks from DOM
        localStorage.removeItem("tasks"); // Clear tasks from storage
    }
});

search.addEventListener("input", (event) => {
    const searchTerm = event.data;
    if (searchTerm != null) {
        ul.innerHTML = "";

        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        // Loop through all tasks and add matching tasks
        tasks.forEach(task => {
            if (task.text.toLowerCase().includes(searchTerm.toLowerCase())) {
                addTask(task.text, task.completed, true); // Add matching task to the list
            }
        });
        // If searchTerm is empty, add all tasks back 
    }
    else if (searchTerm == null || searchTerm.trim() == "") {
        loadTasks();
        console.log("search");
    }
});
filter.addEventListener("input", (event) => {
    const filterTerm = event.target.value; // Get the selected filter value
    ul.innerHTML = ""; // Clear the list

    const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Get tasks from localStorage

    tasks.forEach(task => {
        // Check the filter condition
        if (
            filterTerm === "all" ||
            (filterTerm === "completed" && task.completed) ||
            (filterTerm === "incomplete" && !task.completed)
        ) {
            addTask(task.text, task.completed, true); // Add filtered tasks
        }
    });
});
