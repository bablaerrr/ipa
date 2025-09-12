// --- Tabs Config ---
const tabsIOS = [
  { id: 'ROBLOX', name: 'Roblox', csv: 'https://github.com/bablaerrr/ipa/raw/refs/heads/main/csv/ROBLOX.csv' }
];
const tabsAndroid = [
  { id: 'ROBLOX', name: 'Roblox', csv: 'https://github.com/bablaerrr/ipa/raw/refs/heads/main/csv/ROBLOX.csv' }
];
const tabsWindows = [
  { id: 'ROBLOX', name: 'Roblox', csv: 'https://github.com/bablaerrr/ipa/raw/refs/heads/main/csv/ROBLOX.csv' }
];

// --- Switch Platform ---
function setPlatform(platform, rebuild = true) {
  ['ios', 'android', 'windows'].forEach(p => {
    const btn = document.getElementById(`platform-${p}`);
    if (!btn) return;
    btn.classList.remove('bg-blue-600', 'text-white');
    btn.classList.add('bg-gray-700');
  });

  const activeBtn = document.getElementById(`platform-${platform.toLowerCase()}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-700');
    activeBtn.classList.add('bg-blue-600', 'text-white');
  }

  localStorage.setItem('currentPlatform', platform);

  if (rebuild) createTabs();
}

// --- Create Tabs ---
async function createTabs() {
  const platform = localStorage.getItem('currentPlatform') || 'iOS';
  let tabs = platform === 'iOS' ? tabsIOS :
             platform === 'Android' ? tabsAndroid : tabsWindows;

  const tabsContainer = document.getElementById('tabs');
  const tabsContentContainer = document.getElementById('tabsContent');
  tabsContainer.innerHTML = '';
  tabsContentContainer.innerHTML = '';

  for (const [index, tab] of tabs.entries()) {
    // Создаём кнопку вкладки
    const button = document.createElement('button');
    button.id = `btn-tab-${tab.id}`;
    button.className = `tab-button px-4 py-2 ${
      index === 0 ? 'bg-gray-800 border-b-2 border-blue-500 text-white' : 'bg-gray-900 text-gray-400'
    } rounded-t-lg`;
    button.textContent = tab.name;
    button.onclick = () => showTab(`tab-${tab.id}`);
    tabsContainer.appendChild(button);

    // Создаём контент вкладки
    const tabDiv = document.createElement('div');
    tabDiv.id = `tab-${tab.id}`;
    tabDiv.classList.add('tab-content');
    if (index !== 0) tabDiv.classList.add('hidden');
    tabsContentContainer.appendChild(tabDiv);

    // Загружаем CSV и формируем таблицу
    try {
      const content = await fetch(tab.csv).then(r => r.text());
      tabDiv.innerHTML = generateTable(content);
    } catch (err) {
      console.error(err);
      tabDiv.innerHTML = `<p class="text-red-500 text-center">Failed to load ${tab.csv}</p>`;
    }
  }
}

// --- Show Tab ---
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');

  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('bg-gray-800', 'border-b-2', 'border-blue-500', 'text-white');
    btn.classList.add('bg-gray-900', 'text-gray-400');
  });
  document.getElementById(`btn-${tabId}`).classList.add('bg-gray-800', 'border-b-2', 'border-blue-500', 'text-white');
}

// --- CSV → Table с кнопками "Скачать" ---
function generateTable(csvText) {
  const rows = csvText.trim().split('\n').map(r => r.split(','));
  if (rows.length < 2) return '<p class="text-center text-gray-400">No data</p>';

  let html = '<div class="overflow-x-auto"><table class="min-w-full bg-gray-800 border border-gray-700">';
  
  // Заголовок
  html += '<thead><tr>';
  rows[0].forEach(h => html += `<th class="px-4 py-2 border-b border-gray-700 text-left">${h}</th>`);
  html += '</tr></thead><tbody>';

  // Регулярка д
