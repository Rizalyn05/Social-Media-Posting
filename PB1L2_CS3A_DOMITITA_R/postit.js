/*
    PB1-L2
    Social Media Posting with AES-192

    This program allows one user to enter their information once
    and create caption-only posts.

    Each post is encrypted using AES-192.
*/

// AES-192 requires a 24-byte key.
// This key contains exactly 24 characters.
const AES_KEY = CryptoJS.enc.Utf8.parse("AES-192-Secret-Key-2026!");

// AES initialization vector.
// 16 bytes are required for AES CBC.
const AES_IV = CryptoJS.enc.Utf8.parse("1234567890123456");

// Store user information
let currentUser = null;

// ----------------------------------------------------
// AES-192 ENCRYPTION
// ----------------------------------------------------

function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(data, AES_KEY, {
    iv: AES_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
}

// ----------------------------------------------------
// SAVE USER
// ----------------------------------------------------

function saveUser() {
  const fullname = document.getElementById("fullname").value.trim();
  const birthday = document.getElementById("birthday").value;
  const yearlevel = document.getElementById("yearlevel").value;
  const gender = document.getElementById("gender").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check if all fields are filled
  if (
    !fullname ||
    !birthday ||
    !yearlevel ||
    !gender ||
    !username ||
    !password
  ) {
    showMessage("user-message", "Please fill in all fields.", "red");

    return;
  }

  // Save the user in memory.
  // There is only one user at a time.
  currentUser = {
    fullname: fullname,
    birthday: birthday,
    yearlevel: yearlevel,
    gender: gender,
    username: username,
    password: password,
  };

  // Display the user's name
  document.getElementById("display-name").textContent = fullname;

  // Hide user information
  document.getElementById("user-section").classList.add("hidden");

  // Show posting area
  document.getElementById("post-section").classList.remove("hidden");

  showMessage("user-message", "User information saved successfully!", "green");
}

// ----------------------------------------------------
// SUBMIT POST
// ----------------------------------------------------

function submitPost() {
  if (!currentUser) {
    showMessage("post-message", "Please enter your information first.", "red");

    return;
  }

  const postText = document.getElementById("post-text").value.trim();

  // Do not allow empty posts
  if (!postText) {
    showMessage("post-message", "Please enter a caption.", "red");

    return;
  }

  // Get the current date and time
  const date = new Date();

  const formattedDate = date.toLocaleString();

  /*
        Create the required data:

        Stringified USERNAME + POST + DATE
    */

  const postData = JSON.stringify({
    username: currentUser.username,
    post: postText,
    date: formattedDate,
  });

  // Encrypt the post using AES-192
  const encryptedPost = encryptData(postData);

  // Create the post element
  const post = document.createElement("div");

  post.className = "post";

  post.innerHTML = `<div class="original">ORIGINAL POST</div>

        <div class="caption">
            ${escapeHTML(postText)}
        </div>

        <div class="encrypted">
            ${encryptedPost}
        </div>

        <div class="date">
            Posted: ${formattedDate}
        </div>`;

  // Add newest post below the post box
  document.getElementById("post-thread").prepend(post);
  // Clear post box
  document.getElementById("post-text").value = "";

  showMessage("post-message", "Post added successfully!", "green");
}

// ----------------------------------------------------
// RESET USER
// ----------------------------------------------------

function logout() {
  currentUser = null;

  // Clear the post thread
  document.getElementById("post-thread").innerHTML = "";

  // Clear input fields
  document.getElementById("fullname").value = "";
  document.getElementById("birthday").value = "";
  document.getElementById("yearlevel").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  // Show user information
  document.getElementById("user-section").classList.remove("hidden");

  // Hide posting area
  document.getElementById("post-section").classList.add("hidden");

  showMessage("user-message", "User has been reset.", "black");
}

// ----------------------------------------------------
// DISPLAY MESSAGE
// ----------------------------------------------------

function showMessage(id, text, color) {
  const message = document.getElementById(id);

  if (message) {
    message.textContent = text;
    message.style.color = color;
  }
}

// ----------------------------------------------------
// PREVENT HTML CODE FROM BEING INSERTED INTO POSTS
// ----------------------------------------------------

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
