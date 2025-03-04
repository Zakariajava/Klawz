document.addEventListener('DOMContentLoaded', () => {
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (!logged) {
    window.location.href = 'login.html';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let currentUser = users.find(u => u.email === logged.username);

  if (!currentUser) {
    alert('Usuario no encontrado');
    localStorage.removeItem('loggedUser');
    window.location.href = '../html/login.html';
    return;
  }

  displayUserData(currentUser);

  document.getElementById('btnChange').addEventListener('click', () => {
    window.location.href = '../html/cambiardatos.html';
  });
  document.getElementById('btnOrders').addEventListener('click', () => {
    window.location.href = '../html/gestionpedidos.html';
  });
  document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    window.location.href = '../html/index.html';
  });
});

function displayUserData(user) {
  const container = document.getElementById('user-data');
  container.innerHTML = `
    <p><strong>Nombre:</strong> ${user.name}</p>
    <p><strong>Apellidos:</strong> ${user.lastname}</p>
    <p><strong>Domicilio:</strong> ${user.address}</p>
    <p><strong>Población:</strong> ${user.city}</p>
    <p><strong>Provincia:</strong> ${user.province}</p>
    <p><strong>C.P.:</strong> ${user.zip}</p>
    <p><strong>Teléfono:</strong> ${user.phone}</p>
    <p><strong>Email:</strong> ${user.email}</p>
  `;
}
