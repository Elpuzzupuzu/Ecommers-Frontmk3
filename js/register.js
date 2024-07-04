document.getElementById('crearUsuarioForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const birthdate = document.getElementById('birthdate').value;

    // Validar que todos los campos estén completos
    if (!firstName || !lastName || !email || !password || !birthdate) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        // Enviar datos al servidor para crear el usuario
        const response = await fetch('http://localhost:8080/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: firstName + ' ' + lastName,
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Ya existe un usuario con el mismo correo electrónico o nombre de usuario.');
        }

        const data = await response.json();
        console.log('Success:', data);
        alert('Usuario creado exitosamente');

        // Limpiar los campos del formulario después de enviarlos
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('birthdate').value = '';

        // Redirigir a la página de inicio de sesión (login.html)
        window.location.href = './login.html';

    } catch (error) {
        console.error('Error:', error.message);
        alert('Hubo un error al crear el usuario: ' + error.message);
    }
});

