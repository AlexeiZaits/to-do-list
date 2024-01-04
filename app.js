
//Globals
todo_list = document.getElementById('todo-list')
user_todo = document.getElementById('user-todo')
let authors = [];
let todos = [];

//Attach Events
document.addEventListener('DOMContentLoaded', initApp)
add_todo_button = document.getElementById('add_todo')
.addEventListener('click', add_todo)

function initApp(){
    Promise.all([get_data('users', 'GET'),get_data('todos', 'GET')]).then(values => {
        [authors,todos] = values
        authors.forEach(author => print_author(author));
        todos.forEach(todo => print_todo(todo, 'beforeend'))
    })

}

// Async logic
async function get_data(link, request){
    data = handle_request(`https://jsonplaceholder.typicode.com/${link}`, request)
    .then(data => {
        return JSON.parse(data)
    })
    .catch(error => {
        console.log(`Ошибка при получение данных ${error}`)
    })
    return data
}

async function handle_request(link, request, json=undefined){

        return fetch(link, {
            method: request,
            body: JSON.stringify(json),
            headers: {"Content-Type": 'application/json; charset=UTF-8'},
        })
        .then(response =>{
            if (response.ok){
               return response.text()
            }
            else{
                alert(`Не выполнен ${request}`)
                throw(`Failed in ${request} request ${link}`)
            }
        })
        .catch(error => {
            alert(`Ошибка: ${error}`)
        })
}

function print_author(user){
    user_todo.insertAdjacentHTML('beforeend', `
        <option data-id="${user['id']}">${user['name']}</option>
    `)
    
}

function print_todo(post, position){
    author = find_author(post)
    todo_list.insertAdjacentHTML(position, `
    <li class="todo-item">
    <input type="checkbox" ${post['completed'] === true ? 'checked' : ''} onclick="change_status(event)">
    <p class="todo" data-id=${post['id']}>${post['title']}<br><strong>${author}</strong></p>
    <p class="close" onclick="delete_todo(event)">&times;</p>
    </li>
    `)
    
}

function find_author(post){
    author = authors.find(item => item.id === post.userId).name
    return author
}

function change_status(event){
    todoId = event.target.parentElement
    .querySelector('.todo').dataset.id
    handle_request(`https://jsonplaceholder.typicode.com/todos/${todoId}`, 'PUT')
    
}


function delete_todo(event){
    todo = event.target.parentElement;
    todoId = todo.querySelector('.todo').dataset.id;
    handle_request(`https://jsonplaceholder.typicode.com/todos/${todoId}`, 'DELETE')
    .then(data => {
        if (data){
            todo.innerHTML="";
        }
    })
    .catch(error => {
        console.log(`Ошибка: ${error}`)
    })
    
}

function add_todo(event){
    event.preventDefault();
    
    if(document.getElementById('user-todo').value !== 'select user'){
        author_id = user_todo.value;
        author_id = authors.find(user => user.name === user_todo.value).id
        
        new_todo = document.getElementById('new-todo').value;
        json = { userId: author_id, title: new_todo, completed: false, };
        handle_request(`https://jsonplaceholder.typicode.com/todos`, 'POST', json)
        .then(data => {
            if (data){
                data = {id: 200}
                json['id'] = data.id // имитация работы с базой данных получение id нового поста
                print_todo(json, 'afterbegin')
                
            }
        })
        .catch(error =>{
            console.log(`Ошибка: ${error}`)
        })

    }
    else{
        alert('Выбирите, пожалуйста, пользователя')
    }
}


