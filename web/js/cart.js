/*****************************************************
 * cart.js (versión con cupón "DAW" => -20% de descuento)
 ****************************************************/

let allProducts = [];
let currentDiscount = 0; // Cantidad de descuento en €
let shippingCost = 5;   // En tu ejemplo, un envío fijo

document.addEventListener('DOMContentLoaded', () => {
  fetch('../../productos.json')
    .then((resp) => resp.json())
    .then((data) => {
      allProducts = data;
      renderCartItems();
    })
    .catch((err) => console.error('Error cargando productos:', err));

  // Botón Checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.addEventListener('click', checkout);

  // Botón Apply Coupon
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  applyCouponBtn.addEventListener('click', applyCoupon);
});

/** renderCartItems() - idéntico a antes */
function renderCartItems() {
  const cartTableBody = document.querySelector('#cart-table tbody');
  cartTableBody.innerHTML = '';

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.forEach((item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    if (!product) return;

    const subtotal = product.price * item.quantity;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <a href="#" onclick="removeItem(${item.productId}); return false;">
          <i class="fa-regular fa-trash"></i>
        </a>
      </td>
      <td>
        <img src="../../${product.images[0]}" alt="${product.name}" style="width:60px; height:60px; object-fit: cover;">
      </td>
      <td>
        <h5 class="p-name">${product.name}</h5>
      </td>
      <td>
        <h5>${product.price.toFixed(2)} €</h5>
      </td>
      <td>
        <input 
          type="number"
          class="w-50"
          min="1"
          value="${item.quantity}"
          onchange="updateQuantity(${item.productId}, this.value)"
        >
      </td>
      <td>
        <h5 id="subtotal-${item.productId}">${subtotal.toFixed(2)} €</h5>
      </td>
    `;
    cartTableBody.appendChild(tr);
  });

  updateTotals();
}

/** updateQuantity(productId, newQty) - igual que antes */
function updateQuantity(productId, newQty) {
  newQty = parseInt(newQty, 10);
  if (newQty < 1) newQty = 1;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity = newQty;
  }
  localStorage.setItem('cart', JSON.stringify(cart));

  // Recalcular subtotal de esa fila
  const product = allProducts.find((p) => p.id === productId);
  if (product) {
    let newSubtotal = product.price * newQty;
    const subtotalEl = document.getElementById(`subtotal-${productId}`);
    if (subtotalEl) {
      subtotalEl.textContent = newSubtotal.toFixed(2) + ' €';
    }
  }

  updateTotals();
}

/** removeItem(productId) - igual que antes */
function removeItem(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter((i) => i.productId !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
}

/** updateTotals() - modificado para aplicar currentDiscount */
function updateTotals() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;
  cart.forEach((item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  // Muestra subtotal base
  document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2) + ' €';

  // shipping fijo
  document.getElementById('cart-shipping').textContent = shippingCost.toFixed(2) + ' €';

  // Aplica descuento
  // currentDiscount se recalcula cada vez que se aplique el cupón
  let total = subtotal + shippingCost - currentDiscount;

  if (total < 0) total = 0; // Evitar que sea negativo

  document.getElementById('cart-total').textContent = total.toFixed(2) + ' €';
}

/** applyCoupon()
 * Si el código es "DAW", se hace un 20% de descuento sobre el subtotal
 */
function applyCoupon() {
  const couponInput = document.getElementById('coupon-input');
  const code = couponInput.value.trim().toUpperCase();

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  // Calculamos el subtotal actual
  let subtotal = 0;
  cart.forEach((item) => {
    const product = allProducts.find((p) => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  if (code === 'DAW') {
    // Aplica 20% de descuento sobre el subtotal
    currentDiscount = subtotal * 0.2;
    alert('Cupón aplicado: -20% en el subtotal!');
  } else {
    // Cupón inválido, quita descuento
    currentDiscount = 0;
    alert('Cupón no válido. Inténtalo de nuevo.');
  }

  // Forzamos recalcular totales
  updateTotals();
}

/** checkout() - igual que antes, comprueba login */
function checkout() {
  // 1) Verificar si hay usuario logueado
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (!logged) {
    window.location.href = '../html/login.html';
    return;
  }

  // 2) Cargar la lista de usuarios y buscar el actual
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let currentUser = users.find(u => u.email === logged.username);
  if (!currentUser) {
    alert('Error: usuario no encontrado');
    return;
  }

  // 3) Leer el carrito
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Carrito vacío');
    return;
  }

  // 4) Crear la lista de “items” con nombre, cantidad, precio…
  let items = [];
  cart.forEach(item => {
    let product = allProducts.find(p => p.id === item.productId);
    if (product) {
      items.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }
  });

  // 5) Crear el objeto order
  const newOrder = {
    orderId: Date.now(),
    date: new Date().toLocaleString(),
    items: items,
    status: 'pendiente'
  };

  // 6) Guardarlo en el array orders del usuario
  currentUser.orders.push(newOrder);

  // 7) Actualizar localStorage
  let index = users.findIndex(u => u.email === currentUser.email);
  users[index] = currentUser;
  localStorage.setItem('users', JSON.stringify(users));

  // 8) Vaciar el carrito
  localStorage.removeItem('cart');

  // 9) Confirmar compra y redirigir
  alert('Compra efectuada. Tu pedido está pendiente.');
  window.location.href = '../html/usuario.html';
}

