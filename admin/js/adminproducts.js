let adminProducts = []; // array local para simular

document.addEventListener('DOMContentLoaded', () => {
  // Asegurar que es admin
  const logged = JSON.parse(localStorage.getItem('loggedUser'));
  if (!logged || logged.role !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  // 1) Cargamos adminProducts si existe en localStorage
  let stored = JSON.parse(localStorage.getItem('adminProducts'));
  if (stored && Array.isArray(stored)) {
    adminProducts = stored;
    renderProducts();
  } else {
    // 2) fetch de productos.json una sola vez, y guardamos
    fetch('../../productos.json')
      .then(resp => resp.json())
      .then(data => {
        adminProducts = JSON.parse(JSON.stringify(data)); 
        // clonamos la info del JSON
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        renderProducts();
      })
      .catch(err => console.error('Error cargando JSON', err));
  }
});

function renderProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  tbody.innerHTML = '';

  adminProducts.forEach(prod => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${prod.id}</td>
      <td>${prod.name}</td>
      <td>${prod.category}</td>
      <td>${prod.subcategory}</td>
      <td>${prod.price}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${prod.id})">
          Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteProduct(id) {
  adminProducts = adminProducts.filter(p => p.id !== id);
  localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
  renderProducts();
}

function addProduct(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById('prodId').value, 10);
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value.trim();
  const subcat = document.getElementById('prodSubcat').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const imgMain = document.getElementById('prodImageMain').value.trim();

  // Creamos un objeto con la estructura básica
  const newProd = {
    id,
    name,
    category,
    subcategory: subcat,
    price,
    images: [imgMain], 
    description: "",
    featured: false
  };

  // Insertamos en adminProducts
  adminProducts.push(newProd);
  localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
  alert('Producto agregado (solo en localStorage).');

  // Limpiamos el form
  document.getElementById('prodId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodCategory').value = '';
  document.getElementById('prodSubcat').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodImageMain').value = '';

  renderProducts();
}
