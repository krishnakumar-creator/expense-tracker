/**
 * DAILY COMMUTE & EXPENSE TRACKER
 * Comprehensive logic for tracking Travel (Rapido, Auto, Bus, Train) & Food/Snacks
 */

// ==========================================
// 1. CONFIGURATION & CATEGORY METADATA
// ==========================================
const CATEGORIES = {
  rapido: {
    id: 'rapido',
    name: 'Rapido',
    icon: '🛵',
    group: 'travel',
    color: '#f59e0b',
    badgeClass: 'badge-rapido',
    defaultAmt: 60,
    quickNote: 'Bike taxi commute'
  },
  auto: {
    id: 'auto',
    name: 'Auto Rickshaw',
    icon: '🛺',
    group: 'travel',
    color: '#10b981',
    badgeClass: 'badge-auto',
    defaultAmt: 80,
    quickNote: 'Auto ride'
  },
  bus: {
    id: 'bus',
    name: 'Bus',
    icon: '🚌',
    group: 'travel',
    color: '#38bdf8',
    badgeClass: 'badge-bus',
    defaultAmt: 25,
    quickNote: 'Bus ticket / pass'
  },
  train: {
    id: 'train',
    name: 'Train / Metro',
    icon: '🚆',
    group: 'travel',
    color: '#a855f7',
    badgeClass: 'badge-train',
    defaultAmt: 35,
    quickNote: 'Metro smart card / Train'
  },
  tea: {
    id: 'tea',
    name: 'Tea & Snacks',
    icon: '☕',
    group: 'food',
    color: '#fb923c',
    badgeClass: 'badge-tea',
    defaultAmt: 20,
    quickNote: 'Morning chai & snacks'
  },
  food: {
    id: 'food',
    name: 'Lunch & Food',
    icon: '🍱',
    group: 'food',
    color: '#f43f5e',
    badgeClass: 'badge-food',
    defaultAmt: 120,
    quickNote: 'Afternoon lunch'
  },
  fuel: {
    id: 'fuel',
    name: 'Fuel / Petrol',
    icon: '⛽',
    group: 'travel',
    color: '#ef4444',
    badgeClass: 'badge-fuel',
    defaultAmt: 250,
    quickNote: 'Petrol refill'
  },
  groceries: {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    group: 'other',
    color: '#10b981',
    badgeClass: 'badge-groceries',
    defaultAmt: 300,
    quickNote: 'Daily essentials'
  },
  bills: {
    id: 'bills',
    name: 'Recharge & Bills',
    icon: '📱',
    group: 'other',
    color: '#3b82f6',
    badgeClass: 'badge-bills',
    defaultAmt: 299,
    quickNote: 'Mobile / Wi-Fi recharge'
  },
  other: {
    id: 'other',
    name: 'Other Expense',
    icon: '✨',
    group: 'other',
    color: '#64748b',
    badgeClass: 'badge-other',
    defaultAmt: 100,
    quickNote: 'General expense'
  }
};

function getStorageKey() {
  const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : null;
  return user ? `dailyspends_data_${user.id}` : 'dailyspends_data_v1';
}
function getSettingsKey() {
  const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : null;
  return user ? `dailyspends_settings_${user.id}` : 'dailyspends_settings_v1';
}

// ==========================================
// 2. APPLICATION STATE
// ==========================================
let state = {
  expenses: [],
  settings: {
    currency: '₹',
    budget: 0,
    theme: 'dark'
  },
  currentYear: 2026,
  currentMonth: 9, // 0-indexed: 9 = October
  activeTab: 'tab-list',
  categoryFilter: 'all',
  searchQuery: '',
  modalSelectedCategory: 'rapido',
  modalSelectedPayment: 'UPI',
  editingExpenseId: null
};

// Initialize Current Date
const today = new Date();
state.currentYear = today.getFullYear();
state.currentMonth = today.getMonth();

// ==========================================
// 3. SAMPLE DEMO COMMUTE DATA GENERATOR
// ==========================================
function generateDemoData() {
  return [];
}

// ==========================================
// 4. STORAGE & INITIALIZATION
// ==========================================
async function loadStoredData() {
  try {
    const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : null;
    let rawData = localStorage.getItem(getStorageKey());
    if (rawData) {
      state.expenses = JSON.parse(rawData);
    } else {
      state.expenses = [];
      saveExpensesToStorage();
    }

    const rawSettings = localStorage.getItem(getSettingsKey()) || localStorage.getItem('dailyspends_settings_v1');
    if (rawSettings) {
      state.settings = { ...state.settings, ...JSON.parse(rawSettings) };
    }

    // Sync with Cloud Firestore if available
    if (window.AppDB && window.AppDB.isCloudActive() && user) {
      try {
        const cloudExpenses = await window.AppDB.loadExpenses(user.id);
        if (cloudExpenses && cloudExpenses.length > 0) {
          state.expenses = cloudExpenses;
          refreshAllViews();
        } else if (state.expenses && state.expenses.length > 0) {
          window.AppDB.batchSaveExpenses(user.id, state.expenses);
        }

        const cloudSettings = await window.AppDB.loadSettings(user.id);
        if (cloudSettings) {
          state.settings = { ...state.settings, ...cloudSettings };
          applySettings();
          refreshAllViews();
        }

        window.AppDB.subscribeExpenses(user.id, (updated) => {
          if (Array.isArray(updated) && updated.length > 0) {
            state.expenses = updated;
            refreshAllViews();
          }
        });
      } catch (cloudErr) {
        console.warn('Cloud DB sync notice:', cloudErr);
      }
    }
  } catch (err) {
    console.error('Failed to load storage:', err);
    state.expenses = generateDemoData();
  }
}

function saveExpensesToStorage() {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(state.expenses));
    const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : null;
    if (window.AppDB && window.AppDB.isCloudActive() && user) {
      window.AppDB.batchSaveExpenses(user.id, state.expenses);
    }
  } catch (err) {
    console.error('Failed to save expenses:', err);
  }
}

function saveSettingsToStorage() {
  try {
    localStorage.setItem(getSettingsKey(), JSON.stringify(state.settings));
    const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : null;
    if (window.AppDB && window.AppDB.isCloudActive() && user) {
      window.AppDB.saveSettings(user.id, state.settings);
    }
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// ==========================================
// 5. DATE & FORMATTING HELPERS
// ==========================================
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return `${state.settings.currency}${num.toLocaleString('en-IN')}`;
}

function getFormattedDate(dateObj) {
  const d = dateObj || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getFormattedTime(dateObj) {
  const d = dateObj || new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatGroupDateHeader(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const nowDate = new Date();
  
  const targetMidnight = new Date(y, m - 1, d).setHours(0,0,0,0);
  const nowMidnight = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).setHours(0,0,0,0);
  const diffDays = Math.round((nowMidnight - targetMidnight) / (1000 * 60 * 60 * 24));

  const monthShort = MONTH_NAMES[m - 1].substring(0, 3);

  if (diffDays === 0) {
    return `Today • ${d} ${monthShort}`;
  } else if (diffDays === 1) {
    return `Yesterday • ${d} ${monthShort}`;
  } else {
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][targetDate.getDay()];
    return `${dayName}, ${d} ${monthShort} ${y}`;
  }
}

// ==========================================
// 6. FILTERING & MONTHLY AGGREGATIONS
// ==========================================
function getExpensesForCurrentMonth() {
  const targetMonthPrefix = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}`;
  return state.expenses.filter(item => item.date.startsWith(targetMonthPrefix));
}

function getFilteredExpenses() {
  let list = getExpensesForCurrentMonth();

  // Category filter
  if (state.categoryFilter !== 'all') {
    if (state.categoryFilter === 'travel') {
      list = list.filter(item => {
        const cat = CATEGORIES[item.category];
        return cat && cat.group === 'travel';
      });
    } else {
      list = list.filter(item => item.category === state.categoryFilter);
    }
  }

  // Search filter
  if (state.searchQuery.trim()) {
    const query = state.searchQuery.toLowerCase().trim();
    list = list.filter(item => {
      const cat = CATEGORIES[item.category];
      const catName = cat ? cat.name.toLowerCase() : '';
      const note = (item.note || '').toLowerCase();
      const mode = (item.paymentMode || '').toLowerCase();
      return catName.includes(query) || note.includes(query) || mode.includes(query);
    });
  }

  // Sort descending by date and time
  return list.sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return (b.time || '').localeCompare(a.time || '');
  });
}

function calculateMonthStats() {
  const monthItems = getExpensesForCurrentMonth();

  let totalSpent = 0;
  let travelSpent = 0;
  let travelCount = 0;
  let foodSpent = 0;
  let foodCount = 0;
  let otherSpent = 0;

  const commuteStats = {
    rapido: { count: 0, total: 0 },
    auto: { count: 0, total: 0 },
    bus: { count: 0, total: 0 },
    train: { count: 0, total: 0 }
  };

  const foodStats = {
    tea: { count: 0, total: 0 },
    food: { count: 0, total: 0 }
  };

  const categoryTotals = {};
  for (const key of Object.keys(CATEGORIES)) {
    categoryTotals[key] = 0;
  }

  // Daily spend map
  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  const dailySpend = new Array(daysInMonth + 1).fill(0);

  monthItems.forEach(item => {
    const amt = Number(item.amount) || 0;
    totalSpent += amt;

    const cat = CATEGORIES[item.category] || CATEGORIES.other;
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amt;

    if (cat.group === 'travel') {
      travelSpent += amt;
      travelCount += 1;
      if (commuteStats[item.category]) {
        commuteStats[item.category].count += 1;
        commuteStats[item.category].total += amt;
      }
    } else if (cat.group === 'food') {
      foodSpent += amt;
      foodCount += 1;
      if (foodStats[item.category]) {
        foodStats[item.category].count += 1;
        foodStats[item.category].total += amt;
      }
    } else {
      otherSpent += amt;
    }

    const dayNum = parseInt(item.date.split('-')[2], 10);
    if (dayNum >= 1 && dayNum <= daysInMonth) {
      dailySpend[dayNum] += amt;
    }
  });

  return {
    totalSpent,
    txCount: monthItems.length,
    travelSpent,
    travelCount,
    foodSpent,
    foodCount,
    otherSpent,
    commuteStats,
    foodStats,
    categoryTotals,
    dailySpend,
    daysInMonth
  };
}

// ==========================================
// 7. UI RENDERING
// ==========================================
function updateMonthDisplay() {
  const monthName = MONTH_NAMES[state.currentMonth];
  const label = `${monthName} ${state.currentYear}`;
  document.getElementById('currentMonthLabel').textContent = label;
  document.getElementById('summaryMonthName').textContent = monthName;

  // Show "This Month" jump button if not on current real month
  const now = new Date();
  const isCurrentRealMonth = (state.currentYear === now.getFullYear() && state.currentMonth === now.getMonth());
  document.getElementById('jumpCurrentMonthBtn').style.display = isCurrentRealMonth ? 'none' : 'inline-block';
}

function renderOverviewCards() {
  const stats = calculateMonthStats();
  const budget = Number(state.settings.budget) || 0;

  // Total Card
  document.getElementById('monthlyTotalDisplay').textContent = formatCurrency(stats.totalSpent);
  document.getElementById('totalTxCount').textContent = `${stats.txCount} ${stats.txCount === 1 ? 'expense' : 'expenses'}`;

  const remEl = document.getElementById('budgetRemainingDisplay');
  const progBar = document.getElementById('budgetProgressBar');

  if (budget > 0) {
    document.getElementById('budgetTotalDisplay').textContent = formatCurrency(budget);
    const remaining = budget - stats.totalSpent;
    const percentSpent = Math.min(Math.round((stats.totalSpent / budget) * 100), 100);
    progBar.style.width = `${percentSpent}%`;

    if (remaining >= 0) {
      remEl.textContent = `${formatCurrency(remaining)} left`;
      if (percentSpent > 80) {
        remEl.className = 'budget-rem-warning';
        progBar.className = 'progress-bar-fill warning';
      } else {
        remEl.className = 'budget-rem-positive';
        progBar.className = 'progress-bar-fill';
      }
    } else {
      remEl.textContent = `${formatCurrency(Math.abs(remaining))} exceeded`;
      remEl.className = 'budget-rem-exceeded';
      progBar.className = 'progress-bar-fill exceeded';
    }
  } else {
    document.getElementById('budgetTotalDisplay').textContent = 'Not set';
    remEl.textContent = 'Set in Settings';
    remEl.className = 'budget-rem-neutral';
    progBar.style.width = '0%';
  }

  // Commute Card
  document.getElementById('travelTotalDisplay').textContent = formatCurrency(stats.travelSpent);
  document.getElementById('travelTripsCount').textContent = `${stats.travelCount} trips/rides logged this month`;
  document.getElementById('valRapido').textContent = formatCurrency(stats.commuteStats.rapido.total);
  document.getElementById('valAuto').textContent = formatCurrency(stats.commuteStats.auto.total);
  document.getElementById('valBus').textContent = formatCurrency(stats.commuteStats.bus.total);
  document.getElementById('valTrain').textContent = formatCurrency(stats.commuteStats.train.total);

  // Food Card
  document.getElementById('foodTotalDisplay').textContent = formatCurrency(stats.foodSpent);
  document.getElementById('foodItemsCount').textContent = `${stats.foodCount} food & snacks logged`;
  document.getElementById('valTea').textContent = formatCurrency(stats.foodStats.tea.total);
  document.getElementById('valFood').textContent = formatCurrency(stats.foodStats.food.total);
}

function renderExpensesList() {
  const container = document.getElementById('expensesListContainer');
  const items = getFilteredExpenses();

  if (items.length === 0) {
    const isFiltered = state.categoryFilter !== 'all' || state.searchQuery.trim() !== '';
    container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-state-icon">${isFiltered ? '🔍' : '🛵'}</div>
        <div class="empty-state-title">${isFiltered ? 'No matching expenses' : 'No expenses for this month'}</div>
        <p class="empty-state-desc">
          ${isFiltered 
            ? 'Try clearing the search or category filter to view all items.' 
            : 'Tap any quick-add icon above or the "+ Add Expense" button to log your first commute or food expense.'}
        </p>
        ${!isFiltered ? `<button class="btn btn-primary" onclick="openExpenseModal('rapido')">+ Log First Expense</button>` : ''}
      </div>
    `;
    return;
  }

  // Group items by date
  const groups = {};
  items.forEach(item => {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  });

  let html = '';
  for (const dateKey of Object.keys(groups)) {
    const groupItems = groups[dateKey];
    const groupTotal = groupItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    html += `
      <div class="date-group">
        <div class="date-group-header">
          <span class="date-group-title">${formatGroupDateHeader(dateKey)}</span>
          <span class="date-group-total">${formatCurrency(groupTotal)}</span>
        </div>
    `;

    groupItems.forEach(item => {
      const cat = CATEGORIES[item.category] || CATEGORIES.other;
      const noteDisplay = item.note ? escapeHtml(item.note) : cat.quickNote;
      const timeDisplay = item.time || '';
      const payDisplay = item.paymentMode || 'UPI';

      html += `
        <div class="expense-item-card" data-id="${item.id}">
          <div class="expense-cat-badge ${cat.badgeClass}">
            ${cat.icon}
          </div>
          <div class="expense-details">
            <div class="expense-row-top">
              <span class="expense-cat-name">${cat.name}</span>
              <span class="expense-amount">${formatCurrency(item.amount)}</span>
            </div>
            <div class="expense-row-sub">
              <span class="expense-route-note">${noteDisplay}</span>
              <span class="expense-pay-chip">${payDisplay}</span>
              ${timeDisplay ? `<span>• ${timeDisplay}</span>` : ''}
            </div>
          </div>
          <div class="expense-actions-menu">
            <button class="card-action-btn edit-btn" onclick="editExpense('${item.id}')" title="Edit Expense" aria-label="Edit">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="card-action-btn del-btn" onclick="deleteExpense('${item.id}')" title="Delete Expense" aria-label="Delete">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  }

  container.innerHTML = html;
}

function renderAnalytics() {
  const stats = calculateMonthStats();
  
  // 1. Commute Mode Breakdown Bars
  const travelTotal = stats.travelSpent;
  document.getElementById('travelTotalAnalytics').textContent = formatCurrency(travelTotal);
  
  const commuteBarsContainer = document.getElementById('travelModeBars');
  const modes = [
    { key: 'rapido', label: 'Rapido (Bike Taxi)', icon: '🛵', color: 'var(--cat-rapido)' },
    { key: 'auto', label: 'Auto Rickshaw', icon: '🛺', color: 'var(--cat-auto)' },
    { key: 'bus', label: 'Bus Commute', icon: '🚌', color: 'var(--cat-bus)' },
    { key: 'train', label: 'Train / Metro', icon: '🚆', color: 'var(--cat-train)' }
  ];

  let barsHtml = '';
  modes.forEach(mode => {
    const data = stats.commuteStats[mode.key];
    const pct = travelTotal > 0 ? Math.round((data.total / travelTotal) * 100) : 0;
    
    barsHtml += `
      <div class="bar-item">
        <div class="bar-item-info">
          <span>${mode.icon} ${mode.label} <small style="color:var(--text-muted)">(${data.count} trips)</small></span>
          <span><strong>${formatCurrency(data.total)}</strong> <small style="color:var(--text-secondary)">(${pct}%)</small></span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%; background-color: ${mode.color};"></div>
        </div>
      </div>
    `;
  });
  commuteBarsContainer.innerHTML = barsHtml;

  // 2. Category Donut Chart
  renderDonutChart(stats);

  // 3. Daily Spending Trend Bar Chart
  renderDailyChart(stats);

  // 4. Commute & Daily Insights
  document.getElementById('insightTotalRides').textContent = stats.travelCount;
  const avgRide = stats.travelCount > 0 ? Math.round(stats.travelSpent / stats.travelCount) : 0;
  document.getElementById('insightAvgRideCost').textContent = formatCurrency(avgRide);
  document.getElementById('insightTeaCount').textContent = `${stats.foodStats.tea.count} cups`;
  document.getElementById('insightFoodCount').textContent = `${stats.foodStats.food.count} meals`;
}

function renderDonutChart(stats) {
  const svg = document.getElementById('donutSvg');
  const legend = document.getElementById('donutLegend');
  document.getElementById('donutCenterAmount').textContent = formatCurrency(stats.totalSpent);

  const activeCategories = [];
  for (const [key, val] of Object.entries(stats.categoryTotals)) {
    if (val > 0) {
      activeCategories.push({
        key,
        amount: val,
        cat: CATEGORIES[key] || CATEGORIES.other
      });
    }
  }

  activeCategories.sort((a, b) => b.amount - a.amount);

  if (activeCategories.length === 0 || stats.totalSpent === 0) {
    svg.innerHTML = `
      <circle cx="60" cy="60" r="44" stroke="rgba(255,255,255,0.1)" stroke-width="12" fill="none"/>
    `;
    legend.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem;">No spending recorded this month</span>`;
    return;
  }

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;
  let circlesHtml = '';
  let legendHtml = '';

  activeCategories.slice(0, 6).forEach(item => {
    const pct = item.amount / stats.totalSpent;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += pct;

    circlesHtml += `
      <circle cx="60" cy="60" r="${radius}" 
        fill="transparent" 
        stroke="${item.cat.color}" 
        stroke-width="13" 
        stroke-dasharray="${strokeDasharray}" 
        stroke-dashoffset="${strokeDashoffset}"
        stroke-linecap="round"
        transform="rotate(-90 60 60)"
        style="transition: stroke-dasharray 0.6s ease;"
      />
    `;

    legendHtml += `
      <div class="legend-row">
        <div class="legend-left">
          <span class="legend-color-dot" style="background:${item.cat.color};"></span>
          <span>${item.cat.icon} ${item.cat.name}</span>
        </div>
        <span class="legend-val">${formatCurrency(item.amount)} (${Math.round(pct * 100)}%)</span>
      </div>
    `;
  });

  svg.innerHTML = circlesHtml;
  legend.innerHTML = legendHtml;
}

function renderDailyChart(stats) {
  const container = document.getElementById('dailyChartContainer');
  const now = new Date();
  const currentDay = (state.currentYear === now.getFullYear() && state.currentMonth === now.getMonth()) ? now.getDate() : -1;

  let maxDaily = 1;
  let totalDailySpend = 0;
  let activeDaysCount = 0;

  for (let day = 1; day <= stats.daysInMonth; day++) {
    const val = stats.dailySpend[day];
    if (val > maxDaily) maxDaily = val;
    if (val > 0) {
      totalDailySpend += val;
      activeDaysCount++;
    }
  }

  const avgDaily = activeDaysCount > 0 ? Math.round(totalDailySpend / activeDaysCount) : 0;
  document.getElementById('avgDailySpend').textContent = `Avg: ${formatCurrency(avgDaily)}/day`;

  let html = '';
  for (let day = 1; day <= stats.daysInMonth; day++) {
    const val = stats.dailySpend[day];
    const pct = Math.max(Math.round((val / maxDaily) * 100), 4);
    const isToday = day === currentDay;

    html += `
      <div class="daily-bar-col" title="Day ${day}: ${formatCurrency(val)}">
        <div class="daily-bar-fill ${isToday ? 'active-day' : ''}" style="height: ${pct}%;"></div>
        <span class="daily-bar-label">${day}</span>
      </div>
    `;
  }
  container.innerHTML = html;
}

// ==========================================
// 8. MODAL / BOTTOM SHEET INTERACTIONS
// ==========================================
function openExpenseModal(category = 'rapido', defaultAmount = null) {
  state.editingExpenseId = null;
  document.getElementById('modalTitle').textContent = 'Log Expense';
  document.getElementById('saveBtnText').textContent = 'Save Expense';
  
  // Set category
  selectModalCategory(category);

  // Set default or cleared amount
  const amtInput = document.getElementById('formAmount');
  if (defaultAmount !== null) {
    amtInput.value = defaultAmount;
  } else {
    amtInput.value = '';
  }

  // Pre-fill route / note
  const cat = CATEGORIES[category] || CATEGORIES.other;
  document.getElementById('formNote').value = '';
  document.getElementById('formNote').placeholder = cat.quickNote || 'e.g. Office to Home';

  // Date default today
  const todayStr = getFormattedDate();
  document.getElementById('formDate').value = todayStr;
  updateDateChipSelection('today');

  // Payment default UPI
  selectPaymentMode('UPI');

  // Display overlay
  const overlay = document.getElementById('expenseModalOverlay');
  overlay.style.display = 'flex';
  
  // Focus amount input
  setTimeout(() => {
    amtInput.focus();
    if (amtInput.select) amtInput.select();
  }, 100);
}

function editExpense(id) {
  const item = state.expenses.find(x => x.id === id);
  if (!item) return;

  state.editingExpenseId = id;
  document.getElementById('modalTitle').textContent = 'Edit Expense';
  document.getElementById('saveBtnText').textContent = 'Update Expense';

  document.getElementById('formAmount').value = item.amount;
  selectModalCategory(item.category);
  document.getElementById('formNote').value = item.note || '';
  document.getElementById('formDate').value = item.date;
  selectPaymentMode(item.paymentMode || 'UPI');

  const todayStr = getFormattedDate();
  if (item.date === todayStr) {
    updateDateChipSelection('today');
  } else {
    updateDateChipSelection(null);
  }

  const overlay = document.getElementById('expenseModalOverlay');
  overlay.style.display = 'flex';
}

function closeExpenseModal() {
  document.getElementById('expenseModalOverlay').style.display = 'none';
  state.editingExpenseId = null;
}

function selectModalCategory(catKey) {
  state.modalSelectedCategory = catKey;
  const options = document.querySelectorAll('.cat-option');
  options.forEach(opt => {
    if (opt.getAttribute('data-cat') === catKey) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });

  const cat = CATEGORIES[catKey];
  if (cat && !document.getElementById('formNote').value) {
    document.getElementById('formNote').placeholder = cat.quickNote;
  }
}

function selectPaymentMode(mode) {
  state.modalSelectedPayment = mode;
  document.querySelectorAll('.pay-chip').forEach(btn => {
    if (btn.getAttribute('data-mode') === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateDateChipSelection(type) {
  const todayBtn = document.getElementById('dateTodayBtn');
  const yestBtn = document.getElementById('dateYesterdayBtn');
  todayBtn.classList.remove('active');
  yestBtn.classList.remove('active');

  if (type === 'today') todayBtn.classList.add('active');
  if (type === 'yesterday') yestBtn.classList.add('active');
}

function saveExpenseFromForm() {
  const amtVal = parseFloat(document.getElementById('formAmount').value);
  if (!amtVal || amtVal <= 0) {
    showToast('⚠️ Please enter a valid expense amount');
    document.getElementById('formAmount').focus();
    return;
  }

  const dateVal = document.getElementById('formDate').value;
  if (!dateVal) {
    showToast('⚠️ Please select a date');
    return;
  }

  const noteVal = document.getElementById('formNote').value.trim();
  const categoryVal = state.modalSelectedCategory || 'other';
  const paymentVal = state.modalSelectedPayment || 'UPI';

  if (state.editingExpenseId) {
    // Update existing
    const index = state.expenses.findIndex(x => x.id === state.editingExpenseId);
    if (index !== -1) {
      state.expenses[index] = {
        ...state.expenses[index],
        amount: amtVal,
        category: categoryVal,
        note: noteVal,
        date: dateVal,
        paymentMode: paymentVal
      };
      showToast('✅ Expense updated successfully');
    }
  } else {
    // Create new
    const newExpense = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      amount: amtVal,
      category: categoryVal,
      note: noteVal,
      date: dateVal,
      time: getFormattedTime(),
      paymentMode: paymentVal,
      createdAt: Date.now()
    };
    state.expenses.unshift(newExpense);
    
    const cat = CATEGORIES[categoryVal] || CATEGORIES.other;
    showToast(`✅ Added ${formatCurrency(amtVal)} for ${cat.name}`);
  }

  saveExpensesToStorage();
  closeExpenseModal();
  refreshAllViews();
}

function deleteExpense(id) {
  if (confirm('Delete this expense entry?')) {
    state.expenses = state.expenses.filter(x => x.id !== id);
    saveExpensesToStorage();
    const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : null;
    if (window.AppDB && window.AppDB.isCloudActive() && user) {
      window.AppDB.deleteExpense(user.id, id);
    }
    refreshAllViews();
    showToast('🗑️ Expense deleted');
  }
}

// ==========================================
// 9. REFRESH & VIEW TOGGLING
// ==========================================
function refreshAllViews() {
  updateMonthDisplay();
  renderOverviewCards();
  renderExpensesList();
  renderAnalytics();
}

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  if (tabId === 'tab-analytics') {
    renderAnalytics();
  }
}

// ==========================================
// 10. BACKUP, EXPORT & IMPORT
// ==========================================
// Data download, export and demo loading removed as requested

// ==========================================
// 11. TOAST & HELPERS
// ==========================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  msgEl.textContent = message;
  toast.style.display = 'flex';

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 2600);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function applySettings() {
  document.body.setAttribute('data-theme', state.settings.theme);
  document.getElementById('formCurrencyPrefix').textContent = state.settings.currency;
  document.getElementById('budgetInput').value = state.settings.budget;

  // Toggle icon
  const isDark = state.settings.theme === 'dark';
  document.querySelector('.theme-icon-dark').style.display = isDark ? 'inline' : 'none';
  document.querySelector('.theme-icon-light').style.display = isDark ? 'none' : 'inline';

  // Currency option buttons
  document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-currency') === state.settings.currency);
  });
}

// ==========================================
// 12. EVENT LISTENERS INITIALIZATION
// ==========================================
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    saveSettingsToStorage();
    applySettings();
  });

  // Month navigation
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    if (state.currentMonth === 0) {
      state.currentMonth = 11;
      state.currentYear -= 1;
    } else {
      state.currentMonth -= 1;
    }
    refreshAllViews();
  });

  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    if (state.currentMonth === 11) {
      state.currentMonth = 0;
      state.currentYear += 1;
    } else {
      state.currentMonth += 1;
    }
    refreshAllViews();
  });

  document.getElementById('jumpCurrentMonthBtn').addEventListener('click', () => {
    const now = new Date();
    state.currentYear = now.getFullYear();
    state.currentMonth = now.getMonth();
    refreshAllViews();
  });

  // Quick 1-Tap Presets
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cat = chip.getAttribute('data-category');
      const defAmt = chip.getAttribute('data-default');
      openExpenseModal(cat, defAmt);
    });
  });

  // Floating Action Button
  document.getElementById('fabAddBtn').addEventListener('click', () => {
    openExpenseModal('rapido');
  });

  // Modal Close
  document.getElementById('closeModalBtn').addEventListener('click', closeExpenseModal);
  document.getElementById('cancelFormBtn').addEventListener('click', closeExpenseModal);
  document.getElementById('expenseModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'expenseModalOverlay') closeExpenseModal();
  });

  // Modal Category options
  document.querySelectorAll('.cat-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const cat = opt.getAttribute('data-cat');
      selectModalCategory(cat);
    });
  });

  // Modal Amount Quick Chips (+10, +20, etc.)
  document.querySelectorAll('.amt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const addAmt = parseFloat(chip.getAttribute('data-amt')) || 0;
      const amtInput = document.getElementById('formAmount');
      const current = parseFloat(amtInput.value) || 0;
      amtInput.value = current + addAmt;
      amtInput.focus();
    });
  });

  // Modal Quick Date Toggles
  document.getElementById('dateTodayBtn').addEventListener('click', () => {
    document.getElementById('formDate').value = getFormattedDate();
    updateDateChipSelection('today');
  });

  document.getElementById('dateYesterdayBtn').addEventListener('click', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    document.getElementById('formDate').value = getFormattedDate(yesterday);
    updateDateChipSelection('yesterday');
  });

  // Modal Payment Modes
  document.querySelectorAll('.pay-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectPaymentMode(chip.getAttribute('data-mode'));
    });
  });

  // Save Expense Button / Form Submit
  document.getElementById('saveExpenseBtn').addEventListener('click', saveExpenseFromForm);
  document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveExpenseFromForm();
  });

  // Tab View Switcher
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Category Filter Chips
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.categoryFilter = btn.getAttribute('data-filter');
      renderExpensesList();
    });
  });

  // Search Input
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderExpensesList();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderExpensesList();
  });

  // Budget save
  document.getElementById('saveBudgetBtn').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('budgetInput').value);
    if (val && val > 0) {
      state.settings.budget = val;
      saveSettingsToStorage();
      renderOverviewCards();
      showToast('🎯 Budget updated!');
    }
  });

  // Currency option buttons
  document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.settings.currency = btn.getAttribute('data-currency');
      saveSettingsToStorage();
      applySettings();
      refreshAllViews();
      showToast(`💱 Currency set to ${state.settings.currency}`);
    });
  });

  // User Profile Dropdown & Session Events
  setupUserProfileEvents();

  // Keyboard Shortcuts (Escape closes modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExpenseModal();
    }
  });
}

// ==========================================
function setupUserProfileEvents() {
  const container = document.getElementById('userProfileMenuContainer');
  const btn = document.getElementById('userProfileBtn');
  const switchAccountBtn = document.getElementById('switchAccountBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (btn && container) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove('open');
      }
    });
  }

  if (switchAccountBtn) {
    switchAccountBtn.addEventListener('click', () => {
      if (window.Auth) {
        window.Auth.logout('login.html');
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (window.Auth) {
        window.Auth.logout('login.html?logout=true');
      } else {
        window.location.href = 'login.html?logout=true';
      }
    });
  }
}

function renderUserProfile() {
  const user = (window.Auth && window.Auth.getCurrentUser) ? window.Auth.getCurrentUser() : {
    name: 'Alex Morgan',
    email: 'alex@dailyspends.app',
    avatar: '🛵',
    commutePref: 'rapido'
  };

  const userAvatarCircle = document.getElementById('userAvatarCircle');
  const userProfileName = document.getElementById('userProfileName');
  const menuUserAvatarCircle = document.getElementById('menuUserAvatarCircle');
  const menuUserName = document.getElementById('menuUserName');
  const menuUserEmail = document.getElementById('menuUserEmail');
  const menuUserCommutePill = document.getElementById('menuUserCommutePill');

  const firstName = user.name ? user.name.split(' ')[0] : 'User';
  const pref = user.commutePref || 'commute';
  const prefFormatted = pref.charAt(0).toUpperCase() + pref.slice(1);

  if (userAvatarCircle) userAvatarCircle.textContent = user.avatar || '🛵';
  if (userProfileName) userProfileName.textContent = firstName;
  if (menuUserAvatarCircle) menuUserAvatarCircle.textContent = user.avatar || '🛵';
  if (menuUserName) menuUserName.textContent = user.name || 'User';
  if (menuUserEmail) menuUserEmail.textContent = user.email || '';
  if (menuUserCommutePill) menuUserCommutePill.textContent = `${user.avatar || '🛵'} ${prefFormatted} Commuter`;

  const menuCloudStatusPill = document.getElementById('menuCloudStatusPill');
  if (menuCloudStatusPill) {
    const isCloud = Boolean(window.AppDB && window.AppDB.isCloudActive());
    if (isCloud) {
      menuCloudStatusPill.textContent = '☁️ Cloud DB Synced';
      menuCloudStatusPill.style.background = 'rgba(16, 185, 129, 0.15)';
      menuCloudStatusPill.style.color = '#10b981';
    } else {
      menuCloudStatusPill.textContent = '💾 Local Mode';
      menuCloudStatusPill.style.background = 'rgba(99, 102, 241, 0.15)';
      menuCloudStatusPill.style.color = 'var(--primary)';
    }
  }
}

// 13. APP STARTUP
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderUserProfile();
  loadStoredData();
  applySettings();
  setupEventListeners();
  refreshAllViews();
});
