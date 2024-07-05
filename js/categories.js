// Función para manejar el envío del formulario de creación de categoría
document.getElementById('crearCategoriaForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombreCategoria = document.getElementById('nombreCategoria').value;

    try {
        const response = await fetch('http://localhost:8080/categories/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nombreCategoria })
        });

        if (response.ok) {
            const nuevaCategoria = await response.json();

            // Limpiar el campo de entrada después de crear la categoría
            document.getElementById('nombreCategoria').value = '';

            // Mostrar mensaje de éxito
            alert(`Categoría "${nuevaCategoria.name}" creada con éxito.`);
            
            // Actualizar la lista de categorías
            await mostrarCategorias();

        } else {
            throw new Error('Error al crear la categoría.');
        }
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        alert('Hubo un problema al intentar crear la categoría. Por favor, intenta más tarde.');
    }
});

// Función para mostrar todas las categorías existentes
async function mostrarCategorias() {
    try {
        const response = await fetch('http://localhost:8080/categories');
        if (!response.ok) {
            throw new Error('Error al obtener las categorías.');
        }

        const categorias = await response.json();
        const listaCategorias = document.getElementById('listaCategorias');

        // Limpiar la lista antes de añadir las nuevas categorías
        listaCategorias.innerHTML = '';

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
