/* ==========================================================
   MAIN.JS
   Opini Visual
   Version 1.0

   Entry point global. File ini TIDAK menggantikan navbar.js,
   hero.js, dll — masing-masing modul tetap berdiri sendiri
   (self-initializing IIFE) dan otomatis jalan begitu di-load.

   main.js hanya menangani utilitas lintas halaman yang tidak
   spesifik ke satu komponen:
   1. Tahun berjalan otomatis di footer (© 2026 → update sendiri)
   2. Smooth scroll untuk semua anchor link (#section)
   3. Page loader / fade-in saat halaman pertama kali dibuka
   4. Lazy-load fallback untuk gambar tanpa loading="lazy" native
   5. External link — otomatis buka tab baru + rel aman

   ------------------------------------------------------
   URUTAN LOADING SCRIPT DI HTML (letakkan sebelum </body>):

   <script src="assets/js/navbar.js" defer></script>
   <script src="assets/js/hero.js" defer></script>
   <script src="assets/js/counter.js" defer></script>
   <script src="assets/js/testimonials.js" defer></script>
   <script src="assets/js/portfolio.js" defer></script>
   <script src="assets/js/faq.js" defer></script>
   <script src="assets/js/form.js" defer></script>
   <script src="assets/js/animation.js" defer></script>
   <script src="assets/js/main.js" defer></script>

   Catatan: setiap file hanya akan mengeksekusi logikanya jika
   elemen yang relevan ditemukan di halaman (mis. hero.js tidak
   melakukan apa-apa di halaman yang tidak punya .hero). Jadi
   AMAN untuk memuat seluruh script di semua halaman sekaligus
   tanpa perlu kondisi per-halaman.
========================================================== */

document.addEventListener("DOMContentLoaded", function(){

    /* ------------------------------------------------
       1. Tahun Berjalan di Footer
    ------------------------------------------------ */

    const yearEls = document.querySelectorAll("[data-current-year]");
    const currentYear = new Date().getFullYear();

    yearEls.forEach(function(el){
        el.textContent = currentYear;
    });


    /* ------------------------------------------------
       2. Smooth Scroll untuk Anchor Link
    ------------------------------------------------ */

    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(link){
        link.addEventListener("click", function(e){
            const targetId = link.getAttribute("href");
            const targetEl = document.querySelector(targetId);

            if(targetEl){
                e.preventDefault();
                targetEl.scrollIntoView({ behavior:"smooth", block:"start" });

                /* Pindahkan fokus untuk aksesibilitas keyboard/screen reader */
                targetEl.setAttribute("tabindex", "-1");
                targetEl.focus({ preventScroll:true });
            }
        });
    });


    /* ------------------------------------------------
       3. Page Loader / Fade-in
    ------------------------------------------------ */

    document.body.classList.add("is-loaded");


    /* ------------------------------------------------
       4. Lazy-load Fallback
       (browser modern sudah native via loading="lazy",
       ini hanya jaga-jaga untuk gambar data-src custom,
       mis. dipakai di dalam lightbox/slider dinamis)
    ------------------------------------------------ */

    const lazyImages = document.querySelectorAll("img[data-src]");

    if(lazyImages.length && "IntersectionObserver" in window){
        const lazyObserver = new IntersectionObserver(function(entries, obs){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    const img = entry.target;
                    img.src = img.getAttribute("data-src");
                    img.removeAttribute("data-src");
                    obs.unobserve(img);
                }
            });
        }, { rootMargin:"200px" });

        lazyImages.forEach(function(img){
            lazyObserver.observe(img);
        });
    }


    /* ------------------------------------------------
       5. External Link Handling
       Semua link yang mengarah ke domain lain otomatis
       dibuka di tab baru dengan rel yang aman.
    ------------------------------------------------ */

    document.querySelectorAll('a[href^="http"]').forEach(function(link){
        if(link.hostname !== window.location.hostname){
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        }
    });

});
