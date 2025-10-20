const API = window.APP_CONFIG.API_BASE;
const agencySelect = document.getElementById("agency");
const rankSelect = document.getElementById("rank");
const output = document.getElementById("output");

async function loadAgencies() {
  const res = await fetch(API + "?action=agencies");
  const data = await res.json();
  agencySelect.innerHTML = '<option value="">-- Select Agency --</option>';
  data.agencies.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    agencySelect.appendChild(opt);
  });
}

async function loadRanks() {
  const agency = agencySelect.value;
  rankSelect.innerHTML = '<option value="">-- Select Rank --</option>';
  if (!agency) return;
  const res = await fetch(API + "?action=ranks&agency=" + encodeURIComponent(agency));
  const data = await res.json();
  data.ranks.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    rankSelect.appendChild(opt);
  });
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
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "compute", payload })
  });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

loadAgencies();
