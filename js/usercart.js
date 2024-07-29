document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si ya existe la información en localStorage
    if (localStorage.getItem('userCart')) {
        console.log('ID del carrito ya está en localStorage:', JSON.parse(localStorage.getItem('userCart')).cartId);
        redirectToIndex(); // Redirigir directamente a la página principal si ya hay un carrito guardado
        return;
    }

    try {
        // Obtener userId del localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.userId) {
            console.error('No se encontró información de usuario en localStorage');
            redirectToLogin(); // Redirigir al usuario al login si no hay información de usuario
            return;
        }

        const userId = userInfo.userId;

        // Fetch para obtener solo el ID del carrito del usuario
        const response = await fetch(`https://d2sd26qoendot.cloudfront.net/cart/${userId}/cartId`);
        if (!response.ok) {
            throw new Error('Error al obtener el ID del carrito');
        }

        const cartId = await response.json();
        console.log('ID del carrito obtenido exitosamente:', cartId);

        // Guardar userId y cartId en localStorage
        localStorage.setItem('userCart', JSON.stringify({ userId: userId, cartId: cartId }));

        // Redirigir al usuario a la página principal
        redirectToIndex();

    } catch (error) {
        console.error('Error al obtener o guardar el ID del carrito:', error);
        alert('Hubo un problema al obtener o guardar el ID del carrito. Por favor, intenta más tarde.');
    }
});

function redirectToIndex() {
    window.location.href = 'index.html';
}

function redirectToLogin() {
    window.location.href = 'login.html'; // Ajusta la ruta según corresponda
}
