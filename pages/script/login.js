const login = document.querySelector('.login');
const reg = document.querySelector('.register');
const del = document.querySelector('.delete');

document.querySelector('.password').addEventListener('keypress', function(e){
  if(e.key === 'Enter'){
    document.querySelector('.login').click();
  }
})

document.querySelector('.username').addEventListener('keypress', function(e){
  if(e.key === 'Enter'){
    let password = document.querySelector('.password').value;
    if(password == '') return window.alert('Please enter a password!')
    document.querySelector('.login').click();
  }
})

login.addEventListener('click', async (e) => {
  let username = document.querySelector('.username').value;
  let password = document.querySelector('.password').value;

  let data = {
    username,
    password
  }
  console.log(data)
  await fetch('/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  window.location = '/index'
})

reg.addEventListener('click', async () => {
  let username = document.querySelector('.username').value;
  let password = document.querySelector('.password').value;

  let data = {
    username,
    password
  }
  console.log(data)
  await fetch('/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  window.location = '/index'
})

del.addEventListener('click', async () => {
  let username = document.querySelector('.username').value;
  let password = document.querySelector('.password').value;

  let data = {
    username,
    password
  }
  console.log(data)
  await fetch('/deleteAccount', {method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  window.location = '/'
})

function show_pass() {
  var pass = document.querySelector('.password');
  if (pass.type === "password") {
    pass.type = "text";
    var element = document.getElementById("show-password");
    element.classList.add("no-show");
    element.classList.remove("show")
  } else {
    pass.type = "password";
    var element = document.getElementById("show-password");
    element.classList.add("show");
    element.classList.remove("no-show")
  }
}
