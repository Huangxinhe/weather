// DOM 元素
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const currentEl = document.getElementById('current');
const forecastEl = document.getElementById('forecast');
const hourlySectionEl = document.getElementById('hourlySection');
const hourlyEl = document.getElementById('hourly');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const useLocationBtn = document.getElementById('useLocation');
const themeToggle = document.getElementById('themeToggle');

const cityNameEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const conditionEl = document.getElementById('condition');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const feelsLikeEl = document.getElementById('feelsLike');

// ========== SVG 天气图标 ==========
const ICONS = {
  sun: `<circle cx="12" cy="12" r="4.5" fill="#FFD93D"/><g stroke="#FFD93D" stroke-width="1.6" stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.6" y1="4.6" x2="6.4" y2="6.4"/><line x1="17.6" y1="17.6" x2="19.4" y2="19.4"/><line x1="4.6" y1="19.4" x2="6.4" y2="17.6"/><line x1="17.6" y1="6.4" x2="19.4" y2="4.6"/></g>`,
  moon: `<path d="M20 13.5A8.5 8.5 0 1 1 10.5 4 6.8 6.8 0 0 0 20 13.5z" fill="#FFE9A8"/>`,
  cloud: `<path d="M7 18a4.5 4.5 0 1 1 .8-8.93A5.5 5.5 0 0 1 18.4 10.7 4 4 0 0 1 17.5 18z" fill="#EDEDED"/>`,
  sunCloud: `<circle cx="8" cy="8" r="3.2" fill="#FFD93D"/><g stroke="#FFD93D" stroke-width="1.3" stroke-linecap="round"><line x1="8" y1="2.2" x2="8" y2="3.8"/><line x1="2.2" y1="8" x2="3.8" y2="8"/><line x1="3.9" y1="3.9" x2="5" y2="5"/><line x1="3.9" y1="12.1" x2="5" y2="11"/></g><path d="M11 19a3.8 3.8 0 1 1 .7-7.53A4.6 4.6 0 0 1 20.6 12.9 3.4 3.4 0 0 1 19.8 19z" fill="#FFFFFF"/>`,
  moonCloud: `<path d="M13 9.5A6 6 0 0 1 7 3.6 6 6 0 1 0 13 9.5z" fill="#FFE9A8" transform="translate(0,1) scale(0.85)"/><path d="M11 19a3.8 3.8 0 1 1 .7-7.53A4.6 4.6 0 0 1 20.6 12.9 3.4 3.4 0 0 1 19.8 19z" fill="#EDEDED"/>`,
  rain: `<path d="M7 15a4.5 4.5 0 1 1 .8-8.93A5.5 5.5 0 0 1 18.4 7.7 4 4 0 0 1 17.5 15z" fill="#EDEDED"/><g stroke="#7EC8FF" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="17.5" x2="7" y2="20.5"/><line x1="12.5" y1="17.5" x2="11.5" y2="20.5"/><line x1="17" y1="17.5" x2="16" y2="20.5"/></g>`,
  snow: `<path d="M7 15a4.5 4.5 0 1 1 .8-8.93A5.5 5.5 0 0 1 18.4 7.7 4 4 0 0 1 17.5 15z" fill="#EDEDED"/><g fill="#FFFFFF"><circle cx="8" cy="18" r="1.4"/><circle cx="12.5" cy="20" r="1.4"/><circle cx="16.5" cy="17.5" r="1.4"/></g>`,
  thunder: `<path d="M7 15a4.5 4.5 0 1 1 .8-8.93A5.5 5.5 0 0 1 18.4 7.7 4 4 0 0 1 17.5 15z" fill="#D8D8D8"/><polygon points="13,15 9.5,20 12,20 10.5,23.5 15,18 12.3,18" fill="#FFD93D"/>`,
  fog: `<path d="M7 13a4.5 4.5 0 1 1 .8-8.93A5.5 5.5 0 0 1 18.4 5.7 4 4 0 0 1 17.5 13z" fill="#EDEDED"/><g stroke="#CFCFCF" stroke-width="1.6" stroke-linecap="round"><line x1="5" y1="16.5" x2="19" y2="16.5"/><line x1="7" y1="19.5" x2="17" y2="19.5"/><line x1="9" y1="22.3" x2="15" y2="22.3"/></g>`
};

function icon(name, cls) {
  return `<svg class="${cls || 'weather-icon'}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ICONS[name]}</svg>`;
}

// WMO 天气代码 -> [中文描述, 白天图标, 夜间图标]
const WMO_MAP = {
  0: ['晴', 'sun', 'moon'],
  1: ['大致晴', 'sun', 'moon'],
  2: ['局部多云', 'sunCloud', 'moonCloud'],
  3: ['阴', 'cloud', 'cloud'],
  45: ['雾', 'fog', 'fog'], 48: ['冻雾', 'fog', 'fog'],
  51: ['毛毛雨', 'rain', 'rain'], 53: ['毛毛雨', 'rain', 'rain'], 55: ['毛毛雨', 'rain', 'rain'],
  56: ['冻毛毛雨', 'rain', 'rain'], 57: ['冻毛毛雨', 'rain', 'rain'],
  61: ['小雨', 'rain', 'rain'], 63: ['中雨', 'rain', 'rain'], 65: ['大雨', 'rain', 'rain'],
  66: ['冻雨', 'rain', 'rain'], 67: ['冻雨', 'rain', 'rain'],
  71: ['小雪', 'snow', 'snow'], 73: ['中雪', 'snow', 'snow'], 75: ['大雪', 'snow', 'snow'], 77: ['雪粒', 'snow', 'snow'],
  80: ['阵雨', 'rain', 'rain'], 81: ['强阵雨', 'rain', 'rain'], 82: ['暴雨', 'rain', 'rain'],
  85: ['阵雪', 'snow', 'snow'], 86: ['强阵雪', 'snow', 'snow'],
  95: ['雷暴', 'thunder', 'thunder'], 96: ['雷暴伴冰雹', 'thunder', 'thunder'], 99: ['雷暴伴冰雹', 'thunder', 'thunder']
};

function wmoInfo(code, isDay) {
  const info = WMO_MAP[code] || ['多云', 'sunCloud', 'moonCloud'];
  return { text: info[0], iconName: isDay ? info[1] : info[2] };
}

// ========== 工具函数 ==========
function showLoading() {
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  currentEl.classList.add('hidden');
  hourlySectionEl.classList.add('hidden');
  forecastEl.innerHTML = '';
}

function hideLoading() { loadingEl.classList.add('hidden'); }

function showError(msg) {
  hideLoading();
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

function getWeekday(dayOffset) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  if (dayOffset === -1) return '昨天';
  if (dayOffset === 0) return '今天';
  if (dayOffset === 1) return '明天';
  return days[d.getDay()];
}

// ========== 天气数据获取 ==========
// 一次 Open-Meteo 调用同时获取昨天、未来3天、逐小时数据
async function fetchOpenMeteo(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
    + `&past_days=1&forecast_days=3&timezone=auto`
    + `&daily=weather_code,temperature_2m_max,temperature_2m_min`
    + `&hourly=temperature_2m,weather_code,is_day`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Open-Meteo 请求失败');
  return resp.json();
}

async function fetchWeather(query) {
  showLoading();
  try {
    const wttrUrl = `https://wttr.in/${encodeURIComponent(query)}?format=j1&lang=zh`;
    const resp = await fetch(wttrUrl);
    if (!resp.ok) throw new Error('网络请求失败');
    const data = await resp.json();

    const lat = parseFloat(data.nearest_area?.[0]?.latitude);
    const lon = parseFloat(data.nearest_area?.[0]?.longitude);
    let om = null;
    if (!isNaN(lat) && !isNaN(lon)) {
      try { om = await fetchOpenMeteo(lat, lon); }
      catch (e) { console.error('Open-Meteo 获取失败，降级显示', e); }
    }
    renderWeather(data, om);
    hideLoading();
  } catch (err) {
    showError('获取天气失败：' + err.message);
  }
}

// ========== 渲染 ==========
function renderWeather(data, om) {
  const current = data.current_condition[0];

  const nearestArea = data.nearest_area[0];
  const city = nearestArea.areaName?.[0]?.value
            || nearestArea.region?.[0]?.value
            || '当前位置';

  cityNameEl.textContent = city;
  tempEl.textContent = `${current.temp_C}°C`;
  const condText = current.lang_zh?.[0]?.value
                || current.weatherDesc?.[0]?.value || '';
  conditionEl.textContent = condText;
  windEl.textContent = `${current.windspeedKmph} km/h ${current.winddir16Point}`;
  humidityEl.textContent = `${current.humidity}%`;
  feelsLikeEl.textContent = `${current.FeelsLikeC}°C`;

  currentEl.classList.remove('hidden');

  // 找当前小时在 Open-Meteo hourly 中的索引（用于当前天气图标 + 逐小时起点）
  let nowIdx = 0;
  if (om) {
    const nowKey = new Date().toISOString().slice(0, 13); // 例如 2026-10-03T17
    nowIdx = om.hourly.time.findIndex(t => t.slice(0, 13) === nowKey);
    if (nowIdx < 0) nowIdx = 0;
  }

  // 当前天气大图标（来自 Open-Meteo 当前小时）
  if (om) {
    const code = om.hourly.weather_code[nowIdx];
    const isDay = om.hourly.is_day[nowIdx] === 1;
    const info = wmoInfo(code, isDay);
    conditionEl.innerHTML = `${icon(info.iconName, 'weather-icon')} ${info.text}`;
  }

  // ---- 逐小时预报（未来24小时）----
  if (om) {
    hourlyEl.innerHTML = '';
    const endIdx = Math.min(nowIdx + 24, om.hourly.time.length);
    for (let i = nowIdx; i < endIdx; i++) {
      const hour = parseInt(om.hourly.time[i].slice(11, 13), 10);
      const isDay = om.hourly.is_day[i] === 1;
      const info = wmoInfo(om.hourly.weather_code[i], isDay);
      const temp = Math.round(om.hourly.temperature_2m[i]);

      const item = document.createElement('div');
      item.className = 'hourly-item';
      item.innerHTML = `
        <span class="hourly-time">${i === nowIdx ? '现在' : hour + ':00'}</span>
        ${icon(info.iconName, 'hourly-icon')}
        <span class="hourly-temp">${temp}°</span>
      `;
      hourlyEl.appendChild(item);
    }
    hourlySectionEl.classList.remove('hidden');
  } else {
    hourlySectionEl.classList.add('hidden');
  }

  // ---- 每日预报（昨天 + 今天/明天/后天）----
  forecastEl.innerHTML = '';
  if (om) {
    // om.daily: [昨天, 今天, 明天, 后天]，共 past_days(1) + forecast_days(3) = 4 条
    for (let i = 0; i < om.daily.time.length; i++) {
      const code = om.daily.weather_code[i];
      const info = wmoInfo(code, true);
      const maxT = Math.round(om.daily.temperature_2m_max[i]);
      const minT = Math.round(om.daily.temperature_2m_min[i]);

      const item = document.createElement('div');
      item.className = 'forecast-item';
      item.innerHTML = `
        <span class="forecast-day">${getWeekday(i - 1)}</span>
        <span class="forecast-cond">${icon(info.iconName, 'forecast-icon')} ${info.text}</span>
        <span class="forecast-temp">${minT}° / ${maxT}°</span>
      `;
      forecastEl.appendChild(item);
    }
  } else {
    // Open-Meteo 不可用时回退到 wttr.in 的3天预报
    data.weather.slice(0, 3).forEach((day, idx) => {
      const desc = day.hourly?.[4]?.lang_zh?.[0]?.value
                || day.hourly?.[4]?.weatherDesc?.[0]?.value || '';
      const item = document.createElement('div');
      item.className = 'forecast-item';
      item.innerHTML = `
        <span class="forecast-day">${getWeekday(idx)}</span>
        <span class="forecast-cond">${desc}</span>
        <span class="forecast-temp">${day.mintempC}° / ${day.maxtempC}°</span>
      `;
      forecastEl.appendChild(item);
    });
  }
}

// ========== 深色模式 ==========
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀️ 浅色' : '🌙 深色';
}

themeToggle.addEventListener('click', () => {
  const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  chrome.storage.local.set({ theme: next });
});

// 初始化主题：优先用户选择，否则跟随系统
chrome.storage.local.get(['theme'], (result) => {
  const theme = result.theme
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(theme);
});

// ========== 事件绑定 ==========
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) { showError('请输入城市名'); return; }
  fetchWeather(city);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

useLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('当前浏览器不支持定位');
    return;
  }
  showLoading();
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const query = `${pos.coords.latitude},${pos.coords.longitude}`;
      fetchWeather(query);
    },
    (err) => {
      hideLoading();
      showError('定位失败：' + err.message);
    },
    { timeout: 8000 }
  );
});

// ========== 启动 ==========
chrome.storage.local.get(['lastCity'], (result) => {
  if (result.lastCity) {
    cityInput.value = result.lastCity;
    fetchWeather(result.lastCity);
  } else {
    useLocationBtn.click();
  }
});

// 查询后保存城市名（包装 fetchWeather 以实现记忆功能）
const _origFetch = fetchWeather;
fetchWeather = function(query) {
  chrome.storage.local.set({ lastCity: query });
  return _origFetch(query);
};
