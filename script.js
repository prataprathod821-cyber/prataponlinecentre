/* ==========================================
   PRATAP ONLINE CENTRE
   SCRIPT V2
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       PRELOADER
    ========================== */

    const preloader = document.getElementById("preloader");

    window.addEventListener("load", () => {

        if(preloader){

            preloader.style.opacity="0";

            preloader.style.visibility="hidden";

            setTimeout(()=>{

                preloader.style.display="none";

            },500);

        }

    });

    /* ==========================
       NAVBAR SHADOW
    ========================== */

    const navbar=document.querySelector(".navbar");

    window.addEventListener("scroll",()=>{

        if(window.scrollY>60){

            navbar.classList.add("shadow");

        }else{

            navbar.classList.remove("shadow");

        }

    });

    /* ==========================
       SMOOTH SCROLL
    ========================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            e.preventDefault();

            const target=document.querySelector(this.getAttribute("href"));

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

    /* ==========================
       ACTIVE NAV LINK
    ========================== */

    const sections=document.querySelectorAll("section");

    const navLinks=document.querySelectorAll(".nav-link");

    window.addEventListener("scroll",()=>{

        let current="";

        sections.forEach(section=>{

            const top=section.offsetTop-120;

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

    /* ==========================
       COUNTER ANIMATION
    ========================== */

    const counters=document.querySelectorAll(".hero-counter h2");

    counters.forEach(counter=>{

        const update=()=>{

            const target=parseInt(counter.innerText);

            let count=parseInt(counter.getAttribute("data-count"))||0;

            const increment=Math.ceil(target/80);

            if(count<target){

                count+=increment;

                counter.setAttribute("data-count",count);

                counter.innerText=count+"+";

                requestAnimationFrame(update);

            }else{

                counter.innerText=target+"+";

            }

        };

        update();

    });

    /* ==========================
       SCROLL ANIMATION
    ========================== */

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:0.15

    });

    document.querySelectorAll("section").forEach(sec=>{

        sec.classList.add("hidden");

        observer.observe(sec);

    });

    /* ==========================
       GALLERY CLICK
    ========================== */

    document.querySelectorAll(".gallery-img").forEach(img=>{

        img.addEventListener("click",()=>{

            window.open(img.src,"_blank");

        });

    });

    /* ==========================
       SERVICE CARD EFFECT
    ========================== */

    document.querySelectorAll(".service-card").forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.transform="translateY(-10px)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform="translateY(0)";

        });

    });

    /* ==========================
       FLOATING BUTTON EFFECT
    ========================== */

    document.querySelectorAll(".floating-call,.floating-whatsapp").forEach(btn=>{

        btn.addEventListener("mouseenter",()=>{

            btn.style.transform="scale(1.1)";

        });

        btn.addEventListener("mouseleave",()=>{

            btn.style.transform="scale(1)";

        });

    });

    /* ==========================
       CONSOLE MESSAGE
    ========================== */

    console.log("Pratap Online Centre Website Loaded Successfully");

});// Sticky Navbar

window.addEventListener("scroll",function(){

const navbar=document.getElementById("navbar");

if(window.scrollY>80){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

});

/* ===============================
   AUTO CLOSE MOBILE MENU
================================= */

const navLinks = document.querySelectorAll('.nav-link');

const navCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {

    link.addEventListener('click', () => {

        if(navCollapse.classList.contains('show')){

            new bootstrap.Collapse(navCollapse).hide();

        }

    });

});