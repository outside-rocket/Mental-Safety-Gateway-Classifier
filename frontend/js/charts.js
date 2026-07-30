/* Guardian Portal - Chart.js Initializations & Customizations */

let weeklyWellnessChartInstance = null;
let fidelityGaugeChartInstance = null;
let riskAssessmentGaugeChartInstance = null;
let wellnessGaugeChartInstance = null;

const ChartsModule = {
    initWeeklyWellnessChart() {
        const ctx = document.getElementById('weeklyWellnessChart');
        if (!ctx) return;
        
        // Destroy existing instance to avoid canvas re-use errors
        if (weeklyWellnessChartInstance) {
            weeklyWellnessChartInstance.destroy();
        }
        
        const canvasCtx = ctx.getContext('2d');
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

        weeklyWellnessChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                datasets: [{
                    label: 'Wellness Index',
                    data: [68, 71, 65, 76, 73, 85, 78],
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: 'rgba(59, 130, 246, 0.4)',
                    pointBorderWidth: 6,
                    pointRadius: (context) => (context.dataIndex === 5 ? 7 : 0), // Sat peak dot
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: gradient
                }, {
                    label: 'Activity Baseline',
                    data: [64, 65, 63, 64, 64, 65, 64],
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    pointRadius: 0,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#0d1627',
                        titleFont: { family: 'Outfit', size: 12 },
                        bodyFont: { family: 'Inter', size: 12 },
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#5e6d87',
                            font: { family: 'Outfit', size: 10, weight: '700' }
                        }
                    },
                    y: {
                        display: false,
                        min: 50,
                        max: 95
                    }
                }
            }
        });
    },

    initFidelityGauge() {
        const ctx = document.getElementById('fidelityGaugeChart');
        if (!ctx) return;
        
        if (fidelityGaugeChartInstance) {
            fidelityGaugeChartInstance.destroy();
        }

        fidelityGaugeChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [99.2, 0.8],
                    backgroundColor: ['#10b981', 'rgba(255, 255, 255, 0.04)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '88%',
                rotation: 0,
                circumference: 360,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    },

    initRiskAssessmentGauge() {
        const ctx = document.getElementById('riskAssessmentGaugeChart');
        if (!ctx) return;

        if (riskAssessmentGaugeChartInstance) {
            riskAssessmentGaugeChartInstance.destroy();
        }

        riskAssessmentGaugeChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [92, 8],
                    backgroundColor: ['#10b981', 'rgba(255, 255, 255, 0.04)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '88%',
                rotation: 0,
                circumference: 360,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    },

    initWellnessGauge(score = 64) {
        const ctx = document.getElementById('wellnessGaugeChart');
        if (!ctx) return;

        if (wellnessGaugeChartInstance) {
            wellnessGaugeChartInstance.destroy();
        }

        wellnessGaugeChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: ['#10b981', 'rgba(255, 255, 255, 0.04)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '88%',
                rotation: 0,
                circumference: 360,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    },
    
    // Trigger redraw for all active gauges when window scales
    resizeAll() {
        if (weeklyWellnessChartInstance) weeklyWellnessChartInstance.resize();
        if (fidelityGaugeChartInstance) fidelityGaugeChartInstance.resize();
        if (riskAssessmentGaugeChartInstance) riskAssessmentGaugeChartInstance.resize();
        if (wellnessGaugeChartInstance) wellnessGaugeChartInstance.resize();
    }
};

window.addEventListener('resize', () => {
    ChartsModule.resizeAll();
});
