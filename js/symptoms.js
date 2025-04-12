document.addEventListener('DOMContentLoaded', function() {
    const checkSymptomsBtn = document.getElementById('checkSymptoms');
    const symptomsResult = document.getElementById('symptomsResult');
    const resultText = document.getElementById('resultText');
    const recommendationsList = document.getElementById('recommendationsList');

    if (checkSymptomsBtn) {
        checkSymptomsBtn.addEventListener('click', function() {
            const symptoms = document.getElementById('symptoms').value;
            const duration = document.getElementById('duration').value;
            const severity = document.getElementById('severity').value;

            if (!symptoms || !duration || !severity) {
                alert('Please fill in all fields');
                return;
            }

            // Show loading state
            checkSymptomsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            checkSymptomsBtn.disabled = true;

            // Simulate API call (replace with actual API call in production)
            setTimeout(() => {
                // Generate mock analysis
                const analysis = analyzeSymptoms(symptoms, duration, severity);
                
                // Update UI
                resultText.textContent = analysis.description;
                recommendationsList.innerHTML = analysis.recommendations.map(rec => 
                    `<li>${rec}</li>`
                ).join('');
                
                symptomsResult.style.display = 'block';
                
                // Reset button
                checkSymptomsBtn.innerHTML = 'Check Symptoms';
                checkSymptomsBtn.disabled = false;
            }, 2000);
        });
    }
});

function analyzeSymptoms(symptoms, duration, severity) {
    // This is a mock analysis - replace with actual AI/ML analysis in production
    const possibleConditions = [
        'Common Cold',
        'Flu',
        'Allergies',
        'Sinus Infection',
        'Stomach Bug'
    ];

    const randomCondition = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
    
    return {
        description: `Based on your symptoms (${symptoms}), duration (${duration}), and severity (${severity}), you might be experiencing ${randomCondition}.`,
        recommendations: [
            'Get plenty of rest',
            'Stay hydrated',
            'Monitor your symptoms',
            'Consult a healthcare provider if symptoms worsen',
            'Take over-the-counter medication as needed'
        ]
    };
} 