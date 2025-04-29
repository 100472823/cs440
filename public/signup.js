document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const message = document.getElementById('message');

  if (!username || !password) {
    message.textContent = '¡Todos los campos son obligatorios!';
    message.style.color = 'red';
    return;
  }

  fetch('/user/signup', {   // CORREGIDO: ahora va a /user/signup
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      message.textContent = 'Successful sign up :)';
      message.style.color = 'green';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      message.textContent = data.message || 'Sign Up Error';
      message.style.color = 'red';
    }
  })
  .catch(error => {
    console.error('❌ Signup fetch error:', error);
    message.textContent = 'Server Error. Try again later';
    message.style.color = 'red';
  });
});
