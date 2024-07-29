document.addEventListener('DOMContentLoaded', function () {
    fetch('https://d2sd26qoendot.cloudfront.net/users/all') // Ajusta la URL según sea necesario
        .then(response => response.json())
        .then(data => {
            console.log('Datos obtenidos de la API:', data); // Verifica los datos en la consola
            const tableBody = document.getElementById('users-table').getElementsByTagName('tbody')[0];
            // Verifica si data es un array
            if (Array.isArray(data)) {
                data.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('La respuesta no es un array:', data);
            }
        })
        .catch(error => console.error('Error fetching users:', error));
});
