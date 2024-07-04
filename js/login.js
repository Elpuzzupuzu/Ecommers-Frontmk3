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
        // Aquí puedes manejar el resultado del inicio de sesión, como guardar el token en el localStorage
        console.log(result);
        window.location.href = 'index.html'; // Redirige al usuario a la página principal
      } else {
        alert('Credenciales incorrectas, por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un problema con el servidor. Por favor, intenta más tarde.');
    }
  });