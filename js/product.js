document.addEventListener('DOMContentLoaded', function() {
    // Verificar si adminInfo es nulo al cargar la página
    let adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo === null) {
        window.location.href = 'login_admin.html'; // 
    }

    const buscarProductoForm = document.getElementById('buscarProductoForm');
    const listaProductos = document.getElementById('listaProductos');
    const recargarProductosBtn = document.getElementById('recargarProductos');
    const crearProductoForm = document.getElementById('crearProductoForm');
    let editarProductoForm = null;

    // Cargar todos los productos al cargar la página
    cargarProductos();

    // Eventos
    buscarProductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productoId = document.getElementById('buscarProductoId').value.trim();
        await buscarProductoPorId(productoId);
    });

    recargarProductosBtn.addEventListener('click', () => {
        cargarProductos();
        limpiarInputBuscar();
    });

    crearProductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoProducto = obtenerDatosFormularioCrear();
        if (validarCampos(nuevoProducto)) {
            await crearProducto(nuevoProducto);
        } else {
            alert('Por favor, complete todos los campos del formulario.');
        }
    });

    // Funciones
    async function cargarProductos() {
        try {
            const response = await fetch('http://localhost:8080/products/getall');
            if (!response.ok) throw new Error('Error al obtener los productos.');

            const productos = await response.json();
            mostrarProductos(productos);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            alert('Hubo un problema al cargar los productos. Por favor, intenta más tarde.');
        }
    }

    async function buscarProductoPorId(productoId) {
        try {
            const response = await fetch(`http://localhost:8080/products/${productoId}`);
            if (!response.ok) throw new Error('Producto no encontrado o error en la solicitud.');

            const producto = await response.json();
            if (!producto) throw new Error('Respuesta vacía del servidor.');

            mostrarProductoEnTabla(producto);
        } catch (error) {
            console.error('Error al buscar producto por ID:', error);
            alert('No se pudo encontrar el producto o hubo un problema en la solicitud.');
        }
    }

    async function crearProducto(nuevoProducto) {
        try {
            const response = await fetch('http://localhost:8080/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            });

            if (!response.ok) throw new Error('Error al crear el producto.');

            alert('Producto creado correctamente.');
            limpiarFormularioCrear();
            cargarProductos();
        } catch (error) {
            console.error('Error al crear producto:', error);
            alert('Hubo un problema al intentar crear el producto. Por favor, intenta más tarde.');
        }
    }

    function mostrarProductoEnTabla(producto) {
        listaProductos.innerHTML = ''; // Limpiar la tabla

        const productoItem = crearElementoProducto(producto);
        listaProductos.appendChild(productoItem);
    }

    function mostrarProductos(productos) {
        listaProductos.innerHTML = ''; // Limpiar la tabla

        productos.forEach(producto => {
            const productoItem = crearElementoProducto(producto);
            listaProductos.appendChild(productoItem);
        });
    }

    function crearElementoProducto(producto) {
        const productoItem = document.createElement('div');
        productoItem.classList.add('producto-item');
        productoItem.setAttribute('data-id', producto.id);
        productoItem.innerHTML = `
            <p><strong>Imagen:</strong> <img src="${producto.img}" alt="Descripción de la imagen" style="max-width: 25%; height: auto;"></p>
            <p><strong>ID:</strong> ${producto.id}</p>
            <p><strong>Nombre:</strong> ${producto.name}</p>
            <p><strong>Precio:</strong> ${producto.price}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
            <button class="editar-btn" data-id="${producto.id}">Editar</button>
        `;

        productoItem.querySelector('.eliminar-btn').addEventListener('click', async () => {
            await eliminarProducto(producto.id);
        });

        productoItem.querySelector('.editar-btn').addEventListener('click', () => {
            abrirFormularioEdicion(producto);
        });

        return productoItem;
    }

    function obtenerDatosFormularioCrear() {
        return {
            img: document.getElementById('imagen').value.trim(),
            id_category: parseInt(document.getElementById('id_categoria').value.trim()),
            name: document.getElementById('nombre').value.trim(),
            description: document.getElementById('descripcion').value.trim(),
            price: parseFloat(document.getElementById('precio').value.trim()),
            stock: parseInt(document.getElementById('stock').value.trim())
        };
    }

    function validarCampos(producto) {
        return producto.img && producto.id_category && producto.name && producto.description && producto.price && producto.stock;
    }

    function limpiarFormularioCrear() {
        document.getElementById('imagen').value = '';
        document.getElementById('id_categoria').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('stock').value = '';
    }

    function limpiarInputBuscar() {
        document.getElementById('buscarProductoId').value = '';
    }

    async function eliminarProducto(productoId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`http://localhost:8080/products/delete/${productoId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error al eliminar el producto.');

                alert('Producto eliminado correctamente.');
                cargarProductos();
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Hubo un problema al intentar eliminar el producto. Por favor, intenta más tarde.');
            }
        }
    }

    async function editarProducto(productoEditado) {
        try {
            const response = await fetch(`http://localhost:8080/products/update/${productoEditado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoEditado)
            });

            if (!response.ok) throw new Error('Error al editar el producto.');

            alert('Producto editado correctamente.');
            editarProductoForm.remove();
            cargarProductos();
        } catch (error) {
            console.error('Error al editar producto:', error);
            alert('Hubo un problema al intentar editar el producto. Por favor, intenta más tarde.');
        }
    }

    function abrirFormularioEdicion(producto) {
        editarProductoForm = document.createElement('form');
        editarProductoForm.id = 'editarProductoForm';

        editarProductoForm.innerHTML = `
            <h2>Editar Producto</h2>
            <input type="hidden" id="editId" value="${producto.id}">
            <label for="editImagen">Imagen:</label>
            <input type="text" id="editImagen" value="${producto.img}" required>
            <label for="editIdCategoria">ID Categoría:</label>
            <input type="number" id="editIdCategoria" value="${producto.id_category}" required>
            <label for="editNombre">Nombre:</label>
            <input type="text" id="editNombre" value="${producto.name}" required>
            <label for="editDescripcion">Descripción:</label>
            <input type="text" id="editDescripcion" value="${producto.description}" required>
            <label for="editPrecio">Precio:</label>
            <input type="number" id="editPrecio" value="${producto.price}" step="0.01" required>
            <label for="editStock">Stock:</label>
            <input type="number" id="editStock" value="${producto.stock}" required>
            <button type="submit">Actualizar Producto</button>
        `;

        document.body.appendChild(editarProductoForm);

        editarProductoForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const productoEditado = {
                id: parseInt(document.getElementById('editId').value),
                img: document.getElementById('editImagen').value.trim(),
                id_category: parseInt(document.getElementById('editIdCategoria').value.trim()),
                name: document.getElementById('editNombre').value.trim(),
                description: document.getElementById('editDescripcion').value.trim(),
                price: parseFloat(document.getElementById('editPrecio').value.trim()),
                stock: parseInt(document.getElementById('editStock').value.trim())
            };

            if (validarCampos(productoEditado)) {
                await editarProducto(productoEditado);
            } else {
                alert('Por favor, complete todos los campos del formulario.');
            }
        });
    }
});
