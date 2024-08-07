// Función para manejar el envío del formulario de búsqueda por ID
document.getElementById('buscarCategoriaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const categoriaId = document.getElementById('buscarCategoriaId').value;
    await buscarCategoriaPorId(categoriaId);
});

// Función para buscar una categoría por ID
async function buscarCategoriaPorId(categoriaId) {
    try {
        const response = await fetch(`http://localhost:8080/categories/${categoriaId}`);
        if (!response.ok) {
            throw new Error('Categoría no encontrada.');
        }

        const categoria = await response.json();
        const listaCategorias = document.getElementById('listaCategorias');
        listaCategorias.innerHTML = ''; // Limpiar la lista antes de añadir la nueva categoría

        // Mostrar la categoría encontrada en la tabla
        const categoriaItem = document.createElement('div');
        categoriaItem.classList.add('category-item');
        categoriaItem.innerHTML = `
            <p><strong>ID:</strong> ${categoria.id}</p>
            <p><strong>Nombre:</strong> ${categoria.name}</p>
            <button class="edit-btn" onclick="editarCategoria(${categoria.id}, '${categoria.name}')">Editar</button>
            <button class="delete-btn" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
        `;
        listaCategorias.appendChild(categoriaItem);

    } catch (error) {
        console.error('Error al buscar categoría por ID:', error);
        alert('No se pudo encontrar la categoría. Verifica el ID e intenta nuevamente.');
    }
}

// Función para mostrar todas las categorías existentes
async function mostrarCategorias() {
    try {
        const response = await fetch('http://localhost:8080/categories');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías.');
        }

        const categorias = await response.json();
        const listaCategorias = document.getElementById('listaCategorias');
        listaCategorias.innerHTML = ''; // Limpiar la lista antes de añadir las nuevas categorías

        // Mostrar cada categoría en la lista
        categorias.forEach(categoria => {
            const categoriaItem = document.createElement('div');
            categoriaItem.classList.add('category-item');
            categoriaItem.innerHTML = `
                <p><strong>ID:</strong> ${categoria.id}</p>
                <p><strong>Nombre:</strong> ${categoria.name}</p>
                <button class="edit-btn" onclick="editarCategoria(${categoria.id}, '${categoria.name}')">Editar</button>
                <button class="delete-btn" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
            `;
            listaCategorias.appendChild(categoriaItem);
        });

    } catch (error) {
        console.error('Error al mostrar categorías:', error);
        alert('Hubo un problema al intentar mostrar las categorías. Por favor, intenta más tarde.');
    }
}

// Función para crear una nueva categoría
document.getElementById('crearCategoriaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombreCategoria = document.getElementById('nombreCategoria').value.trim();

    try {
        const response = await fetch('http://localhost:8080/categories/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nombreCategoria })
        });

        if (!response.ok) {
            throw new Error('Error al crear la categoría.');
        }

        // Mostrar mensaje de éxito
        alert('Categoría creada correctamente.');

        // Limpiar el campo y actualizar la lista de categorías
        document.getElementById('nombreCategoria').value = '';
        await mostrarCategorias();

    } catch (error) {
        console.error('Error al crear categoría:', error);
        alert('Hubo un problema al intentar crear la categoría. Por favor, intenta más tarde.');
    }
});

// Función para cargar todas las categorías al hacer clic en el nuevo botón
document.getElementById('cargarTodasBtn').addEventListener('click', async function() {
    // Limpiar el campo de búsqueda por ID
    document.getElementById('buscarCategoriaId').value = '';

    // Mostrar todas las categorías
    await mostrarCategorias();
});

// Función para editar una categoría
async function editarCategoria(categoriaId, nombreCategoria) {
    document.getElementById('buscarCategoriaId').value = categoriaId;
    document.getElementById('editarNombreCategoria').value = nombreCategoria;

    // Mostrar formulario de edición y ocultar otros elementos
    document.getElementById('editarCategoriaForm').style.display = 'block';
    document.getElementById('eliminarCategoria').style.display = 'none';

    // Enfocar en el campo de nombre de categoría para edición
    document.getElementById('editarNombreCategoria').focus();
}

// Función para cancelar la edición de una categoría
document.getElementById('cancelarEdicionBtn').addEventListener('click', function() {
    // Limpiar campos y ocultar formulario de edición
    document.getElementById('editarCategoriaForm').style.display = 'none';
    document.getElementById('editarNombreCategoria').value = '';
    document.getElementById('buscarCategoriaId').value = '';
    mostrarCategorias(); // Actualizar lista de categorías después de cancelar edición
});

// Función para eliminar una categoría
async function eliminarCategoria(categoriaId) {
    const confirmacion = confirm('¿Estás seguro de eliminar esta categoría?');
    if (confirmacion) {
        try {
            const response = await fetch(`http://localhost:8080/categories/${categoriaId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Mostrar mensaje de éxito
                alert('Categoría eliminada correctamente.');

                // Actualizar la lista de categorías
                await mostrarCategorias();

            } else {
                throw new Error('Error al eliminar la categoría.');
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            alert('Hubo un problema al intentar eliminar la categoría. Por favor, intenta más tarde.');
        }
    }
}

// Al cargar la página, mostrar todas las categorías existentes
mostrarCategorias();
