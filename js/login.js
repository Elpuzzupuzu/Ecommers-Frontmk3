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
