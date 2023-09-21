/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");

const view_content = document.getElementById("view-page");
const edit_content = document.getElementById("editing-page");
const edit_todo_content = document.getElementById("editing-todo-page");
const add_diary_button = document.getElementById("add-diary-button");
const diary_save_button = document.getElementById("todo-add");

const academic_button = document.getElementById("academic");
const personality_button = document.getElementById("personality");
const club_button = document.getElementById("club");
const happy_button = document.getElementById("happy");
const angry_button = document.getElementById("angry");
const down_button = document.getElementById("down");

const academic_button_edit = document.getElementById("academic-edit");
const personality_button_edit = document.getElementById("personality-edit");
const club_button_edit = document.getElementById("club-edit");
const happy_button_edit = document.getElementById("happy-edit");
const angry_button_edit = document.getElementById("angry-edit");
const down_button_edit = document.getElementById("down-edit");


let viewing = true;
let kind = -1;
let mood = -1;
let complete = false;
let edited = false;


const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();

  edit_content.style.display = "none";
  edit_todo_content.style.display = "none";

  try {
    const todos = await getTodos();
    todos.forEach((todo) => renderTodo(todo));
  } catch (error) {
    alert("Failed to load todos!");
  }
  
}

function setupEventListeners() {
  const addTodoButton = document.querySelector("#todo-add");
  // const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.getElementById("todo-description-input");

  add_diary_button.addEventListener("click", toggleContent);

  academic_button.addEventListener("click", async () => {
    kind = 1;
  });
  personality_button.addEventListener("click", async () => {
    kind = 2;
  });
  club_button.addEventListener("click", async () => {
    kind = 3;
  });

  happy_button.addEventListener("click", async () => {
    mood = 1;
  });
  angry_button.addEventListener("click", async () => {
    mood = 2;
  });
  down_button.addEventListener("click", async () => {
    mood = 3;
  });

  addTodoButton.addEventListener("click", async () => {
    const dateInput = document.getElementById("dateInput");
    const title = dateInput.value;
    const description = todoDescriptionInput.value;


    if (!title) {
      alert("Please enter a date!");
      return;
    }
    if (!description) {
      alert("Please enter a diary description!");
      return;
    }
    if (kind == -1){
      alert("Please select a kind!");
      return;
    }
    if (mood == -1){
      alert("Please select a mood!");
      return;
    }


    try {
      const todo = await createTodo({ title, description, complete, kind, mood });
      renderTodo(todo);
    } catch (error) {
      alert("Failed to create todo!");
      return;
    }


    dateInput.value = "";
    todoDescriptionInput.value = "";

    view_content.style.display = "block";
    edit_content.style.display = "none"; 
    add_diary_button.textContent = "Add Diary";   
    viewing = !viewing;
  });

  
}

function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
}

function createTodoElement(todo) {
  const item = itemTemplate.content.cloneNode(true);

  const container = item.querySelector(".todo-item");
  container.id = todo.id;
  console.log(todo);

  const title = item.querySelector("p.todo-title");
  title.innerText = todo.title;

  const tag_kind = item.querySelector("i.tag_kind");
  switch(todo.kind){
    case 1:
      tag_kind.innerText = "學業";
      break;
    case 2:
      tag_kind.innerText = "人際";
      break;
    case 3:
      tag_kind.innerText = "社團";
      break;
  }


  const tag_mood = item.querySelector("i.tag_mood");
  switch(todo.mood){
    case 1:
      tag_mood.innerText = "快樂";
      break;
    case 2:
      tag_mood.innerText = "生氣";
      break;
    case 3:
      tag_mood.innerText = "難過";
      break;
  }

  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;

  const deleteButton = item.querySelector("button.delete-todo");
  deleteButton.dataset.id = todo.id;
  deleteButton.addEventListener("click", () => {
    deleteTodoElement(todo.id);
  });

  const editButton = item.querySelector("button.edit-todo");
  editButton.addEventListener("click", async () => {
    populateEditForm(todo);

    academic_button_edit.addEventListener("click", async () => {
      todo.kind = 1;
    });
    personality_button_edit.addEventListener("click", async () => {
      todo.kind = 2;
    });
    club_button_edit.addEventListener("click", async () => {
      todo.kind = 3;
    });
  
    happy_button_edit.addEventListener("click", async () => {
      todo.mood = 1;
    });
    angry_button_edit.addEventListener("click", async () => {
      todo.mood = 2;
    });
    down_button_edit.addEventListener("click", async () => {
      todo.mood = 3;
    });

    const editTodoButton = document.querySelector("#todo-edit");  //save

    editTodoButton.addEventListener("click", async () => {
      const dateInput_edit = document.getElementById("dateInput-edit");
      const todoDescriptionInput_edit = document.getElementById("todo-description-input-edit")
      const title_edit = dateInput_edit.value;
      const description_edit = todoDescriptionInput_edit.value;
  
      if (!title_edit) {
        alert("Please enter a date!");
        return;
      }
      if (!description_edit) {
        alert("Please enter a diary description!");
        return;
      }  


      try{
        todo.title = title_edit;
        todo.description = description_edit;
        
        updateTodoStatus(todo.id, todo);
        updateTodoById(todo.id);
        
        // renderTodo(todo); //for checking

        alert("todo updated");
      }catch (error) {
        alert("Failed to update todo!");
        return;
      }


      dateInput_edit.value = "";
      todoDescriptionInput_edit.value = "";
  
      view_content.style.display = "block";
      edit_content.style.display = "none"; 
      edit_todo_content.style.display = "none";
      add_diary_button.textContent = "Add Diary";   
      viewing = !viewing;
      window.location.reload();
    });
});

  return item;
}

function populateEditForm(data){
  edit_content.style.display = "none";
  view_content.style.display = "none";
  edit_todo_content.style.display = "block";

  viewing = !viewing;
  add_diary_button.textContent = "Cancel";

  const dateInput = document.getElementById("dateInput-edit");
  const todoDescriptionInput = document.getElementById("todo-description-input-edit")

  dateInput.value = data.title;
  todoDescriptionInput.value = data.description;
}

async function deleteTodoElement(id) {
  try {
    await deleteTodoById(id);
  } catch (error) {
    alert("Failed to delete todo!");
  } finally {
    const todo = document.getElementById(id);
    todo.remove();
  }
}

async function editTodoElement(id) {
  try {
    await editTodoById(id);
  } catch (error) {
    alert("Failed to edit todo!");
  } 
}

async function getTodos() {
  const response = await instance.get("/todos");
  return response.data;
}

async function createTodo(todo) {
  const response = await instance.post("/todos", todo);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

async function deleteTodoById(id) {
  const response = await instance.delete(`/todos/${id}`);
  return response.data;
}

async function updateTodoById(id){
  await instance.put(`/todos/${id}`);
}

function toggleContent() {
  const todoInput = document.getElementById("dateInput");
  const todoDescriptionInput = document.querySelector(
    "#todo-description-input",
  );

  if (viewing) {
    view_content.style.display = "none";
    edit_content.style.display = "block";

    add_diary_button.textContent = "Cancel";
  } else {
    view_content.style.display = "block";
    edit_content.style.display = "none";
    edit_todo_content.style.display = "none";

    add_diary_button.textContent = "Add Diary";

    todoInput.value = "";
    todoDescriptionInput.value = "";
  }
  
  viewing = !viewing;
}

main();
