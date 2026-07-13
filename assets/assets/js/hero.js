/* ==========================================================
   HERO.JS
   Opini Visual
   Version 1.0

   Menangani:
   1. Autoplay video hero + fallback ke poster/image jika gagal
      (mis. browser memblokir autoplay atau koneksi lambat)
   2. Parallax halus pada hero media saat scroll
   3. Scroll cue: klik untuk scroll ke section berikutnya,
      dan fade out otomatis saat user mulai scroll
========================================================== */

(function(){
    "use strict";

    const hero = document.querySelector(".hero");
    if(!hero) return;

    const heroVideo = hero.querySelector(".hero-media video");
    const heroMedia = hero.querySelector(".hero-media");
    const scrollCue = hero.querySelector(".hero-scroll-cue");


    /* ------------------------------------------------
       1. Video Autoplay + Fallback
    ------------------------------------------------ */

    if(heroVideo){

        heroVideo.muted = true;
        heroVideo.setAttribute("playsinline", "");

        const playPromise = heroVideo.play();

        if(playPromise !== undefined){
            playPromise.catch(function(){
                /* Autoplay diblokir browser — tampilkan poster/gambar statis */
                heroVideo.style.display = "none";
                hero.classList.add("hero--video-fallback");
            });
        }

        /* Jika video gagal dimuat sama sekali (mis. file tidak ditemukan) */
        heroVideo.addEventListener("error", function(){
            heroVideo.style.display = "none";
            hero.classList.add("hero--video-fallback");
        });

    }


    /* ------------------------------------------------
       2. Parallax Halus pada Hero Media
    ------------------------------------------------ */

    let ticking = false;

    function updateParallax(){
        const scrollY = window.scrollY;

        /* Hentikan efek setelah keluar dari area hero, hemat resource */
        if(scrollY < hero.offsetHeight && heroMedia){
            const offset = scrollY * 0.35;
            heroMedia.style.transform = "translateY(" + offset + "px)";
        }

        ticking = false;
    }

    function onScroll(){
        if(!ticking){
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    /* Parallax dimatikan otomatis untuk pengguna yang memilih reduced motion */
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(heroMedia && !prefersReducedMotion){
        window.addEventListener("scroll", onScroll, { passive:true });
    }


    /* ------------------------------------------------
       3. Scroll Cue
    ------------------------------------------------ */

    if(scrollCue){

        scrollCue.style.cursor = "pointer";

        scrollCue.addEventListener("click", function(){
            const nextSection = hero.nextElementSibling;
            if(nextSection){
                nextSection.scrollIntoView({ behavior:"smooth" });
            }
        });

        window.addEventListener("scroll", function(){
            const opacity = Math.max(0, 1 - window.scrollY / 200);
            scrollCue.style.opacity = opacity;
        }, { passive:true });

    }

})();
