const $ = (id) => document.getElementById(id);
const list = (x) => Array.isArray(x) ? x.join('、') : (x || '');
const esc = (x) => String(x ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

const daily = [
  {date:'2026-05-01',status:'無新集數',episode:'',summary:'5月追蹤起點；尚無5月新公開集數可歸檔。',sectors:[],tickers:[],signal:'等待下一集或社群新訊號。',risk:''},
  {date:'2026-05-02',status:'有新集數',episode:'EP658',summary:'AI 取代論被校正；軟體股要用產品力／抗 AI 程度分層，而不是簡化成工程師消失。',sectors:['美股軟體','AI應用','雲端','資安'],tickers:['Cloudflare','CrowdStrike','Palantir','Atlassian','Adobe','Salesforce','Google','Microsoft'],signal:'被誤殺軟體與巨頭可能是下一輪輪動候選；硬體題材跑完後觀察資金回流軟體。',risk:'不要把 AI 完成單一任務推論成整家公司或職位被取代。'},
  {date:'2026-05-03',status:'無新集數',episode:'EP658延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['美股軟體','AI應用','雲端','資安'],tickers:['Cloudflare','CrowdStrike','Palantir','Atlassian','Adobe','Salesforce','Google','Microsoft'],signal:'追蹤前一觀點是否被新聞／股價驗證。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-04',status:'無新集數',episode:'EP658延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['美股軟體','AI應用','雲端','資安'],tickers:['Cloudflare','CrowdStrike','Palantir','Atlassian','Adobe','Salesforce','Google','Microsoft'],signal:'追蹤前一觀點是否被新聞／股價驗證。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-05',status:'無新集數',episode:'EP658延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['美股軟體','AI應用','雲端','資安'],tickers:['Cloudflare','CrowdStrike','Palantir','Atlassian','Adobe','Salesforce','Google','Microsoft'],signal:'追蹤前一觀點是否被新聞／股價驗證。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-06',status:'有新集數',episode:'EP659',summary:'被動元件第三波升溫；國巨 AI 誓師、信昌電交期拉長，使市場開始提前反映後續漲價可能。',sectors:['被動元件','CPU/ASIC','AI Server'],tickers:['國巨','信昌電','GUC','世芯-KY','聯發科','AMD'],signal:'CPU／ASIC／被動元件一起動；國巨是主線龍頭，第二排被動元件要追蹤交期與漲價函。',risk:'聯發科等標的預期可能已被充分反映，不宜無腦加大部位。'},
  {date:'2026-05-07',status:'無新集數',episode:'EP659延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','CPU/ASIC','AI Server'],tickers:['國巨','信昌電','GUC','世芯-KY','聯發科','AMD'],signal:'追蹤被動元件交期、漲價函、族群擴散。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-08',status:'無新集數',episode:'EP659延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','CPU/ASIC','AI Server'],tickers:['國巨','信昌電','GUC','世芯-KY','聯發科','AMD'],signal:'追蹤被動元件交期、漲價函、族群擴散。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-09',status:'有新集數',episode:'EP660',summary:'市場進入高位階，利空可被放大；NVIDIA 供應鏈局部殺盤、成熟製程／第二梯隊輪動、被動元件全面噴發。',sectors:['NVIDIA供應鏈','成熟製程','被動元件','資金/槓桿'],tickers:['NVIDIA','瑞昱','聯詠','聯電','世界先進','環球晶'],signal:'第一梯隊強勢後，資金開始往成熟製程／第二梯隊尋找相對安全標的；被動元件進一步擴散。',risk:'位階高時隨便一個理由都能殺；故事不嚴重也可能因估值高而減碼。'},
  {date:'2026-05-10',status:'無新集數',episode:'EP660延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['NVIDIA供應鏈','成熟製程','被動元件','資金/槓桿'],tickers:['NVIDIA','瑞昱','聯詠','聯電','世界先進','環球晶'],signal:'追蹤高位階族群是否汰弱留強。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-11',status:'無新集數',episode:'EP660延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['NVIDIA供應鏈','成熟製程','被動元件','資金/槓桿'],tickers:['NVIDIA','瑞昱','聯詠','聯電','世界先進','環球晶'],signal:'追蹤高位階族群是否汰弱留強。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-12',status:'無新集數',episode:'EP660延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['NVIDIA供應鏈','成熟製程','被動元件','資金/槓桿'],tickers:['NVIDIA','瑞昱','聯詠','聯電','世界先進','環球晶'],signal:'追蹤高位階族群是否汰弱留強。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-13',status:'有新集數',episode:'EP661',summary:'被動元件排擠效應深化；AI Server 換代導致高規 MLCC 產能集中，台系廠吃排擠訂單。',sectors:['被動元件','NVIDIA供應鏈','光通訊','權值股防守'],tickers:['國巨','台系被動元件','NVIDIA','台積電'],signal:'海外族群先強、台股後跟；記憶體與被動元件已驗證，光通訊可能是下一個 setup。',risk:'漲價要拆成需求驅動 vs 成本驅動；動能點不動時需準備低估值權值股避風港。'},
  {date:'2026-05-14',status:'無新集數',episode:'EP661延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','NVIDIA供應鏈','光通訊','權值股防守'],tickers:['國巨','台系被動元件','NVIDIA','台積電'],signal:'追蹤被動元件、光通訊是否接續輪動。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-15',status:'無新集數',episode:'EP661延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','NVIDIA供應鏈','光通訊','權值股防守'],tickers:['國巨','台系被動元件','NVIDIA','台積電'],signal:'追蹤被動元件、光通訊是否接續輪動。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-16',status:'有新集數',episode:'EP662',summary:'大跌不恐慌；重點看市場反應強度與資金輪動。被動元件是核心題材，進入漲價三階段觀察。',sectors:['被動元件','PMIC/電源','資安/SaaS','台積電資金效應'],tickers:['台積電','老AI','投信中小型股','CrowdStrike','Figma'],signal:'追創新高領導族群，繞開只是跌深回血的標的；被動元件看現貨漲價、漲價信、控貨／停單。',risk:'投信資金流向台積電可能造成老 AI 與投信中小型股提款。'},
  {date:'2026-05-17',status:'無新集數',episode:'EP662延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','PMIC/電源','資安/SaaS','台積電資金效應'],tickers:['台積電','老AI','投信中小型股','CrowdStrike','Figma'],signal:'追蹤領導族群是否創高續強。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-18',status:'無新集數',episode:'EP662延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','PMIC/電源','資安/SaaS','台積電資金效應'],tickers:['台積電','老AI','投信中小型股','CrowdStrike','Figma'],signal:'追蹤領導族群是否創高續強。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-19',status:'無新集數',episode:'EP662延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','PMIC/電源','資安/SaaS','台積電資金效應'],tickers:['台積電','老AI','投信中小型股','CrowdStrike','Figma'],signal:'追蹤領導族群是否創高續強。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-20',status:'有新集數',episode:'EP663',summary:'被動元件進入明確上升循環；但股價漲多後不宜再亂喊多。',sectors:['被動元件','AI硬體供應鏈','光通訊','老AI'],tickers:['國巨','華新科','鈺邦','立隆電','日電貿','Panasonic','Broadcom','NVIDIA'],signal:'漲價函、現貨掃貨、高階料號斷供、交期拉長；下檔防守關鍵是廠商是否大規模擴產。',risk:'若出現大規模／有共識擴產，會是中期風險；光通短期回檔屬正常但不能過度追高。'},
  {date:'2026-05-21',status:'無新集數',episode:'EP663延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','AI硬體供應鏈','光通訊','老AI'],tickers:['國巨','華新科','鈺邦','立隆電','日電貿','Panasonic','Broadcom','NVIDIA'],signal:'追蹤被動元件漲價與族群擴散是否被股價驗證。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-22',status:'無新集數',episode:'EP663延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','AI硬體供應鏈','光通訊','老AI'],tickers:['國巨','華新科','鈺邦','立隆電','日電貿','Panasonic','Broadcom','NVIDIA'],signal:'追蹤被動元件漲價與族群擴散是否被股價驗證。',risk:'若當日有社群貼文需另補。'},
  {date:'2026-05-23',status:'無新集數',episode:'EP663延續',summary:'無新集數；延續追蹤前一集主題，不新增獨立觀點。',sectors:['被動元件','AI硬體供應鏈','光通訊','老AI'],tickers:['國巨','華新科','鈺邦','立隆電','日電貿','Panasonic','Broadcom','NVIDIA'],signal:'追蹤被動元件漲價與族群擴散是否被股價驗證。',risk:'若當日有社群貼文需另補。'}
];

const watchlist = [
  {category:'被動元件龍頭',items:'國巨',view:'產業主線龍頭，但股價追高風險上升。',dailyCheck:'股價、成交量、外資/投信、月營收、毛利率。',warning:'大規模擴產、漲價不如預期、跌破短均後反彈無力。'},
  {category:'被動元件第二排',items:'華新科、信昌電、鈺邦、立隆電、日電貿',view:'受惠交期拉長、漲價函、排擠訂單。',dailyCheck:'交期、漲價函、營收、法人籌碼。',warning:'只有成本推升而非需求驅動，或漲價無法轉嫁。'},
  {category:'AI硬體/ASIC',items:'GUC、世芯-KY、聯發科、Broadcom/Google TPU相關',view:'GPU 外的 AI 算力主線輪動。',dailyCheck:'海外 ASIC/TPU 新聞、台股供應鏈反應。',warning:'預期已打滿、營收驗證跟不上。'},
  {category:'光通訊',items:'CPO、矽光子、光通供應鏈',view:'美股先強，台股可能後跟；短期回檔不等於結束。',dailyCheck:'美股光通領頭股、台股相關股價強弱。',warning:'利多出盡、成交量失控後跌破關鍵均線。'}
];

function statusBadge(status){ return `<span class="status ${status === '有新集數' ? 'new' : 'none'}">${esc(status)}</span>`; }
function renderRows(rows){
  $('daily-body').innerHTML = rows.map(d => `<tr><td>${esc(d.date)}</td><td>${statusBadge(d.status)}</td><td><strong>${esc(d.episode)}</strong></td><td>${esc(d.summary)}</td><td>${esc(list(d.sectors))}</td><td>${esc(list(d.tickers))}</td><td>${esc(d.signal)}</td><td>${esc(d.risk)}</td></tr>`).join('');
  $('result-count').textContent = `${rows.length} 筆資料`;
}
function renderTimeline(){
  $('timeline').innerHTML = daily.filter(d => d.status === '有新集數').map(d => `<div class="event"><strong>${esc(d.date)}｜${esc(d.episode)}</strong><small>${esc(list(d.sectors))}</small><p>${esc(d.summary)}</p></div>`).join('');
}
function renderWatchlist(){
  $('watchlist').innerHTML = watchlist.map(w => `<div class="watch-card"><h3>${esc(w.category)}</h3><p><b>標的：</b>${esc(w.items)}</p><p>${esc(w.view)}</p><p><b>每日要看：</b>${esc(w.dailyCheck)}</p><p><b>警訊：</b>${esc(w.warning)}</p></div>`).join('');
}
function initFilters(){
  const topics = [...new Set(daily.flatMap(d => d.sectors))].sort();
  $('topic-filter').innerHTML += topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  $('topic-chips').innerHTML = topics.slice(0, 12).map(t => `<span class="chip">${esc(t)}</span>`).join('');
  ['search','status-filter','topic-filter'].forEach(id => $(id).addEventListener('input', applyFilters));
}
function applyFilters(){
  const q = $('search').value.trim().toLowerCase();
  const st = $('status-filter').value;
  const topic = $('topic-filter').value;
  const rows = daily.filter(d => {
    const hay = [d.date,d.status,d.episode,d.summary,list(d.sectors),list(d.tickers),d.signal,d.risk].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (st === 'all' || d.status === st) && (topic === 'all' || d.sectors.includes(topic));
  });
  renderRows(rows);
}
function init(){
  $('stat-days').textContent = daily.length;
  $('stat-episodes').textContent = daily.filter(d => d.status === '有新集數').length;
  renderRows(daily); renderTimeline(); renderWatchlist(); initFilters();
}
init();
