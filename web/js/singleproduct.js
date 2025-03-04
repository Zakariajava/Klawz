/*****************************************************
 * singleproduct.js
 * - Lee ?id=... de la URL
 * - Carga el producto correspondiente de productos.json
 * - Rellena la página con sus fotos, nombre, descripción, precio...
 * - Permite cambiar la imagen principal al pinchar las miniaturas
 * - Botón "ADD TO CART" => añade la cantidad elegida
 ****************************************************/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener id desde la URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'), 10);
  
    // 2. Cargar JSON y buscar el producto
    fetch('../../productos.json')
      .then((resp) => resp.json())
      .then((products) => {
        const product = products.find((p) => p.id === productId);
        if (!product) {
          // Manejo de error: producto no encontrado
          alert('Producto no encontrado');
          return;
        }
        // 3. Rellenar la página con la info
        displayProduct(product);
      })
      .catch((err) => {
        console.error('Error al cargar JSON o producto:', err);
      });
  });
  
  /** displayProduct(product)
   * Rellena el HTML con los datos del producto
   */
  function displayProduct(product) {
    const mainImgEl = document.getElementById('MainImg');
    const smallImgContainer = document.getElementById('small-img-container');
    const nameEl = document.getElementById('prod-name');
    const categoryEl = document.getElementById('prod-category');
    const priceEl = document.getElementById('prod-price');
    const descEl = document.getElementById('prod-description');
    const addCartBtn = document.getElementById('addCartBtn');
    const quantityInput = document.getElementById('prod-quantity');
  
    // Asigna valores
    nameEl.textContent = product.name;
    categoryEl.textContent = product.category + ' / ' + product.subcategory;
    priceEl.textContent = product.price.toFixed(2) + ' €';
    descEl.textContent = product.description || 'Sin descripción.';
  
    // Imagen principal (la primera)
    if (product.images && product.images.length > 0) {
      mainImgEl.src = "../../" + product.images[0];
    } else {
      mainImgEl.src = '../../img/noimage.jpg';
    }
  
    // Miniaturas
    smallImgContainer.innerHTML = '';
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgSrc) => {
        const finalImg = "../../" + imgSrc;
        const div = document.createElement('div');
        div.className = 'small-img-col';
        div.innerHTML = `<img src="${finalImg}" alt="thumb" class="small-img" />`;
        // Al hacer click en la miniatura => cambiar MainImg
        div.addEventListener('click', () => {
          mainImgEl.src = finalImg;
        });
        smallImgContainer.appendChild(div);
      });
    }
  
    // Botón ADD TO CART
    addCartBtn.addEventListener('click', () => {
      const qty = parseInt(quantityInput.value, 10);
      if (qty <= 0) {
        alert('La cantidad debe ser mayor que 0');
        return;
      }
      addToCart(product.id, qty);
    });
  }
  
  /** addToCart(productId, quantity)
   * Añade "quantity" unidades del productoId al carrito localStorage
   */
  function addToCart(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find((i) => i.productId === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Se añadieron ${quantity} unidad(es) al carrito`);
  }
  