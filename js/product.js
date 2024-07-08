document.addEventListener('DOMContentLoaded', () => {
    const buscarProductoForm = document.getElementById('buscarProductoForm');
    const listaProductos = document.getElementById('listaProductos');
    const recargarProductosBtn = document.getElementById('recargarProductos');
    const crearProductoForm = document.getElementById('crearProductoForm');

    // Cargar todos los productos al cargar la página
    cargarProductos();

    // Escuchar el envío del formulario de búsqueda por ID
    buscarProductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productoId = document.getElementById('buscarProductoId').value.trim();
        await buscarProductoPorId(productoId);
    });

    // Escuchar el clic en el botón de recargar productos
    recargarProductosBtn.addEventListener('click', () => {
        cargarProductos();
        limpiarInputBuscar();
    });

    // Escuchar el envío del formulario de creación de producto
    crearProductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const imagen = document.getElementById('imagen').value.trim();
        const id_categoria = document.getElementById('id_categoria').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const precio = document.getElementById('precio').value.trim();
        const stock = document.getElementById('stock').value.trim();

        // Validar que todos los campos estén llenos
        if (imagen && id_categoria && nombre && descripcion && precio && stock) {
            const nuevoProducto = {
                img: imagen,
                id_category: parseInt(id_categoria),
                name: nombre,
                description: descripcion,
                price: parseFloat(precio),
                stock: parseInt(stock)
            };
            await crearProducto(nuevoProducto);
        } else {
            alert('Por favor, complete todos los campos del formulario.');
        }
    });

    // Función para cargar todos los productos
    async function cargarProductos() {
        try {
            const response = await fetch('http://localhost:8080/products/getall');
            if (!response.ok) {
                throw new Error('Error al obtener los productos.');
            }
            const productos = await response.json();
            mostrarProductos(productos);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            alert('Hubo un problema al cargar los productos. Por favor, intenta más tarde.');
        }
    }

    // Función para buscar un producto por ID
    async function buscarProductoPorId(productoId) {
        try {
            const response = await fetch(`http://localhost:8080/products/${productoId}`);
            if (!response.ok) {
                throw new Error('Producto no encontrado o error en la solicitud.');
            }
            const json = await response.json();
            if (!json) {
                throw new Error('Respuesta vacía del servidor.');
            }
            mostrarProductoEnTabla(json);
        } catch (error) {
            console.error('Error al buscar producto por ID:', error);
            alert('No se pudo encontrar el producto o hubo un problema en la solicitud.');
        }
    }

    // Función para crear un nuevo producto
    async function crearProducto(nuevoProducto) {
        try {
            const response = await fetch('http://localhost:8080/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto.');
            }

            const productoCreado = await response.json();
            alert('Producto creado correctamente.');
            limpiarFormularioCrear();
            cargarProductos(); // Volver a cargar todos los productos después de crear uno nuevo
        } catch (error) {
            console.error('Error al crear producto:', error);
            alert('Hubo un problema al intentar crear el producto. Por favor, intenta más tarde.');
        }
    }

    // Función para mostrar un único producto en la tabla
    function mostrarProductoEnTabla(producto) {
        listaProductos.innerHTML = ''; // Limpiar la tabla antes de agregar el producto buscado

        const productoItem = document.createElement('div');
        productoItem.classList.add('producto-item');
        productoItem.innerHTML = `
            <p><strong>Imagen: <img src="${producto.img}" alt="Descripción de la imagen" style="width: 400px; height: 250px;"></strong></p>
            <p><strong>ID:</strong> ${producto.id}</p>
            <p><strong>Nombre:</strong> ${producto.name}</p>
            <p><strong>Precio:</strong> ${producto.price}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
        `;
        listaProductos.appendChild(productoItem);

        // Agregar evento para el botón de eliminar
        const eliminarBtn = productoItem.querySelector('.eliminar-btn');
        eliminarBtn.addEventListener('click', async () => {
            await eliminarProducto(producto.id);
        });
    }

    // Función para mostrar la lista de productos
    function mostrarProductos(productos) {
        listaProductos.innerHTML = '';
        productos.forEach(producto => {
            const productoItem = document.createElement('div');
            productoItem.classList.add('producto-item');
            productoItem.innerHTML = `
                <p><strong>ID:</strong> ${producto.id}</p>
                <p><strong>Nombre:</strong> ${producto.name}</p>
                <p><strong>Descripcion:</strong> ${producto.description}</p>
                <p><strong>Precio:</strong> ${producto.price}</p>
                <p><strong>Stock:</strong> ${producto.stock}</p>
                <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
            `;
            listaProductos.appendChild(productoItem);

            // Agregar evento para el botón de eliminar
            const eliminarBtn = productoItem.querySelector('.eliminar-btn');
            eliminarBtn.addEventListener('click', async () => {
                await eliminarProducto(producto.id);
            });
        });
    }

    // Función para limpiar el campo de búsqueda por ID
    function limpiarInputBuscar() {
        document.getElementById('buscarProductoId').value = '';
    }

    // Función para limpiar el formulario de creación de producto
    function limpiarFormularioCrear() {
        document.getElementById('imagen').value = '';
        document.getElementById('id_categoria').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('stock').value = '';
    }

    // Función para eliminar un producto
    async function eliminarProducto(productoId) {
        try {
            const response = await fetch(`http://localhost:8080/products/${productoId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el producto.');
            }
            alert('Producto eliminado correctamente.');
            cargarProductos(); // Volver a cargar todos los productos después de eliminar uno
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Hubo un problema al intentar eliminar el producto. Por favor, intenta más tarde.');
        }
    }
});
