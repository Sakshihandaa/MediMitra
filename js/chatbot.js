// Chatbot Configuration
const CHATBOT_CONFIG = {
    name: 'Health Assistant',
    welcomeMessage: 'Hello! I\'m your health assistant. How can I help you today?',
    typingSpeed: 50, // milliseconds per character
    responseDelay: 500 // milliseconds before bot responds
};

// Predefined responses for common health queries
const RESPONSES = {
    greetings: [
        'Hello! How can I assist you with your health today?',
        'Hi there! I\'m here to help with your health queries.',
        'Welcome! What health-related questions do you have?'
    ],
    symptoms: [
        'I can help you understand your symptoms. Please describe what you\'re experiencing.',
        'Let me help you analyze your symptoms. What are you feeling?',
        'I\'m here to help assess your symptoms. Please provide more details.'
    ],
    appointments: [
        'You can schedule appointments through the dashboard. Would you like me to guide you?',
        'I can help you manage your appointments. What would you like to do?',
        'The appointment booking feature is available in your dashboard.'
    ],
    vitals: [
        'You can track your vitals in the dashboard. Need help understanding any readings?',
        'I can help you interpret your vital signs. What would you like to know?',
        'Your vitals are being monitored. Would you like to see the latest readings?'
    ],
    emergency: [
        'If this is a medical emergency, please use the SOS button or call emergency services immediately.',
        'For emergencies, please use the SOS feature or dial emergency services.',
        'Your safety is important. Use the SOS button for immediate assistance.'
    ],
    default: [
        'I understand. How else can I help you with your health?',
        'Is there anything specific about your health you\'d like to know?',
        'I\'m here to help. What other health-related questions do you have?'
    ]
};

// Keywords for response matching
const KEYWORDS = {
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    symptoms: ['symptom', 'pain', 'ache', 'fever', 'headache', 'cough', 'cold', 'sick'],
    appointments: ['appointment', 'schedule', 'book', 'doctor', 'visit', 'consultation'],
    vitals: ['vital', 'blood pressure', 'heart rate', 'temperature', 'pulse', 'reading'],
    emergency: ['emergency', 'urgent', 'critical', 'severe', 'dangerous', 'help']
};

class Chatbot {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.initializeUI();
    }

    initializeUI() {
        this.modal = document.getElementById('chatbot-modal');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.input = document.querySelector('.chat-input input');
        this.sendButton = document.querySelector('.send-btn');
        this.closeButton = document.querySelector('.close-btn');

        // Add event listeners
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        this.closeButton.addEventListener('click', () => this.closeChatbot());

        // Add welcome message
        this.addMessage(CHATBOT_CONFIG.welcomeMessage, 'bot');
    }

    handleUserInput() {
        const message = this.input.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Get and display bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getResponse(message);
            this.typeMessage(response, 'bot');
        }, CHATBOT_CONFIG.responseDelay);
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords and return appropriate response
        for (const [category, keywords] of Object.entries(KEYWORDS)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return this.getRandomResponse(RESPONSES[category]);
            }
        }

        // Return default response if no keywords match
        return this.getRandomResponse(RESPONSES.default);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    typeMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        this.messagesContainer.appendChild(messageDiv);
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                messageDiv.innerHTML = `<p>${text.substring(0, i + 1)}</p>`;
                i++;
                setTimeout(typeWriter, CHATBOT_CONFIG.typingSpeed);
            }
        };
        typeWriter();
        
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing';
        typingDiv.innerHTML = '<p>...</p>';
        this.messagesContainer.appendChild(typingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    closeChatbot() {
        this.modal.style.display = 'none';
    }

    openChatbot() {
        this.modal.style.display = 'block';
    }
}

// Voice Input Setup
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

function setupVoiceInput() {
    const micBtn = document.querySelector('.mic-btn');
    const chatInput = document.querySelector('.chat-input input');
    
    if (!recognition) {
        micBtn.style.display = 'none';
        return;
    }
    
    let isListening = false;
    
    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            chatInput.placeholder = 'Listening...';
            recognition.start();
        }
    });
    
    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('active');
    };
    
    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('active');
        chatInput.placeholder = 'Type your message...';
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        micBtn.classList.remove('active');
        chatInput.placeholder = 'Type your message...';
        
        if (event.error === 'not-allowed') {
            showNotification('Please allow microphone access to use voice input.', 'error');
        }
    };
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new Chatbot();
    
    // Add click handler for chatbot button
    const chatbotBtn = document.getElementById('chatbot-btn');
    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', () => {
            if (!localStorage.getItem('auth_token')) {
                alert('Please login to use the chatbot');
                window.location.href = 'login.html';
                return;
            }
            chatbot.openChatbot();
        });
    }

    // Initialize voice input
    setupVoiceInput();
}); 