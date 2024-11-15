class TaskManager {
    constructor(taskListElementId, addTaskButtonId, sortButtonId, addTaskContainerId) {
        this.taskListElement = document.getElementById(taskListElementId);
        this.addTaskButton = document.getElementById(addTaskButtonId);
        this.sortButton = document.getElementById(sortButtonId);
        this.addTaskInputButton = document.querySelector('.icon');
        this.addTaskContainer = document.querySelector(`#${addTaskContainerId}`);
        this.newTaskInput = document.querySelector(`#${addTaskContainerId} input`);
        this.newTaskDeleteButton = document.querySelector(`#${addTaskContainerId} button`);
        this.addButtonLabel = document.querySelector('.add-label');
        this.tasks = [];
        this.isAscending = true;
        this.draggedTask = null;
        this.draggedTaskIndex = null;
        this.init();
        this.sortStatus = null

    }

    init() {
        if (this.tasks.length === 0) {
            this.taskListElement.classList.add('hidden');
        } else {
            this.addTaskContainer.classList.add('hidden');
        }

        this.addButtonLabel.addEventListener('click', () => {
            this.addTask()
            this.addTaskContainer.classList.add('hidden')
        });
        this.newTaskDeleteButton.addEventListener('click', () => {
            this.newTaskInput.value = ''
            
        });
        this.addTaskInputButton.addEventListener('click', () => {
            this.addTaskContainer.classList.remove('hidden')
        });

        document.querySelectorAll('img').forEach(i => i.classList.add('hidden'))
        document.querySelector('.asc').classList.remove('hidden')

        this.sortButton.addEventListener('click', () => this.sortTasks());


        document.querySelector('#addTaskContainer .delete-btn').addEventListener('click', ()=> {
            document.querySelector('#addTaskContainer input').value = ''
            if(this.tasks.length > 0) {
                this.toggleView()
            }
        })

        document.querySelector(`#sortButton`).addEventListener('mouseenter', (e)=> {
            if (!document.querySelector('.desc').classList.contains('hidden')) {
                document.querySelector('.desc').classList.add('hidden')
                document.querySelector('.desc-act').classList.remove('hidden')
            } else if (!document.querySelector('.asc').classList.contains('hidden')) {
                document.querySelector('.asc').classList.add('hidden')
                document.querySelector('.asc-act').classList.remove('hidden')
            }
        })
        document.querySelector(`#sortButton`).addEventListener('mouseleave', (e)=> {
            if (!document.querySelector('.desc-act').classList.contains('hidden')) {
                document.querySelector('.desc').classList.remove('hidden')
                document.querySelector('.desc-act').classList.add('hidden')
            } else if (!document.querySelector('.asc-act').classList.contains('hidden')) {
                document.querySelector('.asc').classList.remove('hidden')
                document.querySelector('.asc-act').classList.add('hidden')
            }
        })
    }

    renderTasks() {
        if(this.tasks.length > 0) {
            this.taskListElement.classList.remove('hidden')
        } else {
            this.taskListElement.classList.add('hidden')
        }
        this.taskListElement.innerHTML = '';
        this.tasks.forEach((task, index) => this.createTaskElement(task, index));
        this.updateTaskNumbers();
        this.enableDragAndDrop();
    }

    toggleView() {
        this.addTaskContainer.classList.toggle('hidden');
    }

    addTask() {
        const noteText = this.newTaskInput.value.trim();
        if (!noteText) return;
        this.tasks.push({ note: noteText });
        if(this.sortStatus) {
            this.sortTasks()
            this.sortTasks()
        }
        this.newTaskInput.value = '';
        this.toggleView();
        this.renderTasks();
    }

    sortTasks() {
        this.sortStatus = true
        this.tasks.sort((a, b) => {
            const textA = a.note.toLowerCase();
            const textB = b.note.toLowerCase();
            return this.isAscending ? textA.localeCompare(textB) : textB.localeCompare(textA);
        });

        this.isAscending = !this.isAscending;
        if(!this.isAscending) {
            document.querySelectorAll('img').forEach(i => i.classList.add('hidden'))
            document.querySelector('.asc').classList.remove('hidden')
        } else {
            document.querySelectorAll('img').forEach(i => i.classList.add('hidden'))
            document.querySelector('.desc').classList.remove('hidden')
        }

        this.renderTasks();
    }

    updateTaskNumbers() {
        const taskItems = this.taskListElement.querySelectorAll(".task");
        taskItems.forEach((task, index) => {
            const taskNumber = task.querySelector(".task-number");
            taskNumber.textContent = `${index + 1}.`;
        });
    }

    enableDragAndDrop() {
        const taskItems = this.taskListElement.querySelectorAll(".task");
        taskItems.forEach(task => {
            task.addEventListener("dragstart", (event) => this.dragStart(event, task));
            task.addEventListener("dragover", (event) => this.dragOver(event));
            task.addEventListener("drop", (event) => this.dragDrop(event, task));
        });

        this.taskListElement.addEventListener("dragend", () => {
            if (this.draggedTask) {
                this.draggedTask.style.display = "flex";
                this.draggedTask = null;
            }
        });
    }

    createTaskElement(task, index) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task");
        taskItem.setAttribute("draggable", "true");
        const taskNumber = document.createElement("span");
        taskNumber.classList.add("task-number");
        taskNumber.textContent = `${index + 1}.`;
        const taskInput = document.createElement("span");
        taskInput.innerText = task.note;
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.innerText = "✕";
        deleteButton.addEventListener("click", () => {
            this.tasks.splice(index, 1);
            this.renderTasks();
            if (this.tasks.length == 0) {
                this.toggleView()
            }
        });
        taskItem.appendChild(taskNumber);
        taskItem.appendChild(taskInput);
        taskItem.appendChild(deleteButton);
        this.taskListElement.appendChild(taskItem);
    }

    dragStart(event, task) {
        this.draggedTask = task;
        setTimeout(() => (task.style.display = "none"), 0);
        this.draggedTaskIndex = [...this.taskListElement.children].indexOf(task);
    }

    dragOver(event) {
        event.preventDefault();
        this.sortStatus = false
        document.querySelectorAll('img').forEach(i => i.classList.add('hidden'))
        document.querySelector('.asc').classList.remove('hidden')
    }

    dragDrop(event, targetTask) {
        const targetIndex = [...this.taskListElement.children].indexOf(targetTask);
        const draggedIndex = this.draggedTaskIndex;

        if (targetIndex !== draggedIndex) {
            const [movedTask] = this.tasks.splice(draggedIndex, 1);
            this.tasks.splice(targetIndex, 0, movedTask);
            this.renderTasks(); 
        }
        this.draggedTask.style.display = "flex";
        this.draggedTask = null;
    }
}

const taskManager = new TaskManager("taskList", "addTaskButton", "sortButton", "addTaskContainer");
