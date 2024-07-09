document.addEventListener('DOMContentLoaded', () => {
    const buscarProductoForm = document.getElementById('buscarProductoForm');
    const listaProductos = document.getElementById('listaProductos');
    const recargarProductosBtn = document.getElementById('recargarProductos');
    const crearProductoForm = document.getElementById('crearProductoForm');
    let editarProductoForm = null; // Variable para mantener referencia al formulario de edición

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
            <p><strong>Imagen:</strong> <img src="${producto.img}" alt="Descripción de la imagen" style="max-width: 25%; height: auto;"></p>
            <p><strong>ID:</strong> ${producto.id}</p>
            <p><strong>Nombre:</strong> ${producto.name}</p>
            <p><strong>Precio:</strong> ${producto.price}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
            <button class="editar-btn" data-id="${producto.id}">Editar</button>
        `;
        listaProductos.appendChild(productoItem);

        // Agregar evento para el botón de eliminar
        const eliminarBtn = productoItem.querySelector('.eliminar-btn');
        eliminarBtn.addEventListener('click', async () => {
            await eliminarProducto(producto.id);
        });

        // Agregar evento para el botón de editar
        const editarBtn = productoItem.querySelector('.editar-btn');
        editarBtn.addEventListener('click', () => {
            abrirFormularioEdicion(producto);
        });
    }

    // Función para abrir el formulario de edición con los datos del producto seleccionado
    function abrirFormularioEdicion(producto) {
        // Crear el formulario de edición
        editarProductoForm = document.createElement('form');
        editarProductoForm.id = 'editarProductoForm';

        editarProductoForm.innerHTML = `
            <h2>Editar Producto</h2>
            <input type="hidden" id="editarProductoId" value="${producto.id}">
            <div class="form-group">
                <label for="editarImagen">Imagen:</label>
                <input type="text" id="editarImagen" name="editarImagen" value="${producto.img}" required>
            </div>
            <div class="form-group">
                <label for="editarIdCategoria">Id del producto:</label>
                <input type="number" id="editarIdCategoria" name="editarIdCategoria" value="${producto.id_category}" required>
            </div>
            <div class="form-group">
                <label for="editarNombre">Nombre:</label>
                <input type="text" id="editarNombre" name="editarNombre" value="${producto.name}" required>
            </div>
            <div class="form-group">
                <label for="editarDescripcion">Descripción:</label>
                <textarea id="editarDescripcion" name="editarDescripcion" rows="3" required>${producto.description}</textarea>
            </div>
            <div class="form-group">
                <label for="editarPrecio">Precio:</label>
                <input type="number" id="editarPrecio" name="editarPrecio" step="0.01" min="0" value="${producto.price}" required>
            </div>
            <div class="form-group">
                <label for="editarStock">Stock:</label>
                <input type="number" id="editarStock" name="editarStock" min="0" value="${producto.stock}" required>
            </div>
            <button type="submit">Guardar Cambios</button>
            <button type="button" id="cancelarEdicion">Cancelar</button>
        `;

        // Escuchar el envío del formulario de edición
        editarProductoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const productoEditado = {
                id: parseInt(document.getElementById('editarProductoId').value),
                img: document.getElementById('editarImagen').value.trim(),
                id_category: parseInt(document.getElementById('editarIdCategoria').value),
                name: document.getElementById('editarNombre').value.trim(),
                description: document.getElementById('editarDescripcion').value.trim(),
                price: parseFloat(document.getElementById('editarPrecio').value),
                stock: parseInt(document.getElementById('editarStock').value)
            };
            await editarProducto(productoEditado);
        });

        // Escuchar el clic en el botón de cancelar
        const cancelarBtn = editarProductoForm.querySelector('#cancelarEdicion');
        cancelarBtn.addEventListener('click', () => {
            editarProductoForm.remove(); // Eliminar el formulario de edición
        });

        // Mostrar el formulario de edición al lado derecho del producto
        const productoItem = listaProductos.querySelector(`.producto-item[data-id="${producto.id}"]`);
        productoItem.appendChild(editarProductoForm);
    }

    // Función para editar un producto
    async function editarProducto(productoEditado) {
        try {
            const response = await fetch(`http://localhost:8080/products/update/${productoEditado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoEditado)
            });

            if (!response.ok) {
                throw new Error('Error al editar el producto.');
            }

            const productoActualizado = await response.json();
            alert('Producto actualizado correctamente.');
            cargarProductos(); // Volver a cargar todos los productos después de editar uno
        } catch (error) {
            console.error('Error al editar producto:', error);
            alert('Hubo un problema al intentar editar el producto. Por favor, intenta más tarde.');
        } finally {
            editarProductoForm.remove(); // Eliminar el formulario de edición
        }
    }

    // Función para eliminar un producto
    async function eliminarProducto(productoId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`http://localhost:8080/products/delete/${productoId}`, {
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
    }

    // Función para mostrar todos los productos en la tabla
    function mostrarProductos(productos) {
        listaProductos.innerHTML = ''; // Limpiar la tabla antes de agregar productos

        productos.forEach(producto => {
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
            listaProductos.appendChild(productoItem);

            // Agregar evento para el botón de eliminar
            const eliminarBtn = productoItem.querySelector('.eliminar-btn');
            eliminarBtn.addEventListener('click', async () => {
                await eliminarProducto(producto.id);
            });

            // Agregar evento para el botón de editar
            const editarBtn = productoItem.querySelector('.editar-btn');
            editarBtn.addEventListener('click', () => {
                abrirFormularioEdicion(producto);
            });
        });
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

    // Función para limpiar el campo de búsqueda
    function limpiarInputBuscar() {
        document.getElementById('buscarProductoId').value = '';
    }
});
