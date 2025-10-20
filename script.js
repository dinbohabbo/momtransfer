const API = window.APP_CONFIG.API_BASE;
const agencySelect = document.getElementById("agency");
const rankSelect = document.getElementById("rank");
const output = document.getElementById("output");

async function loadAgencies() {
  const res = await fetch(API + "?action=agencies");   // no headers
  const data = await res.json();
  agencySelect.innerHTML = '<option value="">-- Select Agency --</option>';
  (data.agencies || []).forEach(a => {
    const o = document.createElement("option");
    o.value = a; o.textContent = a;
    agencySelect.appendChild(o);
  });
}

async function loadRanks() {
  const agency = agencySelect.value;
  rankSelect.innerHTML = '<option value="">-- Select Rank --</option>';
  if (!agency) return;
  const res = await fetch(API + "?action=ranks&agency=" + encodeURIComponent(agency)); // no headers
  const data = await res.json();
  (data.ranks || []).forEach(r => {
    const o = document.createElement("option");
    o.value = r; o.textContent = r;
    rankSelect.appendChild(o);
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
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "compute", payload })
  });

  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

loadAgencies();
