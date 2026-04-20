const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');

// Tab Switching
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginSection.classList.add('active');
    registerSection.classList.remove('active');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerSection.classList.add('active');
    loginSection.classList.remove('active');
});

// Handle tab from URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('tab') === 'register') {
    registerTab.click();
}

// Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('r-username').value;
    const email = document.getElementById('r-email').value;
    const password = document.getElementById('r-password').value;
    const errorDiv = document.getElementById('register-error');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            loginTab.click();
        } else {
            errorDiv.innerText = data.message;
        }
    } catch (err) {
        errorDiv.innerText = 'Could not connect to server.';
    }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('l-username').value;
    const password = document.getElementById('l-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            window.location.href = 'index.html';
        } else {
            errorDiv.innerText = data.message;
        }
    } catch (err) {
        errorDiv.innerText = 'Could not connect to server.';
    }
});
