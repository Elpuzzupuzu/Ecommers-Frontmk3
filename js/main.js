// Función para obtener los productos resumidos por categoría
async function getProductSummariesByCategory(categoryName) {
    try {
        const response = await fetch(`http://localhost:8080/products/by-category?categoryName=${categoryName}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Product Summaries for ${categoryName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching product summaries for ${categoryName}:`, error);
        return [];
    }
}

// Función para obtener todos los productos resumidos
async function getAllProductSummaries() {
    try {
        const response = await fetch('http://localhost:8080/products/getall');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log('All Product Summaries:', data);
        return data;
    } catch (error) {
        console.error('Error fetching all product summaries:', error);
        return [];
    }
}

// Variables globales
const productos = [];
let productoAgregado = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
const numerito = document.querySelector("#numerito");

// Función para cargar los productos después de que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", async function() {
    try {
        await initializeProductos();
        await cargarTodosLosProductos();  // Cargar todos los productos al iniciar la página
        actualizarBotonesAgregar();
        actualizarNumerito();
    } catch (error) {
        console.error('Error initializing products:', error);
    }

    // Obtener todos los botones de categoría
    const botonesCategoria = document.querySelectorAll(".boton-categoria");    /* probando * TTTTTTTTTTTTTT*/ 

    // Escuchar clics en los botones de categoría
    botonesCategoria.forEach(boton => {
        boton.addEventListener("click", async function(e) {
            // Remover la clase 'active' de todos los botones de categoría
            botonesCategoria.forEach(boton => boton.classList.remove("active"));
            
            // Agregar la clase 'active' al botón actual
            e.currentTarget.classList.add("active");

            // Obtener el categoryName del id del botón
            const categoryName = this.id;

            // Actualizar el título principal según la categoría seleccionada
            actualizarTituloPrincipal(categoryName);

            // Cargar productos por categoría
            if (categoryName === 'todos') {
                await cargarTodosLosProductos();
            } else {
                await cargarProductosPorCategoria(categoryName);
            }

            // Actualizar eventos de botones de agregar
            actualizarBotonesAgregar();
        });
    });
});

// Función para actualizar el título principal según la categoría seleccionada
function actualizarTituloPrincipal(categoryName) {
    const tituloPrincipal = document.querySelector(".heading-1");   /* TRABAJANDO*/
    if (categoryName === 'todos') {
        tituloPrincipal.textContent = 'Todos los productos';
    } else {
        tituloPrincipal.textContent = `Productos de ${categoryName}`;
    }
}

// Función para cargar todos los productos
async function cargarTodosLosProductos() {
    try {
        const products = await getAllProductSummaries();
        productos.splice(0, productos.length, ...products); // Limpiar y actualizar productos globales
        mostrarProductos(products);
    } catch (error) {
        console.error('Error cargando todos los productos:', error);
    }
}

// Función para cargar productos por categoría
async function cargarProductosPorCategoria(categoryName) {
    try {
        const products = await getProductSummariesByCategory(categoryName);
        productos.splice(0, productos.length, ...products); // Limpiar y actualizar productos globales
        mostrarProductos(products);
    } catch (error) {
        console.error(`Error cargando productos por categoría ${categoryName}:`, error);
    }
}

// Función para mostrar productos en el contenedor  /*ya modificado*/
function mostrarProductos(products) {
    const contenedorProductos = document.querySelector("#container-products"); // parte dinamica a modificar

    if (!contenedorProductos) {
        console.error('Contenedor de productos no encontrado en el DOM');
        return;
    }

    // Limpiar contenedor de productos
    contenedorProductos.innerHTML = '';

    // Mostrar productos en el contenedor
    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
           <div class="card-product">
                    <div class="container-img">
                        <img src="${product.img}" alt="illia">
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
                     </div>  <!--testing-->
                     <div class="content-card-product">
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <h3>${product.name}</h3>
                        <button class="add-cart" id=${product.id}>
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>
                        <p class="price">$${product.price}  <span></span></p>
                        <P class="price">${product.stock}<span></span></p>
                    </div>
                </div><!--fin card product-->
        `;
        contenedorProductos.appendChild(div);
    });
}

// Función para actualizar eventos de botones de agregar
function actualizarBotonesAgregar() {
    document.querySelectorAll('.add-cart').forEach(boton => {
        boton.removeEventListener('click', agregarAlCarrito); // Limpiar eventos existentes
        boton.addEventListener('click', agregarAlCarrito); // Agregar evento actualizado
    });
}

// Función para agregar productos al carrito
function agregarAlCarrito(e) {
    const idBoton = parseInt(e.currentTarget.id, 10);
    console.log(`ID del botón: ${idBoton}`);

    const productoAgregadoEnClick = productos.find(producto => producto.id === idBoton);
    if (productoAgregadoEnClick) {
        const productoEnCarrito = productoAgregado.find(producto => producto.id === idBoton);
        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, aumentar la cantidad vendida
            productoEnCarrito.sold++;
        } else {
            // Si el producto no está en el carrito, agregarlo con la cantidad vendida inicial de 1
            productoAgregadoEnClick.sold = 1;
            productoAgregado.push(productoAgregadoEnClick);
            console.log(`Producto agregado:`, productoAgregadoEnClick);
        }
        console.log(productoAgregado);
    } else {
        console.error(`Producto con ID ${idBoton} no encontrado`);
    }
    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productoAgregado));

    console.log(`Productos en el carrito:`, productoAgregado);
}

// Función de inicialización
async function initializeProductos() {
    try {
        const products = await getAllProductSummaries();
        productos.push(...products);
        mostrarProductos(products);
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

// Función para actualizar el número de productos en el carrito
function actualizarNumerito() {
    let nuevoNumerito = productoAgregado.reduce((acc, producto) => acc + producto.sold, 0);
    numerito.innerText = nuevoNumerito;
}


    