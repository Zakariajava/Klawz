document.addEventListener('DOMContentLoaded', () => {
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (!logged || logged.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  renderUsers();
});

function renderUsers() {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const tbody = document.getElementById('admin-users-tbody');
  tbody.innerHTML = '';

  // Recorremos todos los usuarios menos el admin
  users.forEach(u => {
    // Aseguramos que exista la propiedad "active"
    if (u.active === undefined) {
      u.active = true;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.email}</td>
      <td>${u.name || ''}</td>
      <td>${u.lastname || ''}</td>
      <td>${u.address || ''}</td>
      <td>${u.city || ''}</td>
      <td>${u.province || ''}</td>
      <td>${u.zip || ''}</td>
      <td>${u.phone || ''}</td>
      <td>${u.active ? 'Sí' : 'No'}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="toggleActive('${u.email}')">
          ${u.active ? 'Desactivar' : 'Activar'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.email}')">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Guardamos en localStorage en caso de que se haya inicializado "active"
  localStorage.setItem('users', JSON.stringify(users));
}

function toggleActive(email) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email);
  if (!user) return;

  user.active = !user.active;
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
}

function deleteUser(email) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.filter(u => u.email !== email);
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
}
