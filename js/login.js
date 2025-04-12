document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // Simple validation
        if (!email || !password || !role) {
            alert('Please fill in all fields');
            return;
        }
        
        // For demo purposes, we'll use a simple validation
        if (email && password) {
            // Create user object
            const user = {
                name: email.split('@')[0],
                email: email,
                role: role,
                token: 'demo-token-' + Date.now()
            };
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userToken', user.token);
            
            // Show success message
            const loginBox = document.querySelector('.login-box');
            loginBox.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>Login Successful!</h2>
                    <p>Redirecting to dashboard...</p>
                </div>
            `;
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            alert('Invalid credentials');
        }
    });
}); 