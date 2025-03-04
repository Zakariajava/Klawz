let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (!logged) {
    // No logueado => login
    window.location.href = '../html/login.html';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  currentUser = users.find(u => u.email === logged.username);
  if (!currentUser) {
    alert('Usuario no encontrado');
    return;
  }

  // Rellenar con los datos actuales
  document.getElementById('editName').value = currentUser.name || '';
  document.getElementById('editLastname').value = currentUser.lastname || '';
  document.getElementById('editAddress').value = currentUser.address || '';
  document.getElementById('editCity').value = currentUser.city || '';
  document.getElementById('editProvince').value = currentUser.province || '';
  document.getElementById('editZip').value = currentUser.zip || '';
  document.getElementById('editPhone').value = currentUser.phone || '';
});

function updateUser(event) {
  event.preventDefault();

  // Tomar nuevos valores
  const newName = document.getElementById('editName').value.trim();
  const newLastname = document.getElementById('editLastname').value.trim();
  const newAddress = document.getElementById('editAddress').value.trim();
  const newCity = document.getElementById('editCity').value.trim();
  const newProvince = document.getElementById('editProvince').value.trim();
  const newZip = document.getElementById('editZip').value.trim();
  const newPhone = document.getElementById('editPhone').value.trim();

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let index = users.findIndex(u => u.email === currentUser.email);
  if (index === -1) {
    alert('Error al actualizar');
    return;
  }

  users[index].name = newName;
  users[index].lastname = newLastname;
  users[index].address = newAddress;
  users[index].city = newCity;
  users[index].province = newProvince;
  users[index].zip = newZip;
  users[index].phone = newPhone;

  localStorage.setItem('users', JSON.stringify(users));

  alert('Datos actualizados.');
  window.location.href = '../html/usuario.html';
}

function cancelEdit() {
  window.location.href = '../html/usuario.html';
}
