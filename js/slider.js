document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = 'http://localhost:8080/products/page'; // Reemplaza con la URL de tu servidor Spring Boot
    let currentPage = 0;
    const pageSize = 5;
    const numerito = document.getElementById('numerito');

    // Array para almacenar productos en el carrito
    let productosEnCarrito = JSON.parse(window.localStorage.getItem("productos-en-carrito")) || [];
    let productos = []; // Variable para almacenar los productos obtenidos del backend

    // Función para obtener todos los productos desde el backend
    async function getAllProducts(page, size) {
        try {
            const response = await fetch(`${baseUrl}?page=${page}&size=${size}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            productos = data.content; // Guarda los productos obtenidos en la variable productos
            displayProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Función para mostrar los productos en la página
    function displayProducts(productsPage) {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = ''; // Limpiamos el contenedor

        if (!productsPage.content || productsPage.content.length === 0) {
            productsContainer.innerHTML = '<p>No products found.</p>';
            return;
        }

        productsPage.content.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = 
            `
            <div class="card-product">
                <div class="container-img">
                    <img src="${product.img}" alt="Producto">
                    <span class="discount">-13%</span>
                    <div class="button-group">
                        <span>
                            <i class="fa-solid fa-eye"></i>
                        </span>
                        <span>
                            <i class="fa-regular fa-heart"></i>
                        </span>
                        <span>
                            <i class="fa-solid fa-code-compare"></i>
                        </span>
                    </div>
                </div>
                <div class="content-card-product">
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    <h3>${product.name}</h3>
                    <button class="add-cart" id="${product.id}">
                        <i class="fa-solid fa-basket-shopping"></i>
                    </button>
                    <p class="price">$${product.price} <span></span></p>
                    <p class="stock">${product.stock} en stock</p>
                </div>
            </div>
            `;
            
            productsContainer.appendChild(productCard);

            // Agregar evento click al botón de agregar al carrito
            productCard.querySelector('.add-cart').addEventListener('click', function(e) {
                e.preventDefault(); // Prevenir comportamiento por defecto del botón
                agregarAlCarrito(e); // Llama a la función agregarAlCarrito pasando el evento
            });
        });

        // Información de paginación
        const pageInfo = document.getElementById('pageInfo');
        pageInfo.innerHTML = `Página ${productsPage.number + 1} de ${productsPage.totalPages}`;

        document.getElementById('prevPage').disabled = productsPage.number === 0;
        document.getElementById('nextPage').disabled = productsPage.number + 1 >= productsPage.totalPages;
    }

    // Botón de página anterior
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            getAllProducts(currentPage, pageSize);
        }
    });

    // Botón de página siguiente
    document.getElementById('nextPage').addEventListener('click', function() {
        currentPage++;
        getAllProducts(currentPage, pageSize);
    });

    // Función para guardar el carrito en localStorage
    const saveLocalCarrito = () => {
        console.log(productosEnCarrito);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        
    };

    // Función para agregar productos al carrito
    function agregarAlCarrito(e) {
        const idBoton = parseInt(e.currentTarget.id, 10);
        const productoAgregado = productos.find(producto => producto.id === idBoton);

        if (productoAgregado) {
            const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idBoton);

            if (productoEnCarrito) {
                // Si el producto ya está en el carrito, aumentar la cantidad vendida
                productoEnCarrito.sold++;
            } else {
                // Si el producto no está en el carrito, agregarlo con la cantidad vendida inicial de 1
                productoAgregado.sold = 1;
                productosEnCarrito.push(productoAgregado);
                saveLocalCarrito();
            }

            saveLocalCarrito();

            // Envía el producto al carrito en el backend
            // await agregarProductoAlCarrito(productoAgregado.id, productoAgregado.sold);

            // Actualizar número de productos en el carrito después de modificarlo
            actualizarNumerito();
        } else {
            console.error(`Producto con ID ${idBoton} no encontrado`);
        }
    }




    // Función para enviar el producto al carrito en el backend
    async function agregarProductoAlCarrito(productId, quantity) {
        try {
            const response = await fetch(`http://localhost:8080/cart/add?userId=1&productId=${productId}&quantity=${quantity}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al agregar producto al carrito');
            }

            console.log('Producto agregado al carrito en el backend');
        } catch (error) {
            console.error('Error al agregar producto al carrito en el backend:', error);
            alert('Error al agregar producto al carrito');
        }
    }   /// REVISAR LA LOGICA

    

    // Función para actualizar el número de productos en el carrito
    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.sold, 0);
        numerito.innerText = nuevoNumerito;
    }

    // Inicialización de productos al cargar la página
    getAllProducts(currentPage, pageSize);
});
