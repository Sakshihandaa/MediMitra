// Initialize graphs functionality
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    initFilters();
    initEventListeners();
});

// Initialize all charts
function initCharts() {
    const charts = {
        bloodPressure: initChart('bloodPressureChart', 'Blood Pressure', ['Systolic', 'Diastolic']),
        heartRate: initChart('heartRateChart', 'Heart Rate'),
        temperature: initChart('temperatureChart', 'Temperature'),
        oxygen: initChart('oxygenChart', 'Oxygen Level'),
        weight: initChart('weightChart', 'Weight')
    };

    window.healthCharts = charts;
    updateAllCharts('7'); // Default to last 7 days
}

// Initialize a single chart
function initChart(canvasId, title, datasets = ['Value']) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const colors = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'];
    
    const chartData = {
        labels: [],
        datasets: datasets.map((label, index) => ({
            label,
            data: [],
            borderColor: colors[index],
            tension: 0.1
        }))
    };

    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Initialize filter controls
function initFilters() {
    const timeFilter = document.getElementById('timeFilter');
    const metricFilter = document.getElementById('metricFilter');

    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => updateAllCharts(e.target.value));
    }

    if (metricFilter) {
        metricFilter.addEventListener('change', handleMetricFilter);
    }
}

// Handle metric filter changes
function handleMetricFilter() {
    const metric = document.getElementById('metricFilter').value;
    const containers = document.querySelectorAll('.chart-container');
    
    if (metric === 'all') {
        containers.forEach(container => container.style.display = 'block');
    } else {
        containers.forEach(container => {
            const chartId = container.querySelector('canvas').id;
            container.style.display = chartId.includes(metric) ? 'block' : 'none';
        });
    }
}

// Update all charts
function updateAllCharts(timeRange) {
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => container.classList.add('loading'));

    // Simulate API call to fetch data (replace with actual API call in production)
    setTimeout(() => {
        const data = generateSampleData(timeRange);
        
        // Update each chart
        Object.entries(window.healthCharts).forEach(([key, chart]) => {
            chart.data.labels = data.labels;
            if (key === 'bloodPressure') {
                chart.data.datasets[0].data = data.bloodPressure.systolic;
                chart.data.datasets[1].data = data.bloodPressure.diastolic;
            } else {
                chart.data.datasets[0].data = data[key];
            }
            chart.update();
        });

        containers.forEach(container => container.classList.remove('loading'));
    }, 1000);
}

// Generate sample data based on time range
function generateSampleData(timeRange) {
    const labels = [];
    const now = new Date();
    const days = parseInt(timeRange);

    // Generate labels
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    // Generate random data
    return {
        labels,
        bloodPressure: {
            systolic: labels.map(() => Math.floor(Math.random() * 20) + 110),
            diastolic: labels.map(() => Math.floor(Math.random() * 15) + 70)
        },
        heartRate: labels.map(() => Math.floor(Math.random() * 20) + 60),
        temperature: labels.map(() => (Math.random() * 2 + 36).toFixed(1)),
        oxygen: labels.map(() => Math.floor(Math.random() * 5) + 95),
        weight: labels.map(() => (Math.random() * 5 + 70).toFixed(1))
    };
}

// Update statistics section
function updateStatistics(data) {
    const stats = document.getElementById('statsContainer');
    if (!stats) return;

    const lastIndex = data.labels.length - 1;
    const currentValue = data.datasets[0].data[lastIndex];
    const previousValue = data.datasets[0].data[lastIndex - 1];
    const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
    const trend = change >= 0 ? 'up' : 'down';

    stats.innerHTML = `
        <div class="stat-card">
            <h3>Current</h3>
            <p>${currentValue}</p>
        </div>
        <div class="stat-card">
            <h3>Change</h3>
            <p class="${trend}">${change}%</p>
        </div>
        <div class="stat-card">
            <h3>Average</h3>
            <p>${calculateAverage(data.datasets[0].data).toFixed(1)}</p>
        </div>
    `;
}

// Calculate average of array
function calculateAverage(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Initialize event listeners
function initEventListeners() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Export functionality will be available soon!');
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userToken');
            window.location.href = 'login.html';
        });
    }
} 