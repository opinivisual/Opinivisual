/* ==========================================================
   NAVBAR.JS
   Opini Visual
   Version 1.0

   Menangani:
   1. Efek scroll (navbar transparan → solid) via class .is-scrolled
   2. Toggle menu mobile (hamburger) via class .is-open
   3. Backdrop overlay saat menu mobile terbuka
   4. Auto-close menu saat link diklik atau resize ke desktop
   5. Highlight link aktif sesuai halaman saat ini
========================================================== */

(function(){
    "use strict";

    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".navbar-toggle");
    const menu = document.querySelector(".navbar-menu");
    const backdrop = document.querySelector(".navbar-backdrop");
    const links = document.querySelectorAll(".navbar-link");

    if(!navbar) return;

    /* ------------------------------------------------
       1. Scroll State
    ------------------------------------------------ */

    const SCROLL_THRESHOLD = 24;

    function handleScroll(){
        if(window.scrollY > SCROLL_THRESHOLD){
            navbar.classList.add("is-scrolled");
        }else{
            navbar.classList.remove("is-scrolled");
        }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive:true });


    /* ------------------------------------------------
       2. Mobile Menu Toggle
    ------------------------------------------------ */

    function openMenu(){
        toggle?.classList.add("is-active");
        menu?.classList.add("is-open");
        backdrop?.classList.add("is-visible");
        toggle?.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeMenu(){
        toggle?.classList.remove("is-active");
        menu?.classList.remove("is-open");
        backdrop?.classList.remove("is-visible");
        toggle?.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    function toggleMenu(){
        const isOpen = menu?.classList.contains("is-open");
        if(isOpen){
            closeMenu();
        }else{
            openMenu();
        }
    }

    if(toggle){
        toggle.setAttribute("aria-expanded", "false");
        toggle.addEventListener("click", toggleMenu);
    }

    if(backdrop){
        backdrop.addEventListener("click", closeMenu);
    }

    /* Tutup menu otomatis saat salah satu link diklik */
    links.forEach(function(link){
        link.addEventListener("click", closeMenu);
    });

    /* Tutup menu otomatis saat layar di-resize ke ukuran desktop */
    let resizeTimer;
    window.addEventListener("resize", function(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
            if(window.innerWidth > 1024){
                closeMenu();
            }
        }, 150);
    });

    /* Tutup menu dengan tombol Escape */
    document.addEventListener("keydown", function(e){
        if(e.key === "Escape"){
            closeMenu();
        }
    });


    /* ------------------------------------------------
       3. Active Link Highlight
       Menandai link navbar yang sesuai dengan halaman
       yang sedang dibuka (berdasarkan nama file).
    ------------------------------------------------ */

    function setActiveLink(){
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        links.forEach(function(link){
            const linkPage = link.getAttribute("href");
            if(linkPage === currentPage){
                link.classList.add("is-active");
            }else{
                link.classList.remove("is-active");
            }
        });
    }

    setActiveLink();

})();
