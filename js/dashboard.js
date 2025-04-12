// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const dashboardSections = document.querySelectorAll('.dashboard-section');

// Chart.js Configuration
const chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Blood Pressure',
                data: [],
                borderColor: '#3498db',
                tension: 0.4,
                fill: false
            },
            {
                label: 'Heart Rate',
                data: [],
                borderColor: '#e74c3c',
                tension: 0.4,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('sidebar-active');
        });
    }

    // Initialize sidebar navigation
    initializeSidebarNavigation();

    // Initialize health chart
    const healthChart = new Chart(
        document.getElementById('healthChart'),
        chartConfig
    );

    // Load dashboard data
    loadDashboardData();

    // Show initial section (Overview by default)
    showSection('overview');
});

// Initialize Sidebar Navigation
function initializeSidebarNavigation() {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the section id from the href attribute
            const sectionId = link.getAttribute('href').substring(1);
            
            // Show the corresponding section
            showSection(sectionId);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-active');
            }
        });
    });
}

// Show Section
function showSection(sectionId) {
    // Hide all sections
    dashboardSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Load section-specific data if needed
        switch(sectionId) {
            case 'vitals':
                loadVitalsData();
                break;
            case 'appointments':
                loadAppointmentsData();
                break;
            case 'records':
                loadHealthRecordsData();
                break;
            case 'graphs':
                loadHealthTrendsData();
                break;
        }
    }
}

// Section-specific data loading functions
async function loadVitalsData() {
    try {
        const response = await fetch('/api/vitals/recent');
        const data = await response.json();
        updateVitalsSection(data);
    } catch (error) {
        showError('Failed to load vitals data');
    }
}

async function loadAppointmentsData() {
    try {
        const response = await fetch('/api/appointments/upcoming');
        const data = await response.json();
        updateAppointmentsSection(data);
    } catch (error) {
        showError('Failed to load appointments data');
    }
}

async function loadHealthRecordsData() {
    try {
        const response = await fetch('/api/records/recent');
        const data = await response.json();
        updateRecordsSection(data);
    } catch (error) {
        showError('Failed to load health records');
    }
}

async function loadHealthTrendsData() {
    try {
        const response = await fetch('/api/health/trends');
        const data = await response.json();
        updateHealthTrends(data);
    } catch (error) {
        showError('Failed to load health trends');
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Fetch user data
        const userResponse = await fetch('/api/user/profile');
        const userData = await userResponse.json();
        updateProfileSection(userData);

        // Fetch vitals data
        const vitalsResponse = await fetch('/api/vitals/recent');
        const vitalsData = await vitalsResponse.json();
        updateVitalsSection(vitalsData);

        // Fetch appointments
        const appointmentsResponse = await fetch('/api/appointments/upcoming');
        const appointmentsData = await appointmentsResponse.json();
        updateAppointmentsSection(appointmentsData);

        // Fetch health records
        const recordsResponse = await fetch('/api/records/recent');
        const recordsData = await recordsResponse.json();
        updateRecordsSection(recordsData);

        // Fetch health trends
        const trendsResponse = await fetch('/api/health/trends');
        const trendsData = await trendsResponse.json();
        updateHealthTrends(trendsData);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please try again later.');
    }
}

// Update Profile Section
function updateProfileSection(userData) {
    const profileImg = document.querySelector('.profile-section img');
    const profileName = document.querySelector('.profile-section h3');
    const profileEmail = document.querySelector('.profile-section p');

    if (profileImg) profileImg.src = userData.avatar || 'images/default-avatar.png';
    if (profileName) profileName.textContent = userData.name;
    if (profileEmail) profileEmail.textContent = userData.email;
}

// Update Vitals Section
function updateVitalsSection(vitalsData) {
    const vitalsContainer = document.querySelector('.vitals-grid');
    if (!vitalsContainer) return;

    vitalsContainer.innerHTML = vitalsData.map(vital => `
        <div class="vital-item">
            <span class="vital-label">${vital.label}</span>
            <span class="vital-value">${vital.value}</span>
            <span class="vital-status ${vital.status}">
                <i class="fas fa-${getStatusIcon(vital.status)}"></i>
                ${vital.status}
            </span>
        </div>
    `).join('');
}

// Update Appointments Section
function updateAppointmentsSection(appointmentsData) {
    const appointmentsContainer = document.querySelector('.appointment-list');
    if (!appointmentsContainer) return;

    appointmentsContainer.innerHTML = appointmentsData.map(appointment => `
        <div class="appointment-item">
            <div class="appointment-time">
                <div class="date">${formatDate(appointment.date)}</div>
                <div class="time">${formatTime(appointment.time)}</div>
            </div>
            <div class="appointment-details">
                <h4>${appointment.title}</h4>
                <p>${appointment.description}</p>
            </div>
        </div>
    `).join('');
}

// Update Records Section
function updateRecordsSection(recordsData) {
    const recordsContainer = document.querySelector('.record-list');
    if (!recordsContainer) return;

    recordsContainer.innerHTML = recordsData.map(record => `
        <div class="record-item">
            <div class="record-icon">
                <i class="fas fa-${getRecordIcon(record.type)}"></i>
            </div>
            <div class="record-details">
                <h4>${record.title}</h4>
                <p>${record.date}</p>
            </div>
        </div>
    `).join('');
}

// Update Health Trends
function updateHealthTrends(trendsData) {
    const chart = Chart.getChart('healthChart');
    if (!chart) return;

    chart.data.labels = trendsData.labels;
    chart.data.datasets[0].data = trendsData.bloodPressure;
    chart.data.datasets[1].data = trendsData.heartRate;
    chart.update();
}

// Helper Functions
function getStatusIcon(status) {
    const icons = {
        normal: 'check-circle',
        warning: 'exclamation-circle',
        critical: 'times-circle'
    };
    return icons[status] || 'question-circle';
}

function getRecordIcon(type) {
    const icons = {
        prescription: 'prescription-bottle',
        lab: 'flask',
        scan: 'x-ray',
        report: 'file-medical'
    };
    return icons[type] || 'file-medical';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
}

function showError(message) {
    // Implement error notification
    console.error(message);
} 