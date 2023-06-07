"use strict";

// Variables
const STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// старий варіант
// const storeEditedTaskInLocalStorage = (editedTask) => {
//   let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
// const editedTaskIndex = tasks.findIndex(task => task.taskId === Number(editedTask.taskId));
//   tasks[editedTaskIndex].taskContent = editedTask.taskContent;
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
// };

const storeEditedTaskInLocalStorage = (editedTask) => {
  let tasks = getTasksFromLocalStorage();
const editedTaskIndex = tasks.findIndex((task) => task.id !== editedTask);
  tasks[editedTaskIndex].value = editedTask;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const removeTaskFromLocalStorage = (taskId) => {
  let tasks = getTasksFromLocalStorage();

  tasks = tasks.filter((task) => task.taskId !== Number(taskId));  

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Стосовно редагування - така ж сама проблема у функції storeEditedTaskInLocalStorage
// Якщо у тебе буде 2 todo з однаковим текстом - то у localStorage зміниться тільки перша. 
// Тому тобі тут також потрібно використовувати логіку з taskId , як і для видалення


// "icons" functions

const createEditIcon = (span) => {
  const editIcon = document.createElement("span");
  editIcon.className = "edit-item";
  editIcon.innerHTML = '<i class="fa fa-edit"></i>';
  editIcon.addEventListener("click", editTask);
  span.append(editIcon);
};

const createDeleteIcon = (span) => {
  const deleteIcon = document.createElement("span");
  deleteIcon.className = "delete-item";
  deleteIcon.innerHTML = '<i class="fa fa-remove"></i>';
  deleteIcon.addEventListener("click", removeTask);
  span.append(deleteIcon);
};

// "tasks" functions
const getTasks = () => {
};

const addTask = (event) => {
  event.preventDefault();

  // Пусте значення або пробіли
  if (taskInput.value.trim() === "") {
    return;
  }

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  const taskId = Date.now();
  li.setAttribute("data-task-id", taskId);
  li.textContent = taskInput.value; // значення яке ввів користувач  

  // add icons
  const taskIcons = document.createElement("span");
  taskIcons.className = "icon-item";
  createEditIcon(taskIcons);
  createDeleteIcon(taskIcons);
  li.append(taskIcons);

  taskList.append(li);

  // Save to storage
  const taskContent = taskInput.value;
  const storedTask = { taskContent, taskId };
  
  storeTaskInLocalStorage(storedTask);

  // Clear input value
  taskInput.value = "";
};


// edit task function
const editTask = (event) => {
  const editedLi = event.target.closest("li");
  if (editedLi) {
    const newTaskText = prompt(
      "Edit task:",
      editedLi.textContent.trim()
    );

    if (newTaskText !== null && newTaskText.trim() !== "") {
      editedLi.textContent = newTaskText.trim();
      const taskId = editedLi.getAttribute("data-task-id");

      const taskIcons = document.createElement("span");
      taskIcons.className = "icon-item";
      createEditIcon(taskIcons);
      createDeleteIcon(taskIcons);
      editedLi.append(taskIcons);      

      const editedTask = { taskContent: newTaskText.trim(), taskId };
      storeEditedTaskInLocalStorage(editedTask);
    }
  }
};

// remove task function
const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Are you sure?");

    if (isApproved) {
      const deletedLi = event.target.closest("li");
      const taskId = deletedLi.getAttribute("data-task-id");
      deletedLi.remove();

      removeTaskFromLocalStorage(taskId);
    }
  }
};

const clearTasks = () => {
  const isApproved = confirm("Are you sure you want to remove all tasks?");
  if (isApproved) {
    taskList.innerHTML = "";
    taskInput.value = "";
    clearTasksFromLocalStorage();    
  }
};


// filter functions

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
};

const clearFilter = () => {
  filterInput.value = '';
  filterTasks({target: {value: ''}});
}



// init
getTasks();

// Event listeners

form.addEventListener("submit", addTask);

form.addEventListener("submit", clearFilter);

clearButton.addEventListener("click", clearTasks);

clearButton.addEventListener("click", clearFilter);

filterInput.addEventListener("input", filterTasks);

taskInput.addEventListener("focus", clearFilter);