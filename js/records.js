document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initRecordsUpload();
    initRecordsList();
    initEventListeners();
    initRecordsStorage();
});

// Records Upload
function initRecordsUpload() {
    const uploadBtn = document.getElementById('uploadRecord');
    const uploadModal = document.getElementById('uploadModal');
    const uploadForm = document.getElementById('uploadForm');
    const dropZone = document.getElementById('dropZone');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.getElementById('cancelUpload');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn2 = document.querySelector('.upload-btn');
    
    // Open modal when upload button is clicked
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            uploadModal.style.display = 'block';
            // Set default date to today
            document.getElementById('recordDate').valueAsDate = new Date();
        });
    }
    
    // Close modal when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            uploadModal.style.display = 'none';
        });
    }
    
    // Close modal when cancel button is clicked
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            uploadModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });
    
    // Form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    
    // Drag and drop functionality
    if (dropZone) {
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
        if (uploadBtn2) {
            uploadBtn2.addEventListener('click', () => {
                fileInput.click();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                handleFiles(e.target.files);
            });
        }
    }
}

function handleFiles(files) {
    if (files.length === 0) return;
    
    // Validate file types and size
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    const invalidFiles = Array.from(files).filter(file => {
        if (!validTypes.includes(file.type)) {
            showNotification(`Invalid file type: ${file.name}. Please upload only PDF, JPEG, or PNG files.`, 'error');
            return true;
        }
        if (file.size > maxFileSize) {
            showNotification(`File too large: ${file.name}. Maximum size is 10MB.`, 'error');
            return true;
        }
        return false;
    });
    
    if (invalidFiles.length > 0) return;
    
    // Show selected files
    const dropZone = document.getElementById('dropZone');
    const uploadContent = dropZone.querySelector('.upload-content');
    const supportedFormats = dropZone.querySelector('.supported-formats');
    
    // Create or get the selected files container
    let selectedFilesContainer = dropZone.querySelector('.selected-files');
    if (!selectedFilesContainer) {
        selectedFilesContainer = document.createElement('div');
        selectedFilesContainer.className = 'selected-files';
        dropZone.appendChild(selectedFilesContainer);
    }
    
    // Clear previous selections
    selectedFilesContainer.innerHTML = '';
    
    // Add each file to the container
    Array.from(files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'selected-file';
        fileItem.innerHTML = `
            <i class="fas ${file.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-image'}"></i>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="remove-file" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedFilesContainer.appendChild(fileItem);
        
        // Add remove button functionality
        const removeBtn = fileItem.querySelector('.remove-file');
        removeBtn.addEventListener('click', () => {
            const dt = new DataTransfer();
            const input = document.getElementById('fileInput');
            const { files } = input;
            
            for (let i = 0; i < files.length; i++) {
                if (i !== index) {
                    dt.items.add(files[i]);
                }
            }
            
            input.files = dt.files;
            handleFiles(input.files);
        });
    });
    
    // Hide the upload content and show a "Browse More" button
    uploadContent.innerHTML = `
        <div class="file-input-container">
            <button type="button" class="browse-btn">
                <i class="fas fa-plus"></i> Add More Files
            </button>
            <input type="file" id="additionalFiles" multiple accept=".pdf,.jpg,.jpeg,.png">
        </div>
    `;
    
    // Add event listener for additional files
    const additionalInput = uploadContent.querySelector('#additionalFiles');
    additionalInput.addEventListener('change', (e) => {
        const newFiles = e.target.files;
        const existingFiles = document.getElementById('fileInput').files;
        
        const dt = new DataTransfer();
        
        // Add existing files
        for (let i = 0; i < existingFiles.length; i++) {
            dt.items.add(existingFiles[i]);
        }
        
        // Add new files
        for (let i = 0; i < newFiles.length; i++) {
            dt.items.add(newFiles[i]);
        }
        
        document.getElementById('fileInput').files = dt.files;
        handleFiles(document.getElementById('fileInput').files);
    });
    
    supportedFormats.style.display = 'none';
}

function handleUploadSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('recordTitle').value;
    const type = document.getElementById('recordType').value;
    const date = document.getElementById('recordDate').value;
    const notes = document.getElementById('recordNotes').value;
    const files = document.getElementById('fileInput').files;
    
    if (!title || !type || !date || files.length === 0) {
        showNotification('Please fill in all required fields and upload at least one file', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    submitBtn.disabled = true;
    
    // Process files
    const filePromises = Array.from(files).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result,
                    uploadDate: new Date().toISOString()
                });
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    // Wait for all files to be processed
    Promise.all(filePromises).then(fileData => {
        // Create record object
        const record = {
            id: Date.now().toString(),
            title: title,
            type: type,
            date: date,
            notes: notes,
            files: fileData,
            createdAt: new Date().toISOString(),
            uploadDate: new Date().toISOString()
        };
        
        // Save record to localStorage
        saveRecord(record);
        
        // Update records list
        updateRecordsList();
        
        // Close modal and reset form
        document.getElementById('uploadModal').style.display = 'none';
        e.target.reset();
        
        // Show detailed success message
        showNotification(`
            <div class="upload-success">
                <div class="success-title">Record uploaded successfully!</div>
                <div class="success-details">
                    <span><i class="fas fa-file"></i> ${files.length} file(s)</span>
                    <span><i class="fas ${getRecordTypeIcon(type)}"></i> ${capitalizeFirstLetter(type)}</span>
                </div>
            </div>
        `, 'success');
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }).catch(error => {
        console.error('Upload error:', error);
        showNotification('An error occurred while uploading. Please try again.', 'error');
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function saveRecord(record) {
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    records.push(record);
    localStorage.setItem('healthRecords', JSON.stringify(records));
}

// Records List
function initRecordsList() {
    updateRecordsList();
    
    // Add search functionality
    const searchInput = document.getElementById('searchRecords');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            updateRecordsList(searchInput.value);
        });
    }
}

function updateRecordsList(searchTerm = '') {
    const recordsList = document.getElementById('recordsList');
    if (!recordsList) return;
    
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    
    if (records.length === 0) {
        recordsList.innerHTML = '<p class="no-records">No health records found</p>';
        return;
    }
    
    // Filter records if search term is provided
    const filteredRecords = searchTerm 
        ? records.filter(record => 
            record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase())))
        : records;
    
    if (filteredRecords.length === 0) {
        recordsList.innerHTML = '<p class="no-records">No records match your search</p>';
        return;
    }
    
    // Sort records by date (newest first)
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    recordsList.innerHTML = filteredRecords.map(record => `
        <div class="record-item">
            <div class="record-info">
                <h3>${record.title}</h3>
                <p class="record-type"><i class="fas ${getRecordTypeIcon(record.type)}"></i> ${capitalizeFirstLetter(record.type)}</p>
                <p class="record-date"><i class="fas fa-calendar"></i> ${formatDate(record.date)}</p>
                <p class="record-files"><i class="fas fa-file"></i> ${record.files.length} file(s)</p>
                ${record.notes ? `<p class="record-notes"><i class="fas fa-sticky-note"></i> ${record.notes}</p>` : ''}
                ${record.isVitalTracker ? `
                    <p class="vital-date">
                        <i class="fas fa-clock"></i>
                        Uploaded ${formatRelativeTime(record.uploadDate)}
                    </p>
                ` : ''}
            </div>
            <div class="record-actions">
                <button class="view-record" data-id="${record.id}"><i class="fas fa-eye"></i> View</button>
                <button class="download-record" data-id="${record.id}"><i class="fas fa-download"></i> Download</button>
                <button class="delete-record" data-id="${record.id}"><i class="fas fa-trash"></i> Delete</button>
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

function getRecordTypeIcon(type) {
    const icons = {
        'lab': 'fa-flask',
        'imaging': 'fa-x-ray',
        'prescription': 'fa-prescription',
        'vaccination': 'fa-syringe',
        'other': 'fa-file-medical'
    };
    
    return icons[type] || 'fa-file-medical';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleViewRecord(e) {
    const recordId = e.target.closest('.view-record').dataset.id;
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (!record) return;
    
    // Create a modal to display the record
    const viewModal = document.createElement('div');
    viewModal.className = 'modal';
    viewModal.id = 'viewModal';
    
    viewModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${record.title}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="record-details">
                    <p><strong>Type:</strong> ${capitalizeFirstLetter(record.type)}</p>
                    <p><strong>Date:</strong> ${formatDate(record.date)}</p>
                    ${record.notes ? `<p><strong>Notes:</strong> ${record.notes}</p>` : ''}
                </div>
                <div class="record-files-view">
                    <h4>Files</h4>
                    <div class="files-list">
                        ${record.files.map((file, index) => `
                            <div class="file-item">
                                <i class="fas ${file.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-image'}"></i>
                                <span>${file.name}</span>
                                <span class="file-size">${formatFileSize(file.size)}</span>
                                <button class="view-file" data-index="${index}">View</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewModal);
    viewModal.style.display = 'block';
    
    // Add event listeners
    const closeBtn = viewModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        viewModal.remove();
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === viewModal) {
            viewModal.remove();
        }
    });
    
    // Add event listeners for file view buttons
    viewModal.querySelectorAll('.view-file').forEach(button => {
        button.addEventListener('click', (e) => {
            const fileIndex = parseInt(e.target.dataset.index);
            const file = record.files[fileIndex];
            
            // Open file in a new tab
            window.open(file.data, '_blank');
        });
    });
}

function handleDownloadRecord(e) {
    const recordId = e.target.closest('.download-record').dataset.id;
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (!record) return;
    
    // If there's only one file, download it directly
    if (record.files.length === 1) {
        const file = record.files[0];
        downloadFile(record.id, file.name);
    } else {
        // If there are multiple files, create a zip file
        // For simplicity, we'll just download the first file
        // In a real application, you would use a library like JSZip
        const file = record.files[0];
        downloadFile(record.id, file.name);
    }
}

function downloadFile(recordId, fileName) {
    const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
    const record = records.find(r => r.id === recordId);
    
    if (!record) {
        showNotification('Record not found', 'error');
        return;
    }
    
    const file = record.files.find(f => f.name === fileName);
    if (!file) {
        showNotification('File not found', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleDeleteRecord(e) {
    const recordId = e.target.closest('.delete-record').dataset.id;
    
    // Create a custom confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'modal confirmation-dialog';
    confirmDialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm Deletion</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this record?</p>
                <p class="warning-text"><i class="fas fa-exclamation-triangle"></i> This action cannot be undone.</p>
                <div class="confirmation-buttons">
                    <button class="cancel-btn">Cancel</button>
                    <button class="delete-btn">Delete Record</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    // Handle button clicks
    const cancelBtn = confirmDialog.querySelector('.cancel-btn');
    const deleteBtn = confirmDialog.querySelector('.delete-btn');
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(confirmDialog);
    });
    
    deleteBtn.addEventListener('click', () => {
        const records = JSON.parse(localStorage.getItem('healthRecords') || '[]');
        const recordToDelete = records.find(record => record.id === recordId);
        
        // Filter out the record to delete
        const updatedRecords = records.filter(record => record.id !== recordId);
        
        // Save updated records
        localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
        
        // Update records list
        updateRecordsList();
        
        // Remove confirmation dialog
        document.body.removeChild(confirmDialog);
        
        // Show success message with record details
        showNotification(`Record "${recordToDelete.title}" has been deleted successfully`, 'success');
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    if (type === 'success') {
        notification.innerHTML = message; // Allow HTML for success messages
    } else {
        // For other types, create standard notification
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
    }
    
    document.body.appendChild(notification);
    
    // Add animation classes
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Hide notification after 4 seconds for success, 5 seconds for errors
    const duration = type === 'error' ? 5000 : 4000;
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Event Listeners
function initEventListeners() {
    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '../index.html';
        });
    }
}

// Add a helper function to format relative time
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
        return formatDate(dateString);
    }
}

// Initialize records storage
function initRecordsStorage() {
    if (!localStorage.getItem('healthRecords')) {
        localStorage.setItem('healthRecords', JSON.stringify([]));
    }
} 