/* ==========================================================
   ANIMATION.JS
   Opini Visual
   Version 1.0

   Menjalankan efek scroll-reveal untuk elemen berclass:
   .reveal, .reveal-left, .reveal-right, .reveal-scale
   (didefinisikan di assets/css/animation.css).

   Elemen mendapat class ".is-visible" begitu masuk viewport,
   lalu di-unobserve (animasi hanya berjalan sekali).

   Untuk animasi berantai (mis. 3 card muncul bergiliran),
   tambahkan class .reveal-delay-1 s/d .reveal-delay-5 di
   masing-masing elemen.
========================================================== */

(function(){
    "use strict";

    const revealSelectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
    const revealElements = document.querySelectorAll(revealSelectors);

    if(!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Jika user memilih reduced motion, langsung tampilkan semua
       tanpa observer (CSS animation.css juga sudah menghandle ini
       sebagai lapisan proteksi ganda) */
    if(prefersReducedMotion){
        revealElements.forEach(function(el){
            el.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold:0.15,
        rootMargin:"0px 0px -60px 0px"
    });

    revealElements.forEach(function(el){
        observer.observe(el);
    });


    /* ------------------------------------------------
       Auto-stagger untuk grup elemen
       Elemen dengan atribut data-reveal-group yang sama
       akan otomatis diberi delay bertingkat tanpa perlu
       menulis manual class .reveal-delay-1, -2, -3 dst.
    ------------------------------------------------ */

    const groups = {};

    document.querySelectorAll("[data-reveal-group]").forEach(function(el){
        const groupName = el.getAttribute("data-reveal-group");
        if(!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(el);
    });

    Object.keys(groups).forEach(function(groupName){
        groups[groupName].forEach(function(el, index){
            const delay = Math.min(index, 5) * 100;
            el.style.transitionDelay = delay + "ms";
        });
    });

})();
