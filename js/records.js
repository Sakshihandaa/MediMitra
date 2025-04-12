document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initRecordsUpload();
    initRecordsList();
    initEventListeners();
});

// Records Upload
function initRecordsUpload() {
    const uploadForm = document.getElementById('uploadForm');
    const dropZone = document.getElementById('dropZone');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    
    if (dropZone) {
        // Drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        // Click to upload
        dropZone.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('fileInput').addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
}

function handleFiles(files) {
    if (files.length === 0) return;
    
    // Validate file types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
        alert('Please upload only PDF, JPEG, or PNG files');
        return;
    }
    
    // Process files
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const record = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                size: file.size,
                date: new Date().toISOString(),
                content: e.target.result
            };
            
            saveRecord(record);
            updateRecordsList();
        };
        
        reader.readAsDataURL(file);
    });
}

function handleUploadSubmit(e) {
    e.preventDefault();
    const files = document.getElementById('fileInput').files;
    handleFiles(files);
    e.target.reset();
}

function saveRecord(record) {
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    records.push(record);
    localStorage.setItem('healthRecords', JSON.stringify(records));
}

// Records List
function initRecordsList() {
    updateRecordsList();
}

function updateRecordsList() {
    const recordsList = document.getElementById('recordsList');
    if (!recordsList) return;
    
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    
    if (records.length === 0) {
        recordsList.innerHTML = '<p>No health records found</p>';
        return;
    }
    
    // Sort records by date (newest first)
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    recordsList.innerHTML = records.map(record => `
        <div class="record-item">
            <div class="record-info">
                <h3>${record.name}</h3>
                <p>${new Date(record.date).toLocaleString()}</p>
                <p>${formatFileSize(record.size)}</p>
            </div>
            <div class="record-actions">
                <button class="view-record" data-id="${record.id}">View</button>
                <button class="download-record" data-id="${record.id}">Download</button>
                <button class="delete-record" data-id="${record.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-record').forEach(button => {
        button.addEventListener('click', handleViewRecord);
    });
    
    document.querySelectorAll('.download-record').forEach(button => {
        button.addEventListener('click', handleDownloadRecord);
    });
    
    document.querySelectorAll('.delete-record').forEach(button => {
        button.addEventListener('click', handleDeleteRecord);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleViewRecord(e) {
    const recordId = e.target.dataset.id;
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (!record) return;
    
    // In production, this would open a proper viewer
    window.open(record.content, '_blank');
}

function handleDownloadRecord(e) {
    const recordId = e.target.dataset.id;
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (!record) return;
    
    const link = document.createElement('a');
    link.href = record.content;
    link.download = record.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleDeleteRecord(e) {
    const recordId = e.target.dataset.id;
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    
    // Filter out the record to delete
    const updatedRecords = records.filter(record => record.id !== recordId);
    
    // Save updated records
    localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
    
    // Update records list
    updateRecordsList();
}

// Event Listeners
function initEventListeners() {
    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    });
} 