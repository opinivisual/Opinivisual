/* ==========================================================
   COUNTER.JS
   Opini Visual
   Version 1.0

   Menganimasikan angka statistik (.card-stat-number) dari 0
   menuju nilai akhir saat elemen masuk viewport.

   Cara pakai di HTML:
   <p class="card-stat-number" data-counter="500" data-suffix="+">0</p>
   <p class="card-stat-number" data-counter="98" data-suffix="%" data-decimal="1">0</p>

   - data-counter  : nilai akhir (wajib)
   - data-suffix   : teks tambahan di akhir, mis. "+", "%", "hrs" (opsional)
   - data-prefix   : teks tambahan di awal, mis. "$" (opsional)
   - data-decimal  : jumlah angka desimal (opsional, default 0)
   - data-duration : durasi animasi dalam ms (opsional, default 1800)
========================================================== */

(function(){
    "use strict";

    const counters = document.querySelectorAll("[data-counter]");
    if(!counters.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function formatNumber(value, decimals){
        return value.toLocaleString("id-ID", {
            minimumFractionDigits:decimals,
            maximumFractionDigits:decimals
        });
    }

    function animateCounter(el){
        const target = parseFloat(el.getAttribute("data-counter")) || 0;
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = parseInt(el.getAttribute("data-decimal"), 10) || 0;
        const duration = parseInt(el.getAttribute("data-duration"), 10) || 1800;

        if(prefersReducedMotion){
            el.textContent = prefix + formatNumber(target, decimals) + suffix;
            return;
        }

        const startTime = performance.now();

        function easeOutQuint(t){
            return 1 - Math.pow(1 - t, 5);
        }

        function step(now){
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuint(progress);
            const currentValue = target * eased;

            el.textContent = prefix + formatNumber(currentValue, decimals) + suffix;

            if(progress < 1){
                requestAnimationFrame(step);
            }else{
                el.textContent = prefix + formatNumber(target, decimals) + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting && !entry.target.hasAttribute("data-counted")){
                entry.target.setAttribute("data-counted", "true");
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold:0.4
    });

    counters.forEach(function(counter){
        observer.observe(counter);
    });

})();
