document.getElementById('crearUsuarioForm').addEventListener('submit', function(e) {
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

    // Enviar datos al servidor
    fetch('http://localhost:8080/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: firstName + ' ' + lastName,
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ya existe un usuario con el mismo correo electrónico o nombre de usuario.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Usuario creado exitosamente');

        // Limpiar los campos del formulario después de enviarlos
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('birthdate').value = '';

        // Redirigir a la página index.html después de enviar el formulario
        window.location.href = './index.html';
    })
    .catch((error) => {
        console.error('Error:', error.message);
        alert('Hubo un error al crear el usuario: ' + error.message);
    });
});
