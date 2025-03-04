document.addEventListener('DOMContentLoaded', () => {
    const logged = JSON.parse(localStorage.getItem('loggedUser'));
    if (!logged || logged.role !== 'admin') {
      window.location.href = 'login.html';
      return;
    }
  
    renderAllOrders();
  });
  
  function renderAllOrders() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const container = document.getElementById('admin-orders-container');
    container.innerHTML = '';
  
    let html = '';
  
    // Recorremos cada usuario y sus orders
    users.forEach(u => {
      if (!u.orders || u.orders.length === 0) return;
  
      html += `<h5>Pedidos de ${u.email}</h5>`;
  
      u.orders.forEach(order => {
        html += `
          <div style="border:1px solid #ccc; margin:10px; padding:10px;">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Fecha:</strong> ${order.date}</p>
            <p><strong>Estado:</strong> ${order.status}</p>
            <ul>
              ${order.items
                .map(
                  i => `<li>${i.name} x ${i.quantity} (precio: ${i.price.toFixed(2)}€)</li>`
                )
                .join('')}
            </ul>
            ${
              order.status !== 'cancelado' && order.status !== 'entregado'
                ? `
                <button class="btn btn-sm btn-success" onclick="markDelivered('${u.email}', ${order.orderId})">
                  Marcar Entregado
                </button>
                <button class="btn btn-sm btn-danger" onclick="cancelOrder('${u.email}', ${order.orderId})">
                  Cancelar
                </button>
                `
                : ''
            }
          </div>
        `;
      });
    });
  
    if (!html) {
      html = '<p>No hay pedidos en todo el sistema.</p>';
    }
  
    container.innerHTML = html;
  }
  
  function markDelivered(userEmail, orderId) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === userEmail);
    if (!user) return;
    let order = user.orders.find(o => o.orderId === orderId);
    if (!order) return;
  
    order.status = 'entregado';
  
    let idx = users.findIndex(u => u.email === userEmail);
    users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));
  
    renderAllOrders();
  }
  
  function cancelOrder(userEmail, orderId) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === userEmail);
    if (!user) return;
    let order = user.orders.find(o => o.orderId === orderId);
    if (!order) return;
  
    order.status = 'cancelado';
  
    let idx = users.findIndex(u => u.email === userEmail);
    users[idx] = user;
    localStorage.setItem('users', JSON.stringify(users));
  
    renderAllOrders();
  }
  