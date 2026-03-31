PROJECT DESCRIPTION : 
Medirecord is a Digital Health Record Management System designed to store, manage, and access patient data efficiently. It helps improve data organization and ensures quick retrieval of medical records

💡 The Idea
Healthcare records are messy. Physical files get lost, digital files are scattered across hospital portals, WhatsApp forwards, and email attachments. Patients — especially in India — have no single place to store, retrieve, and share their medical history.

MediRecord solves this by being:

🗂️ A personal health vault — categorize reports by medical specialty (Cardiology, ENT, Dental, etc.)
📷 Report-capture friendly — scan a QR code on a report or photograph a physical document directly from your phone camera
📝 A health journal — write personal health notes (medication logs, post-checkup observations, diet changes)
🔔 A smart reminder system — never miss a medicine dose or doctor appointment
👤 A profile keeper — store blood group, allergies, emergency contacts — the data doctors always ask for
The ideology is simplicity meets utility: no account setup friction, no cloud lock-in anxiety, no heavy frameworks. Just open the page and start managing your health.

✨ Features
🔐 Authentication : 
Email + password login UI integrated with Supabase Auth
Signup with social options (Google, Facebook — UI ready)
Toggle password visibility
"Remember me" and "Forgot password" UX elements

🏠 Home Dashboard :
Patient profile card: Name, Date of Birth, Gender, Blood Group, Phone, Email
Quick-action shortcuts to Upload, Dashboard, Notes, and Reminders
👤 Profile Management
Fill / edit personal health details:
Full name, DOB, gender, blood group
Phone, emergency contact name + number
Known allergies
All data persisted instantly in localStorage

📤 Upload Medical Records — Three Methods : 
1. 📷 QR Code Scanner
Activates device rear camera via getUserMedia
Lazy-loads jsQR library for real-time QR decoding (frame-by-frame via requestAnimationFrame)
Animated scan frame with animated green sweep line
On successful detection: extracts file URL, shows success card, auto-advances to specialty selection
2. 📸 Camera Capture
Live camera viewfinder with a document-alignment guide overlay
Large shutter button with press animation
Preview the captured photo — Retake or Use This Photo
Photo stored as a base64 JPEG data URL
Both flows merge into Step 3: Specialty Selection, where users categorize and save the file to their dashboard.
3. File manager :
Can also upload reports that is already stored in the file manager.
All these flows merge into Step 3: Specialty Selection, where users categorize and save the file to their dashboard.

📝 Notes — Health Journal
Full create / edit / delete note workflow
Tag system: General, Medication, Diet, Symptoms, Other
Color-coded cards: 6 pastel card colors to personalize notes
Live search — filters notes in real-time by title or content
Tag filter pills — one-click filtering by category
Pre-seeded with 3 realistic sample notes on first launch
Animated cards with hover-reveal edit/delete actions

🔔 Reminders
Create/edit/delete reminders for: 💊 Medication · 🏥 Appointment · 🩺 Check-up · 🏃 Exercise · 🥗 Diet · 📌 Other
Set date, time, and repeat frequency (None / Daily / Weekly / Monthly)
Summary chips: Total / Upcoming / Overdue / Done
Reminder groups: Overdue (red highlight) · Upcoming · Done
Mark as Done / Undo with instant re-render
Pre-seeded with 4 realistic sample reminders

 UI / UX Highlights
Fully responsive: top navbar on desktop → bottom tab bar on mobile
Smooth entry animations (slideUp keyframes) on all cards and modals
Toast notifications for every user action
Modal dialogs with backdrop blur for add/edit workflows
DM Sans (body) + Playfair Display (headings) typography
Deep indigo #3B4AC8 primary with carefully chosen semantic accent colors

App Structure : 
MediRecord
├── Login Page
│   ├── Left Panel  — animated illustration + brand identity
│   └── Right Panel — Login card / Signup card (toggled)
│
└── Main App (post-login)
    ├── Navbar (desktop) / Bottom Tab Bar (mobile)
    │
    ├── 🏠 Home
    │   ├── Gradient Welcome Banner (time-aware greeting)
    │   ├── Personal Info Cards (6 health fields)
    │   └── Quick Action Grid (4 shortcut cards)
    │
    ├── 👤 Profile Fill
    │   └── 8-field health profile form → saved to localStorage
    │
    ├── 🗂️ Dashboard
    │   ├── Specialty Grid View (16 defaults + custom)
    │   └── File Detail View (per specialty — list + inline upload)
    │
    ├── 📤 Upload
    │   ├── Step 1: Method Selection (QR Scan / Camera Capture)
    │   ├── Step 2A: QR Scanner (live + frame decoding)
    │   ├── Step 2B: Camera Capture (live + preview + retake)
    │   └── Step 3: Specialty Selection → Save to Dashboard
    │
    ├── 📝 Notes
    │   ├── Search Bar + Tag Filter Pills
    │   ├── Color-coded Notes Grid
    │   └── Add / Edit Note Modal
    │
    └── 🔔 Reminders
        ├── Summary Chips (Total / Upcoming / Overdue / Done)
        ├── Grouped Reminder Cards (with overdue highlighting)
        └── Add / Edit Reminder Modal

Key Implementation Patterns : 
Page System All app pages are <div> elements that are shown/hidden via display CSS class toggling. showPage(name) activates the target page and syncs both the desktop nav and mobile bottom bar highlight state.

Specialty System Specialties array stored in localStorage under dash_specialties. Files per specialty stored under dash_files_<specId>. The 16 defaults are seeded on first visit; custom specialties are pushed into the same array.

QR Scanner startQRScan() calls getUserMedia({ facingMode: 'environment' }), feeds the stream into a <video> element, and runs jsQR() on canvas-extracted frames via requestAnimationFrame. On detection, the stream is stopped and the decoded URL is forwarded.

Camera Capture startCamera() opens a live viewfinder. capturePhoto() paints the current video frame onto a hidden <canvas> and calls toDataURL('image/jpeg', 0.92) to produce a base64 snapshot, which is shown as a preview image and stored in uploadPayload.

Notes & Reminders Both modules are full CRUD systems backed by localStorage. Reminders compare new Date(rem.date + 'T' + rem.time) against new Date() to dynamically classify each reminder as Overdue / Upcoming / Done on every render.

Project File Structure : 
medirecord/
├── index.html     # Complete SPA markup + page-control + profile-save scripts
├── style.css      # Full stylesheet (~1,000 lines) — no framework, no preprocessor
└── script.js      # All app logic — auth, dashboard, upload, notes, reminders

Planned Features : 
 Full Supabase Auth (email/password + Google OAuth)
 Cloud file uploads — store files in Supabase Storage, persist public URLs
 Cross-device sync via Supabase database
 Web Push notifications for reminders
 QR code generator — create a shareable QR for your health record

🤝 Contributing
Contributions are welcome!

Fork the repository
Create your feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m "Add: amazing feature"
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request

⚙️ How to Run the Project
1. Download or clone the repository  
2. Open index.html in your browser
   
📌 Future Enhancements
- Add database integration  
- Improve UI design  
- Add login authentication  

📄 License
This project is for academic purposes.
