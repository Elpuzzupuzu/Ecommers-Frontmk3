// Función para manejar el login de administradores
document.getElementById('loginAdminForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/admins/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const result = await response.json();

            // Obtener datos del resultado
            const adminId = result.id;
            const adminName = result.name;

            // Asignar a variables locales (opcional)
            let adminInfo = {
                adminId: adminId,
                adminName: adminName
            };

            // Almacenar en localStorage
            localStorage.setItem('adminInfo', JSON.stringify(adminInfo));

            // Redirigir al admin a la página principal de administración
            window.location.href = 'main_admin.html'; // Cambia 'otra-pagina.html' por la URL deseada
        } else {
            throw new Error('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema al intentar iniciar sesión. Por favor, intenta más tarde.');
    }
});
