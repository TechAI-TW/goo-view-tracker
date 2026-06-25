const $ = (id) => document.getElementById(id);

const sample = {
  user: { name: 'Bien', plan: 'Free', chequeTarget: 300 },
  passbook: [
    { date: '2026-06-19', verifiedRest: 28, activeUse: 364, override: 18 },
    { date: '2026-06-20', verifiedRest: 35, activeUse: 412, override: 12 },
    { date: '2026-06-21', verifiedRest: 42, activeUse: 386, override: 8 },
    { date: '2026-06-22', verifiedRest: 31, activeUse: 441, override: 24 },
    { date: '2026-06-23', verifiedRest: 46, activeUse: 402, override: 6 },
    { date: '2026-06-24', verifiedRest: 39, activeUse: 388, override: 10 },
    { date: '2026-06-25', verifiedRest: 52, activeUse: 415, override: 14 }
  ],
  todaySegments: [
    { type: 'use', start: '07:18', end: '08:04' },
    { type: 'rest', start: '08:04', end: '08:12' },
    { type: 'use', start: '08:12', end: '09:40' },
    { type: 'override', start: '09:40', end: '09:52' },
    { type: 'rest', start: '09:52', end: '10:04' },
    { type: 'use', start: '10:04', end: '12:08' },
    { type: 'rest', start: '12:08', end: '12:22' },
    { type: 'use', start: '13:04', end: '14:38' },
    { type: 'rest', start: '14:38', end: '14:50' },
    { type: 'use', start: '14:50', end: '17:44' }
  ],
  events: [
    { type: 'reminder', time: '08:04' },
    { type: 'reminder', time: '09:40' },
    { type: 'cheque', time: '14:38' },
    { type: 'reminder', time: '17:40' }
  ]
};

let data = loadData();

function loadData(){
  try{
    const stored = JSON.parse(localStorage.getItem('breakping-cloud-demo') || 'null');
    return stored || structuredClone(sample);
  }catch{
    return structuredClone(sample);
  }
}
function saveData(){ localStorage.setItem('breakping-cloud-demo', JSON.stringify(data)); }
function fmtMin(min){
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${String(m).padStart(2,'0')}m` : `${m}m`;
}
function esc(x){ return String(x ?? '').replace(/[&<>'"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m])); }
function timeToMin(t){
  const [h,m] = t.split(':').map(Number);
  return h * 60 + m;
}
function totalRest(){ return data.passbook.reduce((sum, d) => sum + d.verifiedRest, 0); }
function totalWeekRest(){ return data.passbook.slice(-7).reduce((sum, d) => sum + d.verifiedRest, 0); }
function totalTodayUse(){ const t = data.passbook[data.passbook.length - 1]; return (t?.activeUse || 0) + (t?.override || 0); }
function totalOverride(){ return data.passbook.reduce((sum, d) => sum + d.override, 0); }
function chequeCount(){ return Math.floor(totalRest() / data.user.chequeTarget); }
function nextChequeProgress(){ return totalRest() % data.user.chequeTarget; }

function renderMetrics(){
  const rest = totalRest();
  const target = data.user.chequeTarget;
  const progress = nextChequeProgress();
  const percent = Math.round((progress / target) * 100);
  $('hero-balance').textContent = `${rest} REST`;
  $('hero-cheques').textContent = `${chequeCount()} issued`;
  $('total-rest').textContent = `${rest} REST`;
  $('week-rest').textContent = `${totalWeekRest()} REST`;
  $('today-use').textContent = fmtMin(totalTodayUse());
  $('override-time').textContent = fmtMin(totalOverride());
  $('cheque-progress').style.width = `${percent}%`;
  $('cheque-progress-label').textContent = `${progress} / ${target} REST`;
  $('cheque-progress-percent').textContent = `${percent}%`;
}

function renderPassbook(){
  $('passbook-list').innerHTML = data.passbook.slice().reverse().map(row => `
    <div class="passbook-row">
      <div>
        <strong>${esc(row.date)}</strong>
        <small>Active ${fmtMin(row.activeUse)} · Rest override ${fmtMin(row.override)}</small>
      </div>
      <strong>+${row.verifiedRest} REST</strong>
    </div>`).join('');
}

function renderCheques(){
  const count = chequeCount();
  if(!count){
    $('cheque-list').innerHTML = `<div class="cheque-row"><div><strong>No Rest Cheque yet</strong><small>Keep saving verified rest. The first cheque is issued at ${data.user.chequeTarget} REST.</small></div><strong>${nextChequeProgress()} REST</strong></div>`;
    return;
  }
  const rows = Array.from({ length: count }, (_, i) => i + 1).reverse();
  $('cheque-list').innerHTML = rows.map(n => `
    <div class="cheque-row">
      <div>
        <strong>Rest Cheque #${String(n).padStart(3,'0')}</strong>
        <small>Future App Pass / annual-fee waiver voucher · no cash value</small>
      </div>
      <strong>Available</strong>
    </div>`).join('');
}

function renderTimeline(){
  const [startHour, endHour] = $('range-select').value.split('-').map(Number);
  const start = startHour * 60;
  const end = endHour * 60;
  const span = end - start;
  const timeline = $('timeline');
  let html = '';
  for(let t = start; t <= end; t += 30){
    const left = ((t - start) / span) * 100;
    const isHour = t % 60 === 0;
    html += `<span class="tick ${isHour ? '' : 'half'}" style="left:${left}%"></span>`;
    if(isHour){ html += `<span class="tick-label" style="left:${left}%">${String(Math.floor(t/60)).padStart(2,'0')}:00</span>`; }
  }
  data.todaySegments.forEach(seg => {
    let segStart = timeToMin(seg.start);
    let segEnd = timeToMin(seg.end);
    if(segEnd <= start || segStart >= end) return;
    segStart = Math.max(segStart, start);
    segEnd = Math.min(segEnd, end);
    const left = ((segStart - start) / span) * 100;
    const width = ((segEnd - segStart) / span) * 100;
    html += `<span class="segment ${esc(seg.type)}" style="left:${left}%;width:${Math.max(width, .25)}%" title="${esc(seg.type)} ${esc(seg.start)}–${esc(seg.end)}"></span>`;
  });
  data.events.forEach(evt => {
    const t = timeToMin(evt.time);
    if(t < start || t > end) return;
    const left = ((t - start) / span) * 100;
    html += `<span class="dot ${evt.type === 'cheque' ? 'cheque' : ''}" style="left:${left}%" title="${esc(evt.type)} ${esc(evt.time)}"></span>`;
  });
  timeline.innerHTML = html;
}

function buildPayload(){
  return {
    endpoint: 'POST /api/v1/sync/segments',
    auth: 'Bearer <desktop-app-token>',
    privacy: ['no screenshots', 'no keystroke content', 'no app names', 'no website URLs'],
    payload: {
      device_id: 'win-device-demo-001',
      date: '2026-06-25',
      rest_credits: data.passbook[data.passbook.length - 1].verifiedRest,
      segments: data.todaySegments,
      events: data.events
    }
  };
}
function renderPayload(){ $('sync-payload').textContent = JSON.stringify(buildPayload(), null, 2); }

function downloadCsv(name, rows){
  const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function simulateSync(){
  const today = data.passbook[data.passbook.length - 1];
  today.verifiedRest += 5;
  today.activeUse += 12;
  data.todaySegments.push({ type: 'rest', start: '17:44', end: '17:49' });
  data.events.push({ type: 'reminder', time: '17:44' });
  saveData();
  renderAll();
}
function fakeCheckout(plan){
  alert(`${plan} checkout placeholder\n\nProduction integration: ECPay / NewebPay / TapPay.\nThis static demo does not process payments.`);
}
function renderAll(){
  renderMetrics();
  renderPassbook();
  renderCheques();
  renderTimeline();
  renderPayload();
}

$('range-select').addEventListener('change', renderTimeline);
$('simulate-sync').addEventListener('click', simulateSync);
$('pay-annual').addEventListener('click', () => fakeCheckout('Pro Annual'));
$('pay-lifetime').addEventListener('click', () => fakeCheckout('Lifetime Early Supporter'));
$('download-passbook').addEventListener('click', () => {
  const rows = [['date','verified_rest_rest','active_use_min','rest_override_min'], ...data.passbook.map(d => [d.date, d.verifiedRest, d.activeUse, d.override])];
  downloadCsv('breakping-passbook.csv', rows);
});

renderAll();
