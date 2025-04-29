document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Evitar recarga de página

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('/user/login', {   // CORREGIDO: ahora va a /user/login
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then((response) => response.json())
  .then((data) => {
    const message = document.getElementById('message');
    console.log("🔵 Response from server:", data);
    
    if (data.success) {
      console.log("✅ Login success! Setting user and redirecting...");
      localStorage.setItem('loggedInUser', username);
      message.textContent = 'Successful Login :)';
      message.style.color = 'green';
      window.location.href = 'homepage.html'; // Redirige a homepage
    } else {
      console.log("❌ Login failed.");
      message.textContent = data.message || 'Invalid Credentials';
      message.style.color = 'red';
    }
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    const message = document.getElementById('message');
    message.textContent = 'Server Error. Try again later';
    message.style.color = 'red';
  });
});
