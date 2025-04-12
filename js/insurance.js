document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initInsuranceForm();
    initPoliciesList();
    initClaimsList();
    initEventListeners();
});

// Insurance Form
function initInsuranceForm() {
    const insuranceForm = document.getElementById('insuranceForm');
    if (insuranceForm) {
        insuranceForm.addEventListener('submit', handleInsuranceSubmit);
    }
}

function handleInsuranceSubmit(e) {
    e.preventDefault();
    
    const provider = document.getElementById('provider').value;
    const policyNumber = document.getElementById('policyNumber').value;
    const type = document.getElementById('type').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const coverage = document.getElementById('coverage').value;
    const premium = document.getElementById('premium').value;
    const documents = document.getElementById('documents').files;

    // Validate inputs
    if (!provider || !policyNumber || !type || !startDate || !endDate || !coverage || !premium) {
        alert('Please fill in all required fields');
        return;
    }

    // Create policy record
    const policy = {
        id: Date.now().toString(),
        provider,
        policyNumber,
        type,
        startDate,
        endDate,
        coverage,
        premium,
        documents: [],
        status: 'active'
    };

    // Handle document uploads
    if (documents.length > 0) {
        Array.from(documents).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                policy.documents.push({
                    name: file.name,
                    type: file.type,
                    content: e.target.result
                });
                
                // Save policy after all documents are processed
                if (policy.documents.length === documents.length) {
                    savePolicy(policy);
                    updatePoliciesList();
                    e.target.reset();
                    alert('Insurance policy added successfully!');
                }
            };
            
            reader.readAsDataURL(file);
        });
    } else {
        savePolicy(policy);
        updatePoliciesList();
        e.target.reset();
        alert('Insurance policy added successfully!');
    }
}

function savePolicy(policy) {
    const policies = JSON.parse(localStorage.getItem('insurancePolicies') || '[]');
    policies.push(policy);
    localStorage.setItem('insurancePolicies', JSON.stringify(policies));
}

// Policies List
function initPoliciesList() {
    updatePoliciesList();
}

function updatePoliciesList() {
    const policiesList = document.getElementById('policiesList');
    if (!policiesList) return;
    
    const policies = JSON.parse(localStorage.getItem('insurancePolicies') || '[]');
    
    if (policies.length === 0) {
        policiesList.innerHTML = '<p>No insurance policies found</p>';
        return;
    }
    
    policiesList.innerHTML = policies.map(policy => `
        <div class="policy-item">
            <div class="policy-header">
                <h3>${policy.provider} - ${policy.type}</h3>
                <span class="policy-status status-${policy.status}">${policy.status}</span>
            </div>
            <div class="policy-details">
                <div class="detail-item">
                    <span class="label">Policy Number:</span>
                    <span class="value">${policy.policyNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Coverage:</span>
                    <span class="value">${policy.coverage}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Premium:</span>
                    <span class="value">${policy.premium}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Validity:</span>
                    <span class="value">${policy.startDate} to ${policy.endDate}</span>
                </div>
            </div>
            <div class="policy-actions">
                <button class="view-documents" data-id="${policy.id}">View Documents</button>
                <button class="file-claim" data-id="${policy.id}">File Claim</button>
                <button class="edit-policy" data-id="${policy.id}">Edit</button>
                <button class="delete-policy" data-id="${policy.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-documents').forEach(button => {
        button.addEventListener('click', handleViewDocuments);
    });
    
    document.querySelectorAll('.file-claim').forEach(button => {
        button.addEventListener('click', handleFileClaim);
    });
    
    document.querySelectorAll('.edit-policy').forEach(button => {
        button.addEventListener('click', handleEditPolicy);
    });
    
    document.querySelectorAll('.delete-policy').forEach(button => {
        button.addEventListener('click', handleDeletePolicy);
    });
}

function handleViewDocuments(e) {
    const policyId = e.target.dataset.id;
    const policies = JSON.parse(localStorage.getItem('insurancePolicies') || '[]');
    const policy = policies.find(p => p.id === policyId);
    
    if (!policy || policy.documents.length === 0) {
        alert('No documents available for this policy');
        return;
    }
    
    // In production, this would open a proper document viewer
    policy.documents.forEach(doc => {
        window.open(doc.content, '_blank');
    });
}

function handleFileClaim(e) {
    const policyId = e.target.dataset.id;
    // In production, this would open a claim form
    alert('Claim filing functionality coming soon!');
}

function handleEditPolicy(e) {
    const policyId = e.target.dataset.id;
    // In production, this would open an edit form
    alert('Policy editing functionality coming soon!');
}

function handleDeletePolicy(e) {
    const policyId = e.target.dataset.id;
    const policies = JSON.parse(localStorage.getItem('insurancePolicies') || '[]');
    
    // Filter out the policy to delete
    const updatedPolicies = policies.filter(policy => policy.id !== policyId);
    
    // Save updated policies
    localStorage.setItem('insurancePolicies', JSON.stringify(updatedPolicies));
    
    // Update policies list
    updatePoliciesList();
}

// Claims List
function initClaimsList() {
    updateClaimsList();
}

function updateClaimsList() {
    const claimsList = document.getElementById('claimsList');
    if (!claimsList) return;
    
    const claims = JSON.parse(localStorage.getItem('insuranceClaims') || '[]');
    
    if (claims.length === 0) {
        claimsList.innerHTML = '<p>No insurance claims found</p>';
        return;
    }
    
    claimsList.innerHTML = claims.map(claim => `
        <div class="claim-item">
            <div class="claim-header">
                <h3>Claim #${claim.id}</h3>
                <span class="claim-status status-${claim.status}">${claim.status}</span>
            </div>
            <div class="claim-details">
                <div class="detail-item">
                    <span class="label">Policy:</span>
                    <span class="value">${claim.policyNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Amount:</span>
                    <span class="value">${claim.amount}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Date:</span>
                    <span class="value">${claim.date}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Description:</span>
                    <span class="value">${claim.description}</span>
                </div>
            </div>
            <div class="claim-actions">
                <button class="view-claim" data-id="${claim.id}">View Details</button>
                <button class="track-claim" data-id="${claim.id}">Track Status</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.view-claim').forEach(button => {
        button.addEventListener('click', handleViewClaim);
    });
    
    document.querySelectorAll('.track-claim').forEach(button => {
        button.addEventListener('click', handleTrackClaim);
    });
}

function handleViewClaim(e) {
    const claimId = e.target.dataset.id;
    // In production, this would show claim details
    alert('Claim details functionality coming soon!');
}

function handleTrackClaim(e) {
    const claimId = e.target.dataset.id;
    // In production, this would show claim tracking
    alert('Claim tracking functionality coming soon!');
}

// Event Listeners
function initEventListeners() {
    // Logout
    document.querySelector('.logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    });
} 