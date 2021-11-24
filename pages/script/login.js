const login = document.querySelector('.login');
const reg = document.querySelector('.register');

login.addEventListener('click', async () => {
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
})