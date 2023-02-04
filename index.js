/*
 #ToDo
 1. Primim data de pe serrver și vizualizarea pe pagină
 2. Prin Form trebuie să creăm task și trimiterea pe server
 3. Scimbarea utilizatorului
 4. Schimbarea statutului (complet, uncomplet)
 5. Ștergerea taskului



# Pașii
# 1. Structurarea și stilizarea elementelor 
# 2. Primirea informației de pe server
# 3. Vizualizarea taskurilor primite de pe server
# 4. Adăugarea userilor într-un select
# 5. Logica de adăugare a Taskurilor
# 6. Logica de schimbării statutului
# 7. Logica de Ștergere
8. Informarea despre erori

*/

//Data Fetching
const form = document.querySelector("form");
const select = document.querySelector("select");
const todoList = document.querySelector(".todoList");
let todos = [];
let users = [];
document.addEventListener("DOMContentLoaded", stockData);
form.addEventListener("submit", handleSubmit);

async function getAllUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error("Users data wrong");
  } catch (error) {
    console.error(error.message);
  }
}

async function getAllToDoList() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error("ToDoList data wrong");
  } catch (error) {
    console.error(error.message);
  }
}

function stockData() {
  celearList();
  Promise.all([getAllUser(), getAllToDoList()]).then((values) => {
    [users, todos] = values;
    users.forEach((user) => renderUsers(user));
    todos.forEach((user) => renderToDo(user));
  });
}

function renderToDo({ id, title, completed }) {
  const li = document.createElement("li");
  li.className = "todoItem";
  li.dataset.id = id;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = completed;
  input.addEventListener("change", toggleStatus);
  const text = document.createElement("span");
  text.innerText = `${title}`;
  const button = document.createElement("button");
  button.addEventListener("click", handleDelete);
  button.innerHTML = `&times;`;
  button.className = `delete`;
  const div = document.createElement("div");
  div.append(input, text);
  li.append(div, button);
  const list = document.querySelector(".todoList");
  list.append(li);
}

function renderUsers(user) {
  const el = document.createElement("option");
  el.value = user.id;
  el.innerText = `${user.name}`;
  select.append(el);
}

function filterByUser(targetUser) {
  const userTodo = todos.filter((element) => element.userId === targetUser);
  celearList();
  userTodo.forEach((todo) => renderToDo(todo));
}

function celearList() {
  todoList.innerHTML = "";
}

function handleSubmit(e) {
  e.preventDefault();
  form.todo.value
    ? createToDo({
        userId: Number(form.user.value),
        title: form.todo.value,
      })
    : filterByUser(parseInt(form.user.value));
  form.todo.value = "";
}

async function createToDo({ userId, title }) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        title: title,
        completed: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      renderToDo(data);
    } else {
      throw new Error("Users data wrong");
    }
  } catch (error) {
    console.error(error.message);
  }
}

function handleStatus() {
  const id = this.parentElement.datase.id;
  const completed = this.checked;
  toggleStatus(id, completed);
}

async function toggleStatus(id, completed) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          completed: completed,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Users data wrong");
    }
  } catch (error) {
    console.error(error.message);
  }
}

function handleDelete() {
  const id = this.parentElement.dataset.id;
  deleteToDo(id);
}

async function deleteToDo(id) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Users data wrong");
    }
    removeTodo(id);
  } catch (error) {
    console.error(error.message);
  }
}

function removeTodo(id) {
  const todoItem = todoList.querySelector(`[data-id="${id}"]`);
  todoItem.querySelector("input").removeEventListener("change", handleStatus);
  todoItem.querySelector("button").removeEventListener("click", handleDelete);
  todoItem.remove();
}

function alertError(error) {
  alert(error.message);
}
