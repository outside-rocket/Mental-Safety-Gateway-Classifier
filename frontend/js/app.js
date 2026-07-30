/* Guardian Portal - Main Application Orchestrator & Client-Side SPA Router */

// Global App State
const AppState = {
    currentView: 'login',
    activeDevicesFilter: 'all',
    deviceSearchQuery: '',
    selectedAlertId: 1
};

// Main Routing Controller
const AppRouter = {
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial load
        this.handleRoute();
    },
    
    handleRoute() {
        let hash = window.location.hash.slice(1) || 'login';
        
        // Parse params if present
        let view = hash;
        let idParam = null;
        
        if (hash.includes('?')) {
            const parts = hash.split('?');
            view = parts[0];
            const params = new URLSearchParams(parts[1]);
            idParam = parseInt(params.get('id'));
        }
        
        // Map "overview" to "analytics" view as per mockup structures
        if (view === 'overview') {
            view = 'analytics';
        }
        
        this.switchView(view, idParam);
    },
    
    switchView(viewName, idParam) {
        const appContainer = document.getElementById('app');
        const sidebar = document.getElementById('sidebar');
        const topNav = document.getElementById('top-nav');
        const bottomNav = document.getElementById('bottom-nav');
        
        // 1. Manage App Shell Modes (Login vs Dashboard)
        if (viewName === 'login') {
            appContainer.classList.add('login-mode');
            sidebar.classList.add('hidden');
            topNav.classList.add('hidden');
            bottomNav.classList.add('hidden');
        } else {
            appContainer.classList.remove('login-mode');
            sidebar.classList.remove('hidden');
            topNav.classList.remove('hidden');
            
            // Bottom navigation visibility mapping
            if (viewName === 'alert-detail') {
                bottomNav.classList.add('hidden');
            } else {
                bottomNav.classList.remove('hidden');
            }
        }
        
        // 2. Deactivate current views, activate targeted view
        const allViews = document.querySelectorAll('.view-container');
        allViews.forEach(v => v.classList.remove('active'));
        
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
            AppState.currentView = viewName;
        } else {
            // Default fallback
            document.getElementById('view-analytics').classList.add('active');
            AppState.currentView = 'analytics';
        }
        
        // 3. Update active nav menu styles
        this.updateActiveNavs(viewName);
        
        // 4. Initialize dynamic page components / charts
        this.loadPageAssets(viewName, idParam);
        
        // Scroll back to top
        window.scrollTo(0, 0);
    },
    
    updateActiveNavs(viewName) {
        const menuItems = document.querySelectorAll('.menu-item, .nav-link, .bottom-nav-item');
        menuItems.forEach(el => {
            const dataView = el.getAttribute('data-view');
            if (dataView === viewName || (viewName === 'overview' && dataView === 'analytics')) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    },
    
    loadPageAssets(viewName, idParam) {
        if (viewName === 'analytics') {
            // Draw charts
            setTimeout(() => {
                ChartsModule.initWeeklyWellnessChart();
            }, 100);
        } else if (viewName === 'alerts') {
            // Draw fidelity gauge
            setTimeout(() => {
                ChartsModule.initFidelityGauge();
            }, 100);
        } else if (viewName === 'devices') {
            // Draw risk gauge
            setTimeout(() => {
                ChartsModule.initRiskAssessmentGauge();
                AppLogic.filterDevices();
            }, 100);
        } else if (viewName === 'alert-detail') {
            const alertId = idParam || AppState.selectedAlertId;
            AppLogic.populateAlertDetail(alertId);
        }
    }
};

// Core Business Logic Handlers
const AppLogic = {
    init() {
        this.bindEvents();
        
        // Setup default device count metric
        document.getElementById('active-devices-count').textContent = MOCK_DATA.devices.length;
    },
    
    bindEvents() {
        // Login Submit
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', () => {
                window.location.hash = '#analytics';
            });
        }
        
        // Social logins mocks
        document.getElementById('btn-login-google').addEventListener('click', () => {
            window.location.hash = '#analytics';
        });
        document.getElementById('btn-login-passkey').addEventListener('click', () => {
            window.location.hash = '#analytics';
        });
        
        // Logout Click
        document.getElementById('btn-logout').addEventListener('click', () => {
            window.location.hash = '#login';
        });
        
        // Device Search
        const searchInput = document.getElementById('device-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                AppState.deviceSearchQuery = e.target.value.toLowerCase();
                this.filterDevices();
            });
        }
        
        // Device Filters Toggle button
        const filterToggleBtn = document.getElementById('btn-device-filter');
        if (filterToggleBtn) {
            filterToggleBtn.addEventListener('click', () => {
                const panel = document.getElementById('device-filter-panel');
                panel.classList.toggle('hidden');
            });
        }
        
        // Device Filter Tag Toggles
        const filterTags = document.querySelectorAll('.btn-filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                filterTags.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                AppState.activeDevicesFilter = e.target.getAttribute('data-filter');
                this.filterDevices();
            });
        });
        
        // Network Scan button
        document.getElementById('btn-run-network-scan').addEventListener('click', () => {
            ComponentsModule.runNetworkScan();
        });
        
        // Onboard Form Submit
        const onboardForm = document.getElementById('form-onboard-device');
        if (onboardForm) {
            onboardForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('device-name').value;
                const ip = document.getElementById('device-ip').value;
                const os = document.getElementById('device-os').value;
                const status = document.getElementById('device-status').value;
                const risk = parseFloat(document.getElementById('device-risk').value).toFixed(2);
                
                const newDevice = {
                    id: `dev-${Date.now()}`,
                    name,
                    ip,
                    os,
                    status,
                    seen: 'Real-time',
                    statusLabel: status === 'ACTIVE' ? 'Analyzing Traffic' : 'Safe Level',
                    risk: `${risk}% Risk`,
                    riskVal: parseFloat(risk),
                    type: name.toLowerCase().includes('phone') ? 'smartphone' : 'laptop'
                };
                
                // Add to mock dataset
                MOCK_DATA.devices.push(newDevice);
                
                // Refresh list
                this.filterDevices();
                
                // Close modal
                ComponentsModule.closeModal();
                onboardForm.reset();
            });
        }
        
        // Settings slider tags updater
        const sliders = [
            { id: 'slider-agitation', valId: 'val-agitation-slider', suffix: '%' },
            { id: 'slider-hrv', valId: 'val-hrv-slider', suffix: '%' },
            { id: 'slider-timeout', valId: 'val-timeout-slider', suffix: 'm' }
        ];
        
        sliders.forEach(sliderInfo => {
            const el = document.getElementById(sliderInfo.id);
            const valEl = document.getElementById(sliderInfo.valId);
            if (el && valEl) {
                el.addEventListener('input', (e) => {
                    valEl.textContent = `${e.target.value}${sliderInfo.suffix}`;
                });
            }
        });
        
        // Close modal buttons click listeners
        const closeModalTriggers = document.querySelectorAll('.btn-close-modal, .btn-close-modal-btn');
        closeModalTriggers.forEach(btn => {
            btn.addEventListener('click', () => ComponentsModule.closeModal());
        });
        
        // Quick help action cards
        document.getElementById('btn-emergency-help-card').addEventListener('click', () => {
            ComponentsModule.openModal('modal-call-confirm');
        });
        document.getElementById('btn-emergency-action-call').addEventListener('click', () => {
            ComponentsModule.openModal('modal-call-confirm');
        });
        document.getElementById('btn-helpline-card').addEventListener('click', () => {
            ComponentsModule.openModal('modal-call-confirm');
        });
        document.getElementById('btn-hospitals-card').addEventListener('click', () => {
            alert('Routing to closest clinical facility (Mock action).');
        });
        
        // Trigger modal call confirm dialer
        document.getElementById('btn-modal-call-confirm').addEventListener('click', () => {
            ComponentsModule.closeModal();
            alert('Helpline dialed. Caregiver response networks activated.');
        });
        
        // Activity Feed rows clicking redirects to detail
        const activityItems = document.querySelectorAll('.activity-feed-item');
        activityItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-alert-id');
                AppState.selectedAlertId = parseInt(id);
                window.location.hash = `#alert-detail?id=${id}`;
            });
        });
        
        // Back from detail click
        document.getElementById('btn-alert-detail-back').addEventListener('click', () => {
            window.location.hash = '#alerts';
        });
    },
    
    // Filter Device Grid based on search query & active status tag
    filterDevices() {
        const query = AppState.deviceSearchQuery;
        const statusFilter = AppState.activeDevicesFilter;
        
        const filtered = MOCK_DATA.devices.filter(dev => {
            const matchesQuery = dev.name.toLowerCase().includes(query) || 
                                 dev.ip.includes(query) || 
                                 dev.os.toLowerCase().includes(query);
                                 
            const matchesStatus = statusFilter === 'all' || 
                                  dev.status.toLowerCase() === statusFilter;
                                  
            return matchesQuery && matchesStatus;
        });
        
        // Render
        ComponentsModule.renderDeviceCards(filtered);
        
        // Update counts
        document.getElementById('active-devices-count').textContent = filtered.length;
    },
    
    // Populates data on Alert Detail page based on active selection
    populateAlertDetail(alertId) {
        const alertData = MOCK_DATA.activityAlerts.find(a => a.id === alertId);
        if (!alertData) return;
        
        // Update titles & headers
        const container = document.getElementById('view-alert-detail');
        if (!container) return;
        
        const riskTitle = container.querySelector('.alert-risk-banner h2');
        if (riskTitle) riskTitle.textContent = alertData.riskLevel;
        
        const descriptionText = container.querySelector('.alert-risk-banner p');
        if (descriptionText) descriptionText.textContent = `Automated analysis has flagged a significant deviation of standard triggers for: ${alertData.title}.`;
        
        // Update wellness score donuts
        setTimeout(() => {
            ChartsModule.initWellnessGauge(alertData.wellnessScore);
            const scoreLabel = container.querySelector('.wellness-score-num');
            if (scoreLabel) scoreLabel.textContent = `${alertData.wellnessScore}%`;
        }, 100);
        
        // Update confidence
        const confidenceText = container.querySelector('.score-number');
        if (confidenceText) confidenceText.textContent = alertData.confidenceVal.split(' ')[0];
        
        const confidenceLabel = container.querySelector('.score-label-green');
        if (confidenceLabel) confidenceLabel.textContent = alertData.confidenceVal.split(' ').slice(1).join(' ');
        
        // Progress track bar mapping
        const confidenceValNum = parseInt(alertData.confidenceVal);
        const progressTrack = container.querySelector('.confidence-progress-bar');
        if (progressTrack) {
            progressTrack.className = 'confidence-progress-bar'; // reset
            progressTrack.style.width = `${confidenceValNum}%`;
            progressTrack.style.backgroundColor = 'var(--accent-blue)';
        }
        
        // Update Narrative
        const narrativeText = container.querySelector('.narrative-body-text p');
        if (narrativeText) narrativeText.textContent = `"${alertData.narrative}"`;
        
        // Update Timeline
        const timelineList = container.querySelector('.timeline-vertical');
        if (timelineList) {
            timelineList.innerHTML = '';
            alertData.timeline.forEach(step => {
                const stepHtml = `
                    <div class="timeline-step step-${step.level}">
                        <span class="step-dot"></span>
                        <div class="step-content">
                            <div class="step-time">${step.time}</div>
                            <p>${step.desc}</p>
                        </div>
                    </div>
                `;
                timelineList.insertAdjacentHTML('beforeend', stepHtml);
            });
        }
        
        // Update history
        const historyList = container.querySelector('.history-list');
        if (historyList) {
            historyList.innerHTML = '';
            alertData.history.forEach(item => {
                const iconClass = item.status === 'warning' ? 'alert-triangle' : 'check-circle';
                const colorClass = item.status === 'warning' ? 'icon-warning-orange' : 'icon-check-green';
                
                const itemHtml = `
                    <div class="history-item clickable">
                        <div class="history-item-left">
                            <i data-lucide="${iconClass}" class="${colorClass}"></i>
                            <div class="history-info">
                                <span class="history-date">${item.date}</span>
                                <span class="history-desc">${item.desc}</span>
                            </div>
                        </div>
                        <i data-lucide="chevron-right" class="icon-chevron"></i>
                    </div>
                `;
                historyList.insertAdjacentHTML('beforeend', itemHtml);
            });
        }
        
        // Re-init lucide
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};

// Bootstrap App
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial icon creation
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // 2. Initialize Routing & Logic
    AppRouter.init();
    AppLogic.init();
});
