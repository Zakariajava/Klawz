/*****************************************************
 * index.js
 * Encargado de:
 *  1) Cargar products.json
 *  2) Renderizar secciones (Featured, Dresses, Watches, Shoes)
 *  3) Funciones para ir a singleproduct.html, añadir al carrito, etc.
 ****************************************************/

document.addEventListener('DOMContentLoaded', () => {
  fetch('../../productos.json')
    .then((response) => response.json())
    .then((products) => {
      renderFeatured(products);
      renderDresses(products);
      renderWatches(products);
      renderShoes(products);
    })
    .catch((error) => console.error('Error loading products:', error));

  const bgImages = [
    '/img/backgroundMain/back2.jpg',
    '/img/backgroundMain/back1.jpg',
    '/img/backgroundMain/back3.jpg'
  ];

  let currentBg = 0;
  const homeSection = document.getElementById('home');

  // Crear overlay para transición 
  const overlay = document.createElement('div');
  overlay.className = 'bg-overlay';
  homeSection.appendChild(overlay);

  // Crear la barra de progreso
  const progressLine = document.createElement('div');
  progressLine.className = 'progress-line';
  homeSection.appendChild(progressLine);

  // Función para iniciar la animación de la barra de progreso
  function startProgress() {
    // Reiniciamos la barra: quitamos la transición y ponemos ancho 0
    progressLine.style.transition = 'none';
    progressLine.style.width = '0';
    // Forzamos reflow para que se apliquen los cambios
    progressLine.offsetWidth;
    // Ahora definimos la transición para que en 5s llegue a 100%
    progressLine.style.transition = 'width 5s linear';
    progressLine.style.width = '100%';
  }

  // Función para cambiar el fondo cuando la barra se llena
  function changeBackground() {
    currentBg = (currentBg + 1) % bgImages.length;
    const nextImage = bgImages[currentBg];

    // Pre-cargamos la imagen
    const img = new Image();
    img.src = nextImage;
    img.onload = () => {
      // Actualizamos el overlay con la nueva imagen y hacemos fade-in
      overlay.style.backgroundImage = `url(${nextImage})`;
      overlay.style.opacity = 1;

      // Después de 1s (duración de la transición) actualizamos el fondo principal
      setTimeout(() => {
        homeSection.style.backgroundImage = `url(${nextImage})`;
        overlay.style.opacity = 0;
        // Reiniciamos la barra de progreso para el siguiente ciclo
        startProgress();
      }, 1000);
    };

    img.onerror = () => {
      console.error('Error al cargar la imagen', nextImage);
      // Si falla, reiniciamos la barra para intentarlo de nuevo
      startProgress();
    };
  }

  // Escuchamos el evento 'transitionend' en la barra de progreso
  progressLine.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'width' && progressLine.style.width === '100%') {
      changeBackground();
    }
  });

  // Inicia la primera animación
  startProgress();

});

/** 
 * Renderiza la sección "Featured" 
 * los productos con "featured": true
 * Cogemos 4 de ellos (si hay más de 4, recortamos)
 */
function renderFeatured(products) {
  let featuredProducts = products.filter((p) => p.featured === true);

  // Coge solo 4
  featuredProducts = featuredProducts.slice(0, 4);

  const container = document.getElementById('featured-list');
  container.innerHTML = ''; 

  featuredProducts.forEach((prod) => {
    container.innerHTML += buildProductHTML(prod);
  });
}

/** 
 * Renderiza la sección "Dresses & Jumpsuits"
 * Por ejemplo, filtrando "mujer" + subcategory "vestidos" 
 * Coge 4
 */
function renderDresses(products) {
  let dresses = products.filter(
    (p) => p.category === 'mujer' && p.subcategory === 'vestidos'
  );
  dresses = dresses.slice(0, 4);

  const container = document.getElementById('dresses-list');
  container.innerHTML = '';

  dresses.forEach((prod) => {
    container.innerHTML += buildProductHTML(prod);
  });
}

/** 
 * Renderiza la sección "Watches"
 */
function renderWatches(products) {
  let watches = products.filter((p) => p.subcategory === 'relojes');
  watches = watches.slice(0, 4);

  const container = document.getElementById('watches-list');
  container.innerHTML = '';

  watches.forEach((prod) => {
    container.innerHTML += buildProductHTML(prod);
  });
}

/** 
 * Renderiza la sección "Shoes"
 */
function renderShoes(products) {
  let shoes = products.filter((p) => p.subcategory === 'zapatillas');
  shoes = shoes.slice(0, 4);

  const container = document.getElementById('shoes-list');
  container.innerHTML = '';

  shoes.forEach((prod) => {
    container.innerHTML += buildProductHTML(prod);
  });
}

/**
 * buildProductHTML(prod)
 * Devuelve un bloque HTML <div class="product"> con la información 
 * de 'prod'.
 * Ajusta las clases, estilos e IDs según tu propio CSS.
 */
function buildProductHTML(prod) {
  // Extrae info del producto
  const { id, name, price, images } = prod;
  const imgPrincipal = images && images.length > 0 ? "../../" + images[0] : '../../img/noimage.jpg';

  return `
      <div class="product text-center col-lg-3 col-md-4 col-12">
        <img 
          class="img-fluid mb-3" 
          src="${imgPrincipal}" 
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

/** 
 * Redirige a singleproduct.html con la query ?id=..., 
 * para que en esa página se cargue la info de este producto. 
 */
function goToSingleProduct(id) {
  window.location.href = `../html/singleproduct.html?id=${id}`;
}

/** 
 * Añadir al carrito
 * Guarda en localStorage un array de items { productId, quantity }.
 */
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));

  alert('Producto añadido al carrito');
}

/**
 * shuffleArray: para sacar 4 aleatorios
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
