document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initFileUpload();
    initAnalysisHistory();
    initEventListeners();
});

// File Upload Handling
function initFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.querySelector('.upload-btn');

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
        dropZone.style.background = 'rgba(52, 152, 219, 0.05)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'var(--background-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'var(--background-color)';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Click to upload
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// Handle uploaded files
function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid file type (PDF, JPG, or PNG)');
        return;
    }

    // Show preview
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('reportPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Show analysis section
    document.querySelector('.upload-section').style.display = 'none';
    document.querySelector('.analysis-section').style.display = 'block';

    // Start analysis
    analyzeReport(file);
}

// Analyze the report
function analyzeReport(file) {
    const loading = document.querySelector('.loading');
    const results = document.querySelector('.results');
    
    loading.style.display = 'flex';
    results.style.display = 'none';

    // Simulate AI analysis (in production, this would call an AI service)
    setTimeout(() => {
        loading.style.display = 'none';
        results.style.display = 'flex';

        // Generate sample analysis
        const keyFindings = [
            'Normal blood pressure range',
            'Slightly elevated cholesterol levels',
            'Healthy blood sugar levels'
        ];

        const recommendations = [
            'Maintain current exercise routine',
            'Consider dietary adjustments for cholesterol',
            'Schedule follow-up in 3 months'
        ];

        const nextSteps = [
            'Continue monitoring blood pressure',
            'Schedule annual physical',
            'Consider consultation with nutritionist'
        ];

        // Populate results
        populateResults('keyFindings', keyFindings);
        populateResults('recommendations', recommendations);
        populateResults('nextSteps', nextSteps);

        // Save to history
        saveToHistory(file.name, keyFindings, recommendations, nextSteps);
    }, 3000);
}

// Populate analysis results
function populateResults(elementId, items) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        container.appendChild(li);
    });
}

// Analysis History
function initAnalysisHistory() {
    const searchInput = document.getElementById('searchReports');
    const filterSelect = document.getElementById('filterDate');

    searchInput.addEventListener('input', filterHistory);
    filterSelect.addEventListener('change', filterHistory);

    // Load history from localStorage
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    const historyList = document.getElementById('historyList');
    
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = createHistoryItem(item);
        historyList.appendChild(historyItem);
    });
}

function createHistoryItem(item) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
        <div class="history-item-header">
            <span class="history-item-title">${item.name}</span>
            <span class="history-item-date">${item.date}</span>
        </div>
        <div class="history-item-preview">
            <img src="${item.preview}" alt="Report Preview">
        </div>
        <div class="history-item-summary">
            ${item.keyFindings[0]}
        </div>
    `;

    div.addEventListener('click', () => {
        showAnalysis(item);
    });

    return div;
}

function saveToHistory(fileName, keyFindings, recommendations, nextSteps) {
    const history = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    
    const newItem = {
        name: fileName,
        date: new Date().toLocaleDateString(),
        preview: document.getElementById('reportPreview').src,
        keyFindings,
        recommendations,
        nextSteps
    };

    history.unshift(newItem);
    localStorage.setItem('reportHistory', JSON.stringify(history));
    loadHistory();
}

function filterHistory() {
    const searchTerm = document.getElementById('searchReports').value.toLowerCase();
    const filterDate = document.getElementById('filterDate').value;
    const history = JSON.parse(localStorage.getItem('reportHistory') || '[]');
    
    let filtered = history.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );

    if (filterDate !== 'all') {
        const now = new Date();
        const itemDate = new Date(item.date);
        
        switch(filterDate) {
            case 'week':
                filtered = filtered.filter(item => 
                    (now - new Date(item.date)) <= 7 * 24 * 60 * 60 * 1000
                );
                break;
            case 'month':
                filtered = filtered.filter(item => 
                    (now - new Date(item.date)) <= 30 * 24 * 60 * 60 * 1000
                );
                break;
            case 'year':
                filtered = filtered.filter(item => 
                    (now - new Date(item.date)) <= 365 * 24 * 60 * 60 * 1000
                );
                break;
        }
    }

    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    filtered.forEach(item => {
        const historyItem = createHistoryItem(item);
        historyList.appendChild(historyItem);
    });
}

function showAnalysis(item) {
    document.querySelector('.upload-section').style.display = 'none';
    document.querySelector('.analysis-section').style.display = 'block';
    
    document.getElementById('reportPreview').src = item.preview;
    populateResults('keyFindings', item.keyFindings);
    populateResults('recommendations', item.recommendations);
    populateResults('nextSteps', item.nextSteps);
}

// Event Listeners
function initEventListeners() {
    // Save Analysis
    document.getElementById('saveAnalysis').addEventListener('click', () => {
        alert('Analysis saved successfully!');
    });

    // Share with Doctor
    document.getElementById('shareAnalysis').addEventListener('click', () => {
        // In production, this would open a doctor selection modal
        alert('Feature coming soon: Share with your doctor');
    });

    // New Analysis
    document.getElementById('newAnalysis').addEventListener('click', () => {
        document.querySelector('.upload-section').style.display = 'block';
        document.querySelector('.analysis-section').style.display = 'none';
        document.getElementById('fileInput').value = '';
    });

    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    });
} 