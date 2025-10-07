// DriveHub App JavaScript

// Application data
const appData = {
  "driver": {
    "name": "Luis Bracale",
    "rating": 4.8,
    "totalRides": 1234,
    "phone": "(11) 98765-4321",
    "email": "luis.bracale@email.com",
    "license": "AB123456789",
    "vehicle": {
      "model": "Impala 1967",
      "plate": "ABC-1234",
      "year": 2020,
      "color": "Preto"
    }
  },
  "stats": {
    "todayEarnings": 189.50,
    "weeklyEarnings": 847.20,
    "monthlyEarnings": 3421.80,
    "totalEarnings": 28647.90,
    "ridesCompleted": 1234,
    "averageRating": 4.8,
    "onlineHours": 8.5
  },
  "availableRides": [
    {
      "id": "R001",
      "pickup": "Avenida 4, 1381",
      "destination": "Rua 1, 234",
      "distance": "18.5 km",
      "estimatedTime": "25 min",
      "fare": 45.80,
      "passengerRating": 4.9
    },
    {
      "id": "R002", 
      "pickup": "Supermercado Paulista",
      "destination": "Avenida T, 900",
      "distance": "12.3 km",
      "estimatedTime": "18 min",
      "fare": 28.40,
      "passengerRating": 4.6
    },
    {
      "id": "R003",
      "pickup": "Av. Paulista, 1000",
      "destination": "Morumbi Shopping",
      "distance": "8.7 km",
      "estimatedTime": "15 min",
      "fare": 19.90,
      "passengerRating": 4.7
    }
  ],
  "recentRides": [
    {
      "id": "R789",
      "date": "2025-10-06",
      "time": "14:30",
      "pickup": "Centro",
      "destination": "Jardins",
      "fare": 23.50,
      "rating": 5,
      "distance": "7.2 km"
    },
    {
      "id": "R788",
      "date": "2025-10-06", 
      "time": "12:15",
      "pickup": "Ibirapuera",
      "destination": "Vila Olímpia",
      "fare": 18.90,
      "rating": 4,
      "distance": "5.8 km"
    },
    {
      "id": "R787",
      "date": "2025-10-05",
      "time": "19:45",
      "pickup": "Brooklin",
      "destination": "Santo André",
      "fare": 32.70,
      "rating": 5,
      "distance": "15.3 km"
    }
  ]
};

// Application state
let appState = {
  isOnline: false,
  currentScreen: 'dashboard',
  selectedRide: null,
  isLoggedIn: false
};

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('loginForm');
const onlineToggle = document.getElementById('onlineToggle');
const navItems = document.querySelectorAll('.nav-item');
const screens = document.querySelectorAll('.screen');
const rideModal = document.getElementById('rideModal');
const toast = document.getElementById('toast');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  // Ensure proper initial state
  appContainer.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginScreen.classList.add('active');
  
  // Populate dynamic content
  populateAvailableRides();
  populateRidesScreen();
  populateHistory();
  updateStats();
}

function setupEventListeners() {
  // Login form
  loginForm.addEventListener('submit', handleLogin);
  
  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const screen = item.getAttribute('data-screen');
      switchScreen(screen);
      updateNavigation(item);
    });
  });
  
  // Online toggle
  onlineToggle.addEventListener('change', handleOnlineToggle);
  
  // Modal close
  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Modal background click
  rideModal.addEventListener('click', (e) => {
    if (e.target === rideModal) {
      closeModal();
    }
  });
  
  // Ride action buttons
  document.getElementById('acceptRide').addEventListener('click', () => acceptRide());
  document.getElementById('rejectRide').addEventListener('click', () => rejectRide());
  
  // Filter buttons
  setupFilterButtons();
  
  // Profile actions
  setupProfileActions();
  
  // Withdraw button
  const withdrawBtn = document.querySelector('.withdraw-btn');
  if (withdrawBtn) {
    withdrawBtn.addEventListener('click', handleWithdraw);
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Entrando...';
  submitBtn.disabled = true;
  
  // Simulate login process
  setTimeout(() => {
    // Hide login screen and show app
    loginScreen.classList.remove('active');
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    // Set logged in state
    appState.isLoggedIn = true;
    
    // Ensure dashboard is the active screen
    switchScreen('dashboard');
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Show success message
    setTimeout(() => {
      showToast('Login realizado com sucesso!');
    }, 300);
    
  }, 1500);
}

function handleOnlineToggle() {
  appState.isOnline = onlineToggle.checked;
  
  const statusText = document.getElementById('searchStatus');
  if (appState.isOnline) {
    showToast('Você está online! Procurando corridas...');
    if (statusText) {
      statusText.textContent = 'Procurando corridas...';
    }
  } else {
    showToast('Você está offline');
    if (statusText) {
      statusText.textContent = 'Offline - Ative para receber corridas';
    }
  }
}

function switchScreen(screenName) {
  // Hide all screens in app container
  const appScreens = document.querySelectorAll('#app-container .screen');
  appScreens.forEach(screen => {
    screen.classList.remove('active');
    screen.classList.add('hidden');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(`${screenName}-screen`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
    appState.currentScreen = screenName;
  }
}

function updateNavigation(activeItem) {
  navItems.forEach(item => item.classList.remove('active'));
  activeItem.classList.add('active');
}

function populateAvailableRides() {
  const ridesList = document.getElementById('availableRidesList');
  if (!ridesList) return;
  
  ridesList.innerHTML = '';
  
  if (appData.availableRides.length === 0) {
    ridesList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">Nenhuma corrida disponível no momento</p>';
    return;
  }
  
  appData.availableRides.forEach(ride => {
    const rideCard = createRideCard(ride);
    ridesList.appendChild(rideCard);
  });
}

function populateRidesScreen() {
  const ridesScreenList = document.getElementById('ridesScreenList');
  if (!ridesScreenList) return;
  
  ridesScreenList.innerHTML = '';
  
  if (appData.availableRides.length === 0) {
    ridesScreenList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">Nenhuma corrida disponível no momento</p>';
    return;
  }
  
  appData.availableRides.forEach(ride => {
    const rideCard = createRideCard(ride, false);
    ridesScreenList.appendChild(rideCard);
  });
}

function createRideCard(ride, showActions = true) {
  const rideCard = document.createElement('div');
  rideCard.className = 'ride-card';
  
  const stars = '⭐'.repeat(Math.floor(ride.passengerRating));
  
  rideCard.innerHTML = `
    <div class="ride-header">
      <div class="ride-route">
        <div class="pickup">📍 ${ride.pickup}</div>
        <div class="destination">🏁 ${ride.destination}</div>
      </div>
      <div class="ride-fare">R$ ${ride.fare.toFixed(2)}</div>
    </div>
    <div class="ride-details">
      <span>📏 ${ride.distance}</span>
      <span>⏱️ ${ride.estimatedTime}</span>
      <span>⭐ ${ride.passengerRating} ${stars}</span>
    </div>
    ${showActions ? `
    <div class="ride-actions">
      <button class="btn btn--reject" onclick="openRideModal('${ride.id}', 'reject')">Recusar</button>
      <button class="btn btn--accept" onclick="openRideModal('${ride.id}', 'accept')">Aceitar</button>
    </div>
    ` : ''}
  `;
  
  return rideCard;
}

function populateHistory() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  if (appData.recentRides.length === 0) {
    historyList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary); padding: 2rem;">Nenhum histórico de corridas</p>';
    return;
  }
  
  appData.recentRides.forEach(ride => {
    const historyItem = createHistoryItem(ride);
    historyList.appendChild(historyItem);
  });
}

function createHistoryItem(ride) {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  
  const stars = '⭐'.repeat(ride.rating);
  const date = new Date(ride.date).toLocaleDateString('pt-BR');
  
  historyItem.innerHTML = `
    <div class="history-header">
      <span class="history-date">${date} - ${ride.time}</span>
      <span class="history-fare">R$ ${ride.fare.toFixed(2)}</span>
    </div>
    <div class="history-route">
      📍 ${ride.pickup} → 🏁 ${ride.destination}
    </div>
    <div class="history-details">
      <span>📏 ${ride.distance}</span>
      <div class="history-rating">
        <span>Avaliação: ${stars} ${ride.rating}</span>
      </div>
    </div>
  `;
  
  return historyItem;
}

function updateStats() {
  // Update stats cards
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length >= 3) {
    statCards[0].querySelector('.stat-value').textContent = `R$ ${appData.stats.todayEarnings.toFixed(2)}`;
    statCards[1].querySelector('.stat-value').textContent = appData.stats.ridesCompleted;
    statCards[2].querySelector('.stat-value').textContent = `${appData.stats.onlineHours}h`;
  }
  
  // Update earnings cards
  const earningCards = document.querySelectorAll('.earning-card');
  if (earningCards.length >= 4) {
    earningCards[0].querySelector('.earning-value').textContent = `R$ ${appData.stats.todayEarnings.toFixed(2)}`;
    earningCards[1].querySelector('.earning-value').textContent = `R$ ${appData.stats.weeklyEarnings.toFixed(2)}`;
    earningCards[2].querySelector('.earning-value').textContent = `R$ ${appData.stats.monthlyEarnings.toFixed(2)}`;
    earningCards[3].querySelector('.earning-value').textContent = `R$ ${appData.stats.totalEarnings.toFixed(2)}`;
  }
}

function openRideModal(rideId, action) {
  const ride = appData.availableRides.find(r => r.id === rideId);
  if (!ride) return;
  
  appState.selectedRide = { ride, action };
  
  const modalBody = document.getElementById('modalBody');
  const stars = '⭐'.repeat(Math.floor(ride.passengerRating));
  
  modalBody.innerHTML = `
    <div class="modal-ride-info">
      <h4>Detalhes da Corrida</h4>
      <div style="margin: 16px 0;">
        <div style="margin-bottom: 8px;"><strong>Origem:</strong> ${ride.pickup}</div>
        <div style="margin-bottom: 8px;"><strong>Destino:</strong> ${ride.destination}</div>
        <div style="margin-bottom: 8px;"><strong>Distância:</strong> ${ride.distance}</div>
        <div style="margin-bottom: 8px;"><strong>Tempo estimado:</strong> ${ride.estimatedTime}</div>
        <div style="margin-bottom: 8px;"><strong>Valor:</strong> R$ ${ride.fare.toFixed(2)}</div>
        <div><strong>Passageiro:</strong> ${stars} ${ride.passengerRating}</div>
      </div>
    </div>
  `;
  
  rideModal.classList.remove('hidden');
}

function closeModal() {
  rideModal.classList.add('hidden');
  appState.selectedRide = null;
}

function acceptRide() {
  if (!appState.selectedRide) return;
  
  const ride = appState.selectedRide.ride;
  showToast(`Corrida aceita! Indo para ${ride.pickup}`);
  
  // Remove ride from available rides
  const rideIndex = appData.availableRides.findIndex(r => r.id === ride.id);
  if (rideIndex > -1) {
    appData.availableRides.splice(rideIndex, 1);
    populateAvailableRides();
    populateRidesScreen();
  }
  
  closeModal();
}

function rejectRide() {
  if (!appState.selectedRide) return;
  
  showToast('Corrida recusada');
  closeModal();
}

function setupFilterButtons() {
  // Ride filters
  const rideFilters = document.querySelectorAll('[data-filter]');
  rideFilters.forEach(filter => {
    filter.addEventListener('click', (e) => {
      // Update active filter
      const parentFilters = e.target.parentElement.querySelectorAll('[data-filter]');
      parentFilters.forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');
      
      // Apply filter (simplified for demo)
      const filterType = e.target.getAttribute('data-filter');
      showToast(`Filtro aplicado: ${filterType}`);
    });
  });
  
  // Period filters
  const periodFilters = document.querySelectorAll('[data-period]');
  periodFilters.forEach(filter => {
    filter.addEventListener('click', (e) => {
      // Update active filter
      const parentFilters = e.target.parentElement.querySelectorAll('[data-period]');
      parentFilters.forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');
      
      // Apply period filter (simplified for demo)
      const period = e.target.getAttribute('data-period');
      showToast(`Período selecionado: ${period}`);
    });
  });
}

function setupProfileActions() {
  // Edit buttons
  const editButtons = document.querySelectorAll('.btn--outline');
  editButtons.forEach(btn => {
    if (btn.textContent.includes('Editar') || btn.textContent.includes('Alterar')) {
      btn.addEventListener('click', (e) => {
        const action = e.target.textContent;
        showToast(`${action} - Funcionalidade em desenvolvimento`);
      });
    }
  });
  
  // Logout button
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Settings button
  const settingsButtons = document.querySelectorAll('.btn--outline');
  settingsButtons.forEach(btn => {
    if (btn.textContent.includes('Configurações')) {
      btn.addEventListener('click', () => {
        showToast('Configurações - Funcionalidade em desenvolvimento');
      });
    }
  });
}

function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    // Hide app and show login
    appContainer.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginScreen.classList.add('active');
    
    // Reset app state
    appState.isOnline = false;
    appState.isLoggedIn = false;
    onlineToggle.checked = false;
    
    // Reset navigation
    navItems.forEach(item => item.classList.remove('active'));
    navItems[0].classList.add('active');
    
    // Show dashboard when logging back in
    switchScreen('dashboard');
    
    showToast('Logout realizado com sucesso');
  }
}

function handleWithdraw() {
  const todayEarnings = appData.stats.todayEarnings;
  if (todayEarnings > 0) {
    if (confirm(`Sacar R$ ${todayEarnings.toFixed(2)}?`)) {
      showToast('Solicitação de saque enviada! O valor será depositado em até 2 dias úteis.');
    }
  } else {
    showToast('Nenhum valor disponível para saque hoje.');
  }
}

function showToast(message) {
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Global functions for inline event handlers
window.openRideModal = openRideModal;

// Simulate real-time updates
setInterval(() => {
  if (appState.isOnline && appState.isLoggedIn && appData.availableRides.length < 5) {
    // Simulate new rides appearing
    const newRides = [
      {
        "id": `R${Date.now()}`,
        "pickup": "Rua Augusta, 123",
        "destination": "Shopping Ibirapuera",
        "distance": "6.2 km",
        "estimatedTime": "12 min",
        "fare": 16.50,
        "passengerRating": 4.5
      },
      {
        "id": `R${Date.now() + 1}`,
        "pickup": "Terminal Tietê",
        "destination": "Zona Sul",
        "distance": "22.1 km",
        "estimatedTime": "35 min",
        "fare": 52.80,
        "passengerRating": 4.8
      }
    ];
    
    if (Math.random() > 0.8) { // 20% chance every interval
      const randomRide = newRides[Math.floor(Math.random() * newRides.length)];
      randomRide.id = `R${Date.now()}`;
      
      appData.availableRides.push(randomRide);
      populateAvailableRides();
      populateRidesScreen();
      
      if (appState.currentScreen === 'dashboard' || appState.currentScreen === 'rides') {
        showToast('Nova corrida disponível!');
      }
    }
  }
}, 15000); // Check every 15 seconds

console.log('DriveHub App initialized successfully!');