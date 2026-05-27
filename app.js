// ========================
// RAIN SHARE FULL APP.JS
// FIXED + OPTIMIZED
// ========================

// ========================
// FIREBASE
// ========================

const firebaseConfig = {

apiKey:
"AIzaSyBeAAxMH9Z4LgUGpv_w8rhhLFfHykuc-vs",

authDomain:
"rain-share.firebaseapp.com",

databaseURL:
"https://rain-share-default-rtdb.firebaseio.com",

projectId:
"rain-share",

storageBucket:
"rain-share.firebasestorage.app",

messagingSenderId:
"521377818281",

appId:
"1:521377818281:web:a91156aff832c0d2a9abb8",

measurementId:
"G-FZT51JLJTE"

};

// ========================
// INIT
// ========================

if(!firebase.apps.length){

firebase.initializeApp(
firebaseConfig
);

}

const auth =
firebase.auth();

const db =
firebase.database();

const storage =
firebase.storage();

// ========================
// VARIABLES
// ========================

const ADMIN_EMAIL =
"HCROBLOX@gmail.com";

const bannedWords = [

"grabify",
"webhook",
"cookie",
"token",
"steal",
"logger",
"hack",
"rat",
".exe"

];

// ========================
// MENU
// ========================

function toggleMenu(){

const sidebar =
document.getElementById(
"sidebar"
);

const overlay =
document.getElementById(
"overlay"
);

if(sidebar){

sidebar.classList.toggle(
"active"
);

}

if(overlay){

overlay.classList.toggle(
"active"
);

}

}

function closeMenu(){

const sidebar =
document.getElementById(
"sidebar"
);

const overlay =
document.getElementById(
"overlay"
);

if(sidebar){

sidebar.classList.remove(
"active"
);

}

if(overlay){

overlay.classList.remove(
"active"
);

}

}

// ========================
// LOADER
// ========================

window.addEventListener(
"load",
()=>{

const loader =
document.getElementById(
"loader"
);

if(loader){

loader.style.opacity =
"0";

setTimeout(()=>{

loader.style.display =
"none";

},500);

}

}
);

// ========================
// NOTIFICATION
// ========================

function showNotification(text){

const old =
document.querySelector(
".notification"
);

if(old){

old.remove();

}

const notify =
document.createElement(
"div"
);

notify.className =
"notification";

notify.innerText =
text;

document.body.appendChild(
notify
);

setTimeout(()=>{

notify.remove();

},3000);

}

// ========================
// THEME
// ========================

function toggleTheme(){

document.body.classList.toggle(
"light"
);

if(
document.body.classList.contains(
"light"
)
){

localStorage.setItem(
"theme",
"light"
);

}else{

localStorage.setItem(
"theme",
"dark"
);

}

}

window.addEventListener(
"load",
()=>{

if(
localStorage.getItem(
"theme"
) === "light"
){

document.body.classList.add(
"light"
);

}

}
);

// ========================
// MUSIC
// ========================

const bgMusic =
document.getElementById(
"bgMusic"
);

function toggleMusic(){

if(!bgMusic) return;

if(bgMusic.paused){

bgMusic.play();

localStorage.setItem(
"music",
"on"
);

showNotification(
"Music ON"
);

}else{

bgMusic.pause();

localStorage.setItem(
"music",
"off"
);

showNotification(
"Music OFF"
);

}

}

window.addEventListener(
"click",
()=>{

if(
bgMusic &&
localStorage.getItem(
"music"
) === "on"
){

bgMusic.play();

}

},
{
once:true
}
);

// ========================
// SECURITY
// ========================

function containsBadWord(text){

text = text.toLowerCase();

return bannedWords.some(
word =>
text.includes(word)
);

}

// ========================
// REGISTER
// ========================

async function register(){

const username =
document.getElementById(
"username"
)?.value;

const email =
document.getElementById(
"email"
)?.value;

const password =
document.getElementById(
"password"
)?.value;

if(
!username ||
!email ||
!password
){

showNotification(
"Fill all fields"
);

return;

}

try{

const cred =
await auth
.createUserWithEmailAndPassword(
email,
password
);

await cred.user
.updateProfile({

displayName:
username

});

await cred.user
.sendEmailVerification();

await db.ref(
"users/" +
cred.user.uid
)

.set({

username:
username,

email:
email,

created:
Date.now(),

verified:false,

followers:0

});

showNotification(
"Register success"
);

setTimeout(()=>{

location.href =
"login.html";

},1000);

}catch(err){

showNotification(
err.message
);

}

}

// ========================
// LOGIN
// ========================

async function login(){

const email =
document.getElementById(
"email"
)?.value;

const password =
document.getElementById(
"password"
)?.value;

if(
!email ||
!password
){

showNotification(
"Fill all fields"
);

return;

}

try{

await auth
.signInWithEmailAndPassword(
email,
password
);

showNotification(
"Login success"
);

setTimeout(()=>{

location.href =
"community.html";

},1000);

}catch(err){

showNotification(
err.message
);

}

}

// ========================
// LOGOUT
// ========================

function logout(){

auth.signOut();

showNotification(
"Logged out"
);

setTimeout(()=>{

location.href =
"index.html";

},1000);

}

// ========================
// VERIFY EMAIL
// ========================

async function verifyEmail(){

if(auth.currentUser){

await auth.currentUser
.sendEmailVerification();

showNotification(
"Verification email sent"
);

}

}

// ========================
// PROFILE
// ========================

auth.onAuthStateChanged(
user=>{

const profile =
document.getElementById(
"profile"
);

if(profile){

if(user){

profile.innerHTML =

`

<h1>

👤 ${user.displayName}

</h1>

<p>

📧 ${user.email}

</p>

<p>

${user.emailVerified
?
"✅ Verified"
:
"❌ Not Verified"}

</p>

<button onclick="
verifyEmail()
">

📧 Verify Email

</button>

<button onclick="
logout()
">

🚪 Logout

</button>

`;

}else{

location.href =
"login.html";

}

}

});

// ========================
// SHARE SCRIPT
// ========================

async function shareScript(){

if(!auth.currentUser){

showNotification(
"Login first"
);

return;

}

const title =
document.getElementById(
"title"
)?.value;

const description =
document.getElementById(
"description"
)?.value;

const content =
document.getElementById(
"content"
)?.value;

const keywords =
document.getElementById(
"keywords"
)?.value;

if(
!title ||
!description ||
!content
){

showNotification(
"Fill all fields"
);

return;

}

if(
containsBadWord(content)
){

showNotification(
"Dangerous script blocked"
);

return;

}

const imageFile =
document.getElementById(
"image"
)?.files[0];

let imageURL = "";

try{

if(imageFile){

const imageRef =
storage.ref(

"images/" +
Date.now() +
"_" +
imageFile.name

);

await imageRef.put(
imageFile
);

imageURL =
await imageRef
.getDownloadURL();

}

const id =
Date.now();

await db.ref(
"scripts/" + id
)

.set({

id:id,

title:title,

description:
description,

content:content,

keywords:keywords,

image:imageURL,

likes:0,

views:0,

pinned:false,

trending:false,

author:
auth.currentUser
.displayName,

authorEmail:
auth.currentUser.email,

time:
new Date()
.toLocaleString()

});

showNotification(
"Script shared"
);

}catch(err){

showNotification(
err.message
);

}

}

// ========================
// COPY
// ========================

function copyScript(text){

navigator.clipboard
.writeText(text);

showNotification(
"Copied"
);

}

// ========================
// LIKE
// ========================

async function likeScript(id){

const ref =
db.ref(
"scripts/" + id
);

const snapshot =
await ref.once("value");

const data =
snapshot.val();

await ref.update({

likes:
(data.likes || 0)+1

});

}

// ========================
// DELETE
// ========================

function deleteScript(id){

if(
confirm(
"Delete script?"
)
){

db.ref(
"scripts/" + id
).remove();

showNotification(
"Deleted"
);

}

}

// ========================
// REPORT
// ========================

function reportScript(id){

const reason =
prompt(
"Why report this script?"
);

if(!reason) return;

db.ref(
"reports/" + id
)

.push({

reason:reason,

reporter:
auth.currentUser
?
auth.currentUser.email
:
"Guest",

time:
new Date()
.toLocaleString()

});

showNotification(
"Report sent"
);

}

// ========================
// SEARCH
// ========================

function searchScripts(){

const input =
document.getElementById(
"search"
)?.value
.toLowerCase();

document
.querySelectorAll(".script")

.forEach(script=>{

if(
script.innerText
.toLowerCase()
.includes(input)
){

script.style.display =
"block";

}else{

script.style.display =
"none";

}

});

}

// ========================
// COMMENTS
// ========================

function sendComment(id){

const input =
document.getElementById(
"comment-" + id
);

if(!input) return;

const text =
input.value;

if(!text) return;

db.ref(
"comments/" + id
)

.push({

user:
auth.currentUser
?
auth.currentUser.displayName
:
"Guest",

text:text,

time:
new Date()
.toLocaleString()

});

input.value = "";

}

function loadComments(id){

db.ref(
"comments/" + id
)

.on("value",snap=>{

let html = "";

snap.forEach(child=>{

const c =
child.val();

html +=

`

<div class="comment">

<b>

${c.user}

</b>

<p>

${c.text}

</p>

</div>

`;

});

const box =
document.getElementById(
"comments-" + id
);

if(box){

box.innerHTML =
html;

}

});

}

// ========================
// LOAD SCRIPTS
// ========================

if(
document.getElementById(
"scripts"
)
){

db.ref("scripts")
.on("value",snap=>{

let html = "";

snap.forEach(child=>{

const script =
child.val();

html +=

`

<div class="script">

<h2>

${script.pinned
?
"📌"
:
""}

${script.trending
?
"🔥"
:
""}

${script.title}

</h2>

<p>

👤 ${script.author}

</p>

<p>

🕒 ${script.time}

</p>

<p>

🏷 ${script.keywords || ""}

</p>

<p>

👀 ${script.views || 0}
views

</p>

<p>

${script.description}

</p>

${
script.image
?
`
<img
src="${script.image}"
class="scriptImage">
`
:
""
}

<pre>

${script.content}

</pre>

<div class="scriptButtons">

<button onclick="
copyScript(
\`${script.content}\`
)
">

📋 Copy

</button>

<button onclick="
likeScript(
'${script.id}'
)
">

❤️ ${script.likes || 0}

</button>

<button onclick="
reportScript(
'${script.id}'
)
">

🚨 Report

</button>

${
auth.currentUser &&
auth.currentUser.email ===
ADMIN_EMAIL
?
`

<button onclick="
deleteScript(
'${script.id}'
)
">

🗑 Delete

</button>

`
:
""
}

</div>

<div id="
comments-${script.id}
">

</div>

<input
id="
comment-${script.id}
"
placeholder="
Comment...
">

<button onclick="
sendComment(
'${script.id}'
)
">

💬 Send

</button>

</div>

`;

setTimeout(()=>{

loadComments(
script.id
);

},100);

});

document.getElementById(
"scripts"
).innerHTML =
html;

});

}

// ========================
// ADMIN REPORTS
// ========================

if(
document.getElementById(
"reports"
)
){

auth.onAuthStateChanged(
user=>{

if(
user &&
user.email ===
ADMIN_EMAIL
){

db.ref("reports")
.on("value",snap=>{

let html = "";

snap.forEach(child=>{

child.forEach(r=>{

const report =
r.val();

html +=

`

<div class="script">

<h2>

🚨 Report

</h2>

<p>

${report.reason}

</p>

<p>

${report.reporter}

</p>

<p>

${report.time}

</p>

</div>

`;

});

});

document.getElementById(
"reports"
).innerHTML =
html;

});

}else{

document.body.innerHTML =

`

<h1 style="
text-align:center;
margin-top:100px;
">

❌ Access Denied

</h1>

`;

}

});

  }
