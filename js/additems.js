// Función para obtener el ID de usuario desde el localStorage
function getUserIdFromLocalStorage() {
    const userData = JSON.parse(localStorage.getItem('userData')); // Asumiendo que 'userData' contiene la información del usuario
    return userData ? userData.userId : null; // Ajusta según la estructura de tu objeto userData
}

// Script para acceder al endpoint del nuevo método
async function enviarProductosAlCarrito() {
    try {
        const userId = getUserIdFromLocalStorage(); // Obtener el ID de usuario del localStorage
        const productosEnCarrito = JSON.parse(localStorage.getItem('productos-en-carrito')) || [];
        
        const response = await fetch(`http://localhost:8080/cart/add-items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                productos: productosEnCarrito
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar productos al carrito');
        }

        console.log('Productos enviados al carrito correctamente');
        localStorage.removeItem('productos-en-carrito'); // Limpiar productos del carrito en localStorage después de enviarlos

    } catch (error) {
        console.error('Error al enviar productos al carrito:', error);
        alert('Error al enviar productos al carrito');
    }
}
