const SUPABASE_URL = "https://ulwsvsakamdpmytptdex.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsd3N2c2FrYW1kcG15dHB0ZGV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjgzNTAsImV4cCI6MjA5MDQ0NDM1MH0.RO4C3HU5_oG3414X6TXqD9akuFJMuGVahqz0sgKPEic";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("Supabase:", supabaseClient);

function login() {
  let email = document.getElementById("email").value;

  if (!email) {
    alert("Enter email");
    return;
  }

  // Show app
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("welcome").innerText = "Hello " + email + "!";
}

// Show Upload
function showUpload() {
  document.getElementById("uploadSection").style.display = "block";
  document.getElementById("qrSection").style.display = "none";
}

// Show QR
function showQR() {
  document.getElementById("qrSection").style.display = "block";
  document.getElementById("uploadSection").style.display = "none";
}

// Upload (basic working)
async function upload() {
  let file = document.getElementById("fileInput").files[0];
  let category = document.getElementById("category").value;
  let custom = document.getElementById("customCategory").value;

  if (custom) category = custom;

  if (!file || !category) {
    alert("Select file & category");
    return;
  }

  let fileName = Date.now() + "_" + file.name;

  let { data, error } = await supabaseClient
    .storage
    .from("Medical_files")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    alert("Upload failed ❌");
    return;
  }

  alert("Uploaded successfully ✅");

  document.getElementById("dataTable").innerHTML += `
    <tr>
      <td>${category}</td>
      <td>${file.name}</td>
    </tr>
  `;
}
