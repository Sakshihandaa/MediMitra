// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Handle role selection in signup form
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const patientFields = document.querySelector('.patient-fields');
    const hospitalFields = document.querySelector('.hospital-fields');

    if (roleInputs.length > 0) {
        roleInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.value === 'patient') {
                    patientFields.style.display = 'block';
                    hospitalFields.style.display = 'none';
                } else {
                    patientFields.style.display = 'none';
                    hospitalFields.style.display = 'block';
                }
            });
        });
    }

    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;
            const rememberMe = document.querySelector('input[name="remember"]').checked;

            // TODO: Implement actual login logic
            console.log('Login attempt:', { email, password, role, rememberMe });
            
            // Simulate successful login
            window.location.href = 'dashboard.html';
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.querySelector('input[name="role"]:checked').value;
            
            if (role === 'patient') {
                const formData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    abhaId: document.getElementById('abhaId').value,
                    password: document.getElementById('password').value,
                    confirmPassword: document.getElementById('confirmPassword').value
                };

                // Validate passwords match
                if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                // TODO: Implement actual patient signup logic
                console.log('Patient signup:', formData);
            } else {
                const formData = {
                    hospitalName: document.getElementById('hospitalName').value,
                    licenseId: document.getElementById('licenseId').value,
                    email: document.getElementById('hospitalEmail').value,
                    contactNumber: document.getElementById('contactNumber').value,
                    password: document.getElementById('hospitalPassword').value,
                    confirmPassword: document.getElementById('confirmHospitalPassword').value
                };

                // Validate passwords match
                if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                // TODO: Implement actual hospital signup logic
                console.log('Hospital signup:', formData);
            }

            // Simulate successful signup
            window.location.href = 'dashboard.html';
        });
    }

    // Social login handlers
    const googleLoginBtn = document.querySelector('.social-btn.google');
    const abhaLoginBtn = document.querySelector('.social-btn.abha');

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            // TODO: Implement Google OAuth
            console.log('Google login clicked');
        });
    }

    if (abhaLoginBtn) {
        abhaLoginBtn.addEventListener('click', function() {
            // TODO: Implement ABHA ID authentication
            console.log('ABHA ID login clicked');
        });
    }
});

// Authentication State
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Protected Routes
const PROTECTED_ROUTES = [
    '/dashboard.html',
    '/vitals.html',
    '/records.html',
    '/graphs.html',
    '/insurance.html',
    '/symptoms.html',
    '/analyzer.html',
    '/appointments.html',
    '/abha.html',
    '/ai-analyzer.html',
    '/features/abha.html',
    '/features/ai-analyzer.html',
    '/features/graphs.html',
    '/features/insurance.html',
    '/features/vitals.html',
    '/features/symptoms.html'
];

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
}

// Get user data
function getUserData() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
}

// Handle protected route access
function checkAuth() {
    const currentPath = window.location.pathname;
    
    // Check if current path is protected
    if (PROTECTED_ROUTES.some(route => {
        // Convert both paths to lowercase and remove leading/trailing slashes for comparison
        const normalizedRoute = route.toLowerCase().replace(/^\/+|\/+$/g, '');
        const normalizedPath = currentPath.toLowerCase().replace(/^\/+|\/+$/g, '');
        return normalizedPath.includes(normalizedRoute);
    })) {
        if (!isAuthenticated()) {
            // Store the intended destination
            localStorage.setItem('redirect_after_login', currentPath);
            // Redirect to login
            window.location.href = '/login.html';
            return false;
        }
    }
    return true;
}

// Handle login success
function handleLoginSuccess(token, userData) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    // Check for redirect
    const redirectUrl = localStorage.getItem('redirect_after_login');
    if (redirectUrl) {
        localStorage.removeItem('redirect_after_login');
        window.location.href = redirectUrl;
    } else {
        window.location.href = '/dashboard.html';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.location.href = '/index.html';
}

// Update UI based on auth state
function updateUIForAuth() {
    const isLoggedIn = isAuthenticated();
    const authButtons = document.querySelectorAll('.auth-dependent');
    const loginButtons = document.querySelectorAll('.login-btn, .register-btn');
    const userMenus = document.querySelectorAll('.user-menu');
    
    if (isLoggedIn) {
        const userData = getUserData();
        
        // Hide login/register buttons
        loginButtons.forEach(btn => btn.style.display = 'none');
        
        // Show user menu
        userMenus.forEach(menu => {
            menu.style.display = 'block';
            const userNameElement = menu.querySelector('.user-name');
            if (userNameElement && userData) {
                userNameElement.textContent = userData.name;
            }
        });
        
        // Enable protected features
        authButtons.forEach(btn => {
            btn.classList.remove('disabled');
            const href = btn.getAttribute('data-auth-href');
            if (href) {
                btn.href = href;
            }
        });
    } else {
        // Show login/register buttons
        loginButtons.forEach(btn => btn.style.display = 'inline-block');
        
        // Hide user menu
        userMenus.forEach(menu => menu.style.display = 'none');
        
        // Disable protected features
        authButtons.forEach(btn => {
            btn.classList.add('disabled');
            btn.href = '/login.html';
        });
    }
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateUIForAuth();
    
    // Handle logout button clicks
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    });
}); 