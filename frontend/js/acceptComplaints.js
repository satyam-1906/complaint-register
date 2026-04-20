const form = document.querySelector('form');
const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

// Check login status on load
if (!username || !token) {
    const msg = document.createElement('div');
    msg.className = 'card glass animate-up';
    msg.style.textAlign = 'center';
    msg.style.marginBottom = '20px';
    msg.style.border = '1px solid #ff4d4d';
    msg.innerHTML = '<strong style="color:#ff4d4d">Hold on! 🛑 You need to <a href="auth.html?tab=login" style="color:var(--primary-green)">Login</a> or <a href="auth.html?tab=register" style="color:var(--primary-green)">Register</a> to submit a complaint.</strong>';
    form.prepend(msg);
    // Disable all inputs
    Array.from(form.elements).forEach(el => {
        if (el.tagName !== 'BUTTON' || el.type === 'submit') {
            el.disabled = true;
            el.style.opacity = '0.5';
        }
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!token) {
        alert('You must be logged in to submit a complaint.');
        return;
    }

    const formData = new FormData(e.target);
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    
    submitBtn.innerText = 'Sending... ⏳';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/complaints', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('Your complaint has been heard! 🕊️');
            e.target.reset();
        } else {
            alert('Oops: ' + result.message);
        }
    } catch (error) {
        console.error('FETCH ERROR:', error.message);
        alert('Could not connect to the server.');
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});
