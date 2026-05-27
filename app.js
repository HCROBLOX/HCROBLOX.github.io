// =========================
// 🌧 RAIN SHARE APP.JS
// FULL FIXED + OPTIMIZED
// =========================

// =========================
// FIREBASE CONFIG
// =========================

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

// =========================
// INIT FIREBASE
// =========================

firebase.initializeApp(
firebaseConfig
);

const auth =
firebase.auth();

const db =
firebase.database();

const storage =
firebase.storage();

// =========================
// ELEMENTS
// =========================

const sidebar =
document.getElementById(
"sidebar"
);

const overlay =
document.getElementById(
"overlay"
);

const loader =
document.getElementById(
"loader"
);

const music =
document.getElementById(
"bgMusic"
);

// =========================
// LOADER FIX
// =========================

window.addEventListener(
"load",
()=>{

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

// =========================
// MENU SYSTEM
// =========================

function toggleMenu(){

if(!sidebar) return;

sidebar.classList.toggle(
"active"
);

overlay.classList.toggle(
"active"
);

document.body.style.overflow =
sidebar.classList.contains(
"active"
)
?
"hidden"
:
"auto";

}

function closeMenu(){

sidebar.classList.remove(
"active"
);

overlay.classList.remove(
"active"
);

document.body.style.overflow =
"auto";

}

// =========================
// AUTO CLOSE SIDEBAR
// =========================

document.addEventListener(
"click",
(e)=>{

if(
window.innerWidth <= 768 &&
sidebar.classList.contains(
"active"
)
){

if(
!sidebar.contains(
e.target
)
&&
!e.target.classList.contains(
"menuBtn"
)
){

closeMenu();

}

}

}
);

// =========================
// ESC CLOSE
// =========================

document.addEventListener(
"keydown",
(e)=>{

if(e.key === "Escape"){

closeMenu();

}

}
);

// =========================
// THEME SYSTEM
// =========================

function toggleTheme(){

document.body.classList.toggle(
"lightMode"
);

const isLight =
document.body.classList.contains(
"lightMode"
);

localStorage.setItem(
"theme",
isLight
?
"light"
:
"dark"
);

}

if(
localStorage.getItem(
"theme"
) === "light"
){

document.body.classList.add(
"lightMode"
);

}

// =========================
// MUSIC SYSTEM
// =========================

function toggleMusic(){

if(!music) return;

if(music.paused){

music.play();

localStorage.setItem(
"music",
"on"
);

}else{

music.pause();

localStorage.setItem(
"music",
"off"
);

}

}

// AUTO PLAY FIX

document.addEventListener(
"click",
()=>{

if(
music &&
localStorage.getItem(
"music"
) === "on"
){

music.play();

}

},
{
once:true
}
);

// =========================
// MOBILE FIX
// =========================

function mobileFix(){

document.body.style.maxWidth =
"100%";

document.body.style.overflowX =
"hidden";

document.querySelectorAll(
"img"
)
.forEach(img=>{

img.style.maxWidth =
"100%";

img.style.height =
"auto";

});

}

mobileFix();

window.addEventListener(
"resize",
mobileFix
);

// =========================
// AUTH SYSTEM
// =========================

auth.onAuthStateChanged(
(user)=>{

const currentPage =
window.location.pathname
.split("/")
.pop();

const protectedPages = [

"community.html",
"admin.html",
"profile.html"

];

if(
!user &&
protectedPages.includes(
currentPage
)
){

window.location.href =
"login.html";

}

if(user){

console.log(
"Logged in:",
user.email
);

}else{

console.log(
"Not logged in"
);

}

}
);

// =========================
// REGISTER
// =========================

function register(){

const email =
document.getElementById(
"registerEmail"
)?.value;

const password =
document.getElementById(
"registerPassword"
)?.value;

if(!email || !password){

alert(
"Please fill all fields."
);

return;

}

auth.createUserWithEmailAndPassword(
email,
password
)
.then((cred)=>{

db.ref(
"users/" + cred.user.uid
).set({

email: email,

createdAt:
Date.now()

});

alert(
"Register success!"
);

window.location.href =
"login.html";

})
.catch(err=>{

alert(err.message);

});

}

// =========================
// LOGIN
// =========================

function login(){

const email =
document.getElementById(
"loginEmail"
)?.value;

const password =
document.getElementById(
"loginPassword"
)?.value;

if(!email || !password){

alert(
"Please fill all fields."
);

return;

}

auth.signInWithEmailAndPassword(
email,
password
)
.then(()=>{

alert(
"Login success!"
);

window.location.href =
"community.html";

})
.catch(err=>{

alert(err.message);

});

}

// =========================
// LOGOUT
// =========================

function logout(){

auth.signOut()
.then(()=>{

alert(
"Logged out!"
);

window.location.href =
"login.html";

})
.catch(err=>{

alert(
err.message
);

});

}

// =========================
// PROFILE SYSTEM
// =========================

function loadProfile(){

const user =
auth.currentUser;

if(!user) return;

const profileEmail =
document.getElementById(
"profileEmail"
);

if(profileEmail){

profileEmail.innerText =
user.email;

}

}

// =========================
// SCRIPT SEARCH
// =========================

function searchScripts(){

const input =
document.getElementById(
"search"
);

if(!input) return;

const filter =
input.value.toLowerCase();

const scripts =
document.querySelectorAll(
".script"
);

scripts.forEach(script=>{

const text =
script.innerText.toLowerCase();

script.style.display =
text.includes(filter)
?
"block"
:
"none";

});

}

// =========================
// LIKE ANTI SPAM FIX
// =========================

async function likeScript(
scriptId
){

const user =
auth.currentUser;

if(!user){

alert(
"Login required!"
);

return;

}

const likeRef =
db.ref(
`likes/${scriptId}/${user.uid}`
);

const snapshot =
await likeRef.once(
"value"
);

if(snapshot.exists()){

alert(
"You already liked this script."
);

return;

}

await likeRef.set(true);

const countRef =
db.ref(
`scripts/${scriptId}/likes`
);

countRef.transaction(
(count)=>{

return (count || 0) + 1;

});

}

// =========================
// REPORT SYSTEM
// =========================

function reportScript(
scriptId
){

const user =
auth.currentUser;

if(!user){

alert(
"Login required!"
);

return;

}

db.ref(
"reports"
).push({

scriptId:
scriptId,

user:
user.uid,

createdAt:
Date.now()

});

alert(
"Report submitted!"
);

}

// =========================
// SCRIPT STATS
// =========================

function loadStats(){

const totalScripts =
document.getElementById(
"totalScripts"
);

const totalUsers =
document.getElementById(
"totalUsers"
);

const totalReports =
document.getElementById(
"totalReports"
);

if(totalScripts){

db.ref(
"scripts"
)
.on(
"value",
snap=>{

totalScripts.innerText =
snap.numChildren();

}
);

}

if(totalUsers){

db.ref(
"users"
)
.on(
"value",
snap=>{

totalUsers.innerText =
snap.numChildren();

}
);

}

if(totalReports){

db.ref(
"reports"
)
.on(
"value",
snap=>{

totalReports.innerText =
snap.numChildren();

}
);

}

}

loadStats();

// =========================
// DISCORD
// =========================

function openDiscord(){

window.open(
"https://discord.gg/PWCa7YTdsa",
"_blank"
);

}

// =========================
// SMOOTH SCROLL
// =========================

document.documentElement.style.scrollBehavior =
"smooth";

// =========================
// END
// =========================
