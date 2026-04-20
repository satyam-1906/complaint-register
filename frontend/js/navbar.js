function injectNavBar() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const nav = document.createElement('nav');
    nav.className = 'glass animate-up';
    nav.style.display = 'flex';
    nav.style.justifyContent = 'space-between';
    nav.style.alignItems = 'center';

    const brand = document.createElement('div');
    brand.innerHTML = '<strong style="cursor:pointer; font-size: 1.2rem;" onclick="window.location.href=\'index.html\'">Complaint Register</strong>';
    nav.appendChild(brand);

    const authSection = document.createElement('div');
    authSection.id = 'auth-section';

    // Theme Toggle
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
    themeBtn.setAttribute('title', 'Toggle Dark/Light Mode');
    themeBtn.onclick = () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
    };
    authSection.appendChild(themeBtn);

    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (username && token) {
        const userContainer = document.createElement('div');
        userContainer.style.position = 'relative';
        userContainer.style.cursor = 'pointer';
        userContainer.innerHTML = `<span>Hi, <strong>${username}</strong> &#9662;</span>`;
        
        const dropdown = document.createElement('div');
        dropdown.id = 'logout-dropdown';
        dropdown.className = 'glass';
        dropdown.style.display = 'none';
        dropdown.style.position = 'absolute';
        dropdown.style.right = '0';
        dropdown.style.top = '100%';
        dropdown.style.marginTop = '10px';
        dropdown.innerHTML = '<a href="#" id="logout-btn" class="dropdown-item">Logout</a>';
        
        userContainer.appendChild(dropdown);
        
        userContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });

        authSection.appendChild(userContainer);

        setTimeout(() => {
            document.getElementById('logout-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.reload();
            });
        }, 100);

    } else {
        const loginBtn = document.createElement('button');
        loginBtn.innerText = 'Login';
        loginBtn.onclick = () => window.location.href = 'auth.html?tab=login';
        authSection.appendChild(loginBtn);

        const regBtn = document.createElement('button');
        regBtn.innerText = 'Register';
        regBtn.onclick = () => window.location.href = 'auth.html?tab=register';
        authSection.appendChild(regBtn);
    }

    nav.appendChild(authSection);
    document.body.prepend(nav);
}

document.addEventListener('DOMContentLoaded', injectNavBar);
