// ========================
// FIREBASE CONFIG
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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// ========================
// VARIABLES
// ========================

const bannedWords = [

"cookie",
"webhook",
"grabify",
"logger",
"token",
"steal",
"hack",
"rat",
".exe"

];

let currentTheme =
localStorage.getItem("theme") || "dark";

let musicEnabled =
localStorage.getItem("music") || "off";

// ========================
// THEME
// ========================

if(currentTheme === "light"){

document.body.classList.add(
"light"
);

}

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

// ========================
// MUSIC
// ========================

const bgMusic =
document.getElementById(
"bgMusic"
);

if(bgMusic){

if(musicEnabled === "on"){

bgMusic.volume = 0.5;

bgMusic.play();

}

}

function toggleMusic(){

if(!bgMusic) return;

if(bgMusic.paused){

bgMusic.play();

localStorage.setItem(
"music",
"on"
);

}else{

bgMusic.pause();

localStorage.setItem(
"music",
"off"
);

}

}

// ========================
// MENU
// ========================

function toggleMenu(){

const sidebar =
document.getElementById(
"sidebar"
);

if(sidebar){

sidebar.classList.toggle(
"active"
);

}

}

// ========================
// LOADING
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
// NOTIFICATION
// ========================

function showNotification(text){

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
// AUTH
// ========================

function register(){

let username =
document.getElementById(
"username"
).value;

let email =
document.getElementById(
"email"
).value;

let password =
document.getElementById(
"password"
).value;

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

auth
.createUserWithEmailAndPassword(
email,
password
)

.then((cred)=>{

cred.user.updateProfile({

displayName:
username

});

cred.user.sendEmailVerification();

db.ref(
"users/" +
cred.user.uid
)

.set({

username:
username,

email:
email,

verified:false,

created:
Date.now(),

followers:0

});

showNotification(
"Register success"
);

location.href =
"login.html";

})

.catch(err=>{

showNotification(
err.message
);

});

}

function login(){

let email =
document.getElementById(
"email"
).value;

let password =
document.getElementById(
"password"
).value;

if(
!email ||
!password
){

showNotification(
"Fill all fields"
);

return;

}

auth
.signInWithEmailAndPassword(
email,
password
)

.then(()=>{

showNotification(
"Login success"
);

location.href =
"index.html";

})

.catch(err=>{

showNotification(
err.message
);

});

}

function logout(){

auth.signOut();

location.href =
"index.html";

}

function verifyEmail(){

if(auth.currentUser){

auth.currentUser
.sendEmailVerification()

.then(()=>{

showNotification(
"Verification sent"
);

});

}

}

// ========================
// PROFILE
// ========================

auth.onAuthStateChanged(
user=>{

if(
document.getElementById(
"profile"
)
){

if(user){

document.getElementById(
"profile"
).innerHTML =

`

<h2>
👤 ${user.displayName}
</h2>

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

📧 Verify

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

if(
!auth.currentUser.emailVerified
){

showNotification(
"Verify email first"
);

return;

}

let title =
document.getElementById(
"title"
).value;

let description =
document.getElementById(
"description"
).value;

let content =
document.getElementById(
"content"
).value;

let keywords =
document.getElementById(
"keywords"
).value;

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
"Dangerous script detected"
);

return;

}

let imageFile =
document.getElementById(
"image"
)?.files[0];

let fileFile =
document.getElementById(
"file"
)?.files[0];

if(fileFile){

if(
fileFile.name
.toLowerCase()
.endsWith(".exe")
){

showNotification(
"EXE blocked"
);

return;

}

}

let imageURL = "";
let fileURL = "";

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

if(fileFile){

const fileRef =
storage.ref(

"files/" +
Date.now() +
"_" +
fileFile.name

);

await fileRef.put(
fileFile
);

fileURL =
await fileRef
.getDownloadURL();

}

let id = Date.now();

db.ref(
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

file:fileURL,

likes:0,

views:0,

comments:0,

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

function likeScript(id){

db.ref(
"scripts/" + id
)

.once("value")

.then(snapshot=>{

let data =
snapshot.val();

db.ref(
"scripts/" +
id +
"/likes"
)

.set(
(data.likes || 0)+1
);

});

}

// ========================
// REPORT
// ========================

function reportScript(id){

let reason =
prompt(
"Why are you reporting?"
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

}

}

// ========================
// PIN
// ========================

function pinScript(id){

db.ref(
"scripts/" +
id +
"/pinned"
)

.set(true);

}

// ========================
// TRENDING
// ========================

function makeTrending(id){

db.ref(
"scripts/" +
id +
"/trending"
)

.set(true);

}

// ========================
// SEARCH
// ========================

function searchScripts(){

let input =
document.getElementById(
"search"
)
.value
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

let input =
document.getElementById(
"comment-" + id
);

let text =
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

let c =
child.val();

html += `

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

const commentsBox =
document.getElementById(
"comments-" + id
);

if(commentsBox){

commentsBox.innerHTML =
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

let script =
child.val();

html += `

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
🏷 ${script.keywords}
</p>

<p>
🕒 ${script.time}
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
style="
width:100%;
border-radius:20px;
margin-top:15px;
">
`
:
``
}

<pre>
${script.content}
</pre>

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

❤️
${script.likes || 0}

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
auth.currentUser.email
===
"HCROBLOX@gmail.com"
?
`

<button onclick="
deleteScript(
'${script.id}'
)
">

🗑 Delete

</button>

<button onclick="
pinScript(
'${script.id}'
)
">

📌 Pin

</button>

<button onclick="
makeTrending(
'${script.id}'
)
">

🔥 Trending

</button>

`
:
``
}

${
script.file
?
`
<br><br>

<a
href="${script.file}"
target="_blank"
>

<button>
⬇ Download
</button>

</a>
`
:
``
}

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
).innerHTML = html;

});

}

// ========================
// REPORTS
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
"HCROBLOX@gmail.com"
){

db.ref("reports")
.on("value",snap=>{

let html = "";

snap.forEach(child=>{

child.forEach(r=>{

let report =
r.val();

html += `

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
).innerHTML = html;

});

}else{

document.body.innerHTML =
"<h1>Access Denied</h1>";

}

});

  }
