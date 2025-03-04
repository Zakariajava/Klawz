document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que es admin
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
  
    // Mostramos todos los que no sean admin
    users.forEach(u => {
      if (u.email === 'admin') return; // omitimos el admin real
  
      const tr = document.createElement('tr');
  
      // Asumimos un campo 'active' booleano para simular. Si no existe, lo creamos true por defecto.
      if (u.active === undefined) {
        u.active = true;
      }
  
      tr.innerHTML = `
        <td>${u.email}</td>
        <td>${u.name || ''} ${u.lastname || ''}</td>
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
  
    // Guardamos por si hemos creado .active
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
  