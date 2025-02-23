document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
  
    if (!username || !password) {
      const msg = document.getElementById('message');
      msg.textContent = '¡Todos los campos son obligatorios!';
      msg.style.color = 'red';
      return;
    }
  
    fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then((response) => response.json())
      .then((data) => {
        const message = document.getElementById('message');
        if (data.success) {
          message.textContent = '¡Registro exitoso! Redirigiendo al login...';
          message.style.color = 'green';
          setTimeout(() => (window.location.href = 'login.html'), 2000);
        } else {
          message.textContent = data.message || 'Error en el registro.';
          message.style.color = 'red';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
  