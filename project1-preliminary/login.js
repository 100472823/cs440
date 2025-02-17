document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById('message');
        if (data.success) {
            message.textContent = 'Login successful!';
            message.style.color = 'green';
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            message.textContent = 'Invalid credentials.';
            message.style.color = 'red';
        }
    })
    .catch(error => console.error('Error:', error));
});
