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

const removeTaskFromLocalStorage = (deletedTask) => {
  const tasks = getTasksFromLocalStorage();
  const deletedIndex = tasks.findIndex((task) => task === deletedTask);
  tasks.splice(deletedIndex, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task;

    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(taskText);

    taskList.append(li);
  });
};

const addTask = (event) => {
  event.preventDefault();

  if (taskInput.value.trim() === "") {
    return;
  }

  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value; 

  const taskText = document.createElement("span");
  taskText.className = "delete-item";
  taskText.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(taskText);

  taskList.append(li);

  // Save to storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input value
  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Are you sure?");

    if (isApproved) {
      const deletedLi = event.target.closest("li");
      deletedLi.remove();

      removeTaskFromLocalStorage(deletedLi.textContent);
    }
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};


getTasks();

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);