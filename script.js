/* =====================================================
   PRATAP ONLINE CENTRE
   SCRIPT V3
   PART 1
===================================================== */

"use strict";

/* ===========================================
   PRELOADER
=========================================== */

window.addEventListener("load", () => {

const preloader = document.getElementById("preloader");

if(preloader){

preloader.style.opacity="0";

preloader.style.visibility="hidden";

setTimeout(()=>{

preloader.remove();

},600);

}

});

/* ===========================================
   STICKY NAVBAR
=========================================== */

const navbar=document.getElementById("navbar");

window.addEventListener("scroll",()=>{

if(window.scrollY>80){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

});

/* ===========================================
   SMOOTH SCROLL
=========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

}

});

});

/* ===========================================
   ACTIVE MENU
=========================================== */

const sections=document.querySelectorAll("section[id]");

const navLinks=document.querySelectorAll(".nav-link");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-150;

const height=section.offsetHeight;

if(pageYOffset>=top){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});

/* ===========================================
   MOBILE MENU AUTO CLOSE
=========================================== */

const navCollapse=document.querySelector(".navbar-collapse");

document.querySelectorAll(".navbar .nav-link").forEach(item=>{

item.addEventListener("click",()=>{

if(navCollapse.classList.contains("show")){

new bootstrap.Collapse(navCollapse).hide();

}

});

});

console.log("Pratap Online Centre Loaded");/* =====================================================
   SCRIPT V3
   PART 2
===================================================== */

/* ===========================================
   COUNTER ANIMATION
=========================================== */

const counters=document.querySelectorAll(".counter-box h3");

let counterStarted=false;

function startCounters(){

if(counterStarted) return;

const heroCounter=document.querySelector(".hero-counter");

if(!heroCounter) return;

const top=heroCounter.getBoundingClientRect().top;

if(top<window.innerHeight-100){

counterStarted=true;

counters.forEach(counter=>{

const text=counter.innerText;

const target=parseInt(text.replace(/\D/g,""));

const suffix=text.replace(/[0-9]/g,"");

let current=0;

const step=Math.max(1,Math.ceil(target/80));

function update(){

current+=step;

if(current<target){

counter.innerText=current+suffix;

requestAnimationFrame(update);

}else{

counter.innerText=target+suffix;

}

}

counter.innerText="0"+suffix;

update();

});

}

}

window.addEventListener("scroll",startCounters);

window.addEventListener("load",startCounters);

/* ===========================================
   SCROLL REVEAL
=========================================== */

const revealItems=document.querySelectorAll(
".trust-card,.about-section,.owner-section,.service-card,.gallery-img,.review-card,.contact-section"
);

const revealObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:0.15
});

revealItems.forEach(item=>{

item.classList.add("fade-up");

revealObserver.observe(item);

});

/* ===========================================
   GALLERY CLICK ZOOM
=========================================== */

document.querySelectorAll(".gallery-img").forEach(img=>{

img.addEventListener("click",()=>{

window.open(img.src,"_blank");

});

});

/* ===========================================
   SERVICE CARD HOVER
=========================================== */

document.querySelectorAll(".service-card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-12px) scale(1.02)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0) scale(1)";

});

});

/* ===========================================
   HERO IMAGE FLOAT
=========================================== */

const heroImage=document.querySelector(".hero-image");

if(heroImage){

window.addEventListener("mousemove",(e)=>{

const x=(window.innerWidth/2-e.clientX)/45;

const y=(window.innerHeight/2-e.clientY)/45;

heroImage.style.transform=
`translate(${x}px,${y}px)`;

});

}/* =====================================================
   SCRIPT V3
   PART 3 (FINAL)
===================================================== */

/* ===========================================
   SCROLL PROGRESS BAR
=========================================== */

const progressBar=document.createElement("div");

progressBar.id="progress-bar";

progressBar.style.position="fixed";
progressBar.style.top="0";
progressBar.style.left="0";
progressBar.style.width="0%";
progressBar.style.height="4px";
progressBar.style.background="linear-gradient(90deg,#0d6efd,#ffc107)";
progressBar.style.zIndex="99999";

document.body.appendChild(progressBar);

window.addEventListener("scroll",()=>{

const totalHeight=document.documentElement.scrollHeight-window.innerHeight;

const progress=(window.pageYOffset/totalHeight)*100;

progressBar.style.width=progress+"%";

});

/* ===========================================
   SCROLL TO TOP BUTTON
=========================================== */

const topBtn=document.createElement("button");

topBtn.innerHTML='<i class="bi bi-arrow-up"></i>';

topBtn.id="scrollTopBtn";

topBtn.style.position="fixed";
topBtn.style.right="20px";
topBtn.style.bottom="95px";
topBtn.style.width="55px";
topBtn.style.height="55px";
topBtn.style.borderRadius="50%";
topBtn.style.border="none";
topBtn.style.background="#0d6efd";
topBtn.style.color="#fff";
topBtn.style.fontSize="22px";
topBtn.style.cursor="pointer";
topBtn.style.display="none";
topBtn.style.zIndex="9999";
topBtn.style.boxShadow="0 15px 35px rgba(0,0,0,.20)";
topBtn.style.transition=".35s";

document.body.appendChild(topBtn);

window.addEventListener("scroll",()=>{

if(window.scrollY>350){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

/* ===========================================
   RIPPLE BUTTON EFFECT
=========================================== */

document.querySelectorAll(".btn").forEach(button=>{

button.addEventListener("click",function(e){

const circle=document.createElement("span");

const diameter=Math.max(this.clientWidth,this.clientHeight);

circle.style.width=diameter+"px";
circle.style.height=diameter+"px";
circle.style.position="absolute";
circle.style.borderRadius="50%";
circle.style.background="rgba(255,255,255,.35)";
circle.style.transform="scale(0)";
circle.style.animation="ripple .6s linear";
circle.style.pointerEvents="none";

const rect=this.getBoundingClientRect();

circle.style.left=e.clientX-rect.left-diameter/2+"px";
circle.style.top=e.clientY-rect.top-diameter/2+"px";

this.style.position="relative";
this.style.overflow="hidden";

this.appendChild(circle);

setTimeout(()=>{

circle.remove();

},600);

});

});

/* ===========================================
   RIPPLE ANIMATION STYLE
=========================================== */

const style=document.createElement("style");

style.innerHTML=`

@keyframes ripple{

to{

transform:scale(4);

opacity:0;

}

}

`;

document.head.appendChild(style);

/* ===========================================
   PAGE LOADED
=========================================== */

console.log("%cPratap Online Centre","color:#0d6efd;font-size:18px;font-weight:bold;");
console.log("%cWebsite Loaded Successfully","color:green;font-size:14px;");

/* ===========================================
   END
=========================================== */