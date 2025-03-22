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
        console.log(" Response from server:", data);
      
        if (data.success) {
          console.log(" Login success! Setting user and redirecting...");
          localStorage.setItem('loggedInUser', username);
          message.textContent = 'Successful Login :)';
          message.style.color = 'green';
      
          // Test: redirect immediately
          window.location.href = 'homepage.html';
        } else {
          console.log(" Login failed.");
          message.textContent = data.message || 'Invalid Credentials';
          message.style.color = 'red';
        }
      })
      
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById('message').textContent =
          'Server Error. Try again later';
        document.getElementById('message').style.color = 'red';
      });
  });

  
  
  