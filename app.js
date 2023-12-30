

add_todo_button = document.getElementById('add_todo')
.addEventListener('click', add_todo)

handle_request('https://jsonplaceholder.typicode.com/users', 'GET')
.then(data => {
    construct_list_users(data)
    
})
.catch(error => {
    console.log(`Ошибка при получение данных ${error}`)
})


async function handle_request(link, request, json=undefined){

        return fetch(link, {
            method: request,
            body: JSON.stringify(json),
            headers: {"Content-Type": 'application/json; charset=UTF-8'},
        })
        .then(response =>{
            if (response.ok){
               
               // return response.json()
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

function construct_list_users(users){
    users = JSON.parse(users)
    user_todo = document.getElementById('user-todo')
    for (let user of users){
        user_todo.insertAdjacentHTML('beforeend', `
            <option data-id="${user['id']}">${user['name']}</option>
        `)

    }

    get_todos(users)
    
}

async function get_todos(users){

    handle_request('https://jsonplaceholder.typicode.com/todos', 'GET')
    .then(data => {
        data = JSON.parse(data)
        construct_todo(data, users)
    })
    .catch(error => {
        console.log(`Ошибка при получение данных ${error}`)
    })
    
}

function construct_todo(posts, users){
    todo_list = document.getElementById('todo-list')
    todo_list.innerHTML = '';
    for (let post of posts){
        author = users.find(item => item.id === post.userId).name
        todo_list.insertAdjacentHTML('beforeend', `
        <li class="todo-item">
        <input type="checkbox" onclick="change_status(event)">
        <p class="todo" data-id=${post['id']}>${post['title']}<br><strong>${author}</strong></p>
        <p class="close" onclick="delete_todo(event)">&times;</p>
        </li>
        `)
    }
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
    json = {}
    if(document.getElementById('user-todo').value !== 'select user'){
        console.log(document.getElementById('user-todo').dataset.id)
        handle_request(`https://jsonplaceholder.typicode.com/todos`, 'POST')
    }
    else{
        alert('Выбирите,пожалуйста, пользователя')
    }
    document.getElementById('new-todo').value;
    document.getElementById('user-todo').value;
}


