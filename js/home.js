// Feature click handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initFeatureCards();
    initSOSButton();
    initNewsletter();
    initResponsiveMenu();
});

// Initialize feature cards
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// SOS Button Functionality
function initSOSButton() {
    const sosBtn = document.getElementById('sos-btn');
    
    if (sosBtn) {
        sosBtn.addEventListener('click', function() {
            const isLoggedIn = localStorage.getItem('auth_token');
            if (!isLoggedIn) {
                alert('Please login to use the SOS feature');
                window.location.href = 'login.html';
                return;
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    // In production, send this to emergency services
                    alert('Emergency alert sent with your location!');
                }, function(error) {
                    alert('Unable to get your location. Please enable location services.');
                });
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }
}

// Newsletter Form
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            }
        });
    }
}

// Responsive Menu
function initResponsiveMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Utility Functions
function isLoggedIn() {
    return localStorage.getItem('userToken') !== null;
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function sendEmergencyAlert(latitude, longitude) {
    // In a real application, this would send the alert to emergency services
    // For now, we'll just simulate the API call
    return new Promise(resolve => setTimeout(resolve, 1000));
} 