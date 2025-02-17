document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById('message');
        if (data.success) {
            message.textContent = 'Registration successful!';
            message.style.color = 'green';
            setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            message.textContent = data.message;
            message.style.color = 'red';
        }
    })
    .catch(error => console.error('Error:', error));
});
