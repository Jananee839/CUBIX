console.log("JS loaded successfully"); // ✅ Fixed: was "onsole.log"

// ✅ Supabase setup
const SUPABASE_URL = "https://ulwsvsakamdpmytptdex.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsd3N2c2FrYW1kcG15dHB0ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjgzNTAsImV4cCI6MjA5MDQ0NDM1MH0.RO4C3HU5_oG3414X6TXqD9akuFJMuGVahqz0sgKPEic";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase client initialized:", supabaseClient);

// ✅ Store email globally so it persists after login
let currentUserEmail = "";

// ✅ Login
function login() {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  currentUserEmail = email; // ✅ Fixed: store email in a variable that persists

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("welcome").innerText = "Hello, " + currentUserEmail + "!";

  loadExistingFiles(); // ✅ Load already-uploaded files when user logs in
}

// ✅ Show Upload section
function showUpload() {
  document.getElementById("uploadSection").style.display = "block";
  document.getElementById("qrSection").style.display = "none";
}

// ✅ Show QR section
function showQR() {
  document.getElementById("qrSection").style.display = "block";
  document.getElementById("uploadSection").style.display = "none";
}

// ✅ Upload function
/*async function upload() {
  const file = document.getElementById("fileInput").files[0];
  const categorySelect = document.getElementById("category").value;
  const customCategory = document.getElementById("customCategory").value.trim();

  const category = customCategory || categorySelect; // ✅ Cleaner: prefer custom if filled

  if (!file || !category) {
    alert("Please select a file and a category.");
    return;
  }

  const fileName = Date.now() + "_" + file.name;
  console.log("Uploading:", fileName);

  const { data, error } = await supabaseClient
    .storage
    .from("Medical_files")
    .upload(fileName, file);

  if (error) {
    console.error("Upload Error:", error);
    alert("Upload failed: " + error.message);
    return;
  }

  console.log("Upload Success:", data);

  // ✅ Fixed: get the public URL so the file is actually accessible
  const { data: urlData } = supabaseClient
    .storage
    .from("reports")
    .getPublicUrl(fileName);

  const publicURL = urlData.publicUrl;
  console.log("Public URL:", publicURL);

  // ✅ Add row with a clickable link to the uploaded file
  addRowToTable(category, file.name, publicURL);

  alert("Uploaded successfully ✅");
}*/
async function upload() {
  const file = document.getElementById("fileInput").files[0];

  console.log("File:", file);

  // 🔐 Check auth
  const { data: userData, error: userError } = await supabaseClient.auth.getUser();
  console.log("User:", userData, userError);

  // 🧪 Hard test upload
  const { data, error } = await supabaseClient.storage
    .from("medical_files")
    .upload("test.txt", new Blob(["hello"], { type: "text/plain" }));

  console.log("Upload response:", data, error);

  if (error) {
    alert("ERROR: " + error.message);
  } else {
    alert("SUCCESS ✅");
  }
}

// ✅ Helper: add a row to the data table
function addRowToTable(category, fileName, url) {
  const table = document.getElementById("dataTable");
  const linkHTML = url
    ? `<a href="${url}" target="_blank">${fileName}</a>`
    : fileName;

  table.innerHTML += `
    <tr>
      <td>${category}</td>
      <td>${linkHTML}</td>
    </tr>
  `;
}

// ✅ Fixed: load existing files from Supabase on login so table isn't always empty
async function loadExistingFiles() {
  const { data, error } = await supabaseClient
    .storage
    .from("medical_files")
    .list("", { limit: 100, offset: 0 });

  if (error) {
    console.error("Failed to load files:", error);
    return;
  }

  console.log("Existing files:", data);

  for (const file of data) {
    const { data: urlData } = supabaseClient
      .storage
      .from("reports")
      .getPublicUrl(file.name);

    // ✅ Category is unknown for old files, so we label them "Unknown"
    addRowToTable("Unknown", file.name, urlData.publicUrl);
  }
}
function showSignup() {
  document.getElementById("loginCard").classList.add("hidden");
  document.getElementById("signupCard").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("signupCard").classList.add("hidden");
  document.getElementById("loginCard").classList.remove("hidden");
}

/* ============================================================
   DASHBOARD — SPECIALTY SYSTEM
   ============================================================ */

const DEFAULT_SPECIALTIES = [
  { id: "general",        name: "General",           color: "#3B4AC8", icon: "general"    },
  { id: "ent",            name: "ENT",                color: "#D69E2E", icon: "ent"        },
  { id: "pediatrics",     name: "Pediatrics",         color: "#38A169", icon: "pediatrics" },
  { id: "cardiology",     name: "Cardiology",         color: "#E53E3E", icon: "cardiology" },
  { id: "orthopedics",    name: "Orthopedics",        color: "#805AD5", icon: "ortho"      },
  { id: "dermatology",    name: "Dermatology",        color: "#DD6B20", icon: "derma"      },
  { id: "ophthalmology",  name: "Ophthalmology",      color: "#319795", icon: "eye"        },
  { id: "gastro",         name: "Gastroenterology",   color: "#C05621", icon: "gastro"     },
  { id: "neurology",      name: "Neurology",          color: "#553C9A", icon: "neuro"      },
  { id: "gynecology",     name: "Gynecology",         color: "#B83280", icon: "gynec"      },
  { id: "urology",        name: "Urology",            color: "#2B6CB0", icon: "urology"    },
  { id: "pulmonology",    name: "Pulmonology",        color: "#2C7A7B", icon: "pulmo"      },
  { id: "endocrinology",  name: "Endocrinology",      color: "#744210", icon: "endo"       },
  { id: "nephrology",     name: "Nephrology",         color: "#1A365D", icon: "nephro"     },
  { id: "psychiatry",     name: "Psychiatry",         color: "#44337A", icon: "psych"      },
  { id: "dental",         name: "Dental",             color: "#276749", icon: "dental"     },
];

// SVG paths for each icon type
const SPEC_ICONS = {
  general:    `<path d="M12 2v20M2 12h20" stroke="white" stroke-width="2.2" stroke-linecap="round"/>`,
  ent:        `<path d="M12 2a7 7 0 0 1 7 7c0 5-4 8-4 13H9c0-5-4-8-4-13a7 7 0 0 1 7-7z" stroke="white" stroke-width="2" fill="none"/><line x1="9" y1="18" x2="15" y2="18" stroke="white" stroke-width="2"/>`,
  pediatrics: `<circle cx="12" cy="8" r="4" stroke="white" stroke-width="2" fill="none"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M12 2v2M8 3l1 1.7M16 3l-1 1.7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`,
  cardiology: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="white" stroke-width="2" fill="none"/>`,
  ortho:      `<path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  derma:      `<circle cx="12" cy="12" r="9" stroke="white" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="1.5" fill="white"/><circle cx="15" cy="10" r="1.5" fill="white"/><path d="M9 15c1 1.5 5 1.5 6 0" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>`,
  eye:        `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="white" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/>`,
  gastro:     `<path d="M12 2a5 5 0 0 1 5 5c0 3-2 5-2 8H9c0-3-2-5-2-8a5 5 0 0 1 5-5z" stroke="white" stroke-width="2" fill="none"/><path d="M9 15h6M10 18h4" stroke="white" stroke-width="1.8" stroke-linecap="round"/>`,
  neuro:      `<path d="M12 2C8 2 5 5 5 9c0 2.5 1.2 4.7 3 6.1V18h8v-2.9c1.8-1.4 3-3.6 3-6.1 0-4-3-7-7-7z" stroke="white" stroke-width="2" fill="none"/><path d="M9 18v3M15 18v3" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
  gynec:      `<circle cx="12" cy="8" r="5" stroke="white" stroke-width="2" fill="none"/><path d="M12 13v9M9 19h6" stroke="white" stroke-width="2" stroke-linecap="round"/>`,
  urology:    `<path d="M12 2a6 6 0 0 0-6 6c0 6 6 14 6 14s6-8 6-14a6 6 0 0 0-6-6z" stroke="white" stroke-width="2" fill="none"/>`,
  pulmo:      `<path d="M12 4v8M8 8C5 8 3 10 3 13c0 3 2 5 5 5h2M16 8c3 0 5 2 5 5 0 3-2 5-5 5h-2" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>`,
  endo:       `<circle cx="12" cy="12" r="3" stroke="white" stroke-width="2" fill="none"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="white" stroke-width="1.8" stroke-linecap="round"/>`,
  nephro:     `<path d="M12 2a6 6 0 0 0-6 6c0 4 2 7 6 10 4-3 6-6 6-10a6 6 0 0 0-6-6z" stroke="white" stroke-width="2" fill="none"/><circle cx="12" cy="8" r="2" fill="white"/>`,
  psych:      `<path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5.5-4 7v3H9v-3c-2.5-1.5-4-4-4-7a7 7 0 0 1 7-7z" stroke="white" stroke-width="2" fill="none"/>`,
  dental:     `<path d="M8 2C6 2 4 4 4 7c0 2 1 4 2 6l1 9h2l1-6h4l1 6h2l1-9c1-2 2-4 2-6 0-3-2-5-4-5-1 0-2 .5-3 1-1-.5-2-1-3-1z" stroke="white" stroke-width="2" fill="none"/>`,
  custom:     `<path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`,
};

let currentSpecId = null;
let selectedColor  = "#3B4AC8";

function getSpecialties() {
  const raw = localStorage.getItem("dash_specialties");
  return raw ? JSON.parse(raw) : [...DEFAULT_SPECIALTIES];
}
function saveSpecialties(arr) {
  localStorage.setItem("dash_specialties", JSON.stringify(arr));
}
function getFiles(specId) {
  const raw = localStorage.getItem("dash_files_" + specId);
  return raw ? JSON.parse(raw) : [];
}
function saveFiles(specId, files) {
  localStorage.setItem("dash_files_" + specId, JSON.stringify(files));
}

function renderSpecGrid() {
  const specs = getSpecialties();
  const grid  = document.getElementById("specGrid");
  grid.innerHTML = "";

  specs.forEach(spec => {
    const files = getFiles(spec.id);
    const isCustom = !DEFAULT_SPECIALTIES.find(d => d.id === spec.id);
    const iconSvg  = SPEC_ICONS[spec.icon] || SPEC_ICONS.custom;

    const card = document.createElement("div");
    card.className = "spec-card";
    card.innerHTML = `
      <div class="spec-icon" style="background:${spec.color};">
        <svg viewBox="0 0 24 24" fill="none" width="26" height="26">${iconSvg}</svg>
      </div>
      <div class="spec-name">${spec.name}</div>
      <div class="spec-count">${files.length} file${files.length !== 1 ? "s" : ""}</div>
      ${isCustom ? `<button class="spec-delete-btn" title="Remove" onclick="deleteCustomSpec(event,'${spec.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
      </button>` : ""}
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".spec-delete-btn")) return;
      openDashFiles(spec);
    });
    grid.appendChild(card);
  });
}

function openDashFiles(spec) {
  currentSpecId = spec.id;
  document.getElementById("dash-specialties").style.display = "none";
  document.getElementById("dash-files").style.display = "block";

  const iconSvg = SPEC_ICONS[spec.icon] || SPEC_ICONS.custom;
  const files   = getFiles(spec.id);

  document.getElementById("specDetailHeader").innerHTML = `
    <div class="spec-detail-icon" style="background:${spec.color};">
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">${iconSvg}</svg>
    </div>
    <div>
      <div class="spec-detail-name">${spec.name}</div>
      <div class="spec-detail-sub">${files.length} file${files.length !== 1 ? "s" : ""} stored</div>
    </div>
  `;

  renderFileList(spec.id, spec.color);
}

function renderFileList(specId, color) {
  const files   = getFiles(specId);
  const list    = document.getElementById("fileList");
  list.innerHTML = "";

  if (files.length === 0) {
    list.innerHTML = `<div class="no-files-msg">
      <svg viewBox="0 0 24 24" fill="none" stroke="#9499b8" stroke-width="1.5" width="40" height="40"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <div>No files yet. Upload your first file below!</div>
    </div>`;
    return;
  }

  files.forEach((f, idx) => {
    const ext  = f.name.split(".").pop().toUpperCase();
    const item = document.createElement("div");
    item.className = "file-item";
    item.innerHTML = `
      <div class="file-item-icon" style="background:${color}22;">
        <svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="file-item-info">
        <div class="file-item-name">${f.name}</div>
        <div class="file-item-meta">${ext} · ${f.size} · ${f.date}</div>
      </div>
      <div class="file-item-actions">
        ${f.url ? `<button class="file-act-btn" title="Open" onclick="window.open('${f.url}','_blank')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </button>` : ""}
        <button class="file-act-btn del" title="Delete" onclick="deleteFile('${specId}',${idx})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>
    `;
    list.appendChild(item);
  });
}

function closeDashFiles() {
  currentSpecId = null;
  document.getElementById("dash-files").style.display = "none";
  document.getElementById("dash-specialties").style.display = "block";
  renderSpecGrid();
}

function handleSpecUpload(event) {
  const file = event.target.files[0];
  if (!file || !currentSpecId) return;

  const sizeMB = (file.size / 1024 / 1024).toFixed(2) + " MB";
  const date   = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Create a local object URL so user can preview
  const url = URL.createObjectURL(file);

  const files = getFiles(currentSpecId);
  files.push({ name: file.name, size: sizeMB, date, url });
  saveFiles(currentSpecId, files);

  // Refresh the detail header sub-count
  const specs = getSpecialties();
  const spec  = specs.find(s => s.id === currentSpecId);
  if (spec) {
    document.querySelector(".spec-detail-sub").textContent =
      `${files.length} file${files.length !== 1 ? "s" : ""} stored`;
    renderFileList(currentSpecId, spec.color);
  }

  event.target.value = ""; // reset input

  if (typeof showToast === "function") showToast("File added to " + (spec ? spec.name : "specialty") + " ✅");
}

function deleteFile(specId, idx) {
  const files = getFiles(specId);
  files.splice(idx, 1);
  saveFiles(specId, files);
  const specs = getSpecialties();
  const spec  = specs.find(s => s.id === specId);
  if (spec) renderFileList(specId, spec.color);
}

/* ── ADD CUSTOM SPECIALTY MODAL & DELETE — defined in upload section below ── */

/* ============================================================
   UPLOAD PAGE — QR SCAN + CAMERA CAPTURE
   ============================================================ */

let activeStream      = null;   // active MediaStream (camera)
let qrAnimFrame       = null;   // requestAnimationFrame for QR
let uploadPayload     = null;   // { type:'qr'|'cam', name, size, date, url, dataUrl }
let selectedUploadSpec = null;  // chosen specialty id
let jsQRLoaded        = false;

// Lazy-load jsQR for QR decoding
function loadJsQR() {
  return new Promise((resolve) => {
    if (window.jsQR) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

/* ── Stop any active camera stream ── */
function stopAllStreams() {
  if (activeStream) {
    activeStream.getTracks().forEach(t => t.stop());
    activeStream = null;
  }
  if (qrAnimFrame) { cancelAnimationFrame(qrAnimFrame); qrAnimFrame = null; }
}

/* ── Reset Upload page to step 1 ── */
function resetUploadPage() {
  stopAllStreams();
  uploadPayload      = null;
  selectedUploadSpec = null;
  document.getElementById("up-step1").style.display    = "block";
  document.getElementById("up-step-qr").style.display  = "none";
  document.getElementById("up-step-cam").style.display = "none";
  document.getElementById("up-step3").style.display    = "none";
  // reset camera UI
  const camPreviewWrap = document.getElementById("camPreviewWrap");
  const camLive        = document.getElementById("camLive");
  if (camPreviewWrap) { camPreviewWrap.style.display = "none"; }
  if (camLive)        { camLive.style.display = "block"; }
  const qrResult = document.getElementById("qrResult");
  if (qrResult) qrResult.style.display = "none";
}

/* ── Called when user clicks Back in any step ── */
function cancelUploadStep() {
  resetUploadPage();
}

function backToMethod() {
  resetUploadPage();
}

/* ====================================================
   QR SCAN FLOW
   ==================================================== */
async function startQRScan() {
  document.getElementById("up-step1").style.display   = "none";
  document.getElementById("up-step-qr").style.display = "block";

  await loadJsQR();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    activeStream = stream;
    const video = document.getElementById("qrVideo");
    video.srcObject = stream;
    await video.play();
    scanQRFrame(video);
  } catch (err) {
    showToast("Camera permission denied. Please allow camera access.");
    resetUploadPage();
  }
}

function scanQRFrame(video) {
  if (!video.videoWidth) { qrAnimFrame = requestAnimationFrame(() => scanQRFrame(video)); return; }

  const canvas = document.createElement("canvas");
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = window.jsQR && window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

  if (code && code.data) {
    // QR found!
    stopAllStreams();
    const url = code.data;
    document.getElementById("qrResultUrl").textContent = url.length > 60 ? url.slice(0, 60) + "…" : url;
    document.getElementById("qrResult").style.display = "flex";

    // Build payload
    const fileName = url.split("/").pop().split("?")[0] || "scanned-report";
    uploadPayload = {
      type: "qr", name: fileName || "QR Report",
      size: "—", date: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
      url: url, dataUrl: null
    };

    setTimeout(() => {
      document.getElementById("up-step-qr").style.display = "none";
      openStep3();
    }, 1200);
    return;
  }

  qrAnimFrame = requestAnimationFrame(() => scanQRFrame(video));
}

/* ====================================================
   CAMERA CAPTURE FLOW
   ==================================================== */
async function startCamera() {
  document.getElementById("up-step1").style.display    = "none";
  document.getElementById("up-step-cam").style.display = "block";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }
    });
    activeStream = stream;
    const video = document.getElementById("camVideo");
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    showToast("Camera access denied. Please allow camera permissions.");
    resetUploadPage();
  }
}

function capturePhoto() {
  const video  = document.getElementById("camVideo");
  const canvas = document.getElementById("camCanvas");
  canvas.width  = video.videoWidth  || 1280;
  canvas.height = video.videoHeight || 720;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

  // Stop camera immediately after capture
  stopAllStreams();

  // Show preview
  document.getElementById("camPreview").src = dataUrl;
  document.getElementById("camPreviewWrap").style.display = "block";
  document.getElementById("camLive").style.display        = "none";

  // Store in payload temporarily
  uploadPayload = {
    type: "cam", name: "report_" + Date.now() + ".jpg",
    size: "photo", date: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
    url: null, dataUrl
  };
}

function retakePhoto() {
  uploadPayload = null;
  document.getElementById("camPreviewWrap").style.display = "none";
  document.getElementById("camLive").style.display        = "block";
  // Restart camera
  startCamera();
}

function proceedWithCapture() {
  document.getElementById("up-step-cam").style.display = "none";
  openStep3();
}

/* ====================================================
   STEP 3 — SPECIALTY SELECTION
   ==================================================== */
function openStep3() {
  document.getElementById("up-step3").style.display = "block";
  selectedUploadSpec = null;

  // Render preview card
  const prev = document.getElementById("up3Preview");
  if (uploadPayload.type === "cam" && uploadPayload.dataUrl) {
    prev.innerHTML = `
      <img src="${uploadPayload.dataUrl}" alt="Captured report"/>
      <div class="up3-preview-info">
        <div class="up3-preview-name">${uploadPayload.name}</div>
        <div class="up3-preview-sub">${uploadPayload.date}</div>
        <div class="up3-preview-type">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Camera Capture
        </div>
      </div>`;
  } else {
    prev.innerHTML = `
      <div class="up3-preview-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#3B4AC8" stroke-width="2" width="28" height="28"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
      </div>
      <div class="up3-preview-info">
        <div class="up3-preview-name">${uploadPayload.name}</div>
        <div class="up3-preview-sub">${uploadPayload.date}</div>
        <div class="up3-preview-type">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          QR Scanned
        </div>
      </div>`;
  }

  // Render specialty list
  renderUploadSpecList();

  // Update save button
  document.getElementById("up3SaveBtn").disabled = true;
}

function renderUploadSpecList() {
  const specs = getSpecialties();
  const list  = document.getElementById("up3SpecList");
  list.innerHTML = "";

  specs.forEach(spec => {
    const iconSvg = SPEC_ICONS[spec.icon] || SPEC_ICONS.custom;
    const item = document.createElement("div");
    item.className = "up3-spec-item";
    item.dataset.specId = spec.id;
    item.innerHTML = `
      <div class="up3-spec-icon" style="background:${spec.color};">
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">${iconSvg}</svg>
      </div>
      <span>${spec.name}</span>
    `;
    item.addEventListener("click", () => {
      document.querySelectorAll(".up3-spec-item").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
      selectedUploadSpec = spec.id;
      document.getElementById("up3SaveBtn").disabled = false;
    });
    list.appendChild(item);
  });
}

function openAddSpecFromUpload() {
  openAddSpecModal();
}

/* ── ADD CUSTOM SPECIALTY MODAL ── */
function openAddSpecModal() {
  document.getElementById("addSpecModal").style.display = "flex";
  document.getElementById("newSpecName").value = "";
  selectedColor = "#3B4AC8";
  document.querySelectorAll(".col-opt").forEach(b => {
    b.classList.toggle("selected", b.dataset.color === selectedColor);
  });
}
function closeAddSpecModal(e) {
  if (e && e.target !== document.getElementById("addSpecModal")) return;
  document.getElementById("addSpecModal").style.display = "none";
}
function selectColor(btn) {
  document.querySelectorAll(".col-opt").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedColor = btn.dataset.color;
}
function addCustomSpecialty() {
  const name = document.getElementById("newSpecName").value.trim();
  if (!name) { alert("Please enter a specialty name."); return; }

  const specs = getSpecialties();
  const id = "custom_" + Date.now();
  specs.push({ id, name, color: selectedColor, icon: "custom", custom: true });
  saveSpecialties(specs);
  document.getElementById("addSpecModal").style.display = "none";
  renderSpecGrid();
  // If step3 (upload specialty select) is visible, refresh it too
  if (document.getElementById("up-step3") && document.getElementById("up-step3").style.display !== "none") {
    renderUploadSpecList();
  }
  if (typeof showToast === "function") showToast("'" + name + "' specialty added ✅");
}
function deleteCustomSpec(e, specId) {
  e.stopPropagation();
  if (!confirm("Remove this specialty?")) return;
  let specs = getSpecialties();
  specs = specs.filter(s => s.id !== specId);
  saveSpecialties(specs);
  localStorage.removeItem("dash_files_" + specId);
  renderSpecGrid();
  if (typeof showToast === "function") showToast("Specialty removed.");
}

function saveToSpecialty() {
  if (!selectedUploadSpec || !uploadPayload) return;

  const files = getFiles(selectedUploadSpec);
  const entry = {
    name: uploadPayload.name,
    size: uploadPayload.size,
    date: uploadPayload.date,
    url:  uploadPayload.url || uploadPayload.dataUrl || null,
    type: uploadPayload.type
  };
  files.push(entry);
  saveFiles(selectedUploadSpec, files);

  const specs = getSpecialties();
  const spec  = specs.find(s => s.id === selectedUploadSpec);
  showToast("Saved to " + (spec ? spec.name : "Dashboard") + " ✅");

  // Reset and go to dashboard
  resetUploadPage();
  setTimeout(() => showPage("dashboard"), 400);
}

/* ── Reset upload page whenever tab is opened ── */
// (handled by showPage in index.html inline script)

// Auto-render on page load
document.addEventListener("DOMContentLoaded", () => {
  renderSpecGrid();
});
/* ============================================================
   NOTES — Full Feature
   ============================================================ */
const NOTE_COLORS = ['#FFF8E1','#E8F5E9','#E3F2FD','#FCE4EC','#F3E5F5','#E0F7FA'];
let noteFilter   = 'all';
let editingNoteId = null;
let selectedNoteColor = '#FFF8E1';

const NOTE_SEED = [
  { id: 'note_seed1', title: 'Blood Pressure Log', content: 'Morning reading: 120/80 mmHg. Evening: 118/78. Feeling good — continue current medication dosage. Follow up with Dr. Sharma next week.', tag: 'medication', color: '#E3F2FD', date: fmtNoteDate(new Date()) },
  { id: 'note_seed2', title: 'Post Cardiology Checkup', content: 'ECG results normal. Doctor advised 30 min brisk walk daily. Reduce salt intake. Schedule echo test next month.', tag: 'general', color: '#E8F5E9', date: fmtNoteDate(new Date(Date.now() - 86400000)) },
  { id: 'note_seed3', title: 'Dietary Changes', content: 'Switching to low-GI diet. Avoid processed sugars. Include more leafy greens, oats, and nuts. Drink at least 2.5L of water daily.', tag: 'diet', color: '#FFF8E1', date: fmtNoteDate(new Date(Date.now() - 172800000)) },
];

function fmtNoteDate(d) {
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function getNotes() {
  const raw = localStorage.getItem('medi_notes');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('medi_notes', JSON.stringify(NOTE_SEED));
  return NOTE_SEED;
}
function saveNotes(arr) { localStorage.setItem('medi_notes', JSON.stringify(arr)); }

function setNoteFilter(tag, btn) {
  noteFilter = tag;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderNotes();
}

function renderNotes() {
  const grid   = document.getElementById('notesGrid');
  if (!grid) return;
  const query  = (document.getElementById('notesSearch') ? document.getElementById('notesSearch').value.trim().toLowerCase() : '');
  let notes    = getNotes();

  if (noteFilter !== 'all') notes = notes.filter(n => n.tag === noteFilter);
  if (query) notes = notes.filter(n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query));

  grid.innerHTML = '';
  if (notes.length === 0) {
    grid.innerHTML = `<div class="notes-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="#9499b8" stroke-width="1.5" width="48" height="48"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      <h4>No notes found</h4>
      <p>${query || noteFilter !== 'all' ? 'Try adjusting your search or filter.' : 'Tap "New Note" to write your first health memo!'}</p>
    </div>`;
    return;
  }

  notes.forEach(note => {
    const tagLabels = { general:'General', medication:'Medication', diet:'Diet', symptoms:'Symptoms', other:'Other' };
    const card = document.createElement('div');
    card.className = 'note-card';
    card.style.background = note.color || '#FFF8E1';
    card.innerHTML = `
      <span class="note-tag tag-${note.tag}">${tagLabels[note.tag] || 'General'}</span>
      <div class="note-card-title">${escHtml(note.title)}</div>
      <div class="note-card-body">${escHtml(note.content)}</div>
      <div class="note-card-footer">
        <span class="note-date">${note.date}</span>
        <div class="note-actions">
          <button class="note-act-btn" title="Edit" onclick="editNote('${note.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
          </button>
          <button class="note-act-btn del" title="Delete" onclick="deleteNote('${note.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function openNoteModal(id) {
  editingNoteId = id || null;
  selectedNoteColor = '#FFF8E1';
  document.getElementById('noteModalTitle').textContent = id ? 'Edit Note' : 'New Note';
  document.getElementById('noteTitle').value   = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('noteTag').value     = 'general';
  document.querySelectorAll('.note-color-opt').forEach(b => {
    b.classList.toggle('selected', b.dataset.color === selectedNoteColor);
  });
  if (id) {
    const note = getNotes().find(n => n.id === id);
    if (note) {
      document.getElementById('noteTitle').value   = note.title;
      document.getElementById('noteContent').value = note.content;
      document.getElementById('noteTag').value     = note.tag;
      selectedNoteColor = note.color || '#FFF8E1';
      document.querySelectorAll('.note-color-opt').forEach(b => {
        b.classList.toggle('selected', b.dataset.color === selectedNoteColor);
      });
    }
  }
  document.getElementById('noteModal').style.display = 'flex';
}

function closeNoteModal() { document.getElementById('noteModal').style.display = 'none'; }
function closeNoteModalOutside(e) { if (e.target === document.getElementById('noteModal')) closeNoteModal(); }

function selectNoteColor(btn) {
  document.querySelectorAll('.note-color-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedNoteColor = btn.dataset.color;
}

function saveNote() {
  const title   = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  const tag     = document.getElementById('noteTag').value;
  if (!title) { document.getElementById('noteTitle').focus(); return; }
  if (!content) { document.getElementById('noteContent').focus(); return; }

  let notes = getNotes();
  if (editingNoteId) {
    notes = notes.map(n => n.id === editingNoteId ? { ...n, title, content, tag, color: selectedNoteColor } : n);
    showToast('Note updated ✅');
  } else {
    notes.unshift({ id: 'note_' + Date.now(), title, content, tag, color: selectedNoteColor, date: fmtNoteDate(new Date()) });
    showToast('Note saved ✅');
  }
  saveNotes(notes);
  closeNoteModal();
  renderNotes();
}

function editNote(id) { openNoteModal(id); }

function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  saveNotes(getNotes().filter(n => n.id !== id));
  showToast('Note deleted');
  renderNotes();
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   REMINDERS — Full Feature
   ============================================================ */
const REM_TYPE_META = {
  medication:  { emoji: '💊', bg: '#FEE2E2', label: 'Medication'   },
  appointment: { emoji: '🏥', bg: '#DBEAFE', label: 'Appointment'  },
  checkup:     { emoji: '🩺', bg: '#DCFCE7', label: 'Check-up'     },
  exercise:    { emoji: '🏃', bg: '#FEF9C3', label: 'Exercise'      },
  diet:        { emoji: '🥗', bg: '#D1FAE5', label: 'Diet'          },
  other:       { emoji: '📌', bg: '#EDE9FE', label: 'Other'         },
};

const REPEAT_LABELS = { none:'No repeat', daily:'Daily', weekly:'Weekly', monthly:'Monthly' };

let editingRemId = null;

function getTodayStr() { return new Date().toISOString().split('T')[0]; }
function makeDateStr(offsetDays) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}
function makePastDatetime(offsetDays) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return { date: d.toISOString().split('T')[0], time: '09:00' };
}

const REM_SEED = (() => {
  const y = makeDateStr(-1), tod = makeDateStr(0), tom = makeDateStr(1);
  return [
    { id:'rem_s1', title:'Take Metformin', desc:'500mg after breakfast', date: y,   time:'08:00', type:'medication', repeat:'daily',  done:false },
    { id:'rem_s2', title:'Cardiologist Appointment', desc:'Room 204, City Hospital', date: tod, time:'11:30', type:'appointment', repeat:'none', done:false },
    { id:'rem_s3', title:'Blood Sugar Test', desc:'Fasting test — no food after midnight', date: tom, time:'07:30', type:'checkup', repeat:'none', done:false },
    { id:'rem_s4', title:'Evening Walk', desc:'30 min brisk walk in the park', date: y, time:'18:00', type:'exercise', repeat:'daily', done:true },
  ];
})();

function getReminders() {
  const raw = localStorage.getItem('medi_reminders');
  if (raw) return JSON.parse(raw);
  localStorage.setItem('medi_reminders', JSON.stringify(REM_SEED));
  return REM_SEED;
}
function saveReminders(arr) { localStorage.setItem('medi_reminders', JSON.stringify(arr)); }

function isOverdue(rem) {
  if (rem.done) return false;
  const dt = new Date(rem.date + 'T' + (rem.time || '00:00'));
  return dt < new Date();
}

function fmtDateTime(date, time) {
  const d = new Date(date + 'T' + (time || '00:00'));
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

function renderReminders() {
  const listEl = document.getElementById('reminderList');
  const sumEl  = document.getElementById('remSummary');
  if (!listEl || !sumEl) return;

  const rems    = getReminders();
  const overdue = rems.filter(r => isOverdue(r));
  const upcoming= rems.filter(r => !r.done && !isOverdue(r));
  const done    = rems.filter(r => r.done);

  // Summary
  sumEl.innerHTML = `
    <div class="rem-chip">
      <div class="rem-chip-emoji">🔔</div>
      <div><div class="rem-chip-count">${rems.length}</div><div class="rem-chip-label">Total</div></div>
    </div>
    <div class="rem-chip">
      <div class="rem-chip-emoji">⏳</div>
      <div><div class="rem-chip-count upcoming">${upcoming.length}</div><div class="rem-chip-label">Upcoming</div></div>
    </div>
    <div class="rem-chip">
      <div class="rem-chip-emoji">⚠️</div>
      <div><div class="rem-chip-count overdue">${overdue.length}</div><div class="rem-chip-label">Overdue</div></div>
    </div>
    <div class="rem-chip">
      <div class="rem-chip-emoji">✅</div>
      <div><div class="rem-chip-count done">${done.length}</div><div class="rem-chip-label">Done</div></div>
    </div>`;

  listEl.innerHTML = '';

  if (rems.length === 0) {
    listEl.innerHTML = `<div class="rem-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="#9499b8" stroke-width="1.5" width="48" height="48"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <h4>No reminders yet</h4>
      <p>Tap "New Reminder" to add your first medication or appointment reminder!</p>
    </div>`;
    return;
  }

  const renderGroup = (label, items, dotClass) => {
    if (items.length === 0) return;
    const grp = document.createElement('div');
    grp.className = 'rem-group';
    grp.innerHTML = `<div class="rem-group-label"><span class="rem-group-dot ${dotClass}"></span>${label} (${items.length})</div>`;
    items.forEach(rem => grp.appendChild(buildRemCard(rem)));
    listEl.appendChild(grp);
  };

  renderGroup('Overdue', overdue, 'overdue');
  renderGroup('Upcoming', upcoming, 'upcoming');
  renderGroup('Done', done, 'done');
}

function buildRemCard(rem) {
  const meta   = REM_TYPE_META[rem.type] || REM_TYPE_META.other;
  const over   = isOverdue(rem);
  const card   = document.createElement('div');
  card.className = 'rem-card' + (over ? ' overdue-card' : '') + (rem.done ? ' done-card' : '');
  card.innerHTML = `
    <div class="rem-type-icon" style="background:${meta.bg};">${meta.emoji}</div>
    <div class="rem-body">
      <div class="rem-card-title">${escHtml(rem.title)}</div>
      ${rem.desc ? `<div class="rem-card-desc">${escHtml(rem.desc)}</div>` : ''}
      <div class="rem-badge-row">
        <span class="rem-badge time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${fmtDateTime(rem.date, rem.time)}
        </span>
        ${rem.repeat !== 'none' ? `<span class="rem-badge repeat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          ${REPEAT_LABELS[rem.repeat]}
        </span>` : ''}
        ${over ? `<span class="rem-badge overdue">⚠️ Overdue</span>` : ''}
      </div>
    </div>
    <div class="rem-actions">
      ${rem.done
        ? `<button class="rem-act-btn undo-btn" onclick="toggleRemDone('${rem.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg> Undo</button>`
        : `<button class="rem-act-btn done-btn" onclick="toggleRemDone('${rem.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg> Done</button>`}
      <button class="rem-act-btn edit-btn" onclick="editReminder('${rem.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg> Edit</button>
      <button class="rem-act-btn del-btn" onclick="deleteReminder('${rem.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg> Delete</button>
    </div>`;
  return card;
}

function toggleRemDone(id) {
  const rems = getReminders().map(r => r.id === id ? { ...r, done: !r.done } : r);
  saveReminders(rems);
  const rem = rems.find(r => r.id === id);
  showToast(rem.done ? 'Marked as done ✅' : 'Marked as pending');
  renderReminders();
}

function openReminderModal(id) {
  editingRemId = id || null;
  document.getElementById('remModalTitle').textContent = id ? 'Edit Reminder' : 'New Reminder';
  document.getElementById('remTitle').value  = '';
  document.getElementById('remDesc').value   = '';
  document.getElementById('remDate').value   = getTodayStr();
  document.getElementById('remTime').value   = '09:00';
  document.getElementById('remType').value   = 'medication';
  document.getElementById('remRepeat').value = 'none';
  if (id) {
    const rem = getReminders().find(r => r.id === id);
    if (rem) {
      document.getElementById('remTitle').value  = rem.title;
      document.getElementById('remDesc').value   = rem.desc || '';
      document.getElementById('remDate').value   = rem.date;
      document.getElementById('remTime').value   = rem.time || '09:00';
      document.getElementById('remType').value   = rem.type;
      document.getElementById('remRepeat').value = rem.repeat;
    }
  }
  document.getElementById('reminderModal').style.display = 'flex';
}

function closeReminderModal() { document.getElementById('reminderModal').style.display = 'none'; }
function closeReminderModalOutside(e) { if (e.target === document.getElementById('reminderModal')) closeReminderModal(); }

function saveReminder() {
  const title  = document.getElementById('remTitle').value.trim();
  const desc   = document.getElementById('remDesc').value.trim();
  const date   = document.getElementById('remDate').value;
  const time   = document.getElementById('remTime').value;
  const type   = document.getElementById('remType').value;
  const repeat = document.getElementById('remRepeat').value;

  if (!title) { document.getElementById('remTitle').focus(); return; }
  if (!date)  { document.getElementById('remDate').focus();  return; }
  if (!time)  { document.getElementById('remTime').focus();  return; }

  let rems = getReminders();
  if (editingRemId) {
    rems = rems.map(r => r.id === editingRemId
      ? { ...r, title, desc, date, time, type, repeat }
      : r);
    showToast('Reminder updated ✅');
  } else {
    rems.push({ id: 'rem_' + Date.now(), title, desc, date, time, type, repeat, done: false });
    showToast('Reminder saved ✅');
  }
  saveReminders(rems);
  closeReminderModal();
  renderReminders();
}

function editReminder(id) { openReminderModal(id); }

function deleteReminder(id) {
  if (!confirm('Delete this reminder?')) return;
  saveReminders(getReminders().filter(r => r.id !== id));
  showToast('Reminder deleted');
  renderReminders();
}

// Init on DOMContentLoaded (already declared above — append to existing listener via a second call, safe in modern browsers)
document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
  renderReminders();
});
