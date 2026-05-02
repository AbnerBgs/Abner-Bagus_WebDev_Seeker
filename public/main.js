// ─── State ───────────────────────────────────────────────
let selectedVehicleKoef = 0.1; // default: motorcycle

// ─── Navigasi ────────────────────────────────────────────
function openCalculator() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('calculator-view').style.display = 'block';
    window.scrollTo(0, 0);
}

function closeCalculator() {
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('calculator-view').style.display = 'none';
}

// ─── Pilih Kendaraan ─────────────────────────────────────
function selectVehicle(btn) {
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedVehicleKoef = btn.innerText.includes('Car') ? 0.2 : 0.1;
}

// ─── Update Progress Bar ──────────────────────────────────
function updateProgressBars(total) {
    const limitHarian = 15;
    let persen = Math.min((total / limitHarian) * 100, 100);
    const isOver = total > limitHarian;
    const color = isOver ? '#ff4d4d' : '#94F990';
    const glow  = isOver ? 'rgba(255,77,77,0.5)' : 'rgba(148,249,144,0.5)';

    // -- Bar di kalkulator (Your Impact) --
    const barKalk = document.getElementById('calculator-progress-bar');
    if (barKalk) {
        barKalk.style.width = persen + '%';
        barKalk.style.backgroundColor = color;
        barKalk.style.boxShadow = `0 0 10px ${glow}`;
    }

    // Label bawah bar kalkulator
    const labelCurrent = document.getElementById('calc-label-current');
    if (labelCurrent) {
        labelCurrent.innerText = `${total.toFixed(2)} KG CO2e`;
    }

    // -- Bar di landing page (Real-Time Impact Feedback) --
    const barLanding = document.getElementById('landing-progress-fill');
    if (barLanding) {
        barLanding.style.width = persen + '%';
        barLanding.style.background = color;
        barLanding.style.boxShadow = `0px 0px 15px ${glow}`;
    }

    const pctLabel = document.getElementById('landing-percentage');
    if (pctLabel) {
        pctLabel.innerText = Math.round(persen) + '%';
    }
}

// ─── Hitung Emisi ─────────────────────────────────────────
function hitungEmisiSekarang() {
    const km     = parseFloat(document.getElementById('distance').value)   || 0;
    const ac     = parseFloat(document.getElementById('acInput').value)     || 0;
    const laptop = parseFloat(document.getElementById('laptopInput').value) || 0;

    const total = (km * selectedVehicleKoef) + (ac * 0.5) + (laptop * 0.05);

    // Tampilkan angka hasil di card
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

    updateProgressBars(total);
}

// Fungsi Riset
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

    updateProgressBars(0);
}

document.addEventListener('DOMContentLoaded', () => {
    const btnReset = document.querySelector('.btn-reset');
    if (btnReset) btnReset.addEventListener('click', resetCalculator);
});