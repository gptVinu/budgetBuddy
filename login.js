// BudgetBuddy - Authentication JavaScript

// Default credentials
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

// DOM Elements - Login Page
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const loginError = document.getElementById('loginError');
const rememberMeCheckbox = document.getElementById('rememberMe');

// DOM Elements - Signup Page
const signupForm = document.getElementById('signupForm');
const newUsernameInput = document.getElementById('newUsername');
const emailInput = document.getElementById('email');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const toggleNewPassword = document.getElementById('toggleNewPassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const signupError = document.getElementById('signupError');

// Handle Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Check if using default credentials or stored credentials
        if ((username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) || validateStoredCredentials(username, password)) {
            // Save to session or localStorage if "remember me" is checked
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('budgetBuddy_auth', JSON.stringify({ 
                    isAuthenticated: true,
                    username: username
                }));
            } else {
                sessionStorage.setItem('budgetBuddy_auth', JSON.stringify({ 
                    isAuthenticated: true,
                    username: username
                }));
            }
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            // Show error message
            showError(loginError, 'Invalid username or password');
            
            // Shake the form for visual feedback
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
        }
    });
}

// Handle Signup Form Submission
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = newUsernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validate form
        if (username.length < 3) {
            showError(signupError, 'Username must be at least 3 characters long');
            return;
        }
        
        if (!validateEmail(email)) {
            showError(signupError, 'Please enter a valid email address');
            return;
        }
        
        if (password.length < 6) {
            showError(signupError, 'Password must be at least 6 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            showError(signupError, 'Passwords do not match');
            return;
        }
        
        // Store credentials in localStorage
        const users = JSON.parse(localStorage.getItem('budgetBuddy_users') || '[]');
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showError(signupError, 'Username already exists');
            return;
        }
        
        // Add new user
        users.push({
            username,
            email,
            password: hashPassword(password) // In real app, use proper hashing
        });
        
        localStorage.setItem('budgetBuddy_users', JSON.stringify(users));
        
        // Auto login and redirect
        sessionStorage.setItem('budgetBuddy_auth', JSON.stringify({ 
            isAuthenticated: true,
            username: username
        }));
        
        // Redirect to dashboard with a small delay to show success
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

// Toggle Password Visibility
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, this);
    });
}

if (toggleNewPassword) {
    toggleNewPassword.addEventListener('click', function() {
        togglePasswordVisibility(newPasswordInput, this);
    });
}

if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, this);
    });
}

// Password Strength Meter
if (newPasswordInput) {
    newPasswordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
}

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateStoredCredentials(username, password) {
    const users = JSON.parse(localStorage.getItem('budgetBuddy_users') || '[]');
    return users.some(user => 
        user.username === username && 
        user.password === hashPassword(password)
    );
}

function hashPassword(password) {
    // This is a simple hash for demo purposes
    // In a real application, use a proper hashing library
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function showError(element, message) {
    if (element) {
        const messageSpan = element.querySelector('span');
        if (messageSpan) messageSpan.textContent = message;
        element.style.display = 'flex';
        
        // Hide after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function togglePasswordVisibility(inputElement, buttonElement) {
    const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
    inputElement.setAttribute('type', type);
    
    // Toggle eye icon
    const icon = buttonElement.querySelector('i');
    if (type === 'password') {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

function updatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1; // Has uppercase
    if (/[a-z]/.test(password)) strength += 1; // Has lowercase
    if (/[0-9]/.test(password)) strength += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Has special char
    
    // Update UI
    let width = (strength / 6) * 100;
    let strengthClass = '';
    let strengthLabel = '';
    
    if (strength < 2) {
        strengthClass = 'weak';
        strengthLabel = 'Weak';
    } else if (strength < 4) {
        strengthClass = 'medium';
        strengthLabel = 'Medium';
    } else if (strength < 6) {
        strengthClass = 'strong';
        strengthLabel = 'Strong';
    } else {
        strengthClass = 'very-strong';
        strengthLabel = 'Very Strong';
    }
    
    strengthBar.style.width = width + '%';
    strengthBar.className = 'strength-bar ' + strengthClass;
    strengthText.textContent = strengthLabel;
    strengthText.className = strengthClass;
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // If on login or signup page
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
        const auth = JSON.parse(localStorage.getItem('budgetBuddy_auth') || sessionStorage.getItem('budgetBuddy_auth') || '{"isAuthenticated": false}');
        
        // If already logged in, redirect to dashboard
        if (auth.isAuthenticated) {
            window.location.href = 'index.html';
        }
    } else {
        // For all other pages, check if logged in
        const auth = JSON.parse(localStorage.getItem('budgetBuddy_auth') || sessionStorage.getItem('budgetBuddy_auth') || '{"isAuthenticated": false}');
        
        // If not logged in and not on login/signup page, redirect to login
        if (!auth.isAuthenticated) {
            window.location.href = 'login.html';
        }
    }
});
