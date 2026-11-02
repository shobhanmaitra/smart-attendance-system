// ---------- Sample data: 10 students ----------
const students = [
  { id: 1,  roll: "CSE101", name: "Aarav Sharma" },
  { id: 2,  roll: "CSE102", name: "Priya Verma" },
  { id: 3,  roll: "CSE103", name: "Rohan Gupta" },
  { id: 4,  roll: "CSE104", name: "Ananya Singh" },
  { id: 5,  roll: "CSE105", name: "Vikram Rathore" },
  { id: 6,  roll: "CSE106", name: "Neha Joshi" },
  { id: 7,  roll: "CSE107", name: "Karan Mehta" },
  { id: 8,  roll: "CSE108", name: "Sneha Agarwal" },
  { id: 9,  roll: "CSE109", name: "Arjun Yadav" },
  { id: 10, roll: "CSE110", name: "Kavya Nair" }
];

// ---------- localStorage helpers ----------
// Data format: { "2026-11-03": { "1": "Present", "2": "Absent" }, ... }
const STORAGE_KEY = "attendanceData";

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getStatus(date, studentId) {
  const data = loadData();
  return (data[date] && data[date][studentId]) || "Not Marked";
}

// ---------- Mark attendance ----------
function markAttendance(studentId, status) {
  const date = dateInput.value;
  const data = loadData();
  if (!data[date]) data[date] = {};
  data[date][studentId] = status;
  saveData(data);
  render();
}

// ---------- Counting ----------
function countStatus(dayData, status) {
  return Object.values(dayData || {}).filter(s => s === status).length;
}

function percentage(present) {
  return ((present / students.length) * 100).toFixed(1);
}

// ---------- Rendering ----------
function renderDashboard(date) {
  const dayData = loadData()[date];
  const present = countStatus(dayData, "Present");
  const absent = countStatus(dayData, "Absent");

  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("presentCount").textContent = present;
  document.getElementById("absentCount").textContent = absent;
  document.getElementById("attendancePercent").textContent = percentage(present) + "%";
}

function renderStudentTable(date) {
  const tbody = document.getElementById("studentTable");
  tbody.innerHTML = "";

  students.forEach(student => {
    const status = getStatus(date, student.id);
    const badgeClass = status.replace(" ", "");
    tbody.innerHTML += `
      <tr>
        <td>${student.roll}</td>
        <td>${student.name}</td>
        <td><span class="badge ${badgeClass}">${status}</span></td>
        <td>
          <button class="btn-present" onclick="markAttendance(${student.id}, 'Present')">Present</button>
          <button class="btn-absent" onclick="markAttendance(${student.id}, 'Absent')">Absent</button>
        </td>
      </tr>`;
  });
}

function renderRecords() {
  const data = loadData();
  const tbody = document.getElementById("recordsTable");
  const dates = Object.keys(data).sort().reverse();

  if (dates.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No attendance records yet.</td></tr>';
    return;
  }

  tbody.innerHTML = "";
  dates.forEach(date => {
    const present = countStatus(data[date], "Present");
    const absent = countStatus(data[date], "Absent");
    tbody.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${present}</td>
        <td>${absent}</td>
        <td>${percentage(present)}%</td>
      </tr>`;
  });
}

function render() {
  const date = dateInput.value;
  renderDashboard(date);
  renderStudentTable(date);
  renderRecords();
}

// ---------- Start ----------
const dateInput = document.getElementById("attendanceDate");
dateInput.value = new Date().toLocaleDateString("en-CA"); // today as YYYY-MM-DD
dateInput.addEventListener("change", render);
render();
