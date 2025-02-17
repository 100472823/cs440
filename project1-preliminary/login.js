document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar que el form recargue la página
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    // OJO: si sirves todo desde la misma URL y puerto, 
    // puedes usar fetch('/login') sin http://localhost:5500
    // pero si prefieres poner la ruta absoluta, haz:
    // fetch('http://localhost:5500/login', {...})
    
    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then((response) => response.json())
      .then((data) => {
        const message = document.getElementById('message');
        if (data.success) {
          message.textContent = '¡Login exitoso! Redirigiendo...';
          message.style.color = 'green';
          // Rediriges, por ejemplo, al index o a otra página:
          setTimeout(() => (window.location.href = 'index.html'), 2000);
        } else {
          message.textContent = data.message || 'Credenciales inválidas.';
          message.style.color = 'red';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').textContent =
          'Error de servidor. Intenta más tarde.';
        document.getElementById('message').style.color = 'red';
      });
  });

  
  
  