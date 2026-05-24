const $ = (id) => document.getElementById(id);
const list = (x) => Array.isArray(x) ? x.join('、') : (x || '');
const esc = (x) => String(x ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

let db = { meta: {}, daily: [], view_events: [], watchlist: [], sources: [] };

async function loadDatabase(){
  try{
    const res = await fetch('data/tracker.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    db = await res.json();
  }catch(err){
    console.error('Failed to load tracker database:', err);
    const body = $('daily-body');
    if(body){
      body.innerHTML = `<tr><td colspan="8">資料庫讀取失敗：${esc(err.message)}。請確認 data/tracker.json 是否存在。</td></tr>`;
    }
  }
}

function statusBadge(status){
  return `<span class="status ${status === '有新集數' ? 'new' : 'none'}">${esc(status)}</span>`;
}

function renderRows(rows){
  const body = $('daily-body');
  if(!body) return;
  body.innerHTML = rows.map(d => `<tr>
    <td>${esc(d.date)}</td>
    <td>${statusBadge(d.status)}</td>
    <td><strong>${esc(d.episode)}</strong></td>
    <td>${esc(d.summary)}</td>
    <td>${esc(list(d.sectors))}</td>
    <td>${esc(list(d.tickers))}</td>
    <td>${esc(d.signal)}</td>
    <td>${esc(d.risk)}</td>
  </tr>`).join('');
  $('result-count').textContent = `${rows.length} 筆資料`;
}

function renderTimeline(){
  const timeline = $('timeline');
  if(!timeline) return;
  timeline.innerHTML = db.daily.filter(d => d.status === '有新集數').map(d => `<div class="event">
    <strong>${esc(d.date)}｜${esc(d.episode)}</strong>
    <small>${esc(list(d.sectors))}</small>
    <p>${esc(d.summary)}</p>
  </div>`).join('');
}

function renderWatchlist(){
  const container = $('watchlist');
  if(!container) return;
  container.innerHTML = db.watchlist.map(w => `<div class="watch-card">
    <h3>${esc(w.category)}</h3>
    <p><b>標的：</b>${esc(w.items)}</p>
    <p>${esc(w.view)}</p>
    <p><b>每日要看：</b>${esc(w.dailyCheck)}</p>
    <p><b>警訊：</b>${esc(w.warning)}</p>
  </div>`).join('');
}

function renderViewEvents(){
  const body = $('events-body');
  if(!body) return;
  body.innerHTML = db.view_events.map(e => `<tr>
    <td>${esc(e.date)}</td>
    <td><strong>${esc(e.episode)}</strong></td>
    <td>${esc(e.theme)}</td>
    <td>${esc(e.stance)}</td>
    <td>${esc(e.summary)}</td>
    <td>${esc(list(e.tickers))}</td>
    <td>${esc(e.follow_up)}</td>
  </tr>`).join('');
}

function renderSources(){
  const body = $('sources-body');
  if(!body) return;
  body.innerHTML = db.sources.map(s => `<tr>
    <td>${esc(s.type)}</td>
    <td>${esc(s.name)}</td>
    <td><a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.url)}</a></td>
    <td>${esc(s.usage)}</td>
  </tr>`).join('');
}

function initFilters(){
  const topics = [...new Set(db.daily.flatMap(d => d.sectors || []))].sort();
  const topicFilter = $('topic-filter');
  topicFilter.innerHTML = '<option value="all">全部主題</option>' + topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  $('topic-chips').innerHTML = topics.slice(0, 14).map(t => `<span class="chip">${esc(t)}</span>`).join('');
  ['search','status-filter','topic-filter'].forEach(id => $(id).addEventListener('input', applyFilters));
}

function applyFilters(){
  const q = $('search').value.trim().toLowerCase();
  const st = $('status-filter').value;
  const topic = $('topic-filter').value;
  const rows = db.daily.filter(d => {
    const hay = [d.date,d.status,d.episode,d.summary,list(d.sectors),list(d.tickers),d.signal,d.risk].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (st === 'all' || d.status === st) && (topic === 'all' || (d.sectors || []).includes(topic));
  });
  renderRows(rows);
}

function renderMeta(){
  $('stat-days').textContent = db.daily.length;
  $('stat-episodes').textContent = db.daily.filter(d => d.status === '有新集數').length;
  const latest = db.daily.filter(d => d.status === '有新集數').at(-1);
  const latestEl = $('stat-latest');
  if(latestEl) latestEl.textContent = latest?.episode || '-';
  const metaEl = $('meta-updated');
  if(metaEl) metaEl.textContent = `資料庫版本 ${db.meta.version || '-'}｜更新日 ${db.meta.updated_at || '-'}`;
}

async function init(){
  await loadDatabase();
  renderMeta();
  renderRows(db.daily);
  renderTimeline();
  renderWatchlist();
  renderViewEvents();
  renderSources();
  initFilters();
}

init();
