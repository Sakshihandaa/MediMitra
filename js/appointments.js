document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initBookingSteps();
    initDoctorSearch();
    initCalendar();
    loadAppointments();
    initEventListeners();
});

// Booking Steps Navigation
function initBookingSteps() {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    let currentStep = 1;

    function updateSteps() {
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        stepContents.forEach(content => {
            const contentStep = parseInt(content.dataset.step);
            if (contentStep === currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === 3 ? 'Confirm Booking' : 'Next';
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateSteps();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < 3) {
            if (validateStep(currentStep)) {
                currentStep++;
                updateSteps();
            }
        } else {
            confirmBooking();
        }
    });

    updateSteps();
}

// Doctor Search and Selection
function initDoctorSearch() {
    const searchInput = document.getElementById('doctorSearch');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const locationFilter = document.getElementById('locationFilter');
    const doctorsList = document.getElementById('doctorsList');

    // Sample doctor data
    const doctors = [
        {
            id: 1,
            name: 'Dr. Priya Sharma',
            specialty: 'Cardiology',
            location: 'Delhi',
            avatar: 'images/doctor1.jpg',
            rating: 4.8,
            experience: '15 years'
        },
        {
            id: 2,
            name: 'Dr. Rajesh Kumar',
            specialty: 'Dermatology',
            location: 'Mumbai',
            avatar: 'images/doctor2.jpg',
            rating: 4.6,
            experience: '12 years'
        },
        {
            id: 3,
            name: 'Dr. Anjali Patel',
            specialty: 'Neurology',
            location: 'Bangalore',
            avatar: 'images/doctor3.jpg',
            rating: 4.9,
            experience: '18 years'
        }
    ];

    function filterDoctors() {
        const searchTerm = searchInput.value.toLowerCase();
        const specialty = specialtyFilter.value;
        const location = locationFilter.value;

        const filtered = doctors.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm);
            const matchesSpecialty = !specialty || doctor.specialty.toLowerCase() === specialty;
            const matchesLocation = !location || doctor.location.toLowerCase() === location;
            return matchesSearch && matchesSpecialty && matchesLocation;
        });

        displayDoctors(filtered);
    }

    function displayDoctors(doctors) {
        doctorsList.innerHTML = '';
        
        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.innerHTML = `
                <div class="doctor-info">
                    <img src="${doctor.avatar}" alt="${doctor.name}" class="doctor-avatar">
                    <div class="doctor-details">
                        <h3>${doctor.name}</h3>
                        <p>${doctor.specialty}</p>
                        <span class="doctor-specialty">${doctor.location}</span>
                    </div>
                </div>
                <div class="doctor-rating">
                    <i class="fas fa-star"></i> ${doctor.rating}
                    <span class="experience">${doctor.experience} experience</span>
                </div>
            `;

            card.addEventListener('click', () => {
                document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                updateSummary('doctor', doctor);
            });

            doctorsList.appendChild(card);
        });
    }

    searchInput.addEventListener('input', filterDoctors);
    specialtyFilter.addEventListener('change', filterDoctors);
    locationFilter.addEventListener('change', filterDoctors);

    // Initial display
    displayDoctors(doctors);
}

// Calendar and Time Slots
function initCalendar() {
    const calendar = flatpickr("#calendar", {
        inline: true,
        minDate: "today",
        onChange: function(selectedDates) {
            if (selectedDates.length > 0) {
                updateSummary('date', selectedDates[0]);
                loadTimeSlots(selectedDates[0]);
            }
        }
    });

    function loadTimeSlots(date) {
        const timeSlots = document.getElementById('timeSlots');
        timeSlots.innerHTML = '';

        // Generate time slots (in production, this would come from the server)
        const slots = [
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
            '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
            '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
        ];

        slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            slotElement.textContent = slot;
            
            slotElement.addEventListener('click', () => {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                slotElement.classList.add('selected');
                updateSummary('time', slot);
            });

            timeSlots.appendChild(slotElement);
        });
    }
}

// Update Booking Summary
function updateSummary(type, value) {
    switch(type) {
        case 'doctor':
            document.getElementById('summaryDoctor').textContent = value.name;
            document.getElementById('summarySpecialty').textContent = value.specialty;
            document.getElementById('summaryLocation').textContent = value.location;
            break;
        case 'date':
            document.getElementById('summaryDate').textContent = value.toLocaleDateString();
            break;
        case 'time':
            document.getElementById('summaryTime').textContent = value;
            break;
    }
}

// Load Appointments
function loadAppointments() {
    // Sample appointment data
    const appointments = [
        {
            id: 1,
            doctor: 'Dr. Priya Sharma',
            specialty: 'Cardiology',
            date: '2024-03-15',
            time: '10:00 AM',
            status: 'upcoming'
        },
        {
            id: 2,
            doctor: 'Dr. Rajesh Kumar',
            specialty: 'Dermatology',
            date: '2024-02-20',
            time: '02:30 PM',
            status: 'completed'
        }
    ];

    displayAppointments('upcomingAppointments', appointments.filter(a => a.status === 'upcoming'));
    displayAppointments('appointmentHistory', appointments.filter(a => a.status !== 'upcoming'));
}

function displayAppointments(containerId, appointments) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    appointments.forEach(appointment => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <div class="appointment-header">
                <span class="appointment-title">${appointment.doctor}</span>
                <span class="appointment-status status-${appointment.status}">
                    ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            </div>
            <div class="appointment-details">
                <p>${appointment.specialty}</p>
                <p>${appointment.date} at ${appointment.time}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

// Validate Current Step
function validateStep(step) {
    switch(step) {
        case 1:
            return document.querySelector('.doctor-card.selected') !== null;
        case 2:
            return document.querySelector('.time-slot.selected') !== null;
        default:
            return true;
    }
}

// Confirm Booking
function confirmBooking() {
    const doctor = document.getElementById('summaryDoctor').textContent;
    const date = document.getElementById('summaryDate').textContent;
    const time = document.getElementById('summaryTime').textContent;
    const notes = document.getElementById('bookingNotes').value;

    // In production, this would send the booking to the server
    const booking = {
        doctor,
        date,
        time,
        notes,
        status: 'upcoming'
    };

    // Save to localStorage (in production, this would be handled by the server)
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(booking);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    alert('Appointment booked successfully!');
    window.location.reload();
}

// Event Listeners
function initEventListeners() {
    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    });
} 