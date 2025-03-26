document.addEventListener("DOMContentLoaded", () => {
    loadTasks(); // Load tasks from local storage when the page loads
});

// Function to add a new task
function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let priority = document.getElementById("priority").value;
    let dueDate = document.getElementById("dueDate").value;
    let category = document.getElementById("category").value;
    let errorMessage = document.getElementById("error-message");

    // Clear previous errors
    errorMessage.textContent = "";

    // Get today's date in YYYY-MM-DD format
    let today = new Date().toISOString().split("T")[0];

    // Validation: Task cannot be empty
    if (taskInput === "") {
        errorMessage.textContent = "Task cannot be empty!";
        return;
    }

    // Validation: Due date cannot be in the past
    if (dueDate && dueDate < today) {
        errorMessage.textContent = "Due date cannot be in the past!";
        return;
    }

    let taskList = document.getElementById("taskList");
    let li = document.createElement("li");

    li.innerHTML = `
        <div class="task-info">
            <input type="checkbox" onclick="toggleTask(this)">
            <span>${taskInput}</span>
        </div>
        <div class="task-meta">
            <span class="priority-${priority.toLowerCase()}">Priority: ${priority}</span> | 
            <span>Due: ${dueDate || "No due date"}</span> | 
            <span>Category: ${category}</span>
        </div>
        <div class="task-buttons">
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    taskList.appendChild(li);
    document.getElementById("taskInput").value = "";
    document.getElementById("dueDate").value = "";
    
    saveTasks(); // Save tasks to local storage
}

// Function to toggle task completion
function toggleTask(checkbox) {
    checkbox.closest("li").classList.toggle("completed");
    saveTasks();
}

// Function to edit a task
function editTask(button) {
    let taskSpan = button.closest("li").querySelector(".task-info span");
    let newText = prompt("Edit your task:", taskSpan.textContent);

    if (newText === null || newText.trim() === "") {
        alert("Task description cannot be empty.");
        return;
    }

    taskSpan.textContent = newText;
    saveTasks();
}

// Function to delete a task
function deleteTask(button) {
    if (confirm("Are you sure you want to delete this task?")) {
        button.closest("li").remove();
        saveTasks();
    }
}

// Function to save tasks to local storage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector(".task-info span").textContent;
        let completed = li.classList.contains("completed");
        let priority = li.querySelector(".task-meta").children[0].textContent.split(": ")[1];
        let dueDate = li.querySelector(".task-meta").children[1].textContent.split(": ")[1];
        let category = li.querySelector(".task-meta").children[2].textContent.split(": ")[1];

        tasks.push({ text, completed, priority, dueDate, category });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    let storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    storedTasks.forEach(task => {
        let taskList = document.getElementById("taskList");
        let li = document.createElement("li");

        li.classList.toggle("completed", task.completed); // Mark completed tasks

        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" onclick="toggleTask(this)" ${task.completed ? "checked" : ""}>
                <span>${task.text}</span>
            </div>
            <div class="task-meta">
                <span class="priority-${task.priority.toLowerCase()}">Priority: ${task.priority}</span> | 
                <span>Due: ${task.dueDate || "No due date"}</span> | 
                <span>Category: ${task.category}</span>
            </div>
            <div class="task-buttons">
                <button class="edit" onclick="editTask(this)">Edit</button>
                <button class="delete" onclick="deleteTask(this)">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}
