let selectedVehicleKoef = 0.1;

const LIMIT_HARIAN  = 15;  
const LIMIT_BULANAN = 450;  

// Buka Calculator
function openCalculator() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('calculator-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function closeCalculator() {
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('calculator-view').style.display = 'none';
}

// Pilih Kendaraan 
function selectVehicle(btn) {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedVehicleKoef = btn.innerText.includes('Car') ? 0.2 : 0.1;
}

// Bar Kalkulator 
function updateBarKalkulator(total) {
    let persen = Math.min((total / LIMIT_HARIAN) * 100, 100);
    
    const card = document.getElementById('impact-card');
    const bar = document.getElementById('calculator-progress-bar'); 

    let barColor, cardBg;

    if (total === 0) {
        barColor = '#94F990';
        cardBg   = '#064E3B'; 
    } else if (total > 15) {
        barColor = '#ff4d4d'; 
        cardBg   = '#b91c1c'; 
    } else if (total > 5) {
        barColor = '#facc15'; 
        cardBg   = '#a16207'; 
    } else {
        barColor = '#94F990'; 
        cardBg   = '#14532d'; 
    }

    if (bar) {
        bar.style.width = persen + '%';
        bar.style.backgroundColor = barColor;
        bar.style.boxShadow = `0 0 10px ${barColor}`;
    }

    if (card) {
        card.style.backgroundColor = cardBg;
        card.style.borderColor = barColor;
        card.style.transition = "all 0.5s ease"; 
    }

    const label = document.getElementById('calc-label-current');
    if (label) label.innerText = `${total.toFixed(2)} KG CO2e`;
}


// Bar Landing Page
function updateBarBulanan() {
    const totalBulanIni = getTotalBulanIni(); // dalam kg CO2e
    let persen = Math.min((totalBulanIni / LIMIT_BULANAN) * 100, 100);

    const isOver = totalBulanIni > LIMIT_BULANAN;
    const color  = isOver ? '#ff4d4d' : '#94F990';
    const glow   = isOver ? 'rgba(255,77,77,0.5)' : 'rgba(148,249,144,0.5)';

    const bar = document.getElementById('landing-progress-fill');
    if (bar) {
        bar.style.width      = persen + '%';
        bar.style.background = color;
        bar.style.boxShadow  = `0px 0px 15px ${glow}`;
    }

    const pctLabel = document.getElementById('landing-percentage');
    if (pctLabel) pctLabel.innerText = Math.round(persen) + '%';
}

// Ambil riwayat dari localStorage
function getRiwayat() {
    try {
        return JSON.parse(localStorage.getItem('riwayatEmisi') || '[]');
    } catch (e) {
        console.error('Failed to load history:', e);
        return [];
    }
}

//  Hitung Total Emisi Bulan Ini dari localStorage 
function getTotalBulanIni() {
    const riwayat = getRiwayat();
    const bulanIni = getBulanTahunSekarang();

    return riwayat
        .filter(entry => entry.bulan === bulanIni)
        .reduce((sum, entry) => sum + (entry.emisi || 0), 0);
}

function getBulanTahunSekarang() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}


function simpanRiwayat(total) {
    const riwayat = getRiwayat();
    const now = new Date();

    riwayat.push({
        tanggal : now.toLocaleDateString(),
        bulan   : getBulanTahunSekarang(),
        emisi   : total
    });

    localStorage.setItem('riwayatEmisi', JSON.stringify(riwayat));
}

// Hitung Emisi 
function hitungEmisiSekarang() {
    const km     = parseFloat(document.getElementById('distance').value)    || 0;
    const ac     = parseFloat(document.getElementById('acInput').value)      || 0;
    const laptop = parseFloat(document.getElementById('laptopInput').value)  || 0;

    const total = (km * selectedVehicleKoef) + (ac * 0.5) + (laptop * 0.05);

    const displayHasil = document.querySelector('.awaiting-data');
    if (displayHasil) {
        displayHasil.innerHTML = `
            <h2 style="font-size:64px;font-weight:800;color:white;margin:20px 0 10px;">
                ${total.toFixed(2)}
            </h2>
            <span style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:1px;">
                KG CO2e / DAY
            </span>`;
    }

    updateBarKalkulator(total);
    simpanRiwayat(total);
    updateBarBulanan();
    simpanInputTerakhir(total);
    tampilkanActionPlan();
}

// Reset Kalkulator
function resetCalculator() {
    document.getElementById('distance').value    = '';
    document.getElementById('acInput').value     = '';
    document.getElementById('laptopInput').value = '';

    selectedVehicleKoef = 0.1;
    document.querySelectorAll('.toggle-btn').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });

    const displayHasil = document.querySelector('.awaiting-data');
    if (displayHasil) {
        displayHasil.innerHTML = `
            <div class="circle-loader">
                <div class="dots">...</div>
            </div>
            <span>AWAITING DATA</span>`;
    }
    updateBarKalkulator(0);
    localStorage.removeItem('inputTerakhir');
}

// Simpan input terakhir ke localStorage untuk restore saat reload
function simpanInputTerakhir(total) {
    localStorage.setItem('inputTerakhir', JSON.stringify({
        jarak    : document.getElementById('distance').value,
        ac       : document.getElementById('acInput').value,
        laptop   : document.getElementById('laptopInput').value,
        kendaraan: selectedVehicleKoef,
        emisi    : total
    }));
}

// Inisialisasi saat halaman dimuat: restore input terakhir & update bar bulanan
window.onload = function () {
    updateBarBulanan();
    restoreActionPlan();

    try {
        const raw = localStorage.getItem('inputTerakhir');
        if (raw) {
            const data = JSON.parse(raw);
            document.getElementById('distance').value    = data.jarak     || '';
            document.getElementById('acInput').value     = data.ac        || '';
            document.getElementById('laptopInput').value = data.laptop     || '';
            selectedVehicleKoef                          = data.kendaraan || 0.1;

            document.querySelectorAll('.toggle-btn').forEach(btn => {
                const isCar = btn.innerText.includes('Car');
                btn.classList.toggle('active',
                    (isCar && selectedVehicleKoef === 0.2) ||
                    (!isCar && selectedVehicleKoef === 0.1)
                );
            });

            if (data.emisi !== undefined) updateBarKalkulator(data.emisi);
        }
    } catch (e) {
        console.error('Failed to restore last input:', e);
    }
};

// Toggle Hamburger Menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav      = document.getElementById('main-nav');
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
    }
});
// Action Plan 
const AP_MESSAGES = {
    0: [
        'Start with one small step. Every small action makes a real difference for the planet.',
        'Nothing checked off yet. Lets pick the one action thats easiest for you to do today',
        'A journey of a thousand miles begins with a single step. Check off your first action now!',
    ],
    1: [
        'Good start! One action completed — the planet feels it.',
        'The first step is always the hardest. And you have taken it — awesome!',
        'One down, four to go! Consistency is the key.',
    ],
    2: [
        'Two actions, twice as good! You are already greener than most people today.',
        'Best momentum! Two real actions you have taken — keep up the pace.',
        'Two steps toward real change. There are still three actions waiting for you!'
    ],
    3: [
        'Amazing! More than half the checklist is complete — you are leading by example.', 
        'Three out of five! The impact you made today is already tangible and felt.',
        'More than halfway there! Just two more steps to Planet Hero.',
    ],
    4: [
        'Almost perfect! One more action and you are a Planet Hero today.', 
        'Four out of five — awesome! You are just one step away from being a Planet Hero.',
        'So close! One last tick will complete your green day.',
    ],
    5: [
        'Planet Hero! All actions completed — Earth thanks you today.',
        'Perfect! You have done everything you could — this is amazing.',
        'One hundred percent complete! Today you proved that change starts with you.',
    ],
};

// Track pesan terakhir biar tidak repeat
let lastMsgIndex = -1;

// Ambil pesan random dari pool level, hindari repeat
function getRandomMsg(done) {
    const pool = AP_MESSAGES[done] || AP_MESSAGES[5];
    if (pool.length === 1) return pool[0];
    let idx;
    do { idx = Math.floor(Math.random() * pool.length); }
    while (idx === lastMsgIndex);
    lastMsgIndex = idx;
    return pool[idx];
}

// Tampilkan action plan (dipanggil saat pertama kali Calculate)
function tampilkanActionPlan() {
    const section = document.getElementById('action-plan');
    if (section) {
        section.style.display = 'block';
        section.style.opacity = '0';
        section.style.transform = 'translateY(16px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 50);
    }
}

// Toggle satu tip card
function toggleTip(card) {
    const id = card.getAttribute('data-id');
    card.classList.toggle('done');

    // Simpan state ke localStorage
    const state = getCheckedState();
    state[id] = card.classList.contains('done');
    localStorage.setItem('actionPlanState', JSON.stringify(state));

    updateActionPlanUI();
}

// Update progress bar & pesan motivasi
function updateActionPlanUI() {
    const cards = document.querySelectorAll('.tip-card');
    const done  = [...cards].filter(c => c.classList.contains('done')).length;
    const total = cards.length;

    // Progress bar
    const fill = document.getElementById('ap-progress-fill');
    if (fill) fill.style.width = (done / total * 100) + '%';

    const label = document.getElementById('ap-progress-label');
    if (label) label.textContent = `${done} / ${total} selesai`;

    // Pesan motivasi — random dari pool per level, selalu beda
    const msg  = getRandomMsg(done);
    const icon = document.getElementById('ap-mot-icon');
    const text = document.getElementById('ap-mot-text');
    if (icon) icon.style.display = 'none';
    if (text) text.innerHTML = msg;
}

// Ambil state checklist dari localStorage
function getCheckedState() {
    try {
        return JSON.parse(localStorage.getItem('actionPlanState') || '{}');
    } catch { return {}; }
}

// Restore state checklist saat halaman dimuat
function restoreActionPlan() {
    const state = getCheckedState();
    const hasAnyChecked = Object.values(state).some(v => v === true);
    const sudahCalculate = !!localStorage.getItem('inputTerakhir');

    // Tampilkan kalau pernah calculate atau ada yang sudah dicentang
    if (sudahCalculate || hasAnyChecked) {
        const section = document.getElementById('action-plan');
        if (section) section.style.display = 'block';
    }

    document.querySelectorAll('.tip-card').forEach(card => {
        const id = card.getAttribute('data-id');
        if (state[id] === true) card.classList.add('done');
    });

    updateActionPlanUI();
}