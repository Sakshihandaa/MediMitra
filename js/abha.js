// Initialize ABHA functionality
document.addEventListener('DOMContentLoaded', function() {
    initAbhaForm();
    initProfileSection();
    initEventListeners();
});

// Initialize ABHA form
function initAbhaForm() {
    const abhaForm = document.getElementById('abhaForm');
    if (abhaForm) {
        abhaForm.addEventListener('submit', handleAbhaSubmit);
    }
}

// Handle ABHA form submission
function handleAbhaSubmit(e) {
    e.preventDefault();
    
    const abhaId = document.getElementById('abhaId').value;
    const password = document.getElementById('abhaPassword').value;

    if (!abhaId || !password) {
        alert('Please fill in all required fields');
        return;
    }

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Linking...';

    // Simulate ABHA verification (replace with actual API call in production)
    setTimeout(() => {
        // Successful verification
        const profileSection = document.getElementById('profileSection');
        abhaForm.style.display = 'none';
        profileSection.style.display = 'block';
        
        // Update profile with mock data (replace with actual data in production)
        updateProfile({
            name: 'John Doe',
            abhaId: abhaId,
            dob: '01/01/1990',
            gender: 'Male',
            bloodGroup: 'O+',
            address: '123 Health Street, Medical City',
            mobile: '+91 98765 43210'
        });

        // Reset form and button
        submitButton.disabled = false;
        submitButton.innerHTML = 'Link ABHA ID';
        e.target.reset();
    }, 2000);
}

// Initialize profile section
function initProfileSection() {
    const profileSection = document.getElementById('profileSection');
    if (profileSection) {
        // Check if user has linked ABHA (replace with actual check in production)
        const hasLinkedAbha = localStorage.getItem('abhaLinked');
        if (hasLinkedAbha) {
            const abhaForm = document.getElementById('abhaForm');
            abhaForm.style.display = 'none';
            profileSection.style.display = 'block';
            
            // Load profile data (replace with actual data in production)
            const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
            updateProfile(profileData);
        }
    }
}

// Update profile information
function updateProfile(data) {
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileAbhaId').textContent = data.abhaId;
    document.getElementById('profileDob').textContent = data.dob;
    document.getElementById('profileGender').textContent = data.gender;
    document.getElementById('profileBloodGroup').textContent = data.bloodGroup;
    document.getElementById('profileAddress').textContent = data.address;
    document.getElementById('profileMobile').textContent = data.mobile;

    // Save to localStorage (replace with server storage in production)
    localStorage.setItem('abhaLinked', 'true');
    localStorage.setItem('profileData', JSON.stringify(data));
}

// Initialize event listeners
function initEventListeners() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Profile editing will be available soon!');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('abhaLinked');
            localStorage.removeItem('profileData');
            window.location.href = 'login.html';
        });
    }
} 