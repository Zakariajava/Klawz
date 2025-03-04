document.addEventListener('DOMContentLoaded', () => {
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (logged) {
    window.location.href = '../html/usuario.html';
  }
});

function doLogin(event) {
  event.preventDefault();

  const userField = document.getElementById('username');
  const passField = document.getElementById('password');

  const user = userField.value.trim();
  const pass = passField.value.trim();

  // admin mode
  if (user === 'admin' && pass === 'admin') {
    localStorage.setItem('loggedUser', JSON.stringify({
      username: 'admin',
      role: 'admin'
    }));
    window.location.href = '../../admin/html/adminindex.html';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let found = users.find(u => u.email === user && u.password === pass);

  if (found) {
    localStorage.setItem('loggedUser', JSON.stringify({
      username: found.email,
      role: 'user'
    }));
    window.location.href = '../html/usuario.html';
  } else {
    alert('Usuario o contraseña incorrectos, o no registrado');
  }
}
