// ATM System State
let currentUser = null;
let isAuthenticated = false;
let currentAction = null;
let tempAmount = '';

// Mock user data
const users = {
  '1234': {
    pin: '1234',
    name: 'Noverson Gabito',
    balance: 28450.75,
    transactions: [
      { type: 'Deposit', amount: 5000, date: '2025-05-01', newBalance: 28450.75 },
      { type: 'Withdrawal', amount: 2000, date: '2025-04-28', newBalance: 23450.75 },
      { type: 'Deposit', amount: 15000, date: '2025-04-20', newBalance: 25450.75 },
      { type: 'Withdrawal', amount: 500, date: '2025-04-15', newBalance: 10450.75 }
    ]
  }
};

// DOM Elements
const screenContent = document.getElementById('screenContent');
const logoutBtn = document.getElementById('logoutBtn');
const backBtn = document.getElementById('backBtn');
const pinInput = document.getElementById('pinInput');
const unlockBtn = document.getElementById('unlockBtn');

// Helper: Update screen
function updateScreen(html) {
  screenContent.innerHTML = html;
}

// Helper: Format currency
function formatCurrency(amount) {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2 });
}

// Dashboard View
function showDashboard() {
  const user = users[currentUser.pin];
  const html = `
    <div class="dashboard">
      <h3>Welcome, ${user.name}</h3>
      <div class="balance-display">
        <small>Current Balance</small>
        <div class="balance-amount">${formatCurrency(user.balance)}</div>
      </div>
      <div class="action-grid">
        <button class="dash-btn" onclick="showWithdraw()"><i class="fas fa-money-bill-wave"></i> Withdraw</button>
        <button class="dash-btn" onclick="showDeposit()"><i class="fas fa-plus-circle"></i> Deposit</button>
        <button class="dash-btn" onclick="showBalance()"><i class="fas fa-chart-line"></i> Balance</button>
        <button class="dash-btn" onclick="showHistory()"><i class="fas fa-history"></i> History</button>
      </div>
    </div>
  `;
  updateScreen(html);
  logoutBtn.style.display = 'inline-flex';
  backBtn.style.display = 'inline-flex';
}

// Show Withdraw Screen
window.showWithdraw = function() {
  currentAction = 'withdraw';
  const html = `
    <div>
      <h3>Withdrawal</h3>
      <p>Enter amount to withdraw:</p>
      <input type="number" id="amountInput" class="amount-input" placeholder="0.00" step="500">
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="atm-btn-primary" onclick="confirmWithdraw()">Confirm</button>
        <button class="btn-outline" onclick="showDashboard()">Cancel</button>
      </div>
    </div>
  `;
  updateScreen(html);
};

// Show Deposit Screen
window.showDeposit = function() {
  currentAction = 'deposit';
  const html = `
    <div>
      <h3>Deposit</h3>
      <p>Enter amount to deposit:</p>
      <input type="number" id="amountInput" class="amount-input" placeholder="0.00" step="100">
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="atm-btn-primary" onclick="confirmDeposit()">Confirm</button>
        <button class="btn-outline" onclick="showDashboard()">Cancel</button>
      </div>
    </div>
  `;
  updateScreen(html);
};

// Show Balance
window.showBalance = function() {
  const user = users[currentUser.pin];
  const html = `
    <div>
      <h3>Balance Inquiry</h3>
      <div class="balance-display">
        <div class="balance-amount">${formatCurrency(user.balance)}</div>
      </div>
      <button class="atm-btn-primary" onclick="showDashboard()">Back to Menu</button>
    </div>
  `;
  updateScreen(html);
};

// Show Transaction History
window.showHistory = function() {
  const user = users[currentUser.pin];
  let historyHtml = '<div><h3>Transaction History</h3><div class="transaction-history">';
  user.transactions.slice().reverse().forEach(t => {
    const icon = t.type === 'Deposit' ? '💰' : '💸';
    historyHtml += `
      <div class="history-item">
        ${icon} <strong>${t.type}</strong> - ${formatCurrency(t.amount)}<br>
        <small>${t.date} | Balance: ${formatCurrency(t.newBalance)}</small>
      </div>
    `;
  });
  historyHtml += '</div><button class="atm-btn-primary" style="margin-top: 1rem;" onclick="showDashboard()">Back</button></div>';
  updateScreen(historyHtml);
};

// Confirm Withdraw
window.confirmWithdraw = function() {
  const amountInput = document.getElementById('amountInput');
  const amount = parseFloat(amountInput.value);
  const user = users[currentUser.pin];
  
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  if (amount % 100 !== 0 && amount % 500 !== 0) {
    alert('Please enter amount in multiples of ₱100 or ₱500');
    return;
  }
  if (amount > user.balance) {
    alert('Insufficient balance!');
    return;
  }
  if (amount > 20000) {
    alert('Maximum withdrawal per transaction is ₱20,000');
    return;
  }
  
  user.balance -= amount;
  user.transactions.push({
    type: 'Withdrawal',
    amount: amount,
    date: new Date().toISOString().split('T')[0],
    newBalance: user.balance
  });
  
  alert(`Successfully withdrew ${formatCurrency(amount)}!\nNew balance: ${formatCurrency(user.balance)}`);
  showDashboard();
};

// Confirm Deposit
window.confirmDeposit = function() {
  const amountInput = document.getElementById('amountInput');
  const amount = parseFloat(amountInput.value);
  const user = users[currentUser.pin];
  
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }
  if (amount > 50000) {
    alert('Maximum deposit per transaction is ₱50,000');
    return;
  }
  
  user.balance += amount;
  user.transactions.push({
    type: 'Deposit',
    amount: amount,
    date: new Date().toISOString().split('T')[0],
    newBalance: user.balance
  });
  
  alert(`Successfully deposited ${formatCurrency(amount)}!\nNew balance: ${formatCurrency(user.balance)}`);
  showDashboard();
};

// Login Function
function login(pin) {
  if (users[pin]) {
    currentUser = { pin: pin };
    isAuthenticated = true;
    showDashboard();
  } else {
    alert('Invalid PIN. Please try again.');
    document.getElementById('pinInput').value = '';
  }
}

// Logout
function logout() {
  isAuthenticated = false;
  currentUser = null;
  currentAction = null;
  const html = `
    <div class="welcome-screen">
      <i class="fas fa-credit-card" style="font-size: 3rem; color: #2c7da0;"></i>
      <h2>Welcome to Nova Bank</h2>
      <p>Please enter your 4-digit PIN to continue</p>
      <div class="pin-input-area">
        <input type="password" id="pinInput" maxlength="4" placeholder="****" class="pin-field">
        <button id="unlockBtn" class="atm-btn-primary">Unlock <i class="fas fa-arrow-right"></i></button>
      </div>
      <p class="demo-hint"><i class="fas fa-info-circle"></i> Demo PIN: <strong>1234</strong></p>
    </div>
  `;
  updateScreen(html);
  logoutBtn.style.display = 'none';
  backBtn.style.display = 'none';
  
  // Reattach event listeners
  document.getElementById('pinInput').addEventListener('input', (e) => {
    if (e.target.value.length === 4) login(e.target.value);
  });
  document.getElementById('unlockBtn').addEventListener('click', () => {
    const pin = document.getElementById('pinInput').value;
    if (pin.length === 4) login(pin);
    else alert('Please enter 4-digit PIN');
  });
}

// Keypad functionality
document.querySelectorAll('.key-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const pinField = document.getElementById('pinInput');
    if (pinField && pinField.style.display !== 'none') {
      const value = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');
      if (value && pinField.value.length < 4) {
        pinField.value += value;
      }
      if (action === 'clear') {
        pinField.value = '';
      }
      if (action === 'enter' && pinField.value.length === 4) {
        login(pinField.value);
      }
    }
  });
});

// Back button
backBtn.addEventListener('click', () => {
  if (isAuthenticated) {
    showDashboard();
  }
});

// Logout button
logoutBtn.addEventListener('click', logout);

// Initial pin input handler
if (pinInput && unlockBtn) {
  pinInput.addEventListener('input', (e) => {
    if (e.target.value.length === 4) login(e.target.value);
  });
  unlockBtn.addEventListener('click', () => {
    if (pinInput.value.length === 4) login(pinInput.value);
    else alert('Please enter 4-digit PIN');
  });
}
