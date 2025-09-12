// --- Tabs config ---
const tabsIOS = [
  { id: 'Roblox', name: 'Roblox', csv: './csv/Roblox.csv' }
];

const tabsAndroid = [
  { id: 'Roblox', name: 'Roblox', csv: './csv/Android.csv' }
];

const tabsWindows = [
  { id: 'Roblox', name: 'Roblox', csv: './csv/Windows.csv' }
];

// --- Platform selector ---
function setPlatform(platform, rebuild = true) {
  const iosButton = document.getElementById('platform-ios');
  const androidButton = document.getElementById('platform-android');
  const windowsButton = document.getElementById('platform-windows');

  // сброс подсветки
  [iosButton, androidButton, windowsButton].forEach(btn => {
    if (!btn) return;
    btn.classList.add('bg-gray-700', 'text-gray-300', 'hover:bg-gray-500');
    btn.classList.remove('bg-blue-600', 'text-white', 'hover:bg-blue-700');
  });

  // подсветка выбранной
  let activeBtn = document.getElementById('platform-' + platform.toLowerCase());
  if (activeBtn) {
    activeBtn.classList.remove('bg-gray-700', 'text-gray-300', 'hover:bg-gray-500');
    activeBtn.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
  }

  localStorage.setItem('currentPlatform', platform);
  console.log(`Platform switched to: ${platform}`);

  if (rebuild) {
    document.getElementById('tabs').innerHTML = '';
    document.getElementById('tabsContent').innerHTML = '';
    createTabs();
  }
}

// --- Build tabs depending on platform ---
async function createTabs() {
  const platform = localStorage.getItem('currentPlatform') || 'iOS';

  let tabs;
  if (platform === 'iOS') tabs = tabsIOS;
  else if (platform === 'Android') tabs = tabsAndroid;
  else if (platform === 'Windows') tabs = tabsWindows;

  const tabsContainer = document.getElementById('tabs');
  const tabsContentContainer = document.getElementById('tabsContent');
  tabsContainer.innerHTML = '';
  tabsContentContainer.innerHTML = '';

  for (const [index, tab] of tabs.entries()) {
    const button = document.createElement('button');
    button.id = `btn-tab-${tab.id}`;
    button.className = `tab-button px-4 py-2 ${
      index === 0 ? 'bg-gray-800 border-b-2 border-blue-500 text-white' : 'bg-gray-900 text-gray-400'
    } rounded-t-lg`;
    button.textContent = tab.name;
    button.onclick = () => showTab(`tab-${tab.id}`);
    tabsContainer.appendChild(button);

    const tabDiv = document.createElement('div');
    tabDiv.setAttribute('id', `tab-${tab.id}`);
    tabDiv.classList.add('tab-content');
    if (index !== 0) tabDiv.classList.add('hidden');
    tabsContentContainer.appendChild(tabDiv);

    try {
      const content = await fetch(tab.csv).then(r => {
        if (!r.ok) throw new Error(`Failed to load ${tab.csv}`);
        return r.text();
      });

      if (platform === 'Android')
        tabDiv.innerHTML = generateTableAndroid(content);
      else
        tabDiv.innerHTML = generateTable(content);

    } catch (error) {
      console.error(`Error loading CSV for tab ${tab.id}:`, error);
      tabDiv.innerHTML = `<p class="text-red-500 text-center">Failed to load data.</p>`;
    }
  }
}
