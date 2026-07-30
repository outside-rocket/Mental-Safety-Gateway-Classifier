/* Guardian Portal - Core UI Component Logics & Renderers */

const ComponentsModule = {
    // Render Connected Device Cards Grid
    renderDeviceCards(devicesList) {
        const container = document.getElementById('devices-grid-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        devicesList.forEach(dev => {
            // Pick Lucide Icon based on device type
            let iconName = 'laptop';
            if (dev.type === 'smartphone') iconName = 'smartphone';
            else if (dev.type === 'camera') iconName = 'video';
            else if (dev.type === 'router') iconName = 'router';
            
            const badgeClass = dev.status === 'ACTIVE' ? 'badge-normal' : 'badge-elevated';
            const dotClass = dev.status === 'ACTIVE' ? 'active' : 'standby';
            
            const cardHtml = `
                <div class="device-card" data-id="${dev.id}">
                    <div class="device-card-header">
                        <div class="device-avatar-wrapper">
                            <i data-lucide="${iconName}"></i>
                        </div>
                        <div class="device-status-badge-container">
                            <span class="badge-status ${badgeClass}">${dev.status}</span>
                            <span class="seen-time">${dev.seen}</span>
                        </div>
                    </div>
                    <div class="device-info-body">
                        <h3>${dev.name}</h3>
                        <p class="device-ip-os">${dev.ip} • ${dev.os}</p>
                    </div>
                    <div class="device-footer">
                        <div class="device-status-desc">
                            <span class="status-indicator-dot ${dotClass}"></span>
                            <span>${dev.statusLabel}</span>
                        </div>
                        <span class="device-risk-score">${dev.risk}</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
        
        // Append the Onboard New Device dashed card at the end
        const onboardCardHtml = `
            <div class="device-card device-card-onboard" id="btn-trigger-onboard-modal">
                <i data-lucide="plus-circle" class="icon-onboard-plus"></i>
                <span class="onboard-text">Onboard New Device</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', onboardCardHtml);
        
        // Re-run Lucide Icons rendering for newly injected HTML
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Bind click event to Onboard button
        document.getElementById('btn-trigger-onboard-modal').addEventListener('click', () => {
            ComponentsModule.openModal('modal-onboard-device');
        });
    },

    // Modal Control Utils
    openModal(modalId) {
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById(modalId);
        
        if (overlay && modal) {
            overlay.classList.add('active');
            modal.classList.add('active');
        }
    },

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        if (!overlay) return;
        
        overlay.classList.remove('active');
        const activeModals = overlay.querySelectorAll('.modal-card');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
    },

    // Network Scan Simulation logic
    runNetworkScan() {
        ComponentsModule.openModal('modal-network-scan');
        const percentText = document.querySelector('.scan-percent');
        const stepText = document.querySelector('.scan-step-text');
        
        if (!percentText || !stepText) return;
        
        let percent = 0;
        percentText.textContent = '0%';
        stepText.textContent = 'Initializing NPU packet inspection...';
        
        const steps = [
            { threshold: 15, text: 'Resolving OpenWrt routing tables...' },
            { threshold: 40, text: 'Scanning active ports on 20 endpoints...' },
            { threshold: 65, text: 'Analyzing packet payloads via edge AI models...' },
            { threshold: 85, text: 'Evaluating behavioral risk baselines...' },
            { threshold: 100, text: 'Network scan complete. Safety index is verified.' }
        ];

        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 4) + 1;
            if (percent >= 100) {
                percent = 100;
                percentText.textContent = '100%';
                stepText.textContent = steps[steps.length - 1].text;
                clearInterval(interval);
                
                setTimeout(() => {
                    ComponentsModule.closeModal();
                    // Optional toast indicator
                }, 1000);
            } else {
                percentText.textContent = `${percent}%`;
                const activeStep = steps.find(s => percent <= s.threshold);
                if (activeStep) {
                    stepText.textContent = activeStep.text;
                }
            }
        }, 80);
    }
};
