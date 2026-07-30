/* Guardian Portal - Mock Datasets for Frontend Logic */

const MOCK_DATA = {
    devices: [
        {
            id: "dev-1",
            name: "MacBook Pro - Admin",
            ip: "192.168.1.14",
            os: "macOS 14.2",
            status: "ACTIVE",
            seen: "Seen 2m ago",
            statusLabel: "Safe Level",
            risk: "0.02% Risk",
            riskVal: 0.02,
            type: "laptop"
        },
        {
            id: "dev-2",
            name: "Pixel 8 Pro",
            ip: "192.168.1.28",
            os: "Android 14",
            status: "STANDBY",
            seen: "Seen 45m ago",
            statusLabel: "Safe Level",
            risk: "0.05% Risk",
            riskVal: 0.05,
            type: "smartphone"
        },
        {
            id: "dev-3",
            name: "Smart Fridge Node",
            ip: "192.168.1.102",
            os: "Embedded OS",
            status: "ACTIVE",
            seen: "Real-time",
            statusLabel: "Analyzing Traffic",
            risk: "1.20% Risk",
            riskVal: 1.20,
            type: "router"
        },
        {
            id: "dev-4",
            name: "Workstation-Main",
            ip: "192.168.1.5",
            os: "Windows 11",
            status: "STANDBY",
            seen: "Seen 6h ago",
            statusLabel: "Safe Level",
            risk: "0.01% Risk",
            riskVal: 0.01,
            type: "laptop"
        },
        {
            id: "dev-5",
            name: "IoT Camera North",
            ip: "192.168.1.99",
            os: "Linux RTSP",
            status: "ACTIVE",
            seen: "Seen 12s ago",
            statusLabel: "Safe Level",
            risk: "0.08% Risk",
            riskVal: 0.08,
            type: "camera"
        }
    ],
    
    activityAlerts: [
        {
            id: 1,
            title: "Agitated Verbal Patterns Detected",
            badge: "CRITICAL",
            location: "Station Alpha-01 • Core Sensor Node",
            time: "2m ago",
            confidence: "98% Confidence",
            riskLevel: "High Risk Detected",
            wellnessScore: 64,
            confidenceVal: "89% High Precision",
            narrative: "Detected linguistic patterns indicating high stress and social withdrawal over the last 48 hours. Communication volume has decreased by 70%, while keyword frequency related to anxiety has increased significantly across monitored channels.",
            timeline: [
                { time: "10:14 AM - Unusual silence detected", desc: "Digital activity dropped below 5% of standard baseline.", level: "orange" },
                { time: "09:45 AM - Rapid typing patterns", desc: "High-velocity input suggesting cognitive agitation.", level: "blue" },
                { time: "08:12 AM - System Login", desc: "Standard authentication protocol completed.", level: "gray" }
            ],
            history: [
                { date: "Oct 24, 2023", desc: "Moderate Risk", status: "warning" },
                { date: "Oct 20, 2023", desc: "Safe Baseline", status: "success" },
                { date: "Oct 14, 2023", desc: "Safe Baseline", status: "success" }
            ]
        },
        {
            id: 2,
            title: "Elevated Heart Rate Variance",
            badge: "ELEVATED",
            location: "Wearable Unit X7 • User ID: 9422",
            time: "14m ago",
            confidence: "82% Confidence",
            riskLevel: "Moderate Risk Active",
            wellnessScore: 78,
            confidenceVal: "74% Moderate Precision",
            narrative: "Biometric sensor telemetry indicated elevated HRV anomalies during restful intervals. Heartbeat spikes align with simulated environmental stressors. Activity metrics remain within safe threshold, but monitoring level raised.",
            timeline: [
                { time: "02:30 PM - Heart Rate Variance Spike", desc: "HRV exceeded 120 bpm during sleeping baseline.", level: "orange" },
                { time: "01:15 PM - Motion accelerometer alert", desc: "Short duration of pacing activity recorded.", level: "blue" },
                { time: "10:00 AM - Baseline synchronization", desc: "Standard daily biometric calibration complete.", level: "gray" }
            ],
            history: [
                { date: "Oct 25, 2023", desc: "Safe Baseline", status: "success" },
                { date: "Oct 18, 2023", desc: "Mild Stress Warning", status: "warning" }
            ]
        },
        {
            id: 3,
            title: "Routine Environmental Scan Complete",
            badge: "NORMAL",
            location: "All Active Nodes • System-wide",
            time: "45m ago",
            confidence: "100% Precision",
            riskLevel: "Normal System Operation",
            wellnessScore: 95,
            confidenceVal: "100% Precision Verified",
            narrative: "Routine diagnostics scan swept all connected network ports, sensor networks, and edge nodes. Performance metrics show optimal throughput with zero package drops. Security controls validated successfully.",
            timeline: [
                { time: "11:00 AM - Diagnostic Scan Finalized", desc: "Zero vulnerability flags or traffic anomalies detected.", level: "green" },
                { time: "10:30 AM - Node Check-in Sweep", desc: "Received active response pulses from all 20 nodes.", level: "blue" }
            ],
            history: [
                { date: "Oct 26, 2023", desc: "Safe Baseline", status: "success" }
            ]
        }
    ]
};
