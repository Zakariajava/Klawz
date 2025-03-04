document.addEventListener('DOMContentLoaded', () => {
    // Comprobamos que sea admin:
    const logged = JSON.parse(localStorage.getItem('loggedUser'));
    if (!logged || logged.role !== 'admin') {
      // No es admin => Fuera
      window.location.href = '../../web/html/index.html';
      return;
    }
  
    // Botón para cerrar sesión
    const logoutBtn = document.getElementById('adminLogoutBtn');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedUser');
      window.location.href = '../../web/html/index.html';
    });
  });
  