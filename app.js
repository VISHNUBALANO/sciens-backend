'use strict';

// ─────────────────────────────
// CONFIG
// ─────────────────────────────
const API_URL = "https://sciens-backend-1.onrender.com";

// ─────────────────────────────
// STATE
// ─────────────────────────────
let currentClient = null;
let currentPlatform = null;
let currentRows = [];

// ─────────────────────────────
// AUTH (same as before)
// ─────────────────────────────
const CREDENTIALS = { username: 'sciens2026', password: 'vishnu2004' };
const SESSION_KEY = 'sciens_auth';

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

function handleLogin() {
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;

  if (u === CREDENTIALS.username && p === CREDENTIALS.password) {
    sessionStorage.setItem(SESSION_KEY, '1');
    window.location.href = 'home.html';
  } else {
    alert("Invalid credentials");
  }
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

// ─────────────────────────────
// NAVIGATION
// ─────────────────────────────
function selectClient(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  currentClient = el.dataset.client;
  document.getElementById('clientTitle').textContent = el.textContent.trim();

  document.getElementById('homeView').style.display = 'none';
  document.getElementById('clientView').style.display = 'block';

  renderPlatformGrid();
}

function openPlatform(platformId) {
  currentPlatform = platformId;

  document.getElementById('clientView').style.display = 'none';
  document.getElementById('platformView').style.display = 'block';

  loadRows();
}

// ─────────────────────────────
// API CALLS
// ─────────────────────────────

// GET rows
async function loadRows() {
  const res = await fetch(
    `${API_URL}/rows?clientId=${currentClient}&platformId=${currentPlatform}`
  );
  currentRows = await res.json();

  renderTable();
}

// SAVE row
async function saveRow(index) {
  const row = currentRows[index];

  await fetch(`${API_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...row,
      clientId: currentClient,
      platformId: currentPlatform
    })
  });

  showToast("Saved to DB 🚀");
}

// UPDATE row
async function updateRow(index) {
  const row = currentRows[index];

  if (!row._id) return saveRow(index);

  await fetch(`${API_URL}/row/${row._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(row)
  });

  showToast("Updated ✅");
}

// DELETE row
async function deleteRow(id) {
  await fetch(`${API_URL}/row/${id}`, {
    method: 'DELETE'
  });

  loadRows();
}

// ─────────────────────────────
// TABLE RENDER
// ─────────────────────────────
function renderTable() {
  const tbody = document.getElementById('tableBody');

  if (!currentRows.length) {
    tbody.innerHTML = `<tr><td colspan="10">No data</td></tr>`;
    return;
  }

  tbody.innerHTML = currentRows.map((row, i) => `
    <tr>
      <td><input type="date" value="${row.date || ''}" onchange="updateField(${i}, 'date', this.value)"></td>
      <td><input type="text" value="${row.category || ''}" onchange="updateField(${i}, 'category', this.value)"></td>
      <td><input type="text" value="${row.title || ''}" onchange="updateField(${i}, 'title', this.value)"></td>
      <td><textarea onchange="updateField(${i}, 'content', this.value)">${row.content || ''}</textarea></td>
      <td><input type="text" value="${row.refLink || ''}" onchange="updateField(${i}, 'refLink', this.value)"></td>
      <td><input type="text" value="${row.finalLink || ''}" onchange="updateField(${i}, 'finalLink', this.value)"></td>
      <td><input type="text" value="${row.status || ''}" onchange="updateField(${i}, 'status', this.value)"></td>
      <td><input type="text" value="${row.qc || ''}" onchange="updateField(${i}, 'qc', this.value)"></td>
      <td><textarea onchange="updateField(${i}, 'comments', this.value)">${row.comments || ''}</textarea></td>
      <td>
        <button onclick="updateRow(${i})">Save</button>
        <button onclick="deleteRow('${row._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ─────────────────────────────
// UPDATE FIELD
// ─────────────────────────────
function updateField(index, field, value) {
  currentRows[index][field] = value;
}

// ─────────────────────────────
// ADD ROW
// ─────────────────────────────
function addNewRow() {
  currentRows.unshift({
    date: new Date().toISOString().split('T')[0],
    category: '',
    title: '',
    content: '',
    refLink: '',
    finalLink: '',
    status: '',
    qc: '',
    comments: ''
  });

  renderTable();
}

// ─────────────────────────────
// TOAST
// ─────────────────────────────
function showToast(msg) {
  alert(msg); // simple version (you can keep your UI toast)
}

// ─────────────────────────────
// INIT
// ─────────────────────────────
function init() {
  const page = window.location.pathname.split('/').pop();

  if (page === 'home.html') {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
    }
  }
}

document.addEventListener('DOMContentLoaded', init);