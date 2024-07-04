document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const result = await response.json();

            // Obtener datos del resultado
            const userId = result.id;
            const username = result.username;

            // Asignar a variables locales (opcional)
            let userInfo = {
                userId: userId,
                username: username
            };

            // Almacenar en localStorage
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // Llamar a la función para crear el carrito
            await createCartForUser(userId);

            // Redirigir al usuario a la página principal
            window.location.href = 'index.html';
        } else {
            alert('Credenciales incorrectas, por favor intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema con el servidor. Por favor, intenta más tarde.');
    }
});

async function createCartForUser(userId) {
    try {
        const response = await fetch(`http://localhost:8080/cart/create?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al crear el carrito');
        }

        console.log('Carrito creado exitosamente');
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        alert('Hubo un problema al crear el carrito. Por favor, intenta más tarde.');
    }
}
