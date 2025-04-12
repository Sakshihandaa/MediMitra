// Health Chart Initialization
const ctx = document.getElementById('healthChart').getContext('2d');
const healthChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Blood Pressure',
            data: [120, 125, 118, 122, 130, 128, 125],
            borderColor: '#1e88e5',
            backgroundColor: 'rgba(30, 136, 229, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Heart Rate',
            data: [72, 75, 70, 68, 74, 76, 73],
            borderColor: '#ef5350',
            backgroundColor: 'rgba(239, 83, 80, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e88e5',
                bodyColor: '#455a64',
                borderColor: '#e3f2fd',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: '#eceff1'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }
});

// Graph Filter Buttons
const filterButtons = document.querySelectorAll('.graph-filters button');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update chart data based on selected filter
        updateChartData(button.textContent);
    });
});

function updateChartData(timeframe) {
    // This is a placeholder for actual data fetching
    // In a real application, you would fetch data based on the timeframe
    const newData = {
        day: [120, 125, 118, 122, 130, 128, 125],
        week: [120, 125, 118, 122, 130, 128, 125],
        month: [120, 125, 118, 122, 130, 128, 125],
        year: [120, 125, 118, 122, 130, 128, 125]
    };
    
    healthChart.data.datasets[0].data = newData[timeframe.toLowerCase()];
    healthChart.update();
}

// Vitals Form Submission with Validation
const vitalsForm = document.querySelector('.vitals-form');
const inputs = vitalsForm.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
    });
});

function validateInput(input) {
    const value = input.value;
    let isValid = true;
    let errorMessage = '';

    switch(input.id) {
        case 'bmi':
            isValid = value >= 10 && value <= 50;
            errorMessage = 'BMI must be between 10 and 50';
            break;
        case 'bp':
            isValid = /^\d{2,3}\/\d{2,3}$/.test(value);
            errorMessage = 'Enter BP in format: systolic/diastolic';
            break;
        case 'glucose':
            isValid = value >= 50 && value <= 400;
            errorMessage = 'Glucose must be between 50 and 400 mg/dL';
            break;
        case 'spo2':
            isValid = value >= 70 && value <= 100;
            errorMessage = 'SpO2 must be between 70% and 100%';
            break;
    }

    if (!isValid) {
        input.classList.add('error');
        showError(input, errorMessage);
    } else {
        input.classList.remove('error');
        removeError(input);
    }
}

function showError(input, message) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    errorElement.textContent = message;
}

function removeError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

vitalsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    inputs.forEach(input => {
        validateInput(input);
        if (input.classList.contains('error')) {
            isValid = false;
        }
    });

    if (isValid) {
        const vitals = {
            bmi: document.getElementById('bmi').value,
            bp: document.getElementById('bp').value,
            glucose: document.getElementById('glucose').value,
            spo2: document.getElementById('spo2').value
        };
        
        // Here you would typically send the data to a server
        console.log('Vitals submitted:', vitals);
        
        // Show success message with animation
        showSuccessMessage();
        vitalsForm.reset();
    }
});

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Vitals saved successfully!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);

    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            successMessage.remove();
        }, 300);
    }, 3000);
}

// Chatbot Implementation
const chatbotToggle = document.querySelector('.chatbot-toggle');
let chatbotOpen = false;

chatbotToggle.addEventListener('click', () => {
    if (!chatbotOpen) {
        openChatbot();
    } else {
        closeChatbot();
    }
});

function openChatbot() {
    const chatbotInterface = document.createElement('div');
    chatbotInterface.className = 'chatbot-interface';
    chatbotInterface.innerHTML = `
        <div class="chatbot-header">
            <h3>Health Assistant</h3>
            <button class="close-chatbot">×</button>
        </div>
        <div class="chatbot-messages">
            <div class="message bot">
                <p>Hello! How can I help you today?</p>
            </div>
        </div>
        <div class="chatbot-input">
            <input type="text" placeholder="Type your message...">
            <button class="send-btn">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(chatbotInterface);
    chatbotOpen = true;

    // Add animations
    setTimeout(() => {
        chatbotInterface.classList.add('show');
    }, 100);

    // Add close button functionality
    const closeButton = chatbotInterface.querySelector('.close-chatbot');
    closeButton.addEventListener('click', closeChatbot);

    // Add send message functionality
    const sendButton = chatbotInterface.querySelector('.send-btn');
    const input = chatbotInterface.querySelector('input');
    
    function sendMessage() {
        const message = input.value.trim();
        if (message) {
            addMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                addMessage('I understand your concern. Let me help you with that.', 'bot');
            }, 1000);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function addMessage(text, sender) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function closeChatbot() {
    const chatbotInterface = document.querySelector('.chatbot-interface');
    if (chatbotInterface) {
        chatbotInterface.classList.remove('show');
        setTimeout(() => {
            chatbotInterface.remove();
        }, 300);
    }
    chatbotOpen = false;
}

// SOS Button Functionality
const sosButton = document.querySelector('.sos-toggle');
let sosActive = false;

sosButton.addEventListener('click', () => {
    if (!sosActive) {
        if (confirm('Are you sure you want to trigger emergency services?')) {
            sosActive = true;
            sosButton.classList.add('active');
            
            // Get user's location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    
                    // In a real application, you would send this to emergency services
                    console.log('Emergency triggered at:', location);
                    
                    // Show confirmation with animation
                    showEmergencyAlert(location);
                });
            } else {
                alert('Geolocation is not supported by your browser');
            }
        }
    } else {
        // Cancel emergency
        sosActive = false;
        sosButton.classList.remove('active');
        const alert = document.querySelector('.emergency-alert');
        if (alert) {
            alert.remove();
        }
    }
});

function showEmergencyAlert(location) {
    const alert = document.createElement('div');
    alert.className = 'emergency-alert';
    alert.innerHTML = `
        <div class="alert-content">
            <h3>Emergency Services Notified</h3>
            <p>Your location has been shared with emergency services.</p>
            <p>Latitude: ${location.latitude.toFixed(6)}</p>
            <p>Longitude: ${location.longitude.toFixed(6)}</p>
            <button class="cancel-emergency">Cancel Emergency</button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Add cancel button functionality
    const cancelButton = alert.querySelector('.cancel-emergency');
    cancelButton.addEventListener('click', () => {
        sosActive = false;
        sosButton.classList.remove('active');
        alert.remove();
    });
}

// Responsive Navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
}); 