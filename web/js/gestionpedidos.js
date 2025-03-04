document.addEventListener('DOMContentLoaded', () => {
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (!logged) {
    window.location.href = '../html/login.html';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let currentUser = users.find(u => u.email === logged.username);
  if (!currentUser) {
    alert('Usuario no encontrado');
    return;
  }

  renderOrders(currentUser);
});

function renderOrders(user) {
  const container = document.getElementById('orders-container');
  if (!user.orders || user.orders.length === 0) {
    container.innerHTML = '<p>No tienes pedidos</p>';
    return;
  }

  let html = '';
  user.orders.forEach(order => {
    html += `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <p><strong>ID Pedido:</strong> ${order.orderId}</p>
        <p><strong>Fecha:</strong> ${order.date}</p>
        <p><strong>Estado:</strong> ${order.status}</p>
        <p><strong>Productos:</strong></p>
        <ul>
          ${order.items
            .map(
              i => `<li>${i.name} x ${i.quantity} (precio: ${i.price.toFixed(
                2
              )} €)</li>`
            )
            .join('')}
        </ul>
        
        <!-- Botón cancelar si no está cancelado ni entregado -->
        ${
          order.status !== 'cancelado' && order.status !== 'entregado'
            ? `<button class="btn btn-danger" onclick="cancelOrder(${order.orderId})">Cancelar Pedido</button>`
            : ''
        }
      </div>
    `;
  });

  container.innerHTML = html;
}

function cancelOrder(orderId) {
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let currentUser = users.find(u => u.email === logged.username);
  if (!currentUser) return;

  let order = currentUser.orders.find(o => o.orderId === orderId);
  if (!order) return;

  order.status = 'cancelado';

  let index = users.findIndex(u => u.email === currentUser.email);
  users[index] = currentUser;
  localStorage.setItem('users', JSON.stringify(users));

  alert('Pedido cancelado');
  location.reload();
}
