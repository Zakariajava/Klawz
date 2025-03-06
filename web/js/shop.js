/*****************************************************
 * shop.js
 * - Carga "productos.json" 
 * - Muestra todos los productos con paginación
 * - Click en imagen => singleproduct.html?id=...
 * - Click en Buy Now => añade al carrito
 ****************************************************/

let allProducts = [];
let currentPage = 1;
const pageSize = 12; // cantidad de productos por página

document.addEventListener('DOMContentLoaded', () => {
  fetch('../../productos.json')
    .then((resp) => resp.json())
    .then((data) => {
      allProducts = data;
      // Renderizamos la 1a página
      renderShopPage(currentPage); 
    })
    .catch((err) => console.error('Error cargando productos:', err));
});

/** renderShopPage(page)
 * Muestra la página "page" de productos en #shop-list
 */
function renderShopPage(page) {
  const container = document.getElementById('shop-list');
  container.innerHTML = '';

  // calcular índices de paginación
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // coger solo los productos que tocan en esta página
  const pageProducts = allProducts.slice(start, end);

  // generar HTML para cada producto
  pageProducts.forEach((prod) => {
    container.innerHTML += buildProductHTML(prod);
  });

  // renderizar la paginación
  renderPagination();
}

/** renderPagination()
 * Genera un <ul> de paginación con "Previous", "1..n", "Next"
 */
function renderPagination() {
  let totalPages = Math.ceil(allProducts.length / pageSize);
  const paginationEl = document.getElementById('shop-pagination');
  paginationEl.innerHTML = '';

  let html = `<ul class="pagination mt-5">`;

  // Botón "Previous"
  if (currentPage === 1) {
    html += `<li class="page-item disabled"><a class="page-link">Previous</a></li>`;
  } else {
    html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${
      currentPage - 1
    })">Previous</a></li>`;
  }

  // Numeritos de páginas
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
    } else {
      html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${i})">${i}</a></li>`;
    }
  }

  // Botón "Next"
  if (currentPage === totalPages) {
    html += `<li class="page-item disabled"><a class="page-link">Next</a></li>`;
  } else {
    html += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${
      currentPage + 1
    })">Next</a></li>`;
  }

  html += `</ul>`;
  paginationEl.innerHTML = html;
}

/** changePage(newPage)
 * cambia currentPage y vuelve a renderizar
 */
function changePage(newPage) {
  currentPage = newPage;
  renderShopPage(currentPage);
}

/** buildProductHTML(prod)
 * Devuelve el HTML <div> de un producto
 */
function buildProductHTML(prod) {
  const { id, name, price, images } = prod;
  const mainImg = images && images.length > 0 ? "../../" + images[0] : '../../img/noimage.jpg';

  return `
    <div class="product text-center col-lg-3 col-md-4 col-12">
      <img 
        class="img-fluid mb-3" 
        src="${mainImg}" 
        alt="${name}"
        style="cursor:pointer;"
        onclick="goToSingleProduct(${id})"
      />
      <div class="star">
        <i class="fa-solid fa-star-sharp" style="color: #989552;"></i>
        <i class="fa-solid fa-star-sharp" style="color: #989552;"></i>
        <i class="fa-solid fa-star-sharp" style="color: #989552;"></i>
        <i class="fa-solid fa-star-sharp" style="color: #989552;"></i>
        <i class="fa-solid fa-star-sharp" style="color: #989552;"></i>
      </div>
      <h5 class="p-name">${name}</h5>
      <h4 class="p-price">${price.toFixed(2)} €</h4>
      <button class="buy-btn" onclick="addToCart(${id})">Buy Now</button>
    </div>
  `;
}

/** Ir a la página singleproduct */
function goToSingleProduct(productId) {
  window.location.href = `../html/singleproduct.html?id=${productId}`;
}

/** Añadir al carrito (localStorage) */
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Producto añadido al carrito');
}
