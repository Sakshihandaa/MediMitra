// Feature click handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initFeatureCards();
    initSOSButton();
    initChatbot();
    initNewsletter();
    initResponsiveMenu();
});

// Feature Cards Click Handlers
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('userToken');
            
            if (!isLoggedIn) {
                alert('Please login to access this feature');
                window.location.href = 'login.html';
                return;
            }

            const feature = this.getAttribute('data-feature');
            window.location.href = `dashboard.html#${feature}`;
        });
    });
}

// SOS Button Functionality
function initSOSButton() {
    const sosBtn = document.getElementById('sos-btn');
    
    if (sosBtn) {
        sosBtn.addEventListener('click', function() {
            const isLoggedIn = localStorage.getItem('userToken');
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

// Chatbot Functionality
function initChatbot() {
    const chatbotBtn = document.getElementById('chatbot-btn');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeBtn = document.querySelector('.close-btn');
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatbotBtn && chatbotModal) {
        chatbotBtn.addEventListener('click', function() {
            const isLoggedIn = localStorage.getItem('userToken');
            if (!isLoggedIn) {
                alert('Please login to use the chatbot');
                window.location.href = 'login.html';
                return;
            }
            chatbotModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', function() {
            chatbotModal.style.display = 'none';
        });

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const responses = [
                    "I'm here to help with your health queries. How can I assist you today?",
                    "I can help you track your health metrics and provide general health advice.",
                    "For medical emergencies, please use the SOS button or contact emergency services.",
                    "I can help you understand your health records and provide basic health information."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'bot');
            }, 1000);
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Newsletter Subscription
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            if (email) {
                // In production, send this to your backend
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            }
        });
    }
}

// Initialize responsive menu
function initResponsiveMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
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