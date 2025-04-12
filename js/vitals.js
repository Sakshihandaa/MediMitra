document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initVitalsForm();
    initVitalsHistory();
    initEventListeners();
});

// Vitals Form
function initVitalsForm() {
    const vitalsForm = document.getElementById('vitalsForm');
    if (vitalsForm) {
        vitalsForm.addEventListener('submit', handleVitalsSubmit);
    }
}

function handleVitalsSubmit(e) {
    e.preventDefault();
    
    const bloodPressure = document.getElementById('bloodPressure').value;
    const heartRate = document.getElementById('heartRate').value;
    const temperature = document.getElementById('temperature').value;
    const oxygenLevel = document.getElementById('oxygenLevel').value;
    const weight = document.getElementById('weight').value;
    const notes = document.getElementById('vitalsNotes').value;

    // Validate inputs
    if (!bloodPressure || !heartRate || !temperature || !oxygenLevel || !weight) {
        alert('Please fill in all required fields');
        return;
    }

    // Create vitals record
    const vitalsRecord = {
        timestamp: new Date().toISOString(),
        bloodPressure,
        heartRate,
        temperature,
        oxygenLevel,
        weight,
        notes
    };

    // Save to localStorage (in production, this would be sent to the server)
    saveVitalsRecord(vitalsRecord);
    
    // Update history
    updateVitalsHistory();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    alert('Vitals recorded successfully!');
}

function saveVitalsRecord(record) {
    const records = JSON.parse(localStorage.getItem('vitalsRecords') || '[]');
    records.push(record);
    localStorage.setItem('vitalsRecords', JSON.stringify(records));
}

// Vitals History
function initVitalsHistory() {
    updateVitalsHistory();
}

function updateVitalsHistory() {
    const historyContainer = document.getElementById('vitalsHistory');
    if (!historyContainer) return;

    const records = JSON.parse(localStorage.getItem('vitalsRecords') || '[]');
    
    if (records.length === 0) {
        historyContainer.innerHTML = '<p class="text-center text-light">No vitals records found</p>';
        return;
    }

    // Sort records by timestamp (newest first)
    records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    historyContainer.innerHTML = records.map(record => `
        <div class="history-item">
            <div class="vital-group">
                <span class="vital-label">Blood Pressure</span>
                <span class="vital-value">${record.bloodPressure} mmHg</span>
            </div>
            <div class="vital-group">
                <span class="vital-label">Heart Rate</span>
                <span class="vital-value">${record.heartRate} bpm</span>
            </div>
            <div class="vital-group">
                <span class="vital-label">Temperature</span>
                <span class="vital-value">${record.temperature} °C</span>
            </div>
            <div class="vital-group">
                <span class="vital-label">Oxygen Level</span>
                <span class="vital-value">${record.oxygenLevel}%</span>
            </div>
            <div class="vital-group">
                <span class="vital-label">Weight</span>
                <span class="vital-value">${record.weight} kg</span>
            </div>
            <div class="vital-group">
                <span class="vital-timestamp">${new Date(record.timestamp).toLocaleString()}</span>
                <button class="delete-btn" data-timestamp="${record.timestamp}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            ${record.notes ? `
                <div class="vital-notes">${record.notes}</div>
            ` : ''}
        </div>
    `).join('');

    // Add delete functionality
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteRecord);
    });
}

function handleDeleteRecord(e) {
    const timestamp = e.target.dataset.timestamp;
    const records = JSON.parse(localStorage.getItem('vitalsRecords') || '[]');
    
    // Filter out the record to delete
    const updatedRecords = records.filter(record => record.timestamp !== timestamp);
    
    // Save updated records
    localStorage.setItem('vitalsRecords', JSON.stringify(updatedRecords));
    
    // Update history display
    updateVitalsHistory();
}

// Event Listeners
function initEventListeners() {
    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    });
} 