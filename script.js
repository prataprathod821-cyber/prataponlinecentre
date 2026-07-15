// ================================
// PRATAP ONLINE CENTRE
// Premium JavaScript
// ================================

// Sticky Navbar Shadow
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

if(window.scrollY > 50){

navbar.style.background = "#084298";

navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.20)";

}else{

navbar.style.background = "#0b5ed7";

navbar.style.boxShadow = "none";

}

});

// Smooth Scroll

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href"))

.scrollIntoView({

behavior:"smooth"

});

});

});

// Fade Animation

const observer = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

});

document.querySelectorAll("section").forEach(section=>{

section.style.opacity="0";

section.style.transform="translateY(60px)";

section.style.transition=".8s";

observer.observe(section);

});

// Counter Animation

const counters=document.querySelectorAll(".hero-features h3");

let started=false;

window.addEventListener("scroll",()=>{

if(started) return;

if(window.scrollY>100){

started=true;

counters.forEach(counter=>{

const target=parseInt(counter.innerText);

let count=0;

const speed=target/80;

const update=()=>{

count+=speed;

if(count<target){

counter.innerText=Math.floor(count)+"+";

requestAnimationFrame(update);

}else{

counter.innerText=target+"+";

}

}

update();

});

}

});

// Service Card Hover Glow

document.querySelectorAll(".service-card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.boxShadow="0 20px 45px rgba(11,94,215,.35)";

});

card.addEventListener("mouseleave",()=>{

card.style.boxShadow="0 10px 35px rgba(0,0,0,.08)";

});

});

// Current Year

const footer=document.querySelector("footer");

if(footer){

footer.innerHTML=footer.innerHTML.replace("2026",new Date().getFullYear());

}

console.log("Pratap Online Centre Website Loaded Successfully");