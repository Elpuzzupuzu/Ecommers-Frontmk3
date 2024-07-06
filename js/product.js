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
        const nuevoProducto = {
            
            img: document.getElementById('img').value.trim(),
            name: document.getElementById('nombre').value.trim(),
            description: document.getElementById('descripcion').value.trim(),
            price: parseFloat(document.getElementById('precio').value.trim()),
            stock: parseInt(document.getElementById('stock').value.trim())
        };
        await crearProducto(nuevoProducto);
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
                throw new Error('Producto no encontrado.');
            }
            const producto = await response.json();
            mostrarProductoEnTabla(producto);
        } catch (error) {
            console.error('Error al buscar producto por ID:', error);
            alert('No se pudo encontrar el producto. Verifica el ID e intenta nuevamente.');
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
        document.getElementById('nombre').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('stock').value = '';
    }
});
