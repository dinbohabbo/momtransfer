const API = window.APP_CONFIG.API_BASE;
const agencySelect = document.getElementById("agency");
const rankSelect = document.getElementById("rank");
const output = document.getElementById("output");

async function loadAgencies() {
  try {
    const res = await fetch(API + "?action=agencies"); // no headers
    const data = await res.json();
    agencySelect.innerHTML = '<option value="">-- Select Agency --</option>';
    (data.agencies || []).forEach(a => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      agencySelect.appendChild(opt);
    });
  } catch (err) {
    console.error("agencies fetch failed:", err);
    agencySelect.innerHTML = '<option value="">(failed to load)</option>';
  }
}

async function loadRanks() {
  const agency = agencySelect.value;
  rankSelect.innerHTML = '<option value="">-- Select Rank --</option>';
  if (!agency) return;
  try {
    const res = await fetch(API + "?action=ranks&agency=" + encodeURIComponent(agency)); // no headers
    const data = await res.json();
    (data.ranks || []).forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      rankSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("ranks fetch failed:", err);
  }
}

agencySelect.addEventListener("change", loadRanks);

async function calculate() {
  const payload = {
    username: document.getElementById("username").value,
    agency: agencySelect.value,
    rank: rankSelect.value,
    mainIdDateISO: document.getElementById("mainDate").value,
    secondBadgeISO: document.getElementById("secondDate").value
  };

  output.textContent = "Checking...";
  try {
    const res = await fetch(API, {
      method: "POST",
      // IMPORTANT: use text/plain to avoid CORS preflight
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "compute", payload })
    });
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error("compute failed:", err);
    output.textContent = "Error contacting server. Open DevTools (F12) → Console for details.";
  }
}

loadAgencies();
