document.addEventListener('DOMContentLoaded', function() {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Helper: read tasks array from localStorage (returns array of strings)
    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    // Helper: save tasks array to localStorage
    function saveStoredTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to create a list item DOM node for a given task text
    // Returns the created <li> element (so caller can append it)
    function createTaskListItem(taskText) {
        const li = document.createElement('li');

        // Create a span to hold the text (keeps structure predictable)
        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.className = 'remove-btn';

        // When clicked, remove the li from DOM and update localStorage
        removeBtn.addEventListener('click', function() {
            // Remove from DOM
            taskList.removeChild(li);

            // Update storage: remove the first matching task text
            const storedTasks = getStoredTasks();
            const index = storedTasks.indexOf(taskText);
            if (index > -1) {
                storedTasks.splice(index, 1);
                saveStoredTasks(storedTasks);
            }
        });

        // Append text and button to li
        li.appendChild(textSpan);
        li.appendChild(removeBtn);

        return li;
    }

    /**
     * Add a task.
     * If taskText is provided, it will be used directly (useful when loading from localStorage).
     * If taskText is omitted, the function will read the value from the input field.
     * The `save` flag controls whether to update localStorage (set to false when loading from storage).
     */
    function addTask(taskText, save = true) {
        // If no taskText passed, read from input
        if (typeof taskText === 'undefined') {
            taskText = taskInput.value.trim();
        }

        // If after trimming it's empty, alert and stop (only when coming from user input)
        if (taskText === "") {
            // If called programmatically with empty text (shouldn't normally happen) just return quietly
            if (typeof taskInput !== 'undefined' && document.activeElement === taskInput) {
                alert("Please enter a task");
            }
            return;
        }

        // Create the list item and append to DOM
        const li = createTaskListItem(taskText);
        taskList.appendChild(li);

        // If requested, add to localStorage
        if (save) {
            const storedTasks = getStoredTasks();
            storedTasks.push(taskText);
            saveStoredTasks(storedTasks);
        }

        // Clear and focus input if this was a user-entered task
        if (taskInput) {
            taskInput.value = "";
            taskInput.focus();
        }
    }

    // Load tasks from localStorage and render them
    function loadTasks() {
        const storedTasks = getStoredTasks();
        storedTasks.forEach(function(taskText) {
            // pass save = false so we don't duplicate into storage again
            addTask(taskText, false);
        });
    }

    // Event listeners
    addButton.addEventListener('click', function() {
        addTask(); // reads from input and saves
    });

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask(); // reads from input and saves
        }
    });

    // Initialize: load persisted tasks
    loadTasks();
});