// Application data
const appData = {
  cityKPIs: {
    traffic: {current: 72, trend: -5, status: "normal"},
    energy: {current: 85, trend: 3, status: "high"},
    airQuality: {current: 45, trend: -12, status: "good"},
    waterUsage: {current: 78, trend: 8, status: "warning"}
  },
  recentAlerts: [
    {id: 1, type: "traffic", severity: "medium", message: "Traffic congestion detected on Highway 101", time: "2025-09-09T14:30:00Z"},
    {id: 2, type: "environment", severity: "low", message: "Air quality improving in downtown area", time: "2025-09-09T14:15:00Z"}
  ],
  feedbackCategories: ["Water", "Traffic", "Safety", "Environment", "Infrastructure", "Public Services", "Health", "Education"],
  sampleFeedback: [
    {id: 1, category: "Water", title: "Burst pipe on Main Street", status: "In Progress", priority: "High", submittedBy: "John Doe", date: "2025-09-09"},
    {id: 2, category: "Traffic", title: "Traffic light malfunction at 5th Avenue", status: "Resolved", priority: "Medium", submittedBy: "Jane Smith", date: "2025-09-08"}
  ],
  ecoTips: [
    {title: "Reduce Energy Consumption", description: "Switch to LED bulbs to reduce energy usage by up to 80%", category: "Energy"},
    {title: "Water Conservation", description: "Install low-flow fixtures to save up to 30% on water bills", category: "Water"},
    {title: "Sustainable Transport", description: "Use public transport or bike to reduce carbon emissions", category: "Transport"}
  ],
  anomalyData: [
    {type: "Traffic", location: "Downtown", severity: "High", time: "14:25", status: "Active"},
    {type: "Security", location: "Park Avenue", severity: "Medium", time: "14:20", status: "Resolved"},
    {type: "Environmental", location: "Industrial Zone", severity: "Low", time: "14:10", status: "Monitoring"}
  ],
  forecastData: {
    waterUsage: [65, 70, 72, 78, 82, 85, 88],
    energyConsumption: [80, 75, 78, 85, 90, 88, 92],
    trafficFlow: [60, 65, 72, 68, 75, 70, 73]
  },
  chatResponses: [
    {query: "water", response: "I can help you with water-related services. You can report water issues through our Citizen Feedback system or check current water usage in the City Health Dashboard."},
    {query: "traffic", response: "For traffic information, check our real-time traffic KPIs in the dashboard or report traffic issues through the feedback system."},
    {query: "sustainability", response: "Visit our Eco-Advice module for personalized sustainability tips and environmental recommendations."}
  ]
};

// Application state
let currentModule = 'dashboard';
let isDarkMode = false;
let feedbackData = [...appData.sampleFeedback];
let chatHistory = [];
let charts = {};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing app');
  initializeApp();
});

function initializeApp() {
  console.log('Initializing Smart City Assistant');
  
  // Wait a bit for all elements to be rendered
  setTimeout(() => {
    setupEventListeners();
    updateLastUpdateTime();
    renderDashboard();
    renderFeedbackList();
    renderEcoTips();
    renderAnomalyList();
    initializeForecastChart();
    
    // Set up real-time updates
    setInterval(updateLastUpdateTime, 30000);
    setInterval(simulateRealTimeUpdates, 5000);
    
    console.log('App initialization complete');
  }, 100);
}

function setupEventListeners() {
  console.log('Setting up event listeners');
  
  // Main navigation buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  console.log('Found nav buttons:', navButtons.length);
  
  navButtons.forEach((btn, index) => {
    const module = btn.getAttribute('data-module');
    console.log(`Setting up nav button ${index}: ${module}`);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Nav button clicked:', module);
      if (module) {
        switchModule(module);
      }
    });
  });

  // Sidebar buttons
  const sidebarButtons = document.querySelectorAll('.sidebar button[data-module]');
  console.log('Found sidebar buttons:', sidebarButtons.length);
  
  sidebarButtons.forEach((btn, index) => {
    const module = btn.getAttribute('data-module');
    console.log(`Setting up sidebar button ${index}: ${module}`);
    
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Sidebar button clicked:', module);
      if (module) {
        switchModule(module);
      }
    });
  });

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    console.log('Setting up theme toggle');
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Theme toggle clicked');
      toggleTheme();
    });
  } else {
    console.log('Theme toggle button not found');
  }

  // Feedback form
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmission);
  }

  const toggleFeedbackBtn = document.getElementById('toggle-feedback-view');
  if (toggleFeedbackBtn) {
    toggleFeedbackBtn.addEventListener('click', toggleFeedbackView);
  }

  const feedbackFilter = document.getElementById('feedback-filter');
  if (feedbackFilter) {
    feedbackFilter.addEventListener('change', filterFeedback);
  }

  // Document upload
  const documentFile = document.getElementById('document-file');
  if (documentFile) {
    documentFile.addEventListener('change', handleDocumentUpload);
  }

  const documentUpload = document.getElementById('document-upload');
  if (documentUpload) {
    documentUpload.addEventListener('click', function() {
      const fileInput = document.getElementById('document-file');
      if (fileInput) {
        fileInput.click();
      }
    });
  }

  // Summary format toggle
  const formatButtons = document.querySelectorAll('[data-format]');
  formatButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const format = e.target.getAttribute('data-format');
      toggleSummaryFormat(format);
    });
  });

  const exportBtn = document.getElementById('export-summary');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportSummary);
  }

  // Carbon calculator
  const carbonForm = document.getElementById('carbon-calculator');
  if (carbonForm) {
    carbonForm.addEventListener('submit', calculateCarbonFootprint);
  }

  // Forecasting
  const forecastMetric = document.getElementById('forecast-metric');
  if (forecastMetric) {
    forecastMetric.addEventListener('change', updateForecastChart);
  }

  const forecastCSV = document.getElementById('forecast-csv');
  if (forecastCSV) {
    forecastCSV.addEventListener('change', handleCSVUpload);
  }

  // Chat
  const sendBtn = document.getElementById('send-message');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendChatMessage);
  }

  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }

  const quickActionButtons = document.querySelectorAll('.quick-action-btn');
  quickActionButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const query = e.target.getAttribute('data-query');
      if (query) {
        sendQuickQuery(query);
      }
    });
  });

  // Modal close
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  console.log('Event listeners setup complete');
}

function switchModule(moduleName) {
  console.log('Switching to module:', moduleName);
  
  if (!moduleName) {
    console.error('No module name provided');
    return;
  }
  
  // Update navigation active state
  const allNavButtons = document.querySelectorAll('.nav-btn');
  allNavButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeNavBtn = document.querySelector(`.nav-btn[data-module="${moduleName}"]`);
  if (activeNavBtn) {
    activeNavBtn.classList.add('active');
    console.log('Activated nav button for:', moduleName);
  } else {
    console.warn('Nav button not found for module:', moduleName);
  }

  // Hide all modules
  const allModules = document.querySelectorAll('.module');
  console.log('Found modules:', allModules.length);
  
  allModules.forEach(module => {
    module.classList.remove('active');
  });

  // Show selected module
  const targetModule = document.getElementById(moduleName);
  if (targetModule) {
    targetModule.classList.add('active');
    currentModule = moduleName;
    console.log('Successfully switched to module:', moduleName);

    // Initialize module-specific functionality
    setTimeout(() => {
      if (moduleName === 'forecasting') {
        updateForecastChart();
      }
      if (moduleName === 'feedback') {
        renderFeedbackList();
      }
      if (moduleName === 'eco-advice') {
        renderEcoTips();
      }
      if (moduleName === 'anomalies') {
        renderAnomalyList();
      }
    }, 100);
  } else {
    console.error('Target module not found:', moduleName);
  }
}

function toggleTheme() {
  console.log('Toggling theme, current isDarkMode:', isDarkMode);
  
  isDarkMode = !isDarkMode;
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  
  if (isDarkMode) {
    body.setAttribute('data-color-scheme', 'dark');
    if (themeToggle) {
      themeToggle.textContent = '☀️';
    }
    console.log('Switched to dark mode');
  } else {
    body.setAttribute('data-color-scheme', 'light');
    if (themeToggle) {
      themeToggle.textContent = '🌙';
    }
    console.log('Switched to light mode');
  }
  
  // Update charts if they exist
  Object.values(charts).forEach(chart => {
    if (chart && typeof chart.update === 'function') {
      chart.update();
    }
  });
}

function updateLastUpdateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const updateElement = document.getElementById('last-update-time');
  if (updateElement) {
    updateElement.textContent = timeString;
  }
}

function renderDashboard() {
  renderRecentAlerts();
  setTimeout(() => renderDashboardChart(), 200);
}

function renderRecentAlerts() {
  const alertsContainer = document.getElementById('recent-alerts');
  if (!alertsContainer) return;
  
  alertsContainer.innerHTML = '';

  appData.recentAlerts.forEach(alert => {
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item severity-${alert.severity}`;
    
    const time = new Date(alert.time).toLocaleTimeString();
    
    alertElement.innerHTML = `
      <div class="alert-title">${alert.message}</div>
      <div class="alert-time">${time}</div>
    `;
    
    alertsContainer.appendChild(alertElement);
  });
}

function renderDashboardChart() {
  const ctx = document.getElementById('dashboard-chart');
  if (!ctx) {
    console.log('Dashboard chart canvas not found');
    return;
  }

  if (charts.dashboard) {
    charts.dashboard.destroy();
  }

  try {
    charts.dashboard = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
        datasets: [
          {
            label: 'Traffic',
            data: [75, 72, 70, 68, 70, 72, 72],
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            tension: 0.4
          },
          {
            label: 'Energy',
            data: [80, 82, 85, 83, 85, 87, 85],
            borderColor: '#FFC185',
            backgroundColor: 'rgba(255, 193, 133, 0.1)',
            tension: 0.4
          },
          {
            label: 'Air Quality',
            data: [55, 52, 48, 45, 43, 45, 45],
            borderColor: '#B4413C',
            backgroundColor: 'rgba(180, 65, 60, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
    console.log('Dashboard chart rendered successfully');
  } catch (error) {
    console.error('Error rendering dashboard chart:', error);
  }
}

function handleFeedbackSubmission(e) {
  e.preventDefault();
  
  const feedback = {
    id: feedbackData.length + 1,
    category: document.getElementById('feedback-category').value,
    title: document.getElementById('feedback-title').value,
    description: document.getElementById('feedback-description').value,
    priority: document.getElementById('feedback-priority').value,
    status: 'Submitted',
    submittedBy: 'Current User',
    date: new Date().toISOString().split('T')[0]
  };

  feedbackData.push(feedback);
  
  // Reset form
  e.target.reset();
  
  // Show success message
  showSuccessModal('Feedback submitted successfully! Tracking ID: ' + feedback.id);
  
  // Update admin view if visible
  renderFeedbackList();
}

function toggleFeedbackView() {
  const formView = document.getElementById('feedback-form-view');
  const adminView = document.getElementById('feedback-admin-view');
  const toggleBtn = document.getElementById('toggle-feedback-view');
  
  if (formView && adminView && toggleBtn) {
    if (formView.classList.contains('hidden')) {
      formView.classList.remove('hidden');
      adminView.classList.add('hidden');
      toggleBtn.textContent = 'Admin View';
    } else {
      formView.classList.add('hidden');
      adminView.classList.remove('hidden');
      toggleBtn.textContent = 'Submit View';
      renderFeedbackList();
    }
  }
}

function renderFeedbackList() {
  const listContainer = document.getElementById('feedback-list');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  feedbackData.forEach(feedback => {
    const item = document.createElement('div');
    item.className = 'feedback-item';
    
    const statusClass = feedback.status === 'Resolved' ? 'status--success' : 
                       feedback.status === 'In Progress' ? 'status--warning' : 'status--info';
    
    const priorityClass = feedback.priority === 'Critical' ? 'status--error' :
                         feedback.priority === 'High' ? 'status--warning' :
                         feedback.priority === 'Medium' ? 'status--info' : 'status--success';
    
    item.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-title">${feedback.title}</div>
        <div>
          <span class="status ${statusClass}">${feedback.status}</span>
        </div>
      </div>
      <div class="feedback-meta">
        <span>Category: ${feedback.category}</span>
        <span>Priority: <span class="status ${priorityClass}">${feedback.priority}</span></span>
        <span>By: ${feedback.submittedBy}</span>
        <span>Date: ${feedback.date}</span>
      </div>
    `;
    
    listContainer.appendChild(item);
  });
}

function filterFeedback() {
  const filter = document.getElementById('feedback-filter').value;
  const filteredData = filter ? feedbackData.filter(item => item.category === filter) : feedbackData;
  
  const listContainer = document.getElementById('feedback-list');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  filteredData.forEach(feedback => {
    const item = document.createElement('div');
    item.className = 'feedback-item';
    
    const statusClass = feedback.status === 'Resolved' ? 'status--success' : 
                       feedback.status === 'In Progress' ? 'status--warning' : 'status--info';
    
    const priorityClass = feedback.priority === 'Critical' ? 'status--error' :
                         feedback.priority === 'High' ? 'status--warning' :
                         feedback.priority === 'Medium' ? 'status--info' : 'status--success';
    
    item.innerHTML = `
      <div class="feedback-header">
        <div class="feedback-title">${feedback.title}</div>
        <div>
          <span class="status ${statusClass}">${feedback.status}</span>
        </div>
      </div>
      <div class="feedback-meta">
        <span>Category: ${feedback.category}</span>
        <span>Priority: <span class="status ${priorityClass}">${feedback.priority}</span></span>
        <span>By: ${feedback.submittedBy}</span>
        <span>Date: ${feedback.date}</span>
      </div>
    `;
    
    listContainer.appendChild(item);
  });
}

function handleDocumentUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Simulate document processing
  const summaryContainer = document.getElementById('document-summary');
  const summaryText = document.getElementById('summary-text');
  
  if (summaryContainer && summaryText) {
    // Show loading state
    summaryText.innerHTML = '<div class="loading"></div> Processing document...';
    summaryContainer.classList.remove('hidden');
    
    // Simulate processing delay
    setTimeout(() => {
      const summary = generateMockSummary(file.name);
      summaryText.innerHTML = summary;
    }, 2000);
  }
}

function generateMockSummary(filename) {
  return `
    <h4>Key Takeaways:</h4>
    <ul>
      <li>Document outlines comprehensive sustainability initiatives for smart city development</li>
      <li>Focus on reducing carbon emissions by 40% over the next 5 years</li>
      <li>Implementation of IoT sensors for real-time environmental monitoring</li>
      <li>Citizen engagement platform for community feedback and participation</li>
      <li>Integration of renewable energy sources across municipal buildings</li>
      <li>Smart traffic management system to reduce congestion by 25%</li>
    </ul>
    <p><strong>Estimated reading time:</strong> 12 minutes</p>
    <p><strong>Document length:</strong> 2,847 words</p>
  `;
}

function toggleSummaryFormat(format) {
  const buttons = document.querySelectorAll('[data-format]');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  const activeBtn = document.querySelector(`[data-format="${format}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  const summaryText = document.getElementById('summary-text');
  if (!summaryText) return;
  
  if (format === 'paragraph') {
    summaryText.innerHTML = `
      <p>This document presents a comprehensive framework for sustainable smart city development, emphasizing environmental responsibility and technological innovation. The primary focus is on achieving a 40% reduction in carbon emissions over the next five years through strategic implementation of green technologies and citizen engagement initiatives.</p>
      <p>The proposal includes deployment of IoT sensors throughout the city for real-time environmental monitoring, enabling data-driven decision making for sustainability measures. A citizen engagement platform will facilitate community feedback and participation in environmental initiatives.</p>
      <p>Key infrastructure improvements include integration of renewable energy sources across municipal buildings and implementation of a smart traffic management system designed to reduce congestion by 25%.</p>
    `;
  } else {
    summaryText.innerHTML = generateMockSummary();
  }
}

function exportSummary() {
  const summaryText = document.getElementById('summary-text');
  if (!summaryText) return;
  
  const text = summaryText.textContent;
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document_summary.txt';
  a.click();
  
  URL.revokeObjectURL(url);
  showSuccessModal('Summary exported successfully!');
}

function renderEcoTips() {
  const tipsContainer = document.getElementById('eco-tips');
  if (!tipsContainer) return;
  
  tipsContainer.innerHTML = '';
  
  appData.ecoTips.forEach(tip => {
    const tipElement = document.createElement('div');
    tipElement.className = 'tip-item';
    tipElement.innerHTML = `
      <div class="tip-title">${tip.title}</div>
      <div class="tip-description">${tip.description}</div>
    `;
    tipsContainer.appendChild(tipElement);
  });
}

function calculateCarbonFootprint(e) {
  e.preventDefault();
  
  const energy = parseFloat(document.getElementById('energy-usage').value);
  const transport = parseFloat(document.getElementById('transport-usage').value);
  
  // Simple calculation (mock formula)
  const carbonFootprint = (energy * 0.4) + (transport * 0.2);
  
  const resultContainer = document.getElementById('carbon-result');
  if (!resultContainer) return;
  
  const valueElement = resultContainer.querySelector('.carbon-value');
  const recommendationsElement = resultContainer.querySelector('.carbon-recommendations');
  
  if (valueElement) {
    valueElement.textContent = `${carbonFootprint.toFixed(1)} kg CO2/month`;
  }
  
  let recommendations = '';
  if (carbonFootprint > 150) {
    recommendations = 'Consider reducing energy consumption and using public transport more frequently.';
  } else if (carbonFootprint > 100) {
    recommendations = 'Good progress! Try switching to renewable energy sources.';
  } else {
    recommendations = 'Excellent! You have a low carbon footprint. Keep up the great work!';
  }
  
  if (recommendationsElement) {
    recommendationsElement.textContent = recommendations;
  }
  
  resultContainer.classList.remove('hidden');
}

function renderAnomalyList() {
  const listContainer = document.getElementById('anomaly-list');
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  appData.anomalyData.forEach(anomaly => {
    const item = document.createElement('div');
    item.className = 'anomaly-item';
    
    const severityClass = anomaly.severity === 'High' ? 'status--error' :
                         anomaly.severity === 'Medium' ? 'status--warning' : 'status--info';
    
    const statusClass = anomaly.status === 'Active' ? 'status--error' :
                       anomaly.status === 'Resolved' ? 'status--success' : 'status--warning';
    
    item.innerHTML = `
      <div class="anomaly-info">
        <div class="anomaly-type">${anomaly.type} - ${anomaly.location}</div>
        <div class="anomaly-location">Detected at ${anomaly.time}</div>
      </div>
      <div class="anomaly-actions">
        <span class="status ${severityClass}">${anomaly.severity}</span>
        <span class="status ${statusClass}">${anomaly.status}</span>
      </div>
    `;
    
    listContainer.appendChild(item);
  });
}

function initializeForecastChart() {
  setTimeout(() => updateForecastChart(), 200);
}

function updateForecastChart() {
  const metricSelect = document.getElementById('forecast-metric');
  const ctx = document.getElementById('forecast-chart');
  if (!ctx || !metricSelect) return;

  const metric = metricSelect.value;

  if (charts.forecast) {
    charts.forecast.destroy();
  }

  try {
    const data = appData.forecastData[metric] || appData.forecastData.waterUsage;
    const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
    
    charts.forecast = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Historical Data',
            data: data.slice(0, 4),
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            tension: 0.4
          },
          {
            label: 'Forecast',
            data: [null, null, null, ...data.slice(3)],
            borderColor: '#FFC185',
            backgroundColor: 'rgba(255, 193, 133, 0.1)',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    console.log('Forecast chart rendered successfully');
  } catch (error) {
    console.error('Error rendering forecast chart:', error);
  }
}

function handleCSVUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Simulate CSV processing
  showSuccessModal('CSV data uploaded successfully! Forecast updated with your data.');
  
  // Mock update to forecast chart with random data
  setTimeout(() => {
    const metricSelect = document.getElementById('forecast-metric');
    if (metricSelect) {
      const randomData = Array.from({length: 7}, () => Math.floor(Math.random() * 50) + 50);
      appData.forecastData[metricSelect.value] = randomData;
      updateForecastChart();
    }
  }, 1000);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  addChatMessage('user', message);
  input.value = '';
  
  // Simulate AI response
  setTimeout(() => {
    const response = generateChatResponse(message);
    addChatMessage('assistant', response);
  }, 1000);
}

function sendQuickQuery(query) {
  addChatMessage('user', query);
  
  setTimeout(() => {
    const response = generateChatResponse(query);
    addChatMessage('assistant', response);
  }, 1000);
}

function addChatMessage(sender, message) {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;
  
  const messageElement = document.createElement('div');
  messageElement.className = `chat-message ${sender}`;
  
  const contentElement = document.createElement('div');
  contentElement.className = 'message-content';
  contentElement.textContent = message;
  
  messageElement.appendChild(contentElement);
  messagesContainer.appendChild(messageElement);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Find matching response
  const matchingResponse = appData.chatResponses.find(response => 
    lowerMessage.includes(response.query)
  );
  
  if (matchingResponse) {
    return matchingResponse.response;
  }
  
  // Default responses
  if (lowerMessage.includes('help')) {
    return "I can help you with various city services. Try asking about water, traffic, sustainability, or use the quick action buttons below.";
  }
  
  if (lowerMessage.includes('report') || lowerMessage.includes('problem')) {
    return "To report an issue, please use our Citizen Feedback system. I can help guide you through the process or you can navigate directly to the Feedback module.";
  }
  
  if (lowerMessage.includes('status') || lowerMessage.includes('dashboard')) {
    return "You can check the current city status in our Dashboard module, which shows real-time KPIs for traffic, energy, air quality, and water usage.";
  }
  
  return "I understand you're asking about city services. For specific assistance, please use the navigation menu to access different modules or try one of the quick action buttons.";
}

function simulateRealTimeUpdates() {
  // Simulate small changes in KPI values
  const kpiCards = document.querySelectorAll('.kpi-card');
  kpiCards.forEach(card => {
    const valueElement = card.querySelector('.kpi-card__value');
    if (valueElement && Math.random() < 0.3) { // 30% chance of update
      const currentText = valueElement.textContent;
      const currentValue = parseFloat(currentText);
      if (!isNaN(currentValue)) {
        const change = (Math.random() - 0.5) * 2; // ±1 change
        const newValue = Math.max(0, Math.min(100, currentValue + change));
        valueElement.textContent = currentText.includes('%') ? 
          `${Math.round(newValue)}%` : 
          `${Math.round(newValue)} ${currentText.split(' ')[1] || ''}`;
      }
    }
  });
  
  // Update timestamp
  updateLastUpdateTime();
}

function showSuccessModal(message) {
  const modal = document.getElementById('success-modal');
  const messageElement = document.getElementById('success-message');
  
  if (modal && messageElement) {
    messageElement.textContent = message;
    modal.classList.remove('hidden');
  }
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

// Initialize charts colors when Chart.js is available
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#334155';
  Chart.defaults.borderColor = 'rgba(203, 213, 225, 0.5)';
}