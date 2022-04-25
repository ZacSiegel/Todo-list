// DOM Selectors

const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const todoForm = document.querySelector('#todo-form');
const completedTodos = document.querySelector('#completed-todos-list');
const filterOption = document.querySelector('#filter-todo');
// const sortOption = document.querySelector('#sort-todo');
const sortByNewest = document.querySelector('#newest');
const sortByOldest = document.querySelector('#oldest');

// Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoList.addEventListener('click', editTodo);
completedTodos.addEventListener('click', editTodo);
todoForm.addEventListener('submit', addTodo);
filterOption.addEventListener('change', filterTodo);

const todoArray = [];

// Functions 

function addTodo(event) {
    event.preventDefault();
    // Checking input field value
    if (todoInput.value === '') {
        alert('Todo item cannot be empty');
        return;
    }

    // Create todo div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    // Create new todo li
    const newTodo = document.createElement('li');
    newTodo.innerHTML = `${todoInput.value}`;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    // Create completed button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add('completed-btn');
    todoDiv.appendChild(completedButton);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="far fa-times-circle"></i>'
    deleteButton.classList.add('delete-btn');
    todoDiv.appendChild(deleteButton);

    // Create ID for each new todo and add it to todo array for sorting
    const newTodoItem = todoInput.value
    todoArray.push(newTodoItem)
    todoDiv.dataset.value = todoArray.indexOf(newTodoItem) + 1;

    // Add to local storage
    saveLocalTodos(`${todoInput.value}`);
    todoInput.value = "";

    // Append to list
    todoList.appendChild(todoDiv);
    todoInput.value = '';
}

function editTodo(event) {

    const todoBtn = event.target;
    const todoClasses = todoBtn.parentElement.classList;

    if (todoBtn.classList[0] === 'delete-btn') {
        const todo = todoBtn.parentElement;
        todo.classList.add('remove');
        removeLocalTodos(todo);
        // this will wait until the transition from the animation to complete
        todo.addEventListener('transitionend', function () {
            todo.remove();
        })
    }

    // Toggle completed class on todo items
    if (todoBtn.classList.contains('completed-btn')) {
        todoClasses.toggle('completed');
    }
    console.log(todoClasses)
    // If todo item is completed, move it to completed todos
    if (todoClasses[1] === 'completed') {
        console.log(todoBtn.parentElement)
        completedTodos.appendChild(todoBtn.parentElement);
    }
    // If todo item becomes unchecked, move it back to list of todo items
    if (todoClasses[1] === undefined) {
        todoList.appendChild(todoBtn.parentElement);
    }
}

function filterTodo(event) {
    const todos = document.querySelectorAll('.todo')
    const filterChoice = event.target.value;
    todos.forEach(todo => {
        if (filterChoice === 'all') {
            todo.style.display = 'flex'
        } else if (filterChoice === 'uncompleted' && !(todo.classList.contains('completed'))) {
            todo.style.display = 'flex'
        } else if (todo.classList[1] === filterChoice) {
            todo.style.display = 'flex'
        } else {
            todo.style.display = 'none'
        }
    })

}

// SORTING
const orderFunctions = {
    ascendingByValue: (a, b) => a.dataset.value - b.dataset.value,
    descendingByValue: (a, b) => b.dataset.value - a.dataset.value,
};

let currentOrder = orderFunctions.ascendingByValue;

sortByNewest.addEventListener('click', (e) => {
    currentOrder = orderFunctions[e.target.dataset.order]
    order()
})

sortByOldest.addEventListener('click', (e) => {
    currentOrder = orderFunctions[e.target.dataset.order]
    order()
})

const order = function () {
    const ordered = [...document.getElementsByClassName('todo')].sort(currentOrder)
    ordered.forEach((elem, index) => {
        elem.style.order = index
    })
}



function saveLocalTodos(todo) {
    let todos;
    // If todos doesn't exist, initialize an empty array
    if (localStorage.getItem("todos") === null) {
        todos = [];
        // If there is a todo array, get the array and add the new todo item to it   
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todo) {
    let todos;
    // checking todos array in local storage
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    // gets todo content
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function (todo) {
        // Create todo div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');

        // Create new exercise li
        const newTodo = document.createElement('li');
        newTodo.innerHTML = todo;
        newTodo.classList.add('todo-item');
        todoDiv.appendChild(newTodo);

        // Create completed button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add('completed-btn');
        todoDiv.appendChild(completedButton);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="far fa-times-circle"></i>'
        deleteButton.classList.add('delete-btn');
        todoDiv.appendChild(deleteButton);

        // Append to list
        todoList.appendChild(todoDiv);
    })
}
