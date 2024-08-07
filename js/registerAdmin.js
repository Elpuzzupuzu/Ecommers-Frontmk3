document.getElementById('crearAdminForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const adminData = {
        name: name,
        lastname: lastname,
        email: email,
        password: password
    };

    fetch('http://localhost:8080/admins/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Admin creado:', data);
        alert('Administrador creado exitosamente');
        document.getElementById('crearAdminForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear el administrador');
    });
});
