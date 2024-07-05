// Obtener la lista de categorías al cargar la página
document.addEventListener('DOMContentLoaded', async function() {
    await obtenerCategorias();
});

// Función para obtener y mostrar las categorías existentes
async function obtenerCategorias() {
    try {
        const response = await fetch('http://localhost:8080/categories');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }
        const categorias = await response.json();
        const listaCategorias = document.getElementById('listaCategorias');

        listaCategorias.innerHTML = ''; // Limpiar lista antes de agregar nuevas categorías

        categorias.forEach(categoria => {
            const categoriaItem = document.createElement('div');
            categoriaItem.classList.add('category-item');
            categoriaItem.innerHTML = `
                <p><strong>ID:</strong> ${categoria.id}</p>
                <p><strong>Nombre:</strong> ${categoria.name}</p>
                <button class="edit-btn" onclick="editarCategoria(${categoria.id}, '${categoria.name}')">Editar</button>
                <button class="delete-btn" onclick="prepararEliminarCategoria(${categoria.id})">Eliminar</button>
            `;
            listaCategorias.appendChild(categoriaItem);
        });

    } catch (error) {
        console.error('Error al obtener categorías:', error);
        alert('Hubo un problema al obtener las categorías. Por favor, intenta más tarde.');
    }
}

// Función para buscar una categoría por ID
document.getElementById('buscarCategoriaForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const categoriaId = document.getElementById('buscarCategoriaId').value.trim();

    try {
        const response = await fetch(`http://localhost:8080/categories/${categoriaId}`);
        if (!response.ok) {
            throw new Error('Categoría no encontrada');
        }
        const categoria = await response.json();

        // Mostrar formulario de edición y botón de eliminar
        document.getElementById('editarCategoriaForm').style.display = 'block';
        document.getElementById('eliminarCategoria').style.display = 'block';

        // Llenar formulario de edición con los datos de la categoría encontrada
        document.getElementById('editarNombreCategoria').value = categoria.name;

        // Guardar el ID de la categoría actualmente en edición
        document.getElementById('editarCategoriaForm').setAttribute('data-categoria-id', categoria.id);

    } catch (error) {
        console.error('Error al buscar categoría por ID:', error);
        alert('Categoría no encontrada. Por favor, verifica el ID e intenta nuevamente.');
    }
});

// Función para editar una categoría
document.getElementById('editarCategoriaForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const categoriaId = this.getAttribute('data-categoria-id');
    const nuevoNombre = document.getElementById('editarNombreCategoria').value.trim();

    const categoriaActualizada = {
        id: parseInt(categoriaId),
        name: nuevoNombre
    };

    try {
        const response = await fetch(`http://localhost:8080/categories/update/${categoriaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaActualizada)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la categoría');
        }

        alert('Categoría actualizada exitosamente');

        // Limpiar formulario después de éxito
        document.getElementById('editarNombreCategoria').value = '';

        // Ocultar formulario de edición y botón de eliminar
        document.getElementById('editarCategoriaForm').style.display = 'none';
        document.getElementById('eliminarCategoria').style.display = 'none';

        // Actualizar la lista de categorías
        await obtenerCategorias();

    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        alert('Hubo un problema al actualizar la categoría. Por favor, intenta más tarde.');
    }
});

// Función para preparar la eliminación de una categoría
function prepararEliminarCategoria(categoriaId) {
    const confirmacion = confirm('¿Estás seguro de querer eliminar esta categoría?');
    if (confirmacion) {
        eliminarCategoria(categoriaId);
    }
}

// Función para eliminar una categoría
async function eliminarCategoria(categoriaId) {
    try {
        const response = await fetch(`http://localhost:8080/categories/delete/${categoriaId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la categoría');
        }

        alert('Categoría eliminada exitosamente');

        // Actualizar la lista de categorías
        await obtenerCategorias();

    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('Hubo un problema al eliminar la categoría. Por favor, intenta más tarde.');
    }
}

// Función para cancelar la edición de una categoría
document.getElementById('cancelarEdicionBtn').addEventListener('click', function() {
    document.getElementById('editarCategoriaForm').style.display = 'none';
    document.getElementById('eliminarCategoria').style.display = 'none';
});
